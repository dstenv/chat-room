const off = 'off'
const warn = 'warn'

module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: [
        // 'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        // 'plugin:vue/vue3-recommended',
        'plugin:vue/vue3-essential',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: ['prettier', '@typescript-eslint', 'vue'],
    root: true,
    rules: {
        /**
         * Eslint config
         */

        'camelcase': off,
        'no-empty': off,
        'no-undef': off,
        'consistent-this': warn,
        // 'line-comment-position': warn,
        // 'no-inline-comments': warn,
        'no-useless-constructor': warn,
        'prefer-rest-params': warn,
        'prefer-spread': warn,

        /* Automatically fixable */
        // 'arrow-body-style': warn,
        'eqeqeq': warn,
        'lines-between-class-members': off,
        'no-lonely-if': warn,
        'no-useless-computed-key': warn,
        'no-useless-rename': warn,
        'no-var': warn,
        'object-shorthand': warn,
        'operator-assignment': warn,
        'prefer-const': warn,
        'prefer-numeric-literals': warn,
        'prefer-object-spread': warn,
        'prefer-template': warn,
        // 'sort-imports': [warn, { ignoreDeclarationSort: true }],
        'spaced-comment': warn,

        /**
         * Typescript-eslint config
         */

        '@typescript-eslint/ban-types': off,
        '@typescript-eslint/no-namespace': off,
        '@typescript-eslint/no-empty-function': off,
        '@typescript-eslint/no-explicit-any': off,
        '@typescript-eslint/no-non-null-asserted-optional-chain': off,
        '@typescript-eslint/no-non-null-assertion': off,
        '@typescript-eslint/no-var-requires': warn,

        /* Automatically fixable */
        '@typescript-eslint/array-type': warn,

        /**
         * Vue config
         */

        /* Automatically fixable */
        'vue/html-self-closing': [
            warn,
            {
                html: {
                    component: 'always',
                    normal: 'always',
                    void: 'always',
                },
                math: 'always',
                svg: 'always',
            },
        ],
        'vue/max-attributes-per-line': off,
        'vue/multi-word-component-names': off,
        'arrow-body-style': off,
        'prefer-arrow-callback': off,

        /**
         * Prettier config
         */

        'prettier/prettier': [
            warn,
            {
                arrowParens: 'always',
                jsxBracketSameLine: false,
                printWidth: 80,
                quoteProps: 'consistent',
                semi: false,
                singleQuote: true,
                trailingComma: 'es5',
                useTabs: false,
                endOfLine: 'auto',
            },
        ],
    },
}
