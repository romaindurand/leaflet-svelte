// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', '@ts-safeql/eslint-plugin'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
		project: './tsconfig.json'
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'@ts-safeql/check-sql': [
			'error',
			{
				connections: [
					{
						connectionUrl: process.env.DATABASE_URL,
						// The migrations path:
						migrationsDir: './prisma/migrations',
						targets: [
							// This makes `prisma.$queryRaw` and `prisma.$executeRaw` commands linted
							{ tag: 'prisma.+($queryRaw|$executeRaw)', transform: '{type}[]' }
						]
					}
				]
			}
		]
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
};
