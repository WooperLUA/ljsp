import type {ASTNode, Token} from "@types";
import {global_env} from "./env/global.ts";
import {list_env} from "./env/list.ts";

type Environment = Record<string, any>;

const create_global_env = (): Environment => (
    {
        ...global_env,
        ...list_env,
    }
);

const is_symbol = (node: any): node is Token =>
    typeof node === 'object' && node !== null && !Array.isArray(node) && node.kind === 'symbol';

const evaluate = (node: ASTNode, env: Environment): any =>
{
    if (Array.isArray(node))
    {
        if (node.length === 0) return [];

        const [first, ...rest] = node;
        const first_evaluated = evaluate(first, env);

        if (first_evaluated === 'const')
        {
            const [name_node, value_node] = rest;

            if (!is_symbol(name_node))
            {
                throw new Error("const expects a symbol as the first argument");
            }

            const value = evaluate(value_node, env);
            // @ts-ignore
            env[name_node.value] = value;
            return value;
        }

        if (first_evaluated === 'if')
        {
            const [test, then, otherwise] = rest;
            const branch_env = Object.create(env);
            return evaluate(test, env) ? evaluate(then, branch_env) : evaluate(otherwise, branch_env);
        }

        if (first_evaluated === 'fn')
        {
            const [params_node, ...body] = rest;

            if (!Array.isArray(params_node))
            {
                throw new Error("fn expects a list of parameters");
            }

            const params = params_node.map(p =>
            {
                if (!is_symbol(p)) throw new Error("Parameters must be symbols");
                // @ts-ignore
                return p.value;
            });

            return (args: any[]) =>
            {
                const new_env = Object.create(env);
                params.forEach((param, i) =>
                {
                    new_env[param] = args[i];
                });

                let res = null;
                for (const expr of body)
                {
                    res = evaluate(expr, new_env);
                }

                return res;
            };
        }

        if (first_evaluated === 'do')
        {
            let res = null;
            for (const expr of rest)
            {
                res = evaluate(expr, env);
            }
            return res;
        }

        if (first_evaluated === 'and' || first_evaluated === 'or')
        {
            const [first_cond, second_cond] = rest;
            return first_evaluated === 'and' ? evaluate(first_cond, env) && evaluate(second_cond, env)
                : evaluate(first_cond, env) || evaluate(second_cond, env);
        }

        if (first_evaluated === 'throw')
        {
            const [msg_node] = rest;
            const message = evaluate(msg_node, env);
            throw new Error(typeof message === 'string' ? message : stringify(message));
        }

        // I hate this code, but it works and that's sufficient
        if (first_evaluated === 'try')
        {
            const [try_node, catch_node] = rest;

            try
            {
                return evaluate(try_node, env);
            }
            catch (err)
            {
                if (Array.isArray(catch_node) && (catch_node[0] as Token)?.value === ':catch')
                {
                    const raw_var = catch_node[1];
                    const error_var: string = typeof raw_var === 'object' && raw_var !== null
                        ? String((raw_var as Token)?.value ?? '')
                        : String(raw_var);

                    const catch_body = catch_node[2];
                    const err_msg = err instanceof Error ? err.message : String(err);

                    const catch_env = typeof env.extend === 'function'
                        ? env.extend({[error_var]: err_msg})
                        : Object.assign(Object.create(env), {...env, [error_var]: err_msg});

                    return evaluate(catch_body, catch_env);
                }

                return evaluate(catch_node, env);
            }
        }

        // this eval case exists only to warn the user that they messed up
        if (first_evaluated === 'catch')
        {
            throw new Error('Unexpected \':catch\' form outside of \':try\'.')
        }

        if (first_evaluated === 'set')
        {
            const [target_node, prop_node, val_node] = rest;
            const target = evaluate(target_node, env);

            if (typeof target !== 'object' || target === null)
            {
                throw new Error('Target of :set must be an object');
            }

            const prop = evaluate(prop_node, env);
            const val = evaluate(val_node, env);

            target[prop] = val;
            return val;
        }

        if (typeof first_evaluated !== 'function')
        {
            throw new Error(`${stringify(first_evaluated)} is not a function`);
        }

        const args = rest.map(arg => evaluate(arg, env));
        return first_evaluated(args);
    }

    const token = node as Token;
    if (!token) return null;

    switch (token.kind)
    {
        case 'list':
            return (token.value as unknown as ASTNode[]).map(node => evaluate(node, env));
        case 'string':
            return token.value.slice(1, -1);
        case 'keyword':
            if ([':const', ':if', ':fn', ':do', ':and', ':or', ':try', ':catch', ':throw', ':set'].includes(token.value))
            {
                return token.value.slice(1);
            }
            return Symbol.for(token.value);
        // JAVASCRIPT INTEROP
        case 'symbol':
        case 'operator':
        {
            const is_js = token.value.startsWith('$');
            const raw_path = is_js ? token.value.slice(1) : token.value;

            if (is_js && !raw_path) return globalThis;

            const parts = raw_path.split('.');
            let current: any = is_js ? globalThis : env;
            let parent: any = null;

            for (const part of parts)
            {
                if (current === null || current === undefined || !(part in current))
                {
                    throw new Error(`Unknown symbol: ${token.value}`);
                }
                parent = current;
                current = current[part];
            }

            if (typeof current === 'function' && is_js)
            {
                return (args: any[]) => current.apply(parent, args);
            }

            return current ?? null;
        }
        default:
            return token.value;
    }
};

export const stringify = (value: any, quote_strings = false): string =>
{
    if (value === null || value === undefined) return '@null';
    if (value === true) return '@true';
    if (value === false) return '@false';
    if (typeof value === 'symbol') return value.description || '';
    if (typeof value === 'string') return quote_strings ? `'${value}'` : value;
    if (Array.isArray(value)) return `[${value.map(v => stringify(v, true)).join(' ')}]`;
    if (typeof value === 'function') return 'Function';
    return String(value);
};

export const interpret = (ast: ASTNode[]) =>
{
    const env = create_global_env();
    let last_result = null;

    for (const node of ast)
    {
        last_result = evaluate(node, env);
    }

    return stringify(last_result);
};