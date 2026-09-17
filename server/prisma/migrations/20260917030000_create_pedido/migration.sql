CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO');
CREATE TYPE "StatusPedido" AS ENUM ('CONCLUIDO', 'CANCELADO');

CREATE TABLE "Pedido" (
    "id" UUID NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "desconto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "status" "StatusPedido" NOT NULL DEFAULT 'CONCLUIDO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ItemPedido" (
    "id" UUID NOT NULL,
    "pedidoId" UUID NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    CONSTRAINT "ItemPedido_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Pedido_usuarioId_idx" ON "Pedido"("usuarioId");
CREATE INDEX "ItemPedido_pedidoId_idx" ON "ItemPedido"("pedidoId");
CREATE INDEX "ItemPedido_produtoId_idx" ON "ItemPedido"("produtoId");

ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;