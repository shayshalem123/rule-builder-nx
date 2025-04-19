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
      getWorker: function (moduleId, label) {
        // Load appropriate worker based on editor language
        if (label === "json") {
          return new Worker(
            new URL(
              "monaco-editor/esm/vs/language/json/json.worker",
              import.meta.url
            )
          );
        }
        if (label === "css") {
          return new Worker(
            new URL(
              "monaco-editor/esm/vs/language/css/css.worker",
              import.meta.url
            )
          );
        }
        if (label === "html") {
          return new Worker(
            new URL(
              "monaco-editor/esm/vs/language/html/html.worker",
              import.meta.url
            )
          );
        }
        if (label === "typescript" || label === "javascript") {
          return new Worker(
            new URL(
              "monaco-editor/esm/vs/language/typescript/ts.worker",
              import.meta.url
            )
          );
        }

        // Default editor worker for other operations
        return new Worker(
          new URL("monaco-editor/esm/vs/editor/editor.worker", import.meta.url)
        );
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
