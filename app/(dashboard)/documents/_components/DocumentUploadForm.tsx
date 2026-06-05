"use client";

import { useState } from "react";
import { Button } from "../../../_components/ui/Button";
import { useToast } from "../../../_components/ui/Toast";

interface DocumentUploadFormProps {
  onSuccess: () => void;
}

type Tab = "upload" | "link" | "note";

export function DocumentUploadForm({ onSuccess }: DocumentUploadFormProps) {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("upload");
  const [loading, setLoading] = useState(false);

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");

  // Link state
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");

  // Note state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", uploadTitle || file.name);
      const res = await fetch("/api/documents/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error);
      }
      toast("File uploaded", "success");
      setFile(null);
      setUploadTitle("");
      onSuccess();
    } catch (err: unknown) {
      toast((err as Error).message ?? "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: linkTitle, type: "LINK", url: linkUrl }),
      });
      if (!res.ok) throw new Error();
      toast("Link added", "success");
      setLinkUrl(""); setLinkTitle("");
      onSuccess();
    } catch {
      toast("Failed to add link", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleNote(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: noteTitle, type: "NOTE", content: noteContent }),
      });
      if (!res.ok) throw new Error();
      toast("Note saved", "success");
      setNoteTitle(""); setNoteContent("");
      onSuccess();
    } catch {
      toast("Failed to save note", "error");
    } finally {
      setLoading(false);
    }
  }

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "upload", label: "Upload File", icon: "📤" },
    { key: "link",   label: "Add Link",    icon: "🔗" },
    { key: "note",   label: "Write Note",  icon: "📝" },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="tab-bar" style={{ marginBottom: 18 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab-item${tab === t.key ? " active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "upload" && (
        <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              File (PDF or Image, max 50 MB)
            </label>
            <input
              id="document-file"
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                if (f && !uploadTitle) setUploadTitle(f.name.replace(/\.[^.]+$/, ""));
              }}
              style={{ display: "block", color: "var(--text-secondary)", fontSize: 14 }}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Title
            </label>
            <input
              id="document-upload-title"
              className="input"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g. Fee Receipt 2026"
              required
            />
          </div>
          <Button type="submit" loading={loading} style={{ alignSelf: "flex-start" }}>
            Upload
          </Button>
        </form>
      )}

      {tab === "link" && (
        <form onSubmit={handleLink} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              URL
            </label>
            <input id="document-link-url" className="input" type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://" required />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Title
            </label>
            <input id="document-link-title" className="input" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="e.g. College Portal" required />
          </div>
          <Button type="submit" loading={loading} style={{ alignSelf: "flex-start" }}>
            Add Link
          </Button>
        </form>
      )}

      {tab === "note" && (
        <form onSubmit={handleNote} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Title
            </label>
            <input id="document-note-title" className="input" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="e.g. Important Dates" required />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Content
            </label>
            <textarea
              id="document-note-content"
              className="input"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your note here…"
              rows={6}
              style={{ resize: "vertical" }}
              required
            />
          </div>
          <Button type="submit" loading={loading} style={{ alignSelf: "flex-start" }}>
            Save Note
          </Button>
        </form>
      )}
    </div>
  );
}
