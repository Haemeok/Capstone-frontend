export type User = {
  id: number;
  name: string;
  email: string;
  profileContent: string;
  imageURL: string;
  username?: string;
  followers?: number;
  following?: number;
  bookmarks?: number;
  likes?: number;
};
