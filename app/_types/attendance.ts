import type { AttendanceStats } from "../_lib/attendance";

export type AttendanceStatus = "PRESENT" | "ABSENT";

export type AttendanceRecord = {
  id: string;
  date: Date;
  status: AttendanceStatus;
  sessionType: "THEORY" | "LAB";
  note: string | null;
  subjectId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AttendanceRecordWithSubject = AttendanceRecord & {
  subject: {
    id: string;
    name: string;
    color: string;
  };
};

export type SubjectAttendanceSummary = {
  subjectId: string;
  subjectName: string;
  subjectCode: string | null;
  subjectColor: string;
  stats: AttendanceStats;
};

export type { AttendanceStats };
