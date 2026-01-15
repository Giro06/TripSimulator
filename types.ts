
export enum Gender {
  MALE = 'Erkek',
  FEMALE = 'Kadın'
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'partner';
  timestamp: Date;
}

export interface Partner {
  name: string;
  gender: Gender;
  avatar: string;
}

export enum GameStatus {
  SELECTION = 'selection',
  PLAYING = 'playing',
  BLOCKED = 'blocked'
}
