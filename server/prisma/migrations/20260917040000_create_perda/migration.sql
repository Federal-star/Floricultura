CREATE TYPE "MotivoPerda" AS ENUM ('DETERIORACAO', 'AVARIA', 'PRAGA', 'VALIDADE', 'OUTROS');

CREATE TABLE "Perda" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "motivo" "MotivoPerda" NOT NULL,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Perda_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Perda_createdAt_idx" ON "Perda"("createdAt");
CREATE INDEX "Perda_motivo_idx" ON "Perda"("motivo");
CREATE INDEX "Perda_produtoId_idx" ON "Perda"("produtoId");

ALTER TABLE "Perda" ADD CONSTRAINT "Perda_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Perda" ADD CONSTRAINT "Perda_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;