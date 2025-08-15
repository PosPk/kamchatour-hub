module.exports = {
	extends: ['eslint:recommended', 'plugin:react-hooks/recommended', 'prettier'],
	overrides: [
		{
			files: ['**/*.ts', '**/*.tsx'],
			extends: ['plugin:@typescript-eslint/recommended'],
			parser: '@typescript-eslint/parser',
			plugins: ['@typescript-eslint']
		}
	]
};