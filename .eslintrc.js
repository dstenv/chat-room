/* eslint-env node */
// require("@rushstack/eslint-patch/modern-module-resolution");

const off = "off"
const warn = "warn"
const error = "error"
const always = "always"

module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-typescript",
        "@vue/eslint-config-prettier",
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    env: {
        browser: true,
        es2021: true,
        node: true,
        commonjs: true,
    },
    ecmaFeatures: {
        jsx: true, // 启用 JSX
    },
    parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        parser: "@typescript-eslint/parser",
        sourceType: "module",
    },
    plugins: ["prettier", "@typescript-eslint", "vue"],
    rules: {
        'eqeqeq': warn,
        camelcase: off,
        // 最大空行设置1
        "no-multiple-empty-lines": [warn, { max: 1 }],
        // 语句强制分号结尾
        semi: [error, "never"],
        // 禁止修改const声明的变量
        "no-const-assign": error,
        // 禁止隐式转换
        "no-implicit-coercion": off,
        // 禁止使用++，--
        "no-plusplus": off,
        // 禁止出现未使用过的变量
        "no-unused-vars": warn,
        // 禁止重复声明变量
        "no-redeclare": warn,
        // 注释风格要不要有空格什么的
        "spaced-comment": warn,
        // 使用严格模式
        strict: error,
        // 禁止尾部出现逗号，主要场景在于对象
        "comma-dangle": [0, off],
        "object-curly-spacing": [
            2,
            "always",
            {
                // 强制在花括号中使用一致的空格
                objectsInObjects: false,
            },
        ],
        // 强制属性中的getter有return
        "allowImplicit": true,
        // 禁止在函数中重复声明参数
        "no-dupe-args": error,

        /*
            代码风格
        */
        // 数组长度超出一定值换行
        "array-bracket-newline": [warn, { minItems: 5 }],
        // 强制数组括号内的间距一致
        "array-bracket-spacing": [warn, always, {
            objectsInArrays: false,
            arraysInArrays: false
        }],
        // 箭头函数参数需要括号
        "arrow-parens": [warn, always],
        // 不允许在行尾尾随空格
        "no-trailing-spaces": warn,
        // 强制一致使用单引号
        quotes: [warn, "single"],

        // 关闭组件命名规则
        "vue/multi-word-component-names": off,
        "@typescript-eslist/camelcase": 0,
        //禁止重复导入模块
        "no-duplicate-imports": error,
        // 禁止空解构
        "no-empty-pattern": warn,
        // 禁止不规则的空格
        "no-irregular-whitespace": warn,
        // 禁止混淆多行表达式
        "no-unexpected-multiline": warn,

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
};
