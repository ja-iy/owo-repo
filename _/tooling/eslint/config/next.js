/** @type {import("eslint").Linter.Config} */
module.exports = {

    
    extends: [
        require.resolve("@vercel/style-guide/eslint/next"),
        // "plugin:@next/next/recommended",
        // "next", 
        "next/core-web-vitals",
        "./library.js",
    ],

    env: {
        node: true,
    },

    rules: {

        "@next/next/no-html-link-for-pages": "off",

    }
}
