import {
  StudentsDescription,
  StudentsFromDbDescription,
} from "../../types/dbTypes";

export const prepareStudents = (
  studentsColl: StudentsFromDbDescription[]
): StudentsDescription[] => {
  return studentsColl.map((s) => ({
    ...s,
    history: JSON.parse(s.history),
  }));
};
