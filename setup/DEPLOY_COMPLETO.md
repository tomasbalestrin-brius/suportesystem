# Guia Completo de Deploy - Sistema de Suporte

Este guia cobre **TODO** o processo de deploy do sistema, do zero até produção.

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter:

- [ ] Conta no GitHub (para código)
- [ ] Conta no Supabase (banco de dados)
- [ ] Conta no OpenAI (IA)
- [ ] Conta no Vercel (deploy) - ou Netlify
- [ ] Node.js 20+ instalado (para testes locais)
- [ ] pnpm instalado: `npm install -g pnpm`

---

## 🚀 Etapa 1: Configurar Supabase (15-20 min)

### 1.1 Criar Projeto

1. Acesse https://supabase.com
2. Clique em **"New Project"**
3. Preencha:
   - **Organization:** Selecione ou crie uma
   - **Name:** `sistema-suporte` (ou o nome que preferir)
   - **Database Password:** Crie uma senha forte (guarde!)
   - **Region:** Escolha a mais próxima (ex: South America - São Paulo)
   - **Pricing Plan:** Free (para começar)
4. Clique em **"Create new project"**
5. Aguarde ~2 minutos enquanto o projeto é criado

### 1.2 Obter Credenciais da API

1. No menu lateral, clique em **⚙️ Project Settings**
2. Clique em **API**
3. Copie e salve em local seguro:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE:** O `service_role` tem poderes de admin. NUNCA exponha no frontend!

### 1.3 Executar Scripts SQL

Agora vamos criar todas as tabelas e configurações do banco.

**Opção A: Via Interface Web (Recomendado)**

1. No menu lateral, clique em **🎲 SQL Editor**
2. Clique em **"New Query"**

3. **Script 1:** Copie todo o conteúdo de `frontend-platform/scripts/001_initial_schema.sql`
   - Cole no editor
   - Clique em **"Run"** (ou Ctrl/Cmd + Enter)
   - Aguarde: "Success. No rows returned"

4. **Script 2:** Copie todo o conteúdo de `frontend-platform/scripts/002_seed_knowledge_base.sql`
   - Nova query
   - Cole e execute
   - Aguarde sucesso

5. **Script 3:** Copie `frontend-platform/scripts/003_expose_tables_api.sql`
   - Nova query
   - Cole e execute

6. **Script 4:** Copie `frontend-platform/scripts/003_fix_permissions.sql`
   - Nova query
   - Cole e execute

**Opção B: Via CLI do Supabase**

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref SEU_PROJECT_ID

# Executar migrations
cd frontend-platform/scripts
supabase db execute -f 001_initial_schema.sql
supabase db execute -f 002_seed_knowledge_base.sql
supabase db execute -f 003_expose_tables_api.sql
supabase db execute -f 003_fix_permissions.sql
```

### 1.4 Verificar Tabelas Criadas

No SQL Editor, execute:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Você deve ver **9 tabelas:**
- admin_notifications
- customers
- integration_logs
- knowledge_base
- platform_webhooks
- public_chat_messages
- public_chats
- ticket_messages
- tickets

✅ Se viu todas, prossiga!

### 1.5 Criar Usuário Admin

Para acessar o dashboard admin, você precisa de um usuário:

**Opção A: Via Interface**

1. No menu lateral, clique em **👥 Authentication**
2. Clique em **Users**
3. Clique em **"Add user"** ou **"Invite user"**
4. Preencha:
   - **Email:** seu-email@exemplo.com
   - **Password:** Senha forte
   - **Auto Confirm User:** ✅ Marque esta opção
5. Clique em **"Create user"** ou **"Send invite"**

**Opção B: Via SQL**

```sql
-- No SQL Editor, execute:
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role
)
VALUES (
  'admin@seudominio.com',
  crypt('SuaSenhaSegura123!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  'authenticated'
);
```

✅ **Supabase configurado!**

---

## 🤖 Etapa 2: Configurar OpenAI (5-10 min)

### 2.1 Criar Conta e Obter API Key

1. Acesse https://platform.openai.com
2. Faça login ou crie uma conta
3. Vá em **API Keys** (menu lateral ou https://platform.openai.com/api-keys)
4. Clique em **"Create new secret key"**
5. Dê um nome: `Sistema de Suporte`
6. Copie a chave (começa com `sk-proj-...`)

⚠️ **IMPORTANTE:** Guarde a chave em local seguro. Ela não será mostrada novamente!

### 2.2 Adicionar Créditos

A OpenAI não tem plano gratuito. Você precisa adicionar créditos:

1. Vá em **Billing** (https://platform.openai.com/account/billing)
2. Clique em **"Add payment method"**
3. Adicione um cartão de crédito
4. Adicione créditos (mínimo $5)

**Custos estimados:**
- GPT-4o: ~$2.50 por 1M tokens input, ~$10 por 1M tokens output
- 100 conversas típicas: ~$0.50-$1.00
- 1000 conversas/mês: ~$5-$10

### 2.3 Configurar Limites (Recomendado)

Para evitar surpresas na fatura:

1. Em **Billing > Limits**
2. Defina:
   - **Hard limit:** $20/mês (exemplo)
   - **Soft limit:** $15/mês
3. Você receberá emails quando atingir os limites

✅ **OpenAI configurado!**

---

## 💻 Etapa 3: Configurar Localmente (10-15 min)

### 3.1 Clonar Repositório (se ainda não fez)

```bash
git clone https://github.com/tomasbalestrin-brius/suportesystem.git
cd suportesystem/frontend-platform
```

### 3.2 Criar Arquivo .env.local

```bash
# Copiar template
cp .env.example .env.local

# Editar com suas credenciais
nano .env.local  # ou use seu editor preferido
```

Preencha:

```env
# Supabase (do passo 1.2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# OpenAI (do passo 2.1)
OPENAI_API_KEY=sk-proj-...

# App (opcional agora)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3.3 Instalar Dependências

```bash
# Instalar pnpm (se ainda não tem)
npm install -g pnpm

# Instalar dependências do projeto
pnpm install
```

Aguarde ~2-3 minutos.

### 3.4 Testar Localmente

```bash
# Iniciar servidor de desenvolvimento
pnpm dev
```

Você deve ver:

```
> next dev

  ▲ Next.js 16.0.10
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

✓ Ready in 2.3s
```

### 3.5 Abrir no Navegador

1. Abra http://localhost:3000
2. Você deve ver o chat público com a Sofia
3. Digite uma mensagem de teste: "Olá, preciso de ajuda"
4. A IA deve responder

**Possíveis erros:**

❌ **"Could not find the table 'public.public_chats'"**
→ Scripts SQL não foram executados. Volte ao passo 1.3

❌ **"Invalid API key" (OpenAI)**
→ Chave OpenAI inválida ou sem créditos. Verifique passo 2

❌ **"Failed to fetch" ao enviar mensagem**
→ Credenciais do Supabase erradas. Verifique .env.local

### 3.6 Testar Dashboard Admin

1. Acesse http://localhost:3000/login
2. Use o email/senha do usuário admin criado (passo 1.5)
3. Você deve ser redirecionado para `/admin`
4. Veja estatísticas, tickets (se criou algum), base de conhecimento

✅ **Sistema funcionando localmente!**

---

## 🚀 Etapa 4: Deploy no Vercel (10-15 min)

### 4.1 Criar Conta no Vercel

1. Acesse https://vercel.com
2. Clique em **"Sign Up"**
3. Use **"Continue with GitHub"** (recomendado)
4. Autorize o Vercel a acessar seus repositórios

### 4.2 Fazer Push do Código

Certifique-se de que seu código está no GitHub:

```bash
# Voltar para raiz do projeto
cd /home/user/suportesystem

# Verificar status
git status

# Se há mudanças, commitar
git add -A
git commit -m "feat: Preparar projeto para deploy"

# Push
git push -u origin claude/build-system-frontend-FUEYH
```

### 4.3 Importar Projeto no Vercel

1. No dashboard do Vercel, clique em **"Add New..."** > **"Project"**
2. Encontre seu repositório `suportesystem`
3. Clique em **"Import"**

### 4.4 Configurar Build Settings

1. **Framework Preset:** Next.js (deve detectar automaticamente)
2. **Root Directory:** `frontend-platform` ⚠️ **IMPORTANTE**
3. **Build Command:** `pnpm build` (padrão)
4. **Output Directory:** `.next` (padrão)
5. **Install Command:** `pnpm install` (padrão)

### 4.5 Configurar Environment Variables

Clique em **"Environment Variables"** e adicione:

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...
OPENAI_API_KEY = sk-proj-...
NODE_ENV = production
```

Para cada variável:
1. Cole o **nome** (ex: `NEXT_PUBLIC_SUPABASE_URL`)
2. Cole o **valor**
3. Marque: **Production**, **Preview**, **Development** (todas)
4. Clique em **"Add"**

⚠️ **CUIDADO:** Não exponha `SUPABASE_SERVICE_ROLE_KEY` ou `OPENAI_API_KEY` no GitHub!

### 4.6 Deploy

1. Clique em **"Deploy"**
2. Aguarde ~2-5 minutos
3. Você verá logs do build em tempo real

**Build bem-sucedido:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    ...      ...
└ ○ /admin                               ...      ...

✓ Build completed in 2m 34s
```

### 4.7 Acessar Deploy

1. Vercel mostrará a URL: `https://seu-projeto.vercel.app`
2. Clique para abrir
3. Teste o chat público
4. Teste o login admin

✅ **Deploy concluído!**

---

## 🌐 Etapa 5: Configurar Domínio Personalizado (Opcional)

### 5.1 Adicionar Domínio

1. No projeto Vercel, vá em **Settings** > **Domains**
2. Clique em **"Add"**
3. Digite seu domínio: `suporte.seudominio.com`
4. Clique em **"Add"**

### 5.2 Configurar DNS

Vercel mostrará instruções para configurar DNS:

**Se usar Vercel DNS (recomendado):**
- Apenas clique em "Use Vercel DNS"

**Se usar outro provedor (GoDaddy, Registro.br, etc):**

Adicione um registro CNAME:

```
Type:  CNAME
Name:  suporte (ou @, se for domínio principal)
Value: cname.vercel-dns.com
```

### 5.3 Aguardar Propagação

- DNS pode levar 5 minutos a 48 horas
- Geralmente funciona em 5-15 minutos
- Vercel mostra status: "Valid Configuration" quando pronto

### 5.4 Atualizar Variáveis de Ambiente

No Vercel, atualize:

```
NEXT_PUBLIC_APP_URL = https://suporte.seudominio.com
```

Redeploy:
1. Vá em **Deployments**
2. Clique nos 3 pontos do último deploy
3. Clique em **"Redeploy"**

✅ **Domínio configurado!**

---

## 🔧 Etapa 6: Configurações Pós-Deploy

### 6.1 Atualizar URLs no Supabase

1. Acesse seu projeto no Supabase
2. Vá em **Authentication** > **URL Configuration**
3. Adicione em **Redirect URLs:**
   ```
   https://seu-projeto.vercel.app/auth/callback
   https://suporte.seudominio.com/auth/callback
   ```
4. Em **Site URL:** `https://suporte.seudominio.com`

### 6.2 Configurar CORS (se necessário)

Se tiver problemas de CORS:

No Supabase, vá em **API** > **Settings** > **CORS**:
```
https://seu-projeto.vercel.app
https://suporte.seudominio.com
```

### 6.3 Testar Tudo em Produção

Checklist:
- [ ] Chat público funciona
- [ ] IA responde
- [ ] Tickets são criados
- [ ] Login admin funciona
- [ ] Dashboard carrega
- [ ] Base de conhecimento funciona
- [ ] Notificações aparecem

---

## 📊 Etapa 7: Monitoramento

### 7.1 Vercel Analytics (Grátis)

Já ativado automaticamente. Ver em:
- **Vercel Dashboard** > **Analytics**

### 7.2 Supabase Logs

Monitor em tempo real:
- **Supabase** > **Database** > **Logs**

### 7.3 OpenAI Usage

Acompanhe custos:
- **OpenAI** > **Usage** (https://platform.openai.com/usage)

---

## 🔒 Checklist de Segurança

Antes de ir para produção:

- [ ] `.env.local` no `.gitignore` (já está)
- [ ] Credenciais não estão no código
- [ ] RLS habilitado em todas as tabelas (já está)
- [ ] Service role key NÃO está exposta no frontend
- [ ] HTTPS habilitado (automático no Vercel)
- [ ] Limites de uso configurados (OpenAI)
- [ ] Backup do banco configurado (Supabase faz automático no plano free)
- [ ] Senha do Supabase forte
- [ ] Autenticação 2FA ativada (Vercel, GitHub)

---

## 🐛 Troubleshooting Comum

### Deploy falha no Vercel

**Erro: "Module not found"**
```bash
# Limpar cache e reinstalar
pnpm store prune
rm -rf node_modules .next
pnpm install
```

**Erro: "Build timeout"**
- Plano free tem limite de 45min
- Geralmente build leva 2-5min
- Se estiver travando, verifique erros TypeScript

### Chat não funciona em produção

1. Verificar variáveis de ambiente no Vercel
2. Ver logs: Vercel > Functions > Logs
3. Abrir console do navegador (F12) e verificar erros

### IA não responde

1. Verificar créditos OpenAI
2. Ver limites de uso (OpenAI > Usage)
3. Verificar chave API no Vercel env vars

### Login não funciona

1. Verificar Redirect URLs no Supabase
2. Limpar cookies do navegador
3. Verificar se usuário foi criado corretamente

---

## 📈 Próximos Passos

Após deploy:

1. **Customizar branding**
   - Ver `docs/GUIA_CUSTOMIZACAO_DETALHADO.md`
   - Trocar logo, cores, nome da IA

2. **Configurar integrações**
   - Webhooks de pagamento
   - Email notifications
   - Ver `docs/EXEMPLOS_PRATICOS.md`

3. **Adicionar FAQ**
   - Popular `knowledge_base` com suas perguntas
   - Importar de CSV se tiver muitas

4. **Monitorar e ajustar**
   - Ver analytics
   - Ajustar prompts da IA
   - Otimizar respostas

5. **Escalar se necessário**
   - Upgrade Supabase se precisar
   - Otimizar custos OpenAI
   - Adicionar cache

---

## 💰 Custos Mensais Estimados

**Setup Mínimo (Ideal para começar):**
- Supabase Free: $0
- Vercel Hobby: $0
- OpenAI (~1000 conversas/mês): $5-10
- Domínio (opcional): $10-15/ano
- **Total: ~$5-10/mês**

**Setup Médio (Produção):**
- Supabase Pro: $25/mês
- Vercel Pro: $20/mês (se precisar)
- OpenAI (~5000 conversas/mês): $25-50
- **Total: ~$70-95/mês**

---

## 🎉 Conclusão

Se chegou até aqui, seu sistema está:
✅ Funcionando em produção
✅ Acessível via domínio
✅ Seguro e monitorado
✅ Pronto para receber usuários!

**Próximo passo:** Divulgar e começar a usar! 🚀

---

**Última atualização:** 2025-12-22
**Versão:** 1.0
**Suporte:** Ver documentação em `docs/`
