"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Pencil, Trash2, BookOpen, RefreshCw, AlertCircle,
  ChevronLeft, ChevronRight, TriangleAlert,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/axios";
import { toast } from "sonner";
import type { Blog, BlogListResponse, BlogPagination } from "@/types/blog";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_OPTIONS = ["all", "design", "our-mind", "others"] as const;
const STATUS_OPTIONS = ["all", "published", "draft"] as const;
type CategoryFilter = (typeof CATEGORY_OPTIONS)[number];
type StatusFilter = (typeof STATUS_OPTIONS)[number];

const PAGE_SIZE = 5;

const CATEGORY_COLOR: Record<string, string> = {
  design: "bg-indigo-100 text-indigo-700",
  "our-mind": "bg-violet-100 text-violet-700",
  others: "bg-pink-100 text-pink-700",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildQuery(
  category: CategoryFilter,
  status: StatusFilter,
  page: number
): string {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (status === "published") params.set("published", "true");
  if (status === "draft") params.set("published", "false");
  params.set("page", String(page));
  params.set("limit", String(PAGE_SIZE));
  return params.toString();
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-start justify-between gap-4 px-5 py-4">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="h-20 w-20 shrink-0 rounded-lg bg-muted" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex gap-2">
            <div className="h-4 w-16 rounded-full bg-muted" />
            <div className="h-4 w-14 rounded-full bg-muted" />
          </div>
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <div className="h-7 w-7 rounded bg-muted" />
        <div className="h-7 w-7 rounded bg-muted" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-white py-20">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
        <BookOpen className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium">No blog posts found</p>
      <p className="text-xs text-muted-foreground">
        Try adjusting your filters or create a new post.
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-red-200 bg-red-50 py-16">
      <AlertCircle className="h-8 w-8 text-red-400" />
      <p className="text-sm font-medium text-red-600">Failed to load blogs</p>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={onRetry}>
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BlogListProps {
  /** Increment to trigger a fresh fetch — e.g. after creating a blog. */
  refreshKey?: number;
  /** Called when the user clicks Edit on a blog row. */
  onEdit?: (blog: Blog) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BlogList({ refreshKey = 0, onEdit }: BlogListProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState<BlogPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmBlog, setConfirmBlog] = useState<Blog | null>(null);

  // ── Filters & page ───────────────────────────────────────────────────────
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever filters change
  const handleCategoryChange = (v: CategoryFilter) => {
    setCategory(v);
    setPage(1);
  };
  const handleStatusChange = (v: StatusFilter) => {
    setStatus(v);
    setPage(1);
  };

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const qs = buildQuery(category, status, page);
      const { data } = await api.get<{ data: BlogListResponse }>(
        `/api/blogs?${qs}`
      );
      setBlogs(data.data.blogs);
      setPagination(data.data.pagination);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [category, status, page]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs, refreshKey]);

  // Reset to page 1 when refreshKey changes (new blog was created)
  useEffect(() => {
    setPage(1);
  }, [refreshKey]);

  // ── Delete ───────────────────────────────────────────────────────────────

  const handleDelete = (blog: Blog) => setConfirmBlog(blog);

  const handleConfirmDelete = async () => {
    if (!confirmBlog) return;
    const blog = confirmBlog;
    setConfirmBlog(null);

    setDeletingId(blog._id);
    const toastId = toast.loading("Deleting blog…");
    try {
      await api.delete(`/api/blogs/${blog._id}`);
      toast.success("Blog deleted successfully.", { id: toastId });
      if (blogs.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchBlogs();
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to delete blog.";
      toast.error(msg, { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  // ── Derived ──────────────────────────────────────────────────────────────

  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? 0;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-3">

      {/* ── Filter bar ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3">

        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            Category
          </span>
          {CATEGORY_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleCategoryChange(c)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                category === c
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "border border-border bg-gray-50 text-muted-foreground hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Status pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            Status
          </span>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                status === s
                  ? s === "published"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : s === "draft"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-indigo-600 text-white shadow-sm"
                  : "border border-border bg-gray-50 text-muted-foreground hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      {loading ? (
        <Card className="border border-border shadow-none">
          <CardContent className="p-0">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Separator />}
                <SkeletonRow />
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        <ErrorState onRetry={fetchBlogs} />
      ) : blogs.length === 0 ? (
        <EmptyState />
      ) : (
        <Card className="border border-border shadow-none">
          <CardContent className="p-0">
            {blogs.map((blog, i) => (
              <React.Fragment key={blog._id}>
                {i > 0 && <Separator />}
                <div className="flex items-start justify-between gap-4 px-5 py-4">

                  {/* Left: thumbnail + info */}
                  <div className="flex min-w-0 flex-1 items-start gap-4">

                    {/* Thumbnail */}
                    {blog.coverImage ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${blog.coverImage}`}
                        alt={blog.title}
                        className="h-20 w-20 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <BookOpen className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                          CATEGORY_COLOR[blog.category] ?? "bg-muted text-muted-foreground"
                        }`}
                      >
                        {blog.category}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          blog.isPublished
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    <CardTitle className="text-sm font-semibold leading-snug">
                      {blog.title}
                    </CardTitle>

                    {blog.excerpt && (
                      <CardDescription className="line-clamp-2 text-xs">
                        {blog.excerpt}
                      </CardDescription>
                    )}

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      <span>{formatDate(blog.createdAt)}</span>
                      {blog.tags.length > 0 && (
                        <>
                          <span>&middot;</span>
                          <span>{blog.tags.slice(0, 3).join(", ")}</span>
                        </>
                      )}
                    </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 cursor-pointer text-muted-foreground hover:text-indigo-600"
                      title="Edit"
                      onClick={() => onEdit?.(blog)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 cursor-pointer text-muted-foreground hover:text-red-600"
                      title="Delete"
                      disabled={deletingId === blog._id}
                      onClick={() => handleDelete(blog)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── Footer: summary + pagination ───────────────────────────────── */}
      {!loading && !error && pagination && (
        <div className="flex flex-wrap items-center justify-between gap-3">

          {/* Summary badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{total} Total</Badge>
            <Badge variant="secondary">
              Page {pagination.page} of {totalPages}
            </Badge>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* Prev */}
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 cursor-pointer"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isEllipsis =
                  totalPages > 7 &&
                  p !== 1 &&
                  p !== totalPages &&
                  (p < page - 1 || p > page + 1);
                const prevIsEllipsis =
                  totalPages > 7 &&
                  p - 1 !== 1 &&
                  p - 1 !== totalPages &&
                  (p - 1 < page - 1 || p - 1 > page + 1);

                if (isEllipsis) {
                  if (!prevIsEllipsis) {
                    return (
                      <span key={p} className="px-1 text-xs text-muted-foreground">
                        …
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="icon"
                    className={`h-7 w-7 cursor-pointer text-xs ${
                      p === page
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : ""
                    }`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                );
              })}

              {/* Next */}
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 cursor-pointer"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Delete confirmation dialog ──────────────────────────────────── */}
      <Dialog open={!!confirmBlog} onOpenChange={(open: boolean) => { if (!open) setConfirmBlog(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <TriangleAlert className="h-7 w-7 text-red-500" />
            </div>
            <DialogTitle className="text-center text-base">
              Delete Blog Post?
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              You are about to permanently delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{confirmBlog?.title}&rdquo;
              </span>
              . This action{" "}
              <span className="font-semibold text-red-600">cannot be undone</span>.
            </DialogDescription>
          </DialogHeader>

          {/* Cover image preview if available */}
          {confirmBlog?.coverImage && (
            <div className="overflow-hidden rounded-xl border border-border">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${confirmBlog.coverImage}`}
                alt={confirmBlog.title}
                className="h-32 w-full object-cover opacity-80"
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => setConfirmBlog(null)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 cursor-pointer bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20"
              onClick={handleConfirmDelete}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
