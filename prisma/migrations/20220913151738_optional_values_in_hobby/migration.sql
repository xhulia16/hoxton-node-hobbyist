-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hobby" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "active" BOOLEAN
);
INSERT INTO "new_Hobby" ("active", "id", "image", "name") SELECT "active", "id", "image", "name" FROM "Hobby";
DROP TABLE "Hobby";
ALTER TABLE "new_Hobby" RENAME TO "Hobby";
CREATE UNIQUE INDEX "Hobby_name_key" ON "Hobby"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
