-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "subjectId" TEXT NOT NULL,
    CONSTRAINT "AttendanceRecord_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "content" TEXT,
    "fileSize" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "subjectId" TEXT NOT NULL,
    CONSTRAINT "Material_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "targetAttendance" INTEGER NOT NULL DEFAULT 75
);
