import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
/* eslint-disable @typescript-eslint/no-explicit-any */
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

// Type for Monaco plugin since its typing is inconsistent
type MonacoPlugin = {
  (options: Record<string, unknown>): any;
  default?: (options: Record<string, unknown>) => any;
};

// https://vitejs.dev/config/
export const config = defineConfig(({ mode }) => {
  // Handle plugin which might be a direct function or have a default export
  const monaco = monacoEditorPlugin as MonacoPlugin;
  const monacoPlugin = monaco.default || monaco;

  return {
    server: {
      host: '::',
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development',
      monacoPlugin({
        // Define custom worker paths directly in public
        customWorkers: [
          {
            label: 'json',
            entry: 'monaco-editor/esm/vs/language/json/json.worker.js',
            output: 'json.worker.js',
          },
          {
            label: 'css',
            entry: 'monaco-editor/esm/vs/language/css/css.worker.js',
            output: 'css.worker.js',
          },
          {
            label: 'html',
            entry: 'monaco-editor/esm/vs/language/html/html.worker.js',
            output: 'html.worker.js',
          },
          {
            label: 'typescript',
            entry: 'monaco-editor/esm/vs/language/typescript/ts.worker.js',
            output: 'typescript.worker.js',
          },
          {
            label: 'editorWorkerService',
            entry: 'monaco-editor/esm/vs/editor/editor.worker.js',
            output: 'editor.worker.js',
          },
        ],
        // Register all necessary language workers
        languageWorkers: ['json', 'css', 'html', 'typescript'],
        // Where workers will be published
        publicPath: 'monaco-editor/',
        // Better handling for workers
        filename: '[name].worker.js',
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // Add an alias for monaco-editor to help resolve paths
        'monaco-editor': path.resolve(
          __dirname,
          '../../node_modules/.pnpm/monaco-editor@0.52.2/node_modules/monaco-editor'
        ),
      },
    },
    optimizeDeps: {
      // Force pre-bundling of these dependencies
      include: [
        'monaco-editor/esm/vs/language/json/json.worker.js',
        'monaco-editor/esm/vs/editor/editor.worker.js',
        'monaco-editor/esm/vs/language/css/css.worker.js',
        'monaco-editor/esm/vs/language/html/html.worker.js',
        'monaco-editor/esm/vs/language/typescript/ts.worker.js',
        '@monaco-editor/react',
      ],
      // Make sure Vite doesn't exclude these
      exclude: [],
    },
    build: {
      // Better source maps for debugging
      sourcemap: mode === 'development',
      // Better CommonJS interop
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      // Separate worker chunks
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('monaco-editor')) {
              return 'monaco-editor';
            }
            if (id.includes('worker')) {
              return 'workers';
            }
          },
        },
      },
    },
  };
});

export default config;
