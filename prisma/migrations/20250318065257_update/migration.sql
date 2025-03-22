/*
  Warnings:

  - Added the required column `updatedAt` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Made the column `hasCompletedOnboarding` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "expertise" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "hasCompletedOnboarding" SET NOT NULL;
