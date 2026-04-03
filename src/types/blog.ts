// ---------------------------------------------------------------------------
// Blog types — mirrors the Mongoose model returned by the backend
// ---------------------------------------------------------------------------

export type BlogCategory = "design" | "our-mind" | "others";

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: BlogCategory;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogListResponse {
  blogs: Blog[];
  pagination: BlogPagination;
}
