export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export type CreateBookmarkInput = Omit<Bookmark, "id" | "createdAt" | "updatedAt">;
export type UpdateBookmarkInput = Partial<Omit<Bookmark, "id" | "createdAt">>;
