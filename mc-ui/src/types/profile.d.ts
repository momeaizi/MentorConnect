export interface Profile {
  age: number;
  bio: string;
  birth_date: string;
  common_interests: string[];
  distance: number;
  fameRating: number;
  firstName: string;
  gender: string;
  image: string | null;
  interests: string[];
  lastName: string;
  pictures: string[];
  id: number;
  username: string;
  conversationId?: number;
  likeStatus: string;
  isFlagged: boolean;
}