import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { track } from '../lib/analytics';
import { useTotems } from './TotemContext';

export interface FeedComment {
  id: string;
  text: string;
  createdAt: number;
}

export interface FeedPost {
  id: string;
  title?: string;
  uri: string;
  likes: number;
  comments: FeedComment[];
  createdAt: number;
}

interface PhotoFeedContextType {
  posts: FeedPost[];
  addPost: (params: { title?: string; uri: string }) => Promise<FeedPost | null>;
  likePost: (id: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  clear: () => Promise<void>;
}

const STORAGE_KEY = 'photo_feed_posts_v1';

const Ctx = createContext<PhotoFeedContextType | undefined>(undefined);

export const usePhotoFeedContext = (): PhotoFeedContextType => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePhotoFeedContext must be used within PhotoFeedProvider');
  return ctx;
};

export const PhotoFeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const { award } = useTotems();

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setPosts(JSON.parse(raw));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); } catch {}
    })();
  }, [posts]);

  const addPost = useCallback(async ({ title, uri }: { title?: string; uri: string }): Promise<FeedPost | null> => {
    if (!uri) return null;
    const post: FeedPost = {
      id: Date.now().toString(),
      title,
      uri,
      likes: 0,
      comments: [],
      createdAt: Date.now(),
    };
    setPosts(prev => [post, ...prev]);
    track('feed_view', { action: 'post_added' });
    try { await award('volcano', 15, 'post_in_feed'); } catch {}
    return post;
  }, [award]);

  const likePost = useCallback(async (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  }, []);

  const addComment = useCallback(async (postId: string, text: string) => {
    if (!text) return;
    const cmt: FeedComment = { id: Date.now().toString(), text, createdAt: Date.now() };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [cmt, ...p.comments] } : p));
  }, []);

  const clear = useCallback(async () => setPosts([]), []);

  const value = useMemo<PhotoFeedContextType>(() => ({ posts, addPost, likePost, addComment, clear }), [posts, addPost, likePost, addComment, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

