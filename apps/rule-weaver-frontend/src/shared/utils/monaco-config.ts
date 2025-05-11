/**
 * Monaco Editor global configuration utilities
 *
 * This file contains configurations for ensuring Monaco editor loads correctly
 * in different environments and prevents worker loading errors.
 */

/**
 * Fix for Monaco editor "toUrl is not a function" error when loading workers.
 *
 * This function creates a global MonacoEnvironment object to properly handle worker script loading.
 * Must be called before any Monaco editor instance is initialized.
 */
export const configureMonacoEnvironment = () => {
  // Create global Monaco environment configuration if it doesn't exist
  if (!window.MonacoEnvironment) {
    window.MonacoEnvironment = {
      // Define getWorker function to resolve correctly from the public path
      getWorker: function (_moduleId, label) {
        // For strict pnpm isolation mode, we need to use dynamic imports

        // Use base URL for dynamic imports
        const baseUrl = window.location.origin;

        // Map of worker endpoints configured in Vite
        const workerMap: Record<string, string> = {
          json: `${baseUrl}/monaco-editor/json.worker.js`,
          css: `${baseUrl}/monaco-editor/css.worker.js`,
          html: `${baseUrl}/monaco-editor/html.worker.js`,
          typescript: `${baseUrl}/monaco-editor/typescript.worker.js`,
          javascript: `${baseUrl}/monaco-editor/typescript.worker.js`,
          // Default worker
          _default: `${baseUrl}/monaco-editor/editor.worker.js`,
        };

        // Get the worker URL from our map
        return new Worker(workerMap[label] || workerMap._default, {
          type: "module",
        });
      },
    };
  }
};

/**
 * Initialize Monaco environment with all necessary configurations.
 *
 * Call this function in the application's entry point before rendering
 * any Monaco editor instances.
 */
export const initializeMonaco = () => {
  // Configure Monaco environment to handle worker scripts
  configureMonacoEnvironment();
};
