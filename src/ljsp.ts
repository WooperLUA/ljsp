import {tokenize} from "@lexer";
import {parse} from "@parser";
import type {ASTNode} from "@types";

type Result = {
    ast : ASTNode[]
    output : string
}
export const run = (source : string) : Result =>
{
    if (!source)
    {
        throw new Error('You must provide a source code to run it dumbo.');
    }
    const parsed_code = parse(tokenize(source))
    return {
        ast : parsed_code,
        output : 'no interpreter yet.'
    }
}


run("(+ 3 (+ 1 2)) (:const (x 5))")