export interface Photo {
  id: string;
  url: string;
  caption: string;
  isUserUploaded?: boolean;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

export type FileType = 'folder' | 'text' | 'image';

export interface FolderItem {
  id: string;
  name: string;
  type: FileType;
  content?: string; // For text files or image URLs
  children?: FolderItem[]; // For folders
}

export interface UserState {
  name: string;
  isOnboarded: boolean;
}