export type PaidLessons = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type StudentsMarksType = Record<string, boolean>;

export interface VisitDescription {
  visitors: number;
  subscribers: number;
  unSubscribers: number;
}

export interface StatisticDescription {
  visitDate: string;
  signed: number;
  unsigned: number;
}
export interface StatisticFromDb {
  visitDate: string;
  signed: number | null;
  unsigned: number | null;
}

export interface StudentsDescription {
  id: number;
  name: string;
  instagram: string | null;
  hasSubscription: number | null;
  startSubscription: string | null;
  paidLessons: number | null;
  additional: string | null;
}

export interface NewStudentDescription {
  name: string;
  instagram: string | null;
  hasSubscription: number | null;
  startSubscription: string | null;
  paidLessons: number | null;
  additional: string | null;
}

export interface StudentsFromDbDescription {
  id: number;
  name: string;
  instagram: string;
  hasSubscription: number;
  startSubscription: string;
  paidLessons: number;
  additional: string;
}

export interface VisitStatisticDescription {
  id: number;
  date: string;
  signed: number;
  unsigned: number;
}

export interface VisitHistoryDescription {
  id: number;
  studentId: number;
  visitDate: string;
  deducted: number;
}

export type ModalType = "new" | "old" | null;

export interface DiagramColorsDescription {
  signed: string;
  unsigned: string;
}

export type DiagramKey = keyof DiagramColorsDescription;
