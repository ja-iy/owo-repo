/** @type {import("eslint").Linter.Config} */
module.exports = {


    extends: [
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        './base.js',
    ],

    env: {
        node: true,
    },

    globals: {
        React: true,
        JSX: true,
    },
    
}
