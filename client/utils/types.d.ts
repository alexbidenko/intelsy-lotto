export type BoardType = (number | null)[][];

export enum GameStateVariant {
  UNKNOWN = 'unknown',
  PROCESSED = 'processed',
  RESULTS = 'results',
  FINISHED = 'finished',
}

export type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
};

export type EventType = {
  name: 'faster_user' | 'fastest_user';
  data: {
    user: UserType;
    value: number;
    duration: number;
  };
  timestamp: number;
} | {
  name: 'completed';
  data: {
    type: 'first_row' | 'second_row' | 'third_row' | 'full_card';
    user: UserType;
    completed: boolean;
  };
};
