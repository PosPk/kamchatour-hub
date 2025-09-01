'use strict';

const fs = require('fs');
const path = require('path');

const pathsToClean = [
	'.expo',
	'dist',
	'.cache',
	'node_modules/.cache',
];

for (const p of pathsToClean) {
	const full = path.resolve(process.cwd(), p);
	if (fs.existsSync(full)) {
		console.log(`Removing ${full}`);
		fs.rmSync(full, { recursive: true, force: true });
	}
}

console.log('Reset complete. Run `npm ci` and `npm start`.');

