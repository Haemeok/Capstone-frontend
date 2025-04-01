export type User = {
  id: number;
  name: string;
  email: string;
  profileContent: string;
  imageURL: string;
  username?: string;
  bookmarks?: number;
  likes?: number;
};
