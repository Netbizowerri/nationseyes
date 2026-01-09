import { collection, doc, getDocs, setDoc, deleteDoc, query, where, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Post, Comment, User } from '../types';
import { INITIAL_POSTS } from '../constants';

const POSTS_COLLECTION = 'posts';
const COMMENTS_COLLECTION = 'comments';
const AUTH_KEY = 'nations_eyes_auth';

export const storageService = {
  getPosts: async (): Promise<Post[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, POSTS_COLLECTION));
      const posts: Post[] = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() } as Post);
      });

      if (posts.length === 0) {
        // Seed initial posts if empty
        for (const post of INITIAL_POSTS) {
          await storageService.savePost(post);
        }
        return INITIAL_POSTS;
      }
      return posts;
    } catch (e) {
      console.error("Error getting posts: ", e);
      return [];
    }
  },

  savePost: async (post: Post) => {
    try {
      await setDoc(doc(db, POSTS_COLLECTION, post.id), post);
    } catch (e) {
      console.error("Error saving post: ", e);
    }
  },

  deletePost: async (id: string) => {
    try {
      await deleteDoc(doc(db, POSTS_COLLECTION, id));
    } catch (e) {
      console.error("Error deleting post: ", e);
    }
  },

  getComments: async (): Promise<Comment[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COMMENTS_COLLECTION));
      const comments: Comment[] = [];
      querySnapshot.forEach((doc) => {
        comments.push({ id: doc.id, ...doc.data() } as Comment);
      });
      return comments;
    } catch (e) {
      console.error("Error getting comments: ", e);
      return [];
    }
  },

  addComment: async (comment: Comment) => {
    try {
      await setDoc(doc(db, COMMENTS_COLLECTION, comment.id), comment);
    } catch (e) {
      console.error("Error adding comment: ", e);
    }
  },

  updateCommentStatus: async (id: string, isApproved: boolean) => {
    try {
      const commentRef = doc(db, COMMENTS_COLLECTION, id);
      await updateDoc(commentRef, { isApproved });
    } catch (e) {
      console.error("Error updating comment: ", e);
    }
  },

  deleteComment: async (id: string) => {
    try {
      await deleteDoc(doc(db, COMMENTS_COLLECTION, id));
    } catch (e) {
      console.error("Error deleting comment: ", e);
    }
  },

  getAuth: (): User | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },

  setAuth: (user: User | null) => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }
};