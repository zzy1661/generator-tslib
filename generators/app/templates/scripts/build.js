const fs = require('fs-extra');
const execa = require('execa');
const pkg = require('../package.json');

const stdio = ['ignore', 'inherit', 'pipe'];
const opts = {stdio};

const name = pkg.name;
const packageName = name.split('-').reduce((p, c) => {
	return p + c[0].toUpperCase() + c.slice(1);
});
const run = async () => {
	const pkgPrefix = `${packageName.toLowerCase()}.`;

	const tempMove = name => fs.move(`dist/${pkgPrefix}${name}`, `temp/${pkgPrefix}${name}`);
	const moveTemp = name => fs.move(`temp/${pkgPrefix}${name}`, `dist/${pkgPrefix}${name}`);

	const build = (format, env) => {
		const args = ['build', '--name', packageName, '--format', format];
		if (env) {
			args.push('--env', env);
		}
		return execa('tsdx', args, opts);
	};

	await fs.emptyDir('temp');

	await build('esm', 'development').catch(e => {
		console.log(e);
	});

	await tempMove(`esm.development.js`);
	await tempMove(`esm.development.js.map`);

	await build('esm', 'production');
	await tempMove(`esm.production.min.js`);
	await tempMove(`esm.production.min.js.map`);

	await build('esm,cjs').catch(err => {
		throw new Error(`build failed: ${err.stderr}`);
	});

	await moveTemp(`esm.development.js`);
	await moveTemp(`esm.development.js.map`);
	await moveTemp(`esm.production.min.js`);
	await moveTemp(`esm.production.min.js.map`);
	await fs.remove('temp');
};

run().catch(err => {
	console.error(err);
	process.exit(1);
});
