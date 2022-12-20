/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

const off = "off";
const warn = "warn";
const error = "error";
const always = "always";

module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-typescript",
        "@vue/eslint-config-prettier",
    ],
    env: {
        browser: true,
        es2021: true,
        node: true,
        commonjs: true,
        "vue/setup-compiler-macros": true, // 针对setup语法糖 可不用defined defineEmits 以及 definExpose
    },
    ecmaFeatures: {
        jsx: true, // 启用 JSX
    },
    parserOptions: {
        ecmaVersion: "latest",
        parser: "@typescript-eslint/parser",
        sourceType: "module",
    },
    plugins: ["prettier", "@typescript-eslint", "vue"],
    rules: {
        camelcase: off,
        "no-multiple-empty-lines": off,
        semi: [warn, always], // 语句强制分号结尾
        "no-const-assign": error, // 禁止修改const声明的变量
        "no-implicit-coercion": off, // 禁止隐式转换
        "no-plusplus": off, // 禁止使用++，--
        "no-unused-vars": warn, // 禁止出现未使用过的变量
        indent: [warn, 4], // 缩进风格
        "no-redeclare": warn, // 禁止重复声明变量
        "spaced-comment": warn, // 注释风格要不要有空格什么的
        strict: error, // 使用严格模式
        "comma-dangle": [0, off], // 禁止尾部出现逗号，主要场景在于对象
        "object-curly-spacing": [
            2,
            "always",
            {
                // 强制在花括号中使用一致的空格
                objectsInObjects: false,
            },
        ],

        // 关闭组件命名规则
        "vue/multi-word-component-names": "off",
        "@typescript-eslist/camelcase": 0,
    },
};
