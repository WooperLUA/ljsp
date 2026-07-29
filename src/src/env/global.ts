export const global_env = {
    '+':      (args: any[]) => args.reduce((a, b) => a + b, 0),
    '-':      (args: any[]) => args.length === 1 ? -args[0] : args.reduce((a, b) => a - b),
    '*':      (args: any[]) => args.reduce((a, b) => a * b, 1),
    '/':      (args: any[]) => args.reduce((a, b) => a / b),
    '%':      (args: any[]) => args[0] % args[1],
    '=':      (args: any[]) => args.every(v => v === args[0]),
    '==':     (args: any[]) => args.every(v => v === args[0]),
    '!=':     (args: any[]) => args[0] !== args[1],
    '>':      (args: any[]) => args[0] > args[1],
    '<':      (args: any[]) => args[0] < args[1],
    '>=':     (args: any[]) => args[0] >= args[1],
    '<=':     (args: any[]) => args[0] <= args[1],
    '!':      (args: any[]) => !args[0],
    'get':    (args: any[]) => args[0][args[1]] ?? null,
    'length': (args: any[]) => args[0].length,
    'push':   (args: any[]) => [...args[0], ...args.slice(1)],
    'typeof': (args: any[]) =>
              {
                  const val = args[0];
                  if (val === null || val === undefined) return '@null';
                  if (Array.isArray(val)) return 'list';
                  return typeof val;
              }
}