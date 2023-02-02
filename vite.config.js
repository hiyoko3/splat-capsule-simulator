import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import { createHtmlPlugin } from 'vite-plugin-html';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default () => {
  const IS_PROD = process.env.NODE_ENV === 'production';
  const SRC_PATH = 'src';
  const OUTPUT_PATH = IS_PROD ? 'build' : 'dist';

  return defineConfig({
    root: path.resolve(__dirname, SRC_PATH),
    resolve: {
      alias: [
        {
          find: '@src',
          replacement: path.resolve(__dirname, SRC_PATH)
        }
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    plugins: [
      // compile vue
      vue(),
      // generate html
      createHtmlPlugin(),
      // lint
      eslintPlugin(),
      // svg loader
      svgLoader({ defaultImport: 'url' })
    ],
    // publicDir: path.resolve(__dirname, `${SRC_PATH}/assets`),
    build: {
      outDir: path.resolve(__dirname, OUTPUT_PATH),
      emptyOutDir: true
    }
  });
};
