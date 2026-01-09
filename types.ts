
export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
  status: 'published' | 'draft';
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  date: string;
  isApproved: boolean;
}

export interface User {
  username: string;
  role: 'admin' | 'super-admin';
  isLoggedIn: boolean;
}

export enum Category {
  POLITICS = 'Politics',
  ECONOMY = 'Economy',
  SOCIETY = 'Society',
  EDITORIAL = 'Editorial',
  WORLD = 'World',
  ENTERTAINMENT = 'Entertainments',
  SPORTS = 'Sports'
}
