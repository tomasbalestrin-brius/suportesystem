# Sistema de Suporte Inteligente com IA

Sistema completo de suporte ao cliente com inteligência artificial (Sofia GPT-4), tickets automáticos, dashboard administrativo e integrações externas.

**🔗 Repositório:** https://github.com/tomasbalestrin-brius/suportesystem

---

## ⚡ Deploy Rápido (5 minutos)

### 1. Configure o Vercel

**A. No Dashboard do Vercel:**

1. Importe o repositório: `tomasbalestrin-brius/suportesystem`
2. **Root Directory:** `frontend-platform` ⚠️ IMPORTANTE!
3. **Framework Preset:** Next.js (detecta automaticamente)
4. **Build Command:** `pnpm build` (já configurado)
5. **Output Directory:** `.next` (padrão)

**B. Variáveis de Ambiente** (obrigatórias):

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
OPENAI_API_KEY=sk-proj-...
```

**C. Deploy:**

Clique em **Deploy** e aguarde ~2-4 minutos.

### 2. Configure o Supabase

Execute os scripts SQL no Supabase Dashboard > SQL Editor (em ordem):

```bash
1. frontend-platform/scripts/001_initial_schema.sql
2. frontend-platform/scripts/002_seed_knowledge_base.sql
3. frontend-platform/scripts/003_expose_tables_api.sql
4. frontend-platform/scripts/003_fix_permissions.sql
```

### 3. Pronto! 🎉

Acesse: `https://seu-projeto.vercel.app`

---

## 📂 Estrutura do Projeto

```
suportesystem/
├── frontend-platform/         # Frontend Next.js completo
│   ├── app/                   # App Router (páginas e APIs)
│   ├── components/            # Componentes React
│   ├── lib/                   # IA, Supabase, integrações
│   ├── scripts/               # SQL Scripts Supabase
│   ├── public/                # Assets estáticos
│   ├── package.json
│   ├── .env.example           # Template de variáveis
│   └── vercel.json            # Config Vercel
│
├── docs/                      # Documentação técnica
│   ├── ANALISE_FRONTEND.md
│   ├── DETALHAMENTO_TECNICO.md
│   ├── GUIA_CUSTOMIZACAO_DETALHADO.md
│   └── EXEMPLOS_PRATICOS.md
│
├── setup/                     # Guias de configuração
│   ├── DEPLOY_VERCEL.md       # Deploy detalhado
│   ├── DEPLOY_COMPLETO.md     # Setup completo
│   └── setup.sh               # Script automático
│
└── README.md                  # Este arquivo
```

---

## 🎯 Funcionalidades

### ✅ Frontend Completo

- **Chat Público com IA (Sofia)**
  - Interface sem login
  - GPT-4 com personalidade humanizada
  - Coleta natural de dados
  - Criação automática de tickets

- **Sistema de Tickets**
  - Categorização automática
  - Priorização inteligente
  - IA resolve ou encaminha para humano
  - Histórico completo

- **Dashboard Administrativo**
  - Gestão de tickets
  - Base de conhecimento (FAQ)
  - Notificações em tempo real
  - Estatísticas e métricas

- **Integrações via Webhooks**
  - Plataformas de email
  - Plataformas de pagamento
  - Áreas de membros

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | Next.js 16 + React 19 + TypeScript |
| **UI** | Tailwind CSS 4 + Radix UI |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime) |
| **IA** | OpenAI GPT-4 |
| **Deploy** | Vercel (Frontend) + Supabase (Backend) |
| **Package Manager** | pnpm |

---

## 📚 Documentação Completa

### Guias de Deploy
- **[DEPLOY_VERCEL.md](./setup/DEPLOY_VERCEL.md)** - Deploy passo a passo no Vercel
- **[DEPLOY_COMPLETO.md](./setup/DEPLOY_COMPLETO.md)** - Setup completo do zero

### Documentação Técnica
- **[DETALHAMENTO_TECNICO.md](./docs/DETALHAMENTO_TECNICO.md)** - Como tudo funciona
- **[ANALISE_FRONTEND.md](./docs/ANALISE_FRONTEND.md)** - Análise do código

### Customização
- **[GUIA_CUSTOMIZACAO_DETALHADO.md](./docs/GUIA_CUSTOMIZACAO_DETALHADO.md)** - Personalizar tudo
- **[EXEMPLOS_PRATICOS.md](./docs/EXEMPLOS_PRATICOS.md)** - Código pronto

---

## 🚀 Desenvolvimento Local

### Requisitos
- Node.js 18+
- pnpm 8+
- Credenciais Supabase e OpenAI

### Setup

```bash
# 1. Clone o repositório
git clone https://github.com/tomasbalestrin-brius/suportesystem.git
cd suportesystem/frontend-platform

# 2. Instale dependências
pnpm install

# 3. Configure variáveis
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 4. Execute o servidor
pnpm dev
```

Abra: http://localhost:3000

---

## 🔧 Comandos Úteis

```bash
# Build de produção
cd frontend-platform
pnpm build

# Executar build localmente
pnpm start

# Checar tipos TypeScript
pnpm type-check

# Limpar cache
rm -rf .next node_modules
pnpm install
```

---

## 📊 Status do Build

✅ **Último Build:** Sucesso (16 rotas compiladas)

### Rotas Disponíveis:
- `/` - Chat público
- `/admin` - Dashboard
- `/admin/tickets` - Gestão de tickets
- `/admin/knowledge-base` - Base de conhecimento
- `/api/chat` - API do chat
- `/api/tickets` - API de tickets
- `/api/webhooks/*` - Webhooks de integração

---

## ⚙️ Configuração do Vercel

### Opção 1: Via Dashboard (Recomendado)

1. **New Project** > Import Git Repository
2. **Root Directory:** `frontend-platform` ⚠️
3. **Environment Variables:** Adicione as 4 obrigatórias
4. **Deploy**

### Opção 2: Via vercel.json (Já configurado)

O arquivo `vercel.json` na raiz já está configurado para:
- Build Command: `cd frontend-platform && pnpm build`
- Output: `frontend-platform/.next`
- Region: São Paulo (gru1)
- Timeout APIs: 30s

---

## 🔐 Variáveis de Ambiente

### Obrigatórias

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# OpenAI
OPENAI_API_KEY=sk-proj-...
```

### Opcionais

```env
# App
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app

# Integrações
PURCHASE_PLATFORM_URL=
PURCHASE_PLATFORM_API_KEY=
MEMBER_PLATFORM_URL=
MEMBER_PLATFORM_API_KEY=
EMAIL_PLATFORM_API_KEY=
```

Veja `frontend-platform/.env.example` para template completo.

---

## 🗄️ Banco de Dados

### Scripts SQL (executar em ordem):

1. **001_initial_schema.sql** - Cria tabelas, views, functions
2. **002_seed_knowledge_base.sql** - Popula FAQ inicial
3. **003_expose_tables_api.sql** - Configura APIs
4. **003_fix_permissions.sql** - Ajusta permissões RLS

### Tabelas Criadas:
- `customers` - Clientes
- `tickets` - Tickets de suporte
- `ticket_messages` - Mensagens dos tickets
- `knowledge_base_articles` - Base de conhecimento
- `notifications` - Notificações
- `settings` - Configurações do sistema
- `chat_sessions` - Sessões de chat
- `webhooks_log` - Log de webhooks
- `ai_interactions` - Interações com IA

---

## 💰 Custos Estimados

| Serviço | Plano | Custo |
|---------|-------|-------|
| **Vercel** | Hobby | Grátis |
| **Vercel** | Pro | $20/mês |
| **Supabase** | Free | Grátis |
| **Supabase** | Pro | $25/mês |
| **OpenAI** | Pay-as-go | $20-50/mês* |

\* Baseado em 1000-2000 conversas/mês com GPT-4o

**Configuração mínima (Grátis):**
- Vercel Hobby
- Supabase Free
- OpenAI ~$20/mês

---

## 🐛 Troubleshooting

### Build falha no Vercel

**Erro: "Cannot find module"**
```bash
# Limpe cache no Vercel Dashboard > Settings > Clear Build Cache
# Redeploy
```

**Erro: "Missing environment variables"**
```bash
# Verifique no Vercel Dashboard > Settings > Environment Variables
# Todas as 4 obrigatórias devem estar presentes
```

### Runtime errors

**Erro 500 nas APIs**
```bash
# Verifique logs: Vercel Dashboard > Deployments > [seu deploy] > Logs
# Confirme que OPENAI_API_KEY está configurada
```

**Supabase connection error**
```bash
# Verifique se as URLs estão corretas (sem / no final)
# Confirme que SQL scripts foram executados
```

---

## 🤝 Suporte

- **Issues:** https://github.com/tomasbalestrin-brius/suportesystem/issues
- **Documentação:** Ver pasta `docs/`
- **Guias:** Ver pasta `setup/`

---

## 📝 Licença

[A definir]

---

## ✅ Checklist de Deploy

- [ ] Repositório clonado/importado no Vercel
- [ ] Root Directory configurado como `frontend-platform`
- [ ] 4 variáveis de ambiente obrigatórias configuradas
- [ ] Deploy executado com sucesso
- [ ] SQL scripts executados no Supabase
- [ ] Aplicação acessível e funcionando
- [ ] Chat responde corretamente
- [ ] Tickets são criados
- [ ] Dashboard carrega

---

**Status:** ✅ Pronto para produção
**Última atualização:** 2025-12-23
**Branch:** `claude/build-system-frontend-FUEYH`
**Build:** ✅ Passing (16 rotas compiladas)
