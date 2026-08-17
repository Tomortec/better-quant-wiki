"use client";

import { useRef, useState } from "react";
import { exportStoreJson, importStoreJson } from "@/lib/practice/store";
import { Button } from "@/components/ui/button";

export function BackupControls() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  function download() {
    const blob = new Blob([exportStoreJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "better-quant-wiki-practice.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("已导出进度。");
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!window.confirm("导入会覆盖此浏览器里的练习进度，确定吗？")) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    void file.text().then((text) => {
      const result = importStoreJson(text);
      setMessage(result.ok ? "已导入进度。" : result.error);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" size="sm" onClick={download}>
        导出进度
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
        导入 JSON
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {message ? <span className="text-xs text-muted-foreground">{message}</span> : null}
    </div>
  );
}
