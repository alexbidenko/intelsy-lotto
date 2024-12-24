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

export type EventType = { _id: string } & (
  {
    name: 'faster_user' | 'fastest_user';
    data: {
      user: UserType;
      value: number;
      duration: number;
    };
    timestamp: number;
  } | {
  name: 'first_row' | 'second_row' | 'third_row' | 'full_card';
    data: {
      user: UserType;
      completed: boolean;
    };
  }
);
