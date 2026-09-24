# 💐 FloraERP - Sistema Integrado de Gestão para Floriculturas

O **FloraERP** é uma solução ERP completa desenvolvida para otimizar as operações comerciais, logísticas e de atendimento ao cliente em floriculturas. O sistema engloba desde a frente de caixa (PDV) até a gestão avançada de estoque botânico, perdas/avarias, agendamento de entregas e pós-venda automatizado via WhatsApp.

---

## 🎯 Requisitos do Sistema

### 📌 Requisitos Funcionais (RF)
- **RF01 - Catálogo Rápido e Ficha Botânica:** Exibição visual de produtos e ficha detalhada contendo dicas de rega, iluminação, benefícios (medicinal/culinário), argumentos de venda e recomendações para venda casada.
- **RF02 - Pesquisa Global e Atalho Web:** Busca rápida no acervo do sistema (produtos, SKUs e clientes) com atalho para pesquisas externas na internet direto pelo PDV.
- **RF03 - Categorização por Mais Populares:** Destaque para sub-classes e produtos mais vendidos no caixa.
- **RF04 - Histórico de Vendas:** Consulta integrada de vendas realizadas diretamente na interface principal.
- **RF05 - Disparo de Guia de Cuidados:** Envio automático do Guia de Cuidados Botânicos personalizado para o WhatsApp do cliente após a venda.
- **RF06 - Montagem de Kits/Combos:** Agrupamento de itens e insumos (ex: vaso + muda + fita) em um carrinho único.
- **RF07 - Cadastro e Gestão de Clientes:** Cadastro completo para controle de preferências e histórico de compras.
- **RF08 - Agendamento de Entregas:** Registro de agendamentos com validação cadastral (Nome, Telefone, CPF, Data e Horário da entrega).
- **RF09 - Registro Formal de Pedidos:** Processamento transacional seguro de cada pedido.
- **RF10 - Registro de Perdas no Balcão:** Módulo para dar baixa em itens danificados, murchos ou quebrados.
- **RF11 - Alertas de Estoque Baixo/Zerado:** Notificação visual em tempo real e relatórios de saldo crítico/zerado.

### 📌 Requisitos Não Funcionais (RNF)
- **RNF01 - Multiplataforma Integrada:** Compatível com computadores do caixa, tablets e smartphones no pátio da loja.
- **RNF02 - Interface Intuitiva:** Design limpo e otimizado para dias de grande movimento (ex: Dia das Mães, Dia dos Namorados).
- **RNF03 - Atalhos Principais:** Acesso direto em 1 clique para Pesquisa de Estoque, Realizar Venda e Histórico.

### 📌 Regras de Negócio (RN)
- **RN01 - Baixa Automática por Avaria:** A dedução de estoque ocorre no instante do registro da perda.
- **RN02 - Unificação de Kit em Pedido Único:** O kit personalizado gera um único lançamento financeiro no pedido.
- **RN03 - Obrigatoriedade de Dados para Agendamento:** Validação estrita de Nome, Telefone, CPF e Data/Horário para agendar entregas.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** (Ambiente de execução)
- **Express.js** (Framework de rotas e API RESTful)
- **Prisma ORM** (Modelagem e manipulação de banco de dados)
- **PostgreSQL** (Banco de dados relacional)

### Frontend
- **HTML5 / CSS3 / JavaScript (Vanilla)**
- **Tailwind CSS** (Estilização responsiva)

### Integrações
- **API do WhatsApp (`wa.me`)** para envio de guias de cuidados botânicos.

---

## 📂 Estrutura do Projeto

```text
flora-erp/
├── client/
│   ├── css/
│   │   └── style.css
│   └── pages/
│       ├── clientes/       # Cadastro e gestão de clientes (CAIOX-62)
│       ├── dashboard/      # Métricas e alertas de estoque (RF11)
│       ├── entregas/       # Agendamento e tracking de entregas (CAIOX-64)
│       ├── pdv/            # Frente de caixa, Ficha Botânica e WhatsApp (CAIOX-63, 65, 66, 67)
│       └── perdas/         # Registro de avarias e perdas (RF10)
├── server/
│   ├── controllers/        # Controladores de regra de negócio
│   ├── middlewares/        # Middlewares de autenticação e validação
│   ├── prisma/
│   │   ├── schema.prisma   # Schema do banco de dados
│   │   └── seed.js         # Povoamento inicial de testes
│   ├── routes/             # Definições de rotas da API REST
│   ├── services/           # Serviços de alerta e regras transacionais
│   └── server.js           # Ponto de entrada da aplicação backend
└── README.md
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **PostgreSQL** em execução local ou em nuvem

### Passo a Passo

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/seu-usuario/flora-erp.git
   cd flora-erp
   ```

2. **Instalar as Dependências:**
   ```bash
   npm install
   ```

3. **Configurar as Variáveis de Ambiente (`.env`):**
   Crie um arquivo `.env` na raiz do projeto contendo:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/flora_erp?schema=public"
   PORT=3000
   JWT_SECRET="sua_chave_secreta_aqui"
   ```

4. **Executar as Migrations do Banco:**
   ```bash
   npx prisma migrate dev
   ```

5. **(Opcional) Executar o Seed para Dados Iniciais:**
   ```bash
   node server/prisma/seed.js
   ```

6. **Iniciar o Servidor em Modo de Desenvolvimento:**
   ```bash
   npm run dev
   ```

7. **Acessar a Aplicação:**
   Abra o navegador e acesse: `http://localhost:3000/client/pages/pdv/index.html`

---

## 📅 Histórico de Entregas por Sprints

### 🟢 Sprint 1: Fundação & Core Operacional
- Autenticação e permissões de usuários.
- Catálogo de Produtos e Montagem de Kits em Pedido Único (**RF06 / RN02**).
- PDV com aplicação de descontos, troco e múltiplos pagamentos.
- Módulo de Registro de Perdas com Baixa Automática no Estoque (**RF10 / RN01**).
- Cadastro Unificado de Clientes (**CAIOX-62 / RF07**).

### 🟢 Sprint 2: Gestão Avançada & Pós-venda
- **CAIOX-63:** Vínculo de Cliente ao Pedido no PDV e Emissão de Comprovante/Recibo.
- **CAIOX-64:** Agendamento e Gestão de Entregas com Validação Estrita (**RF08 / RN03**).
- **CAIOX-65:** Ficha Botânica Expandida, Argumentos de Venda e Venda Casada (**RF01 / RF03**).
- **CAIOX-66:** Disparo de Guia de Cuidados via WhatsApp pós-venda (**RF05**).
- **CAIOX-67:** Pesquisa Global com Busca Web & Notificações de Estoque Zerado (**RF02 / RF11**).

---

## 📝 Licença

Este projeto foi desenvolvido como ERP acadêmico/profissional para a disciplina de Engenharia de Software e Gestão Ágil.