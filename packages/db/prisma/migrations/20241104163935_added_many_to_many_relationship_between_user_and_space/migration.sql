/*
  Warnings:

  - You are about to drop the column `userId` on the `Space` table. All the data in the column will be lost.
  - Added the required column `creatorUserId` to the `Space` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_userId_fkey";

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "userId",
ADD COLUMN     "creatorUserId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_SpaceToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SpaceToUser_AB_unique" ON "_SpaceToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SpaceToUser_B_index" ON "_SpaceToUser"("B");

-- AddForeignKey
ALTER TABLE "_SpaceToUser" ADD CONSTRAINT "_SpaceToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpaceToUser" ADD CONSTRAINT "_SpaceToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
