/*
  Warnings:

  - You are about to drop the column `autor` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `autorId` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Asset` table. All the data in the column will be lost.
  - Added the required column `assignedTo` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depreciation` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disposeValue` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturer` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchasePrice` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNumber` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "autor",
DROP COLUMN "autorId",
DROP COLUMN "createdAt",
DROP COLUMN "nome",
DROP COLUMN "price",
ADD COLUMN     "assignedTo" TEXT NOT NULL,
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "depreciation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "disposeValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "manufacturer" TEXT NOT NULL,
ADD COLUMN     "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "purchasePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "serialNumber" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
