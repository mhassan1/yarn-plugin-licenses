import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import jsdoc from 'eslint-plugin-jsdoc'

export default defineConfig(js.configs.recommended, tseslint.configs.recommended, jsdoc.configs['flat/recommended'])
