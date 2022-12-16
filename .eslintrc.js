/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

const off = "off"
const warn = "warn"
const error = "error"

module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-typescript",
        "@vue/eslint-config-prettier",
    ],
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
        "commonjs": true
    },
    parserOptions: {
        ecmaVersion: "latest",
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: ['prettier', '@typescript-eslint', 'vue'],
    rules: {
        // "no-multiple-empty-lines": off,
        // // js语句结尾必须使用分号
        // "semi": [2, off],// 语句强制分号结尾
        // "no-const-assign": error, // 禁止修改const声明的变量
        // "no-implicit-coercion": warn, // 禁止隐式转换
        // "no-plusplus": off, // 禁止使用++，--
        // "indent": [4, 4], // 缩进风格
        // "no-redeclare": warn,// 禁止重复声明变量
        // "spaced-comment": warn, // 注释风格要不要有空格什么的
        // "strict": error,// 使用严格模式
        // "comma-dangle": [2, "never"], // 禁止尾部出现逗号，主要场景在于对象
        // "object-curly-spacing": [2, "always", { // 强制在花括号中使用一致的空格
        //     objectsInObjects: false
        // }],
        // "spaced-comment": [2, "always", { // 要求在注释前有空白
        //     "markers": ["global", "globals", "eslint", "eslint-disable", "*package", "!", ","]
        // }],
    },
};
