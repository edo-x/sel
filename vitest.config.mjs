import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		coverage: {
			reportsDirectory: 'dist/.coverage',
		},
		exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
		passWithNoTests: true,
	},
});
