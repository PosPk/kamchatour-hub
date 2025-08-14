import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
	{
		ignores: ['node_modules', 'dist', 'build', '.expo', '.expo-shared']
	},
	...tseslint.config(
		js.configs.recommended,
		...tseslint.configs.recommended,
		{
			files: ['**/*.ts', '**/*.tsx'],
			languageOptions: {
				parserOptions: {
					ecmaVersion: 'latest',
					sourceType: 'module'
				},
				globals: { ...globals.es2021 }
			},
			plugins: {
				'react-hooks': reactHooks
			},
			rules: {
				'react-hooks/rules-of-hooks': 'error',
				'react-hooks/exhaustive-deps': 'warn',
				'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
			}
		}
	)
];