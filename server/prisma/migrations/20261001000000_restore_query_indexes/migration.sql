-- CreateIndex
CREATE INDEX "ItemPedido_pedidoId_idx" ON "ItemPedido"("pedidoId");

-- CreateIndex
CREATE INDEX "ItemPedido_produtoId_idx" ON "ItemPedido"("produtoId");

-- CreateIndex
CREATE INDEX "Pedido_usuarioId_idx" ON "Pedido"("usuarioId");

-- CreateIndex
CREATE INDEX "Perda_createdAt_idx" ON "Perda"("createdAt");

-- CreateIndex
CREATE INDEX "Perda_motivo_idx" ON "Perda"("motivo");

-- CreateIndex
CREATE INDEX "Perda_produtoId_idx" ON "Perda"("produtoId");