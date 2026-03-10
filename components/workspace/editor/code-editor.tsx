"use client";

import { useCallback, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { Spinner } from "@/components/ui/spinner";
import { getFileLanguage } from "@/lib/utils";
import type { ProjectFile } from "@/types";

interface CodeEditorProps {
  file: ProjectFile | null;
  unsavedContent?: string;
  onChange: (fileId: string, content: string) => void;
  onSave: (fileId: string, content: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({
  file,
  unsavedContent,
  onChange,
  onSave,
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (file) {
        const content = editor.getValue();
        onSave(file.id, content);
      }
    });
  };

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (file && value !== undefined) {
        onChange(file.id, value);
      }
    },
    [file, onChange]
  );

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted">
        <div className="text-center">
          <p className="text-lg font-medium">No file selected</p>
          <p className="text-sm mt-1">Select a file from the sidebar to start editing</p>
        </div>
      </div>
    );
  }

  const language = getFileLanguage(file.path);
  const content = unsavedContent ?? file.content;

  return (
    <Editor
      height="100%"
      language={language}
      value={content}
      onChange={handleChange}
      onMount={handleMount}
      loading={
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 22,
        padding: { top: 16 },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        automaticLayout: true,
        tabSize: 2,
        renderWhitespace: "selection",
        bracketPairColorization: { enabled: true },
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
      }}
      theme="vs-light"
    />
  );
}
