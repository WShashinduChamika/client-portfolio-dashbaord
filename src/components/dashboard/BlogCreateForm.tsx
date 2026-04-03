"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import {
  ImagePlus,
  X,
  Tag,
  Loader2,
  FileText,
  Pencil,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { toast } from "sonner";
import type { Blog } from "@/types/blog";
import "react-quill-new/dist/quill.snow.css";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_OPTIONS = ["design", "our-mind", "others"] as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BlogCreateFormProps {
  /** Called when the form is dismissed (cancel or successful submit) */
  onClose: () => void;
  /** Called after a blog is successfully created/updated */
  onSuccess?: () => void;
  /** When provided the form operates in edit mode */
  blog?: Blog;
}

// ---------------------------------------------------------------------------
// ReactQuill — client-side only
// ---------------------------------------------------------------------------

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BlogCreateForm({ onClose, onSuccess, blog }: BlogCreateFormProps) {
  const isEditMode = !!blog;

  const [title, setTitle] = useState(blog?.title ?? "");
  const [content, setContent] = useState(blog?.content ?? "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [category, setCategory] = useState<string>(blog?.category ?? CATEGORY_OPTIONS[0]);
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>(blog?.tags ?? []);
  const [isPublished, setIsPublished] = useState(blog?.isPublished ?? false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  // For edit mode — tracks the existing server-side cover path
  const [existingCoverImage, setExistingCoverImage] = useState<string | null>(
    blog?.coverImage || null
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    blog?.coverImage
      ? `${process.env.NEXT_PUBLIC_API_URL}${blog.coverImage}`
      : null
  );
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  // ── Cover image helpers ───────────────────────────────────────────────────

  const applyFile = (f: File) => {
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) applyFile(f);
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setExistingCoverImage(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── Tag helpers ───────────────────────────────────────────────────────────

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagsInput.trim()) {
      e.preventDefault();
      const newTag = tagsInput.trim().replace(/,$/, "");
      if (newTag && !tags.includes(newTag)) setTags((t) => [...t, newTag]);
      setTagsInput("");
    }
  };

  const removeTag = (tag: string) => setTags((t) => t.filter((x) => x !== tag));

  // ── Reset ─────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setTitle("");
    setContent("");
    setExcerpt("");
    setTagsInput("");
    setTags([]);
    setIsPublished(false);
    setExistingCoverImage(null);
    removeCover();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (publish: boolean) => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading(
      isEditMode
        ? "Updating post…"
        : publish
        ? "Publishing post…"
        : "Saving draft…"
    );
    try {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("content", content);
      form.append("excerpt", excerpt.trim());
      form.append("category", category);
      form.append("tags", tags.join(","));
      form.append("isPublished", publish ? "true" : "false");

      if (coverFile) {
        // New file selected — upload it
        form.append("coverImage", coverFile);
      } else if (isEditMode) {
        // No new file; pass existing path so backend keeps it (or clears if null)
        form.append("coverImage", existingCoverImage ?? "");
      }

      if (isEditMode) {
        await api.put(`/api/blogs/${blog!._id}`, form, {
          headers: { "Content-Type": undefined },
        });
      } else {
        await api.post("/api/blogs", form, {
          headers: { "Content-Type": undefined },
        });
      }

      toast.success(
        isEditMode
          ? "Blog updated successfully!"
          : publish
          ? "Blog published successfully!"
          : "Draft saved successfully!",
        { id: toastId }
      );

      onSuccess?.();
      if (!isEditMode) resetForm();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ??
        (err as { message?: string })?.message ??
        "An error occurred.";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Card className="relative overflow-hidden border border-border shadow-sm">
      {/* ── Loading overlay ──────────────────────────────────────────── */}
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-indigo-600">Saving your post…</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b bg-linear-to-r from-indigo-50 to-violet-50 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isEditMode ? "bg-amber-100" : "bg-indigo-100"}`}>
            {isEditMode
              ? <Pencil className="h-4 w-4 text-amber-600" />
              : <FileText className="h-4 w-4 text-indigo-600" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {isEditMode ? "Edit Blog Post" : "New Blog Post"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isEditMode ? `Editing: ${blog!.title}` : "Fill in the details below"}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-white/60 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3">

          {/* ── Left / main column ──────────────────────────────────────── */}
          <div className="col-span-2 flex flex-col gap-5 border-r p-6">

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an attention-grabbing title…"
                className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium placeholder:text-muted-foreground/50 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Excerpt */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short summary shown in the blog listing…"
                rows={2}
                className="w-full resize-none rounded-lg border border-border bg-white px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="overflow-hidden rounded-lg border border-border focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  className="[&_.ql-container]:min-h-55 [&_.ql-container]:border-0 [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* ── Right / meta column ─────────────────────────────────────── */}
          <div className="flex flex-col gap-5 bg-gray-50/60 p-6">

            {/* Cover image */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Cover Image
              </label>
              {coverPreview ? (
                <div className="relative overflow-hidden rounded-xl border border-border">
                  <img
                    src={coverPreview}
                    alt="cover preview"
                    className="h-40 w-full object-cover"
                  />
                  <button
                    onClick={removeCover}
                    className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const f = e.dataTransfer.files[0];
                    if (f) applyFile(f);
                  }}
                  className={`flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${
                    dragOver
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-border bg-white hover:border-indigo-300 hover:bg-indigo-50/40"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                    <ImagePlus className="h-5 w-5 text-indigo-500" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">Click or drag to upload</p>
                  <p className="text-[10px] text-muted-foreground/60">PNG, JPG, WEBP · max 5 MB</p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                      category === c
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "border border-border bg-white text-muted-foreground hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-white px-3 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-700"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 cursor-pointer hover:text-indigo-900"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? "Add tag, press Enter…" : ""}
                  className="min-w-20 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground/50"
                />
              </div>
              <p className="text-[10px] text-muted-foreground/60">
                Press Enter or comma to add a tag
              </p>
            </div>

            {/* Publish toggle */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
              <div>
                <p className="text-sm font-medium">Publish immediately</p>
                <p className="text-xs text-muted-foreground">Make visible to readers</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublished((p) => !p)}
                className={`relative h-6 w-11 cursor-pointer overflow-hidden rounded-full transition-colors ${
                  isPublished ? "bg-indigo-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    isPublished ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>


          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t bg-gray-50/60 px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={loading}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="cursor-pointer gap-1.5"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save as Draft
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="cursor-pointer gap-1.5 bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 hover:opacity-90"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Publish
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
