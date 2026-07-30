export const list_env = {
    'map':      (args: any[]) =>
                {
                    if (args.length < 2) throw new Error('Expected 2 arguments (map <list> <fn>)');
                    const [list, fn] = args;
                    if (!Array.isArray(list)) throw new Error('First argument to map must be a list');
                    if (typeof fn !== 'function') throw new Error('Second argument to map must be a function');
                    return list.map((item, index) => fn([item, index]));
                },
    'filter':   (args: any[]) =>
                {
                    if (args.length < 2) throw new Error('Expected 2 arguments (filter <list> <fn>)');
                    const [list, fn] = args;
                    if (!Array.isArray(list)) throw new Error('First argument to filter must be a list');
                    if (typeof fn !== 'function') throw new Error('Second argument to filter must be a function');
                    return list.filter((item, index) => Boolean(fn([item, index])));
                },
    'reduce':   (args: any[]) =>
                {
                    if (args.length < 3) throw new Error('Expected 3 arguments (reduce <list> <fn> <initial>)');
                    const [list, fn, initial] = args;
                    if (!Array.isArray(list)) throw new Error('First argument to reduce must be a list');
                    if (typeof fn !== 'function') throw new Error('Second argument to reduce must be a function');
                    return list.reduce((acc, curr, index) => fn([acc, curr, index]), initial);
                },
    'slice':    (args: any[]) =>
                {
                    if (args.length < 2) throw new Error('Expected at least 2 arguments (slice <list> <start> [end])');
                    const [list, start, end] = args;
                    if (!Array.isArray(list)) throw new Error('First argument to slice must be a list');
                    return list.slice(start, end);
                },
    'concat':   (args: any[]) =>
                {
                    if (args.length < 1) throw new Error('Expected at least 1 argument (concat <list1> ...)');
                    return args.reduce((acc, curr) => acc.concat(curr), []);
                },
    'includes': (args: any[]) =>
                {
                    if (args.length < 2) throw new Error('Expected 2 arguments (includes <list> <item>)');
                    const [list, item] = args;
                    if (!Array.isArray(list)) throw new Error('First argument to includes must be a list');
                    return list.includes(item);
                },
    'join':     (args: any[]) =>
                {
                    if (args.length < 1) throw new Error('Expected at least 1 argument (join <list> [separator])');
                    const [list, sep = ''] = args;
                    if (!Array.isArray(list)) throw new Error('First argument to join must be a list');
                    return list.join(sep);
                },
    'reverse':  (args: any[]) =>
                {
                    if (args.length < 1) throw new Error('Expected 1 argument (reverse <list>)');
                    const [list] = args;
                    if (!Array.isArray(list)) throw new Error('First argument to reverse must be a list');
                    return [...list].reverse();
                },
    'sort':     (args: any[]) =>
                {
                    const [list, compare_fn] = args;
                    if (!Array.isArray(list)) throw new Error('First argument to sort must be a list');

                    const copy = [...list];
                    if (compare_fn)
                    {
                        return copy.sort((a, b) => compare_fn([a, b]));
                    }
                    return copy.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
                },
    'get':      (args: any[]) =>
                {
                    if (args.length < 2) throw new Error('Expected 2 arguments (get <list> <index>)');
                    return args[0][args[1]] ?? null
                },
    'length':   (args: any[]) =>
                {
                    if (args.length < 1) throw new Error(`Expected 1 argument (length <list>)`);
                    return args[0].length
                },
    'push':     (args: any[]) =>
                {
                    if (args.length < 2) throw new Error(`Expected 2 arguments (push <list> <value>)`);
                    return [...args[0], ...args.slice(1)]
                },
}