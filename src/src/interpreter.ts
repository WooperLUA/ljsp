import type {ASTNode, Token} from "@types";
import {global_env} from "./env/global.ts";
import {console_env} from "./env/console.ts";

type Environment = Record<string, any>;

const create_global_env = (): Environment => (
    {
        ...global_env,
        '$console': console_env,
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
            env[name_node.value] = value;
            return value;
        }

        if (first_evaluated === 'if')
        {
            const [test, then, otherwise] = rest;
            return evaluate(test, env) ? evaluate(then, env) : evaluate(otherwise, env);
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

        if (typeof first_evaluated !== 'function')
        {
            const name = typeof first === 'object' && first !== null && !Array.isArray(first)
                ? (first as Token).value
                : JSON.stringify(first);
            throw new Error(`${name} is not a function`);
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
            if ([':const', ':if', ':fn'].includes(token.value))
            {
                return token.value.slice(1);
            }
            return Symbol.for(token.value);
        case 'symbol':
        case 'operator':
            if (token.value.includes('.'))
            {
                const parts = token.value.split('.');
                let current = env;
                for (const part of parts)
                {
                    if (current === null || current === undefined || !(part in current))
                    {
                        throw new Error(`Unknown symbol: ${token.value}`);
                    }
                    current = current[part];
                }
                return current ?? null;
            }
            if (token.value in env)
            {
                return env[token.value] ?? null;
            }
            throw new Error(`Unknown ${token.kind}: ${token.value}`);
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