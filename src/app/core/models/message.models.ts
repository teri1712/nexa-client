export interface Message {
      readonly sequenceNumber: number;
      readonly content: string;
      readonly createdAt: string;
      readonly mine: boolean;
}