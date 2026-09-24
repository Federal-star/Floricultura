-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "argumentosVenda" TEXT,
ADD COLUMN     "popular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sugestoesIds" TEXT,
ADD COLUMN     "usos" TEXT;
