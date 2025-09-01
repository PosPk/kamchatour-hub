export interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  imageUrl: string;
  caption?: string;
  tags?: string[];
  createdAt: number;
  likes: number;
  likedByMe?: boolean;
  comments: { id: string; userName: string; text: string; createdAt: number }[];
  location?: { latitude: number; longitude: number; name?: string };
}

let mockFeed: FeedPost[] = [
  {
    id: 'p1', userId: 'u1', userName: 'Андрей', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop', caption: 'У подножья вулкана', tags: ['вулканы','трек'], createdAt: Date.now() - 7200000, likes: 23, likedByMe: false, comments: []
  },
  {
    id: 'p2', userId: 'u2', userName: 'Мария', imageUrl: 'https://images.unsplash.com/photo-1521292270410-a8c0d7f2e47c?q=80&w=1000&auto=format&fit=crop', caption: 'Медвежья тропа', tags: ['дикая природа'], createdAt: Date.now() - 3600000, likes: 41, likedByMe: true, comments: []
  }
];

export async function listFeed(): Promise<FeedPost[]> {
  await new Promise(r => setTimeout(r, 250));
  return [...mockFeed].sort((a, b) => b.createdAt - a.createdAt);
}

export async function addPost(post: Omit<FeedPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'likedByMe'>): Promise<FeedPost> {
  await new Promise(r => setTimeout(r, 250));
  const item: FeedPost = { ...post, id: String(Date.now()), createdAt: Date.now(), likes: 0, comments: [], likedByMe: false };
  mockFeed.unshift(item);
  return item;
}

export async function toggleLike(id: string): Promise<FeedPost | null> {
  await new Promise(r => setTimeout(r, 120));
  const idx = mockFeed.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const liked = !mockFeed[idx].likedByMe;
  mockFeed[idx].likedByMe = liked;
  mockFeed[idx].likes += liked ? 1 : -1;
  return mockFeed[idx];
}

