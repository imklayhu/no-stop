import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url))

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        tsconfigRootDir
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    }
  },
)
