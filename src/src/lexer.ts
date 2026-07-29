import type {Token, TokenKind} from "@types";

const token_patterns: [TokenKind, RegExp][] = [
    ['comment', /;[^\n]*/y],
    ['boolean', /(@true|@false)\b/y],
    ['null', /@null\b/y],
    ['keyword', /:[a-zA-Z_][a-zA-Z0-9_\-?]*/y],
    ['string', /'([^'\\]|\\.)*'/y],
    ['number', /-?\d+(\.\d+)?/y],
    ['operator', /(>=|<=|!=|==|\/=|>|<|=|[+\-*\/%=!])/y],
    ['invalid', /(true|false|null|let|var|function)\b/y],
    ['symbol', /[a-zA-Z_$][a-zA-Z0-9_\-?.]*/y],
    ['o_square_bracket', /\[/y],
    ['c_square_bracket', /]/y],
    ['o_paren', /\(/y],
    ['c_paren', /\)/y],
];

const lexing_predictions: Record<string, string> = {
    '"':        "did you mean <'> ?",
    'false':    "did you mean <@false> ?",
    'true':     "did you mean <@true> ?",
    'null':     "did you mean <@null> ?",
    'let':      "did you mean <const> ?",
    'var':      "did you mean <const> ?",
    'function': "did you mean <fn> ?"
};

const cast = (kind: TokenKind, value: string) =>
{
    let new_value: any = value;
    switch (kind)
    {
        case 'boolean':
            new_value = new_value === '@true';
            break;
        case 'null':
            new_value = null;
            break;
        case 'number':
            new_value = parseFloat(new_value);
            break;
    }
    return new_value;
}

const new_token = (kind: TokenKind, value: string): Token => ({kind, value});

export const tokenize = (source: string): Token[] =>
{
    const tokens: Token[] = [];
    let cursor = 0;

    while (cursor < source.length)
    {
        if (/\s/.test(source[cursor]))
        {
            cursor++;
            continue;
        }

        let matched = false;

        for (const [kind, regex] of token_patterns)
        {
            regex.lastIndex = cursor;
            const match = regex.exec(source);

            if (match)
            {
                if (kind === 'comment')
                {
                    cursor = regex.lastIndex;
                    matched = true;
                    break;
                }

                if (kind === 'invalid')
                {
                    const word = match[0];
                    const hint = lexing_predictions[word] ? `, ${lexing_predictions[word]}` : '';
                    throw new Error(`Unexpected token '${word}' at position ${cursor}${hint}`);
                }

                // lexing casts
                let value = cast(kind, match[0])

                tokens.push(new_token(kind, value));
                cursor = regex.lastIndex;
                matched = true;
                break;
            }
        }

        if (!matched)
        {
            const char = source[cursor];
            const word_match = source.slice(cursor).match(/^[a-zA-Z_]+/);
            const key = word_match ? word_match[0] : char;

            const hint = lexing_predictions[key] || lexing_predictions[char];
            const pred = hint ? `, ${hint}` : '';

            throw new Error(`Unexpected token '${key}' at position ${cursor}${pred}`);
        }
    }

    return tokens;
};

