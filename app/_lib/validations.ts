import { z } from "zod";

// ─── Subjects ────────────────────────────────────────────────────────────────

export const createSubjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  code: z.string().max(20).optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color")
    .default("#6366f1"),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  code: z.string().max(20).nullable().optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
});

// ─── Attendance ───────────────────────────────────────────────────────────────

export const createAttendanceSchema = z.object({
  subjectId: z.string().cuid(),
  date: z.string().date(), // "YYYY-MM-DD"
  status: z.enum(["PRESENT", "ABSENT"]),
  sessionType: z.enum(["THEORY", "LAB"]).default("THEORY"),
  note: z.string().max(500).optional(),
});

export const updateAttendanceSchema = z.object({
  date: z.string().date().optional(),
  status: z.enum(["PRESENT", "ABSENT"]).optional(),
  sessionType: z.enum(["THEORY", "LAB"]).optional(),
  note: z.string().max(500).nullable().optional(),
});

// ─── Materials ────────────────────────────────────────────────────────────────

export const createMaterialSchema = z.object({
  subjectId: z.string().cuid(),
  title: z.string().min(1, "Title is required").max(200),
  type: z.enum(["LINK", "NOTE"]),
  url: z.string().url("Must be a valid URL").optional(),
  content: z.string().max(50_000).optional(),
});

export const createUploadedMaterialSchema = z.object({
  subjectId: z.string().cuid(),
  title: z.string().min(1).max(200),
  type: z.enum(["PDF", "IMAGE"]),
  url: z.string(),    // stored file path
  fileSize: z.number().int().positive(),
});

// ─── Documents ────────────────────────────────────────────────────────────────

export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  type: z.enum(["LINK", "NOTE"]),
  url: z.string().url("Must be a valid URL").optional(),
  content: z.string().max(50_000).optional(),
});

export const createUploadedDocumentSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum(["PDF", "IMAGE"]),
  url: z.string(),
  fileSize: z.number().int().positive(),
});

// ─── Settings ─────────────────────────────────────────────────────────────────

export const updateSettingsSchema = z.object({
  targetAttendance: z.number().int().min(1).max(100).optional(),
  academicYear: z.string().min(1).max(20).optional(),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
