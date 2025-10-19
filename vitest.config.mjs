import tsconfigPaths from 'vite-tsconfig-paths';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		coverage: {
			exclude: [
				...coverageConfigDefaults.exclude,
				'*.config.mjs',
			],
			reportsDirectory: 'dist/.coverage',
		},
		exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
		passWithNoTests: true,
	},
});
