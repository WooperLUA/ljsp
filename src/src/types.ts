export type TokenKind =
    | 'comment'
    | 'boolean'
    | 'null'
    | 'keyword'
    | 'string'
    | 'number'
    | 'operator'
    | 'invalid'
    | 'symbol'
    | 'o_paren'
    | 'c_paren';

export type Token = {
    kind: TokenKind;
    value: string;
} | null;

export type ASTNode = Token | ASTNode[];