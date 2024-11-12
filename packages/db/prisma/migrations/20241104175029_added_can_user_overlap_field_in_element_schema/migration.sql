/*
  Warnings:

  - Added the required column `canUserOverlap` to the `Element` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Element" ADD COLUMN     "canUserOverlap" BOOLEAN NOT NULL;
