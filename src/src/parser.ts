import type {ASTNode, Token} from "@types";

export const parse = (tokens: Token[]): ASTNode[] =>
{
    let cursor = 0;

    const parse_expr = (): ASTNode =>
    {
        const token = tokens[cursor];
        if (!token) throw new Error("Unexpected end of input");

        if (token.kind === 'o_paren')
        {
            cursor++;
            const sub_expr: ASTNode[] = [];

            while (cursor < tokens.length && tokens[cursor]?.kind !== 'c_paren')
            {
                sub_expr.push(parse_expr());
            }

            if (cursor >= tokens.length)
            {
                throw new Error("Unclosed parenthesis");
            }

            cursor++;
            return sub_expr;
        }

        if (token.kind === 'c_paren')
        {
            throw new Error("Unexpected closing parenthesis");
        }

        cursor++;
        return token;
    };

    const ast: ASTNode[] = [];
    while (cursor < tokens.length)
    {
        ast.push(parse_expr());
    }

    return ast;
};