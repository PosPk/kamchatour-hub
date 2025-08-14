module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			[
				'module-resolver',
				{
					root: ['.'],
					alias: {
						'@assets': './assets',
						'@lib': './lib',
						'@components': './components',
						'@contexts': './contexts',
						'@hooks': './hooks',
						'@navigation': './navigation',
						'@screens': './screens',
						'@services': './services',
						'@types': './types',
						'@utils': './utils',
						'@features': './features'
					}
				}
			]
		],
		env: {
			production: {
				plugins: [['transform-remove-console', { exclude: ['error', 'warn'] }]]
			}
		}
	};
};