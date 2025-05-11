import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './platform-consistency.css';

// Monaco Editor global setup - fixes "toUrl is not a function" error
// This needs to be configured before Monaco is loaded anywhere in the app
import { loader } from '@monaco-editor/react';
import { initializeMonaco } from './shared/utils/monaco-config';

// Initialize Monaco environment to prevent worker loading issues
initializeMonaco();

// Additionally configure the Monaco loader paths
loader.config({
  paths: {
    vs: '/vs',
  },
  'vs/nls': { availableLanguages: { '*': 'en' } },
});

// Initialize theme before rendering
const initializeTheme = () => {
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const theme = storedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.classList.add(theme);
};

initializeTheme();

createRoot(document.getElementById('root')!).render(<App />);
