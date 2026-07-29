import {tokenize} from "@lexer";
import {parse} from "@parser";
import type {ASTNode} from "@types";
import {interpret} from "@interpreter";

type Result = {
    ast: ASTNode[]
    output: string
}
export const run = (source: string): Result =>
{
    if (!source)
    {
        throw new Error('You must provide a source code to run it.');
    }
    const parsed_code = parse(tokenize(source))
    const output = interpret(parsed_code);
    return {
        ast:    parsed_code,
        output: output || 'no interpreter yet.'
    }
}