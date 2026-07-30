# LJSP (Lisp-like JavaScript Processor)
A small lisp language made for JavaScript developers.

## Features

- **Lisp Syntax**: Parentheses for function calls `(func arg1 arg2)`.
- **List Support**: Square brackets for list literals `[1 2 3]`.
- **Keywords**: Keywords start with the `:` prefix.
- **JavaScript Interop**: Access JavaScript native methods with the `$` prefix (only `$console` support for now).
- **Others**: Boolean and null literals use `@true`, `@false`, and `@null` (`undefined` is treated as null).

## Sandbox available

Check out the LJSP sandbox here to test out the language.
- (https://wooperlua.github.io/ljsp/)

## Syntax Overview

### Literals
- Numbers: `42`, `-3.14`
- Strings: `'hello world'`
- Booleans: `@true`, `@false`
- Null: `@null`
- Lists: `[1 2 3 [4 5]]`
- Keywords: `:const`, `:fn`, `:if`

### Core Operations
Since the environment maps keywords to their respective functionalities, you typically call them by evaluating the keyword:

```ljs
(:const x 10)
(:const add-five (:fn (n) (+ n 5)))
(add-five x)       ; 15
```

### Conditionals
```ljs
(:if (> x 5) 'large' 'small')
```

### Multiple Expressions (Do)
The `:do` keyword allows grouping multiple expressions, returning the result of the last one.
```ljs
(:if (> x 0)
  (:do
    ($console.log 'Positive')
    (+ x 1))
  0)
```

### Errors
```ljs
(:const divide (:fn (x y)
  (:if (= y 0)
    (:throw 'Cannot divide by 0')
    (/ x y))))

(:try
  (divide 10 5)
(:catch err
  (echo err)))
```

### List Manipulation
```ljs
(:const my-list [1 2 3])
(get my-list 0)      ; 1
(length my-list)     ; 3
(push my-list 4)     ; [1 2 3 4]
(:const doubled (map my-list (:fn (x) (* x 2))))                ; [2 4 6 8]
(:const evens (filter my-list (:fn (x) (!= x 2))))              ; [1 3 4]
(:const total (reduce my-list (:fn (acc curr) (+ acc curr)) 0)) ; 10
(echo (join my-list ', '))                                      ; 1, 2, 3, 4
```

### Console Methods (with JavaScript interop)
```ljs
($console.log 'Value of x is:' x)
($console.warn 'Warning message')
($console.table [[1 2] [3 4]])
```
