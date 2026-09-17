CREATE TYPE "CategoriaProduto" AS ENUM ('PLANTA', 'VASO', 'INSUMO', 'ARRANJO', 'OUTROS');

CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "categoria" "CategoriaProduto" NOT NULL,
    "precoVenda" DECIMAL(10,2) NOT NULL,
    "quantidadeEstoque" INTEGER NOT NULL DEFAULT 0,
    "descricao" TEXT,
    "imagemUrl" TEXT,
    "rega" TEXT,
    "iluminacao" TEXT,
    "cuidados" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Produto_sku_key" ON "Produto"("sku");
