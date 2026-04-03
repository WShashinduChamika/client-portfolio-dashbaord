"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogCreateForm from "@/components/dashboard/BlogCreateForm";
import BlogList from "@/components/dashboard/BlogList";
import type { Blog } from "@/types/blog";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BlogsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const isFormOpen = showForm || !!editingBlog;

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  const handleSuccess = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleNewPost = () => {
    setEditingBlog(null);
    setShowForm((s) => !s);
  };

  const handleEdit = (blog: Blog) => {
    setShowForm(false);
    setEditingBlog(blog);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Blogs</h2>
          <p className="text-sm text-muted-foreground">Write and manage your blog articles.</p>
        </div>
        <Button
          size="sm"
          onClick={handleNewPost}
          className="gap-1.5 bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          {isFormOpen && !editingBlog ? "Close" : "New Post"}
        </Button>
      </div>

      {/* Create / Edit form */}
      {isFormOpen && (
        <BlogCreateForm
          key={editingBlog?._id ?? "new"}
          blog={editingBlog ?? undefined}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}

      {/* Blog list */}
      <BlogList refreshKey={refreshKey} onEdit={handleEdit} />
    </div>
  );
}


