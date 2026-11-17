import type { StorybookConfig } from '@storybook/react-webpack5';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/preset-create-react-app",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-webpack5",
  "staticDirs": [
    "../public"
  ],
  webpackFinal: async (webpackConfig) => {
    const checker = webpackConfig.plugins?.find(
      (plugin) => plugin?.constructor.name === 'ForkTsCheckerWebpackPlugin'
    );
    if (!checker || !('options' in checker) || typeof checker.options !== 'object' ||
        checker.options === null || !('typescript' in checker.options) ||
        typeof checker.options.typescript !== 'object' || checker.options.typescript === null) {
      throw new Error('Could not configure the Create React App TypeScript checker for Storybook');
    }

    Object.assign(checker.options.typescript, {
      configFile: 'tsconfig.storybook.json',
      typescriptPath: require.resolve('typescript-storybook'),
    });
    return webpackConfig;
  },
};
export default config;