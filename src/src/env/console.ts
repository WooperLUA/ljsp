import {stringify} from "@interpreter";

const format = (args: any[]) => args.map(v => (typeof v === 'string' || v === undefined) ? v : stringify(v, true));

export const console_env = {
    'log':      (args: any[]) => { console.log(...format(args)); return null; },
    'error':    (args: any[]) => { console.error(...format(args)); return null; },
    'warn':     (args: any[]) => { console.warn(...format(args)); return null; },
    'info':     (args: any[]) => { console.info(...format(args)); return null; },
    'debug':    (args: any[]) => { console.debug(...format(args)); return null; },
    'table':    (args: any[]) => { console.table(args[0]); return null; },
    'clear':    () => { console.clear(); return null; },
    'time':     (args: any[]) => { console.time(args[0]); return null; },
    'timeEnd':  (args: any[]) => { console.timeEnd(args[0]); return null; },
    'count':    (args: any[]) => { console.count(args[0]); return null; },
    'assert':   (args: any[]) => { console.assert(args[0], ...format(args.slice(1))); return null; },
    'group':    (args: any[]) => { console.group(...format(args)); return null; },
    'groupEnd': () => { console.groupEnd(); return null; },
    'groupCollapsed': (args: any[]) => { console.groupCollapsed(...format(args)); return null; },
    'trace':    (args: any[]) => { console.trace(...format(args)); return null; },
}