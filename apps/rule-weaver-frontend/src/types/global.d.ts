/**
 * Global type definitions for the application
 */

// Extend Window interface to include MonacoEnvironment
interface Window {
  MonacoEnvironment?: {
    getWorker?: (moduleId: string, label: string) => Worker;
    [key: string]: any;
  };
}
