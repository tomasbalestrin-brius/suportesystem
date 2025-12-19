# Guia de Setup Rápido - Sistema de Suporte

Este guia ajudará você a colocar o sistema de suporte funcionando em menos de 1 hora.

---

## 🎯 Pré-requisitos

- [ ] Node.js 20+ instalado
- [ ] pnpm instalado (`npm install -g pnpm`)
- [ ] Conta no Supabase (https://supabase.com)
- [ ] Conta no OpenAI (https://platform.openai.com)
- [ ] Git configurado

---

## 🚀 Passo a Passo

### 1. Configurar Supabase (10 min)

#### 1.1 Criar Projeto
1. Acesse https://supabase.com
2. Clique em "New Project"
3. Preencha:
   - **Nome:** Sistema de Suporte
   - **Database Password:** Crie uma senha forte
   - **Region:** Escolha a mais próxima (ex: South America)
4. Clique em "Create new project"
5. Aguarde ~2 minutos

#### 1.2 Executar Scripts SQL
1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query**
3. Abra o arquivo `frontend-platform/scripts/001_initial_schema.sql`
4. Copie todo o conteúdo e cole no editor
5. Clique em **Run** (ou Ctrl/Cmd + Enter)
6. Aguarde "Success. No rows returned"

7. Repita para os outros scripts:
   - `002_seed_knowledge_base.sql`
   - `003_expose_tables_api.sql`
   - `003_fix_permissions.sql`

#### 1.3 Criar Usuário Admin
1. No menu lateral, clique em **Authentication**
2. Clique em **Users**
3. Clique em **Invite user**
4. Preencha:
   - **Email:** seu-email@exemplo.com
   - **Auto Confirm User:** ✅ Marque
5. Defina uma senha
6. Clique em **Invite user**

#### 1.4 Obter Chaves da API
1. No menu lateral, clique em **Project Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGc...`
   - **service_role**: `eyJhbGc...` (guarde com segurança!)

---

### 2. Configurar OpenAI (5 min)

#### 2.1 Obter API Key
1. Acesse https://platform.openai.com
2. Faça login ou crie uma conta
3. Vá em **API Keys** (menu lateral)
4. Clique em **Create new secret key**
5. Dê um nome (ex: "Sistema de Suporte")
6. Copie a chave (começa com `sk-proj-...`)
7. ⚠️ **IMPORTANTE:** Salve em local seguro, não será mostrada novamente!

#### 2.2 Adicionar Créditos (se necessário)
1. Vá em **Billing**
2. Adicione créditos (mínimo $5)
3. Configure limite de uso para evitar surpresas

---

### 3. Configurar Projeto Local (10 min)

#### 3.1 Navegar até o Frontend
```bash
cd /home/user/suportesystem/frontend-platform
```

#### 3.2 Criar Arquivo de Ambiente
```bash
cp .env.example .env.local
# Ou crie manualmente:
touch .env.local
```

#### 3.3 Editar .env.local
Abra `.env.local` e adicione:

```env
# Supabase (substituir pelos seus valores)
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...SUA_CHAVE_AQUI

# OpenAI (OBRIGATÓRIO)
OPENAI_API_KEY=sk-proj-...SUA_CHAVE_AQUI

# Integrações (opcional - deixar vazio por enquanto)
PURCHASE_PLATFORM_URL=
PURCHASE_PLATFORM_API_KEY=
MEMBER_PLATFORM_URL=
MEMBER_PLATFORM_API_KEY=
EMAIL_PLATFORM_API_KEY=
AWS_SES_REGION=us-east-1
```

#### 3.4 Instalar Dependências
```bash
pnpm install
```

Aguarde ~2-3 minutos para instalação completa.

---

### 4. Testar Localmente (5 min)

#### 4.1 Iniciar Servidor de Desenvolvimento
```bash
pnpm dev
```

#### 4.2 Acessar a Aplicação
Abra o navegador em: http://localhost:3000

#### 4.3 Testar o Chat
1. Você verá a interface do chat público
2. Digite uma mensagem: "Olá, preciso de ajuda"
3. A Sofia (IA) deve responder
4. Continue a conversa e teste a criação de tickets

#### 4.4 Testar o Dashboard Admin
1. Acesse: http://localhost:3000/login
2. Faça login com o email/senha criados no Supabase
3. Você será redirecionado para `/admin`
4. Veja os tickets criados no chat

---

## ✅ Verificação

### Chat Funcionando ✓
- [ ] Chat carrega sem erros
- [ ] IA responde às mensagens
- [ ] Mensagens aparecem na interface
- [ ] Dados são coletados (nome, email, CPF)

### Dashboard Admin ✓
- [ ] Login funciona
- [ ] Dashboard mostra estatísticas
- [ ] Lista de tickets aparece
- [ ] Pode visualizar detalhes dos tickets
- [ ] Base de conhecimento carrega

### Banco de Dados ✓
Verifique no Supabase SQL Editor:

```sql
-- Verificar tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Deve retornar:
-- admin_notifications
-- customers
-- integration_logs
-- knowledge_base
-- platform_webhooks
-- public_chat_messages
-- public_chats
-- ticket_messages
-- tickets
```

```sql
-- Verificar se há dados no FAQ
SELECT COUNT(*) FROM knowledge_base;
-- Deve retornar > 0
```

---

## 🎨 Customização Básica (10 min)

### 1. Alterar Nome da IA
Edite `frontend-platform/lib/ai/prompts.ts`:

```typescript
export const SOFIA_SYSTEM_PROMPT = `
Você é [SEU_NOME], assistente virtual de [SUA_EMPRESA].
...
```

### 2. Alterar Cores
Edite `frontend-platform/app/globals.css`:

```css
:root {
  --primary: 220 90% 56%;      /* Azul - altere aqui */
  --secondary: 280 70% 60%;    /* Roxo - altere aqui */
}
```

### 3. Alterar Título
Edite `frontend-platform/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Seu Sistema de Suporte',  // Altere aqui
  description: 'Suporte inteligente com IA',
}
```

### 4. Alterar Logo
Substitua os arquivos em `frontend-platform/public/`:
- `logo.svg` ou `logo.png`
- `favicon.ico`

---

## 🚀 Deploy (Opcional - 15 min)

### Opção 1: Vercel (Recomendado)

#### 1. Criar Conta
- Acesse https://vercel.com
- Faça login com GitHub

#### 2. Importar Projeto
- Clique em "Add New Project"
- Selecione o repositório
- Root Directory: `frontend-platform`
- Framework Preset: Next.js

#### 3. Configurar Variáveis de Ambiente
- Em "Environment Variables", adicione:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `OPENAI_API_KEY`

#### 4. Deploy
- Clique em "Deploy"
- Aguarde ~2 minutos
- Pronto! Seu sistema está no ar

### Opção 2: Netlify

```bash
# Instalar CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd frontend-platform
netlify deploy --prod
```

---

## 🐛 Resolução de Problemas

### Erro: "Could not find the table 'public.public_chats'"
**Solução:** Execute novamente os scripts SQL no Supabase

### Erro: "Invalid API key" (OpenAI)
**Solução:** Verifique se a chave no `.env.local` está correta e tem créditos

### Erro: "Failed to fetch" ao fazer login
**Solução:** Verifique as chaves do Supabase no `.env.local`

### IA não responde
**Causas possíveis:**
1. OpenAI API Key inválida ou sem créditos
2. Erro no console do navegador (pressione F12)
3. Problema na rota `/api/chat`

**Debug:**
```bash
# Ver logs do servidor
# Terminal onde está rodando `pnpm dev`
```

### Chat carrega mas não salva mensagens
**Solução:** Verifique se os scripts SQL foram executados corretamente

---

## 📋 Checklist Completo

### Setup Inicial
- [ ] Projeto criado no Supabase
- [ ] Scripts SQL executados (4 arquivos)
- [ ] Usuário admin criado
- [ ] Chaves do Supabase copiadas
- [ ] OpenAI API Key obtida
- [ ] `.env.local` configurado
- [ ] Dependências instaladas (`pnpm install`)

### Testes Locais
- [ ] Servidor rodando (`pnpm dev`)
- [ ] Chat público funciona
- [ ] IA responde
- [ ] Tickets são criados
- [ ] Login admin funciona
- [ ] Dashboard carrega

### Customização
- [ ] Nome da IA alterado (opcional)
- [ ] Cores customizadas (opcional)
- [ ] Logo alterado (opcional)

### Deploy
- [ ] Deploy realizado (opcional)
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio configurado (opcional)
- [ ] Testado em produção

---

## 🎉 Próximos Passos

Depois que tudo estiver funcionando:

1. **Adicionar mais perguntas ao FAQ**
   - Via dashboard admin em `/admin/knowledge-base`
   - Ou via SQL: `INSERT INTO knowledge_base ...`

2. **Configurar integrações externas**
   - Ver `INTEGRATION_GUIDE.md` no frontend

3. **Personalizar ainda mais**
   - Ajustar prompts da IA
   - Adicionar mais categorias de tickets
   - Customizar emails de notificação

4. **Monitoramento**
   - Adicionar Sentry para erros
   - Configurar Vercel Analytics
   - Ver métricas de uso da OpenAI

---

## 📞 Suporte

- **Documentação completa:** Ver `docs/ANALISE_FRONTEND.md`
- **Arquitetura:** Ver `docs/ARQUITETURA_PROPOSTA.md`
- **Issues:** Reportar problemas no GitHub

---

**Tempo estimado total:** 30-60 minutos
**Última atualização:** 2025-12-19
