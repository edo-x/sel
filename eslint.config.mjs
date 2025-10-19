import eslint from '@eslint/js';
import tslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import importsNewlinesPlugin from 'eslint-plugin-import-newlines';
import { defineConfig } from 'eslint/config';

export default defineConfig(
	{
		ignores: [
			"dist/", "tsconfig.json", "eslint.config.mjs"
		]
	},
	eslint.configs.recommended,
	tslint.configs.recommended,
	perfectionist.configs['recommended-alphabetical'],
	stylistic.configs.customize({
		indent: 'tab',
		semi: true,
		quotes: 'single',
		severity: 'warn'
	}),
	{
		plugins: {
			'import': importPlugin,
			'import-newlines': importsNewlinesPlugin,
		}
	},
	{
		rules: {
			/* styling overrides */
			'@stylistic/indent': ['warn', 'tab', {
				SwitchCase: 1,
				MemberExpression: 1,
			}],
			'@stylistic/brace-style': ['warn', 'stroustrup', {
				allowSingleLine: false,
			}],
			'@stylistic/nonblock-statement-body-position': ['warn', 'below'],
			'@stylistic/operator-linebreak': 'off',

			/* perfectionist overrides */
			'perfectionist/sort-enums': 0,
			'perfectionist/sort-switch': 0,
			'perfectionist/sort-union-types': 0,
			'perfectionist/sort-intersection-types': 0,
			'perfectionist/sort-decorators': 0,
			'perfectionist/sort-modules': 0,
			'perfectionist/sort-classes': 0,
			'perfectionist/sort-imports': 0,
			'perfectionist/sort-switch-case': 0,

			/* typescript overrides */
			'@typescript-eslint/no-explicit-any': 0,
			'@typescript-eslint/ban-ts-comment': 0,
			'@typescript-eslint/no-dynamic-delete': 0,
			'@typescript-eslint/no-invalid-void-type': 0,
			'@typescript-eslint/no-namespace': 0,
			'@typescript-eslint/no-non-null-assertion': 0,
			'@typescript-eslint/no-this-alias': 0,
			'@typescript-eslint/no-unused-vars': ['warn', {
				"args": "all",
				"argsIgnorePattern": "^_",
				"caughtErrors": "all",
				"caughtErrorsIgnorePattern": "^_",
				"destructuredArrayIgnorePattern": "^_",
				"varsIgnorePattern": "^_",
				"ignoreRestSiblings": true

			}],

			/* imports plugins */
			'sort-imports': ['warn', {
				ignoreCase: true,
				ignoreDeclarationSort: true,
			}],
			'import/order': ['warn', {
				groups: [
					'builtin',
					'external',
					'internal',
					'sibling',
					'parent',
					'index',
				],
				pathGroups: [
					{
						pattern: '~/**',
						group: 'internal',
						position: 'after',
					},
				],
				alphabetize: {
					order: 'asc',
					orderImportKind: 'asc',
					caseInsensitive: true,
				},
			}],
			'import-newlines/enforce': ['warn', {
				items: 3,
			}],
		}
	}
)
