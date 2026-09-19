/*
  Warnings:

  - The `quizBattery` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `quizBudget` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `quizMultitask` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `quizPortable` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `quizPurpose` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `quizScreen` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "quizBattery",
ADD COLUMN     "quizBattery" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "quizBudget",
ADD COLUMN     "quizBudget" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "quizMultitask",
ADD COLUMN     "quizMultitask" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "quizPortable",
ADD COLUMN     "quizPortable" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "quizPurpose",
ADD COLUMN     "quizPurpose" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "quizScreen",
ADD COLUMN     "quizScreen" TEXT[] DEFAULT ARRAY[]::TEXT[];
