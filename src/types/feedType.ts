export interface FeedItem {
  writerId: string | undefined;
  writerAvatar: string | undefined;
  writerName: string | undefined;
  description: string | undefined;
  tag: string[];
  nowPlaying: string | null;
  updatedAt: string | undefined;
}

export default interface FeedType extends FeedItem {
  _id?: string;
}
