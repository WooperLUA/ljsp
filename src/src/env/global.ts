import {stringify} from "@interpreter";

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
    'echo':   (args: any[]) =>
              {
                  if (args.length < 1) throw new Error('Expected 1 argument (echo <value>');
                  return args.map(arg => stringify(arg)).join(' ');
              },
    'get':    (args: any[]) =>
              {
                  if (args.length < 2) throw new Error('Expected 2 arguments (get <list> <index>)');
                  return args[0][args[1]] ?? null
              },
    'length': (args: any[]) =>
              {
                  if (args.length < 1) throw new Error(`Expected 1 argument (length <value>)`);
                  return args[0].length
              },
    'push':   (args: any[]) =>
              {
                  if (args.length < 2) throw new Error(`Expected 2 arguments (push <list> <value>)`);
                  return [...args[0], ...args.slice(1)]
              },
    'typeof': (args: any[]) =>
              {
                  if (args.length < 1) throw new Error(`Expected 1 argument (typeof <value>)`);
                  const val = args[0];
                  if (val === null || val === undefined) return '@null';
                  if (Array.isArray(val)) return 'list';
                  return typeof val;
              }
}