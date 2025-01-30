export interface FeedRecord {
  id: string;
  time: Date;
  amount: number; // in ml
}

export type FeedRecordUpdate = Partial<Omit<FeedRecord, 'id'>>;
