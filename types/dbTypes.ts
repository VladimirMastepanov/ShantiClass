
export type PaidLessons = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type StudentsMarksType = Record<string, boolean>;

export interface VisitDescription {
  visitors: number;
  subscribers: number;
  unSubscribers: number;
}

export interface StudentsDescription {
  id: number;
  name: string;
  instagram: string | null;
  hasSubscription: number | null;
  startSubscription: string | null; // Date
  paidLessons: number | null;
  additional: string | null;
  // history: string[]; // array of dates: dd/mm/yy
}

export interface NewStudentDescription {
  name: string;
  instagram: string | null;
  hasSubscription: number | null;
  startSubscription: string | null; // Date
  paidLessons: number | null;
  additional: string | null;
}

export interface StudentsFromDbDescription {
  id: number;
  name: string;
  instagram: string;
  hasSubscription: number;
  startSubscription: string; // Date
  paidLessons: number;
  additional: string;
}

export interface VisitStatisticDescription {
  id: number;
  date: string; // Date
  signed: number;
  unsigned: number;
}

export interface VisitHistoryDescription {
  id: number;
  studentId: number;
  visitDate: string;
  deducted: number;
}

export type ModalType = 'new' | 'old' | null;


// export interface StudentsHistory {
//   date: Date;
//   names: string[];
// }