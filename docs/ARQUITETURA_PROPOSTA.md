# Arquitetura Proposta - Sistema de Suporte Integrado

## 🎯 Objetivo

Construir um sistema de suporte completo utilizando o frontend **v0-ai-support-platform** integrado com um backend robusto.

---

## 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                     SISTEMA DE SUPORTE                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   FRONTEND       │◄────►│    BACKEND       │◄────►│   BANCO DE       │
│   (Next.js)      │      │   (API/Logic)    │      │   DADOS          │
│                  │      │                  │      │   (PostgreSQL)   │
│  - Chat Público  │      │  - Supabase      │      │                  │
│  - Dashboard     │      │  - APIs REST     │      │  - Tables        │
│  - Admin Panel   │      │  - IA (OpenAI)   │      │  - RLS           │
│                  │      │  - Webhooks      │      │  - Triggers      │
└──────────────────┘      └──────────────────┘      └──────────────────┘
         │                         │                         │
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────────────────────────────────────────────────┐
│              INTEGRAÇÕES EXTERNAS (Webhooks)                 │
│  - Email (SES)  - Pagamentos  - Membros  - Outros           │
└──────────────────────────────────────────────────────────────┘
```

---

## 📂 Estrutura de Pastas Proposta

### Opção 1: Monorepo (Recomendado)

```
suportesystem/
├── apps/
│   ├── frontend/              # v0-ai-support-platform (Next.js)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── backend/               # Backend customizado (opcional)
│       ├── src/
│       ├── tests/
│       └── package.json
│
├── packages/                  # Shared packages
│   ├── types/                 # TypeScript types compartilhados
│   ├── utils/                 # Utilitários compartilhados
│   └── config/                # Configurações compartilhadas
│
├── supabase/                  # Configuração Supabase
│   ├── migrations/            # SQL migrations
│   ├── functions/             # Edge Functions
│   └── config.toml
│
├── docs/                      # Documentação
│   ├── ANALISE_FRONTEND.md
│   ├── ARQUITETURA_PROPOSTA.md
│   ├── API.md
│   └── SETUP.md
│
├── scripts/                   # Scripts de setup/deploy
│   ├── setup-database.sh
│   ├── seed-data.sh
│   └── deploy.sh
│
├── .env.example               # Template de variáveis
├── .gitignore
├── pnpm-workspace.yaml        # Configuração monorepo
├── turbo.json                 # Turborepo config (opcional)
└── README.md
```

### Opção 2: Frontend Standalone (Mais Simples)

```
suportesystem/
├── app/                       # Next.js app (do v0-ai-support-platform)
├── components/
├── lib/
├── public/
├── scripts/                   # SQL scripts
├── docs/                      # Documentação
├── .env.local                 # Variáveis de ambiente
├── package.json
└── README.md
```

---

## 🔧 Opções de Backend

### **Opção A: Supabase (Padrão do Frontend)**

**Vantagens:**
- ✅ Já integrado no frontend
- ✅ Backend-as-a-Service (menos código)
- ✅ PostgreSQL + Auth + Realtime + Storage
- ✅ Row Level Security (RLS)
- ✅ APIs auto-geradas
- ✅ Edge Functions para lógica customizada

**Desvantagens:**
- ⚠️ Vendor lock-in
- ⚠️ Custos podem escalar
- ⚠️ Menos controle sobre infraestrutura

**Stack:**
- Supabase (PostgreSQL + Auth + Realtime)
- Next.js API Routes
- OpenAI API
- Vercel/Netlify (deploy)

### **Opção B: Backend Customizado (Node.js/NestJS)**

**Vantagens:**
- ✅ Controle total
- ✅ Escalabilidade customizada
- ✅ Fácil migração de providers
- ✅ Lógica de negócio centralizada

**Desvantagens:**
- ⚠️ Mais código para manter
- ⚠️ Mais tempo de desenvolvimento
- ⚠️ Precisa reimplementar auth/realtime

**Stack:**
- NestJS/Express + TypeScript
- PostgreSQL (direto ou via Prisma/TypeORM)
- Redis (cache/queue)
- JWT para autenticação
- Socket.io para realtime

### **Opção C: Híbrido (Recomendado para Escalabilidade)**

**Conceito:**
- Frontend: Next.js (do v0-ai-support-platform)
- BaaS: Supabase (auth, database, realtime)
- Microserviços: NestJS para lógica complexa
- Queue: Redis/BullMQ para jobs assíncronos
- Cache: Redis para performance

**Stack:**
```
Next.js Frontend
    ↓
Supabase (Auth + DB + Realtime)
    ↓
NestJS Microservices
    ↓
Redis (Cache + Queue)
    ↓
External APIs (OpenAI, Email, etc)
```

---

## 🗄️ Estratégia de Banco de Dados

### Usar Scripts SQL Existentes

O frontend já vem com scripts SQL completos:

```bash
scripts/
├── 001_initial_schema.sql      # Schema completo (253 linhas)
├── 002_seed_knowledge_base.sql # Dados iniciais (240 linhas)
├── 003_expose_tables_api.sql   # Configuração API
└── 003_fix_permissions.sql     # Correção de permissões
```

**Execução:**
```bash
# Via Supabase CLI
supabase db reset

# Ou via SQL Editor do Supabase
# Copiar e colar cada script na ordem
```

### Tabelas Criadas

1. **public_chats** - Sessões de chat
2. **public_chat_messages** - Mensagens do chat
3. **customers** - Dados de clientes
4. **tickets** - Tickets de suporte
5. **ticket_messages** - Mensagens dos tickets
6. **knowledge_base** - Base de conhecimento (FAQ)
7. **admin_notifications** - Notificações admin
8. **platform_webhooks** - Logs de webhooks
9. **integration_logs** - Logs de integrações

---

## 🔐 Estratégia de Autenticação

### Para Usuários Públicos (Chat)
- **Sem autenticação**: Acesso anônimo ao chat
- **Session ID**: UUID gerado no cliente
- **Tracking**: Via cookies/localStorage

### Para Administradores
- **Supabase Auth**: Email/senha
- **JWT tokens**: Gerenciados pelo Supabase
- **Middleware**: Proteção de rotas `/admin/*`

### Implementação
```typescript
// middleware.ts (já existe no frontend)
export async function middleware(req: NextRequest) {
  // Verifica autenticação para rotas admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
}
```

---

## 🤖 Integração com IA (OpenAI)

### Fluxo Atual

```
Cliente envia mensagem
    ↓
POST /api/chat
    ↓
lib/ai/sofia.ts (IA Sofia)
    ↓
OpenAI GPT-4 + Tools/Functions
    ↓
Análise + Resposta + Ações
    ↓
- Criar ticket (se necessário)
- Buscar FAQ
- Coletar dados do cliente
    ↓
Stream de resposta ao cliente
```

### Configuração Necessária

```env
OPENAI_API_KEY=sk-proj-...
```

### Tools/Functions Implementadas

1. **create_ticket**: Cria ticket automaticamente
2. **search_knowledge_base**: Busca no FAQ
3. **get_customer_info**: Busca dados do cliente
4. **check_purchase_status**: Verifica compras
5. **check_access_status**: Verifica acesso

---

## 🔗 Integrações Externas (Webhooks)

### Webhooks Implementados

#### 1. Email Platform
```
POST /api/webhooks/email
```
Recebe eventos de emails (bounces, aberturas, etc)

#### 2. Payment Platform
```
POST /api/webhooks/payment
```
Recebe eventos de pagamentos (aprovação, cancelamento, etc)

#### 3. Member Platform
```
POST /api/webhooks/members
```
Recebe eventos de membros (cadastro, acesso, expiração)

### Configuração

```env
PURCHASE_PLATFORM_URL=https://api.pagamentos.com
PURCHASE_PLATFORM_API_KEY=pk_live_...

MEMBER_PLATFORM_URL=https://api.membros.com
MEMBER_PLATFORM_API_KEY=mk_live_...

EMAIL_PLATFORM_API_KEY=ses_key_...
AWS_SES_REGION=us-east-1
```

### Fluxo de Webhook

```
Plataforma Externa
    ↓
POST /api/webhooks/{tipo}
    ↓
Validação + Log (platform_webhooks)
    ↓
Processamento assíncrono
    ↓
Atualização de dados (customers, tickets)
    ↓
Notificação (se necessário)
```

---

## 📊 Monitoramento e Logs

### Logs Implementados

1. **platform_webhooks**: Todos os webhooks recebidos
2. **integration_logs**: Chamadas a APIs externas
3. **Supabase Logs**: Queries e erros do DB

### Adicionar

- **Sentry**: Monitoramento de erros
- **LogRocket**: Session replay
- **Vercel Analytics**: Métricas de uso
- **Prometheus + Grafana**: Métricas customizadas (se backend próprio)

---

## 🚀 Deploy

### Frontend (Next.js)

**Opção 1: Vercel (Recomendado)**
```bash
# Conectar repo GitHub
# Configurar env vars
# Deploy automático
```

**Opção 2: Netlify**
```bash
netlify deploy --prod
```

**Opção 3: Docker**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
CMD ["pnpm", "start"]
```

### Banco de Dados (Supabase)

**Opção 1: Supabase Cloud**
- Criar projeto em supabase.com
- Executar migrations
- Configurar env vars

**Opção 2: Self-hosted**
```bash
supabase start
supabase db push
```

### Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Integrações
PURCHASE_PLATFORM_URL=
PURCHASE_PLATFORM_API_KEY=
MEMBER_PLATFORM_URL=
MEMBER_PLATFORM_API_KEY=
EMAIL_PLATFORM_API_KEY=

# Outros
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://suporte.seusite.com
```

---

## 🎨 Customização

### Branding

**Arquivos a modificar:**
1. `app/layout.tsx` - Título e metadados
2. `public/` - Logo e favicons
3. `app/globals.css` - Cores e tema
4. `lib/ai/prompts.ts` - Personalidade da IA
5. `scripts/002_seed_knowledge_base.sql` - FAQ inicial

### Cores (Tailwind)

```css
/* app/globals.css */
:root {
  --primary: 220 90% 56%;      /* Azul */
  --secondary: 280 70% 60%;    /* Roxo */
  --accent: 160 70% 50%;       /* Verde */
}
```

### Nome da IA

```typescript
// lib/ai/prompts.ts
export const SOFIA_SYSTEM_PROMPT = `
Você é [SEU_ASSISTENTE], assistente virtual de [SUA_EMPRESA]...
`
```

---

## 📋 Checklist de Setup

### 1. Configuração Inicial
- [ ] Clonar repositório frontend
- [ ] Instalar dependências (`pnpm install`)
- [ ] Criar projeto Supabase
- [ ] Executar scripts SQL (001, 002, 003)
- [ ] Configurar `.env.local`

### 2. Configuração de Serviços
- [ ] Obter OpenAI API Key
- [ ] Configurar Supabase Auth
- [ ] Criar usuário admin
- [ ] Configurar integrações externas (opcional)

### 3. Customização
- [ ] Alterar branding (logo, cores)
- [ ] Customizar prompts da IA
- [ ] Adicionar FAQ específico
- [ ] Configurar domínio

### 4. Deploy
- [ ] Deploy do frontend (Vercel/Netlify)
- [ ] Configurar variáveis de ambiente no deploy
- [ ] Testar em produção
- [ ] Configurar webhooks (se aplicável)

### 5. Monitoramento
- [ ] Configurar Sentry (erros)
- [ ] Configurar analytics
- [ ] Configurar logs
- [ ] Configurar alertas

---

## 💡 Recomendações

### Para MVP (Início Rápido)
1. ✅ Usar Supabase (BaaS)
2. ✅ Deploy no Vercel
3. ✅ Mínima customização
4. ✅ Focar em testar o fluxo

### Para Produção
1. ✅ Adicionar testes (Jest, Cypress)
2. ✅ Implementar CI/CD
3. ✅ Configurar monitoramento
4. ✅ Documentar APIs
5. ✅ Implementar rate limiting
6. ✅ Adicionar backups automáticos

### Para Escalabilidade
1. ✅ Considerar backend separado (NestJS)
2. ✅ Implementar cache (Redis)
3. ✅ Queue para jobs assíncronos
4. ✅ CDN para assets
5. ✅ Load balancing

---

## 🔄 Próximos Passos Imediatos

1. **Decidir arquitetura**: Opção A (Supabase) vs B (Backend próprio) vs C (Híbrido)
2. **Configurar ambiente**: Criar projeto Supabase e obter API keys
3. **Executar setup**: Rodar scripts SQL e configurar variáveis
4. **Testar localmente**: `pnpm dev` e verificar funcionalidades
5. **Customizar**: Adaptar branding e conteúdo
6. **Deploy**: Publicar em ambiente de testes
7. **Integrar**: Conectar com plataformas externas

---

## 📞 Próxima Ação

**Qual caminho você prefere?**

A. **Setup Rápido (Supabase + Vercel)**
   - Tempo: ~2-4 horas
   - Complexidade: Baixa
   - Ideal para: MVP, testes

B. **Setup Completo (Backend Customizado)**
   - Tempo: ~1-2 semanas
   - Complexidade: Alta
   - Ideal para: Produção escalável

C. **Híbrido (Supabase + Microserviços)**
   - Tempo: ~1 semana
   - Complexidade: Média
   - Ideal para: Crescimento gradual

---

**Data:** 2025-12-19
**Status:** Proposta de arquitetura
**Próximo passo:** Aguardando decisão de implementação
