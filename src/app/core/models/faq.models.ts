export interface FaqResponse {
  question: string;
}

export enum LogStatus {
  CREATED = 'CREATED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface ClusterLogResponse {
  id: number;
  date: string; // ISO date string
  status: LogStatus;
  message: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
