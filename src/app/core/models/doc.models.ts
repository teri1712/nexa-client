export interface Doc {
  id: string;
  filename: string;
  title: string;
  description: string;
  fileType: DocType;
  createdAt: string;
  score: number;
}

export interface DocItem {
  id: string;
  filename: string;
  title: string;
  fileType: DocType;
  createdAt: string;
  score: number;
}

export enum DocType {
  PDF = 'PDF',
  DOCX = 'DOCX',
}

export interface DocPage {
  totalPages: number;
  docs: DocItem[];
}

export interface DocFilter {
  start?: Date
  end?: Date
  type: DocType,
  last?: DocItem
}
