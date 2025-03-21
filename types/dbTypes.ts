
export type PaidLessons = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface StudentsDescription {
  id: number;
  name: string;
  instagram: string | null;
  hasSubscription: number | null;
  startSubscription: string | null; // Date
  paidLessons: number | null;
  additional: string | null;
}

export interface VisitStatisticDescription {
  id: number;
  date: Date;
  singed: number;
  unSinged: number;
}
