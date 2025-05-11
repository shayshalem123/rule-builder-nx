import { useState, useEffect } from "react";
import type { editor } from "monaco-editor";

interface UseFullscreenEditorOptions {
  editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>;
}

/**
 * Hook for managing fullscreen editor state and behavior
 */
export function useFullscreenEditor({ editorRef }: UseFullscreenEditorOptions) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle ESC key to exit fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Re-layout the editor when fullscreen changes
  useEffect(() => {
    if (isFullscreen) {
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.layout();
          editorRef.current.focus();
        }
      }, 200);
    }
  }, [isFullscreen, editorRef]);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return {
    isFullscreen,
    toggleFullscreen,
  };
}
