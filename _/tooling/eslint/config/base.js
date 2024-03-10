const { resolve } = require("node:path")

/** @type {import("eslint").Linter.Config} */
module.exports = {

    plugins: [
        "@typescript-eslint", 
        "import",
        "only-warn",
    ],

    extends: [
    //     "prettier",
        "turbo",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
        "eslint-config-turbo",
    ],

    env: {
        es2022: true,
        node: true,
    },

    parser: "@typescript-eslint/parser",

    parserOptions: {
        project: true
    },

    settings: {
        "import/resolver": {
            typescript: {
                project: resolve(process.cwd(), "tsconfig.json")
            },
        },
    },

    ignorePatterns: [
        "*.config.js",
        "*.config.cjs",
        ".eslintrc.cjs",
        ".next",
        "dist",
        "pnpm-lock.yaml",
    ],

    reportUnusedDisableDirectives: true,

    rules: {


        // unsafe

        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-call": "off",        
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",

        //

        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars":"warn",

        "require-await": "off",
        "@typescript-eslint/require-await": "warn",

        "dot-notation": "off",
        "@typescript-eslint/dot-notation": "off",


        "@typescript-eslint/no-explicit-any": "warn", 

        "@typescript-eslint/no-empty-interface": [ "error", { "allowSingleExtends": true } ],

        "@typescript-eslint/array-type": "off",

        "@typescript-eslint/consistent-type-imports": [
            "warn",
            { prefer: "type-imports", fixStyle: "separate-type-imports" },
        ],

        "@typescript-eslint/consistent-type-definitions": "off",

        "@typescript-eslint/no-misused-promises": [
            2,
            { checksVoidReturn: { attributes: false } },
        ],


        "@typescript-eslint/consistent-indexed-object-style": "off",
        

        "import/consistent-type-specifier-style": ["error", "prefer-top-level"],

        "turbo/no-undeclared-env-vars": "off",

    },

}

