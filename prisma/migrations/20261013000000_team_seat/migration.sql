-- AlterTable: the seat of a person in the office (-1 = automatic, in the order of the list)
ALTER TABLE "TeamMember" ADD COLUMN "seat" INTEGER NOT NULL DEFAULT -1;
