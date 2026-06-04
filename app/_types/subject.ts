// TypeScript types derived from Prisma models + application logic

export type Subject = {
  id: string;
  name: string;
  code: string | null;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SubjectWithCounts = Subject & {
  _count: {
    attendance: number;
    materials: number;
  };
};
