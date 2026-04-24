-- CreateTable
CREATE TABLE "ERPModule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "access" TEXT NOT NULL DEFAULT 'NONE',
    CONSTRAINT "RolePermission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "ERPModule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'GUEST',
    "departmentId" TEXT,
    "schoolId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "fullName" TEXT,
    "passwordHash" TEXT DEFAULT '',
    "profilePicture" TEXT,
    "campusId" TEXT,
    "department" TEXT,
    "lastActive" DATETIME,
    "lastSeen" DATETIME,
    "campusAccess" TEXT,
    "dateOfBirth" TEXT,
    "managerId" TEXT,
    "academics" TEXT DEFAULT 'CORE',
    "category" TEXT DEFAULT 'IN_SERVICE',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "staffSubtype" TEXT,
    "roleScope" TEXT NOT NULL DEFAULT 'OWN',
    CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("academics", "campusAccess", "campusId", "category", "createdAt", "dateOfBirth", "department", "departmentId", "email", "fullName", "id", "isVerified", "lastActive", "lastSeen", "managerId", "name", "password", "passwordHash", "profilePicture", "role", "schoolId", "status", "updatedAt") SELECT "academics", "campusAccess", "campusId", "category", "createdAt", "dateOfBirth", "department", "departmentId", "email", "fullName", "id", "isVerified", "lastActive", "lastSeen", "managerId", "name", "password", "passwordHash", "profilePicture", "role", "schoolId", "status", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_departmentId_idx" ON "User"("departmentId");
CREATE INDEX "User_schoolId_idx" ON "User"("schoolId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ERPModule_name_key" ON "ERPModule"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ERPModule_code_key" ON "ERPModule"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_moduleId_action_key" ON "RolePermission"("role", "moduleId", "action");
