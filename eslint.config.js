/* eslint-disable */

const { defineConfig } = require('eslint/config')

const tsParser = require('@typescript-eslint/parser')
const jsdoc = require('eslint-plugin-jsdoc')
const typescriptEslintEslintPlugin = require('@typescript-eslint/eslint-plugin')
const js = require('@eslint/js')

const { FlatCompat } = require('@eslint/eslintrc')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

module.exports = defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: 'module',
      parserOptions: {}
    },

    extends: compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:jsdoc/recommended',
      'plugin:@typescript-eslint/eslint-recommended'
    ),

    plugins: {
      jsdoc,
      '@typescript-eslint': typescriptEslintEslintPlugin
    }
  }
])
