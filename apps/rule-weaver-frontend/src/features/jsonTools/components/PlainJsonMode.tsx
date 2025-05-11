import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/shared/components/inputs/card";
import JsonEditor from "@/shared/components/jsonEditor/JsonEditor";
import { JsonData } from "../types";
import { useLocalStorage } from "react-use";
import { Tabs } from "@/shared/components/inputs/tabs";
import { Button } from "@/shared/components/inputs/button";
import { PlusCircle, X, Edit2 } from "lucide-react";
import { Input } from "@/shared/components/inputs/input";

interface JsonFile {
  id: string;
  name: string;
  data: JsonData;
}

export const PlainJsonMode = () => {
  const [storedFiles, setStoredFiles] = useLocalStorage<JsonFile[]>(
    "json-editor-files",
    [{ id: "1", name: "file-1", data: {} }]
  );

  const [storedActiveFileId, setStoredActiveFileId] = useLocalStorage<string>(
    "json-editor-active-file-id",
    "1"
  );

  const [files, setFiles] = useState<JsonFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>("");
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingFileName, setEditingFileName] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (storedFiles && storedFiles.length > 0) {
      setFiles(storedFiles);

      const fileExists = storedFiles.some(
        (file) => file.id === storedActiveFileId
      );
      setActiveFileId(fileExists ? storedActiveFileId : storedFiles[0].id);
    } else {
      const initialFiles = [{ id: "1", name: "file-1", data: {} }];
      setFiles(initialFiles);
      setStoredFiles(initialFiles);
      setActiveFileId("1");
    }
  }, []);

  // Update localStorage whenever files change
  useEffect(() => {
    if (files.length > 0) {
      setStoredFiles(files);
    }
  }, [files]);

  // Update localStorage whenever active file ID changes
  useEffect(() => {
    if (activeFileId) {
      setStoredActiveFileId(activeFileId);
    }
  }, [activeFileId]);

  useEffect(() => {
    if (editingFileId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingFileId]);

  const handleJsonChange = (data: JsonData, fileId: string) => {
    setFiles(
      files.map((file) => (file.id === fileId ? { ...file, data } : file))
    );
  };

  const addNewFile = () => {
    const newId = Date.now().toString();
    const newFile = {
      id: newId,
      name: `file-${files.length + 1}`,
      data: {},
    };
    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    setActiveFileId(newId);
  };

  const removeFile = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (files.length === 1) return;

    const newFiles = files.filter((file) => file.id !== fileId);
    setFiles(newFiles);

    if (activeFileId === fileId) {
      setActiveFileId(newFiles[0].id);
    }
  };

  const startRenameFile = (
    fileId: string,
    fileName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setEditingFileId(fileId);
    setEditingFileName(fileName);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveFileName();
    } else if (e.key === "Escape") {
      cancelRename();
    }
  };

  const saveFileName = () => {
    if (editingFileId && editingFileName.trim()) {
      const newName = editingFileName.trim().endsWith("")
        ? editingFileName.trim()
        : `${editingFileName.trim()}`;

      setFiles(
        files.map((file) =>
          file.id === editingFileId ? { ...file, name: newName } : file
        )
      );
      setEditingFileId(null);
    } else {
      cancelRename();
    }
  };

  const cancelRename = () => {
    setEditingFileId(null);
    setEditingFileName("");
  };

  const handleMouseDown = (fileId: string, e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
      removeFile(fileId, e);
    }
  };

  // If files is empty or activeFileId is not set, show nothing until useEffect runs
  if (files.length === 0 || !activeFileId) {
    return null;
  }

  return (
    <Card className="shadow-md m-2 rounded-lg border-border-primary overflow-hidden">
      <CardContent className="p-0">
        <Tabs
          value={activeFileId}
          onValueChange={setActiveFileId}
          className="w-full"
        >
          <div className="flex items-center px-3 pt-3 pb-0 bg-background-primary/50">
            <div className="flex-1 flex items-center overflow-x-auto overflow-y-hidden">
              <div className="flex-1 overflow-x-auto overflow-y-hidden flex">
                <div className="flex gap-0.5 w-max">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className={`group py-1.5 px-4 flex items-center cursor-pointer mr-1 text-sm transition-all duration-200 ${
                        activeFileId === file.id
                          ? "bg-background-secondary text-primary font-medium relative z-10 -mb-px shadow-[0_-2px_7px_-5px_rgba(0,0,0,0.12),_-2px_0_5px_-4px_rgba(0,0,0,0.06),_2px_0_5px_-4px_rgba(0,0,0,0.06)] rounded-t-md"
                          : "bg-background-primary/80 hover:bg-accent text-text-primary hover:text-text-secondary border border-border-primary/60 rounded-t-md"
                      }`}
                      onClick={() => setActiveFileId(file.id)}
                      onMouseDown={(e) => handleMouseDown(file.id, e)}
                    >
                      {editingFileId === file.id ? (
                        <Input
                          ref={inputRef}
                          value={editingFileName}
                          onChange={(e) => setEditingFileName(e.target.value)}
                          onBlur={saveFileName}
                          onKeyDown={handleRenameKeyDown}
                          className="w-28 h-5 px-1 py-0 text-xs"
                        />
                      ) : (
                        <>
                          <span className="mr-1 truncate max-w-32">
                            {file.name}
                          </span>
                          <div className="flex ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit2
                              size={12}
                              className="hover:text-blue-600 mr-1 cursor-pointer"
                              onClick={(e) =>
                                startRenameFile(file.id, file.name, e)
                              }
                            />
                            {files.length > 1 && (
                              <X
                                size={12}
                                className="hover:text-destructive cursor-pointer"
                                onClick={(e) => removeFile(file.id, e)}
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addNewFile}
                  className="ml-1 flex-shrink-0 text-text-primary hover:text-primary hover:bg-background-primary rounded-t-md py-1 h-auto"
                >
                  <PlusCircle size={13} className="mr-1" />
                  <span className="text-xs">New</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="p-3 pt-1">
            {files.map((file) => (
              <div
                key={file.id}
                className={activeFileId === file.id ? "block" : "hidden"}
              >
                <JsonEditor
                  value={file.data}
                  fileName={file.name}
                  onChange={(data) => handleJsonChange(data, file.id)}
                  height="65vh"
                  showToolbar={true}
                  enableStickyProperties={true}
                />
              </div>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
