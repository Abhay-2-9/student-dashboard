export type MaterialType = "PDF" | "IMAGE" | "NOTE" | "LINK";

export type Material = {
  id: string;
  title: string;
  type: MaterialType;
  url: string | null;
  content: string | null;
  fileSize: number | null;
  subjectId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MaterialWithSubject = Material & {
  subject: {
    id: string;
    name: string;
    color: string;
  };
};

export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  PDF: "PDF",
  IMAGE: "Image",
  NOTE: "Note",
  LINK: "Link",
};

export const MATERIAL_TYPE_ICONS: Record<MaterialType, string> = {
  PDF: "📄",
  IMAGE: "🖼️",
  NOTE: "📝",
  LINK: "🔗",
};
