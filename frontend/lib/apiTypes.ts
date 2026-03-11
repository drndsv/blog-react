export type User = {
  id: number;
  email: string;
  name: string;
};

export type Article = {
  id: number;
  title: string;
  content: string;
  previewImage?: string | null;
  author?: User;
};

export type Comment = {
  id: number;
  content: string;
  user?: Pick<User, 'id' | 'name'>;
  articleId?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  page: number;
  pageCount: number;
};
