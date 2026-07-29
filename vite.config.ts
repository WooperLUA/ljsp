import {defineConfig} from "vite";
import path from 'path';

export default defineConfig({
    base: './',
    resolve: {
        alias: {
            "@":           path.resolve(__dirname, "./src"),
            "@interpreter":     path.resolve(__dirname, "./src/src/interpreter.ts"),
            "@lexer": path.resolve(__dirname, "./src/src/lexer.ts"),
            "@parser":      path.resolve(__dirname, "./src/src/parser.ts"),
            "@types":      path.resolve(__dirname, "./src/src/types.ts"),
        }
    }
});