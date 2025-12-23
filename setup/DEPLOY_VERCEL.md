# Guia de Deploy no Vercel

Este guia cobre o deploy do frontend no Vercel com as credenciais já configuradas.

---

## ✅ Pré-requisitos Concluídos

Segundo suas informações:
- ✅ Credenciais obrigatórias cadastradas nas variáveis do Vercel
- ✅ Projeto do GitHub configurado
- ✅ Frontend configurado e testado localmente

---

## 🚀 Deploy no Vercel

### Opção 1: Deploy Automático via GitHub (Recomendado)

O Vercel detecta automaticamente pushes no branch e faz deploy automático.

**1. Faça push deste código:**

```bash
git push -u origin claude/build-system-frontend-FUEYH
```

**2. No Vercel Dashboard:**
- O deploy iniciará automaticamente
- Acompanhe em: https://vercel.com/[seu-usuario]/[seu-projeto]/deployments

**3. Aguarde a build (2-4 minutos):**
- ✅ Installing dependencies
- ✅ Building application
- ✅ Generating static pages
- ✅ Deployment ready

---

### Opção 2: Deploy Manual via CLI

Se preferir controle total:

**1. Instale a Vercel CLI:**

```bash
npm i -g vercel
```

**2. Faça login:**

```bash
vercel login
```

**3. Entre na pasta do frontend:**

```bash
cd frontend-platform
```

**4. Execute o deploy:**

```bash
# Deploy de preview
vercel

# Deploy para produção
vercel --prod
```

---

## 🔍 Verificações Pós-Deploy

### 1. Verificar Variáveis de Ambiente

No Vercel Dashboard, vá em **Settings > Environment Variables** e confirme:

#### Obrigatórias (já configuradas segundo você):
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `OPENAI_API_KEY`

#### Opcionais (configure se necessário):
- `NEXT_PUBLIC_APP_URL` - URL do seu app (ex: https://seu-app.vercel.app)
- `PURCHASE_PLATFORM_URL` - URL da plataforma de pagamentos
- `PURCHASE_PLATFORM_API_KEY` - Chave da plataforma de pagamentos
- `MEMBER_PLATFORM_URL` - URL da área de membros
- `MEMBER_PLATFORM_API_KEY` - Chave da área de membros
- `EMAIL_PLATFORM_API_KEY` - Chave da plataforma de emails

### 2. Testar a Aplicação

**Acesse seu domínio Vercel:**
```
https://[seu-projeto].vercel.app
```

**Teste estas funcionalidades:**

1. **Chat Público (/) ✓**
   - Abra a página inicial
   - Digite uma mensagem
   - Verifique se a Sofia responde
   - Confirme se consegue criar um ticket

2. **Dashboard Admin (/dashboard) ✓**
   - Acesse `/dashboard`
   - Faça login (se configurou auth)
   - Verifique lista de tickets
   - Teste criação manual de ticket

3. **API Routes ✓**
   - Teste: `https://seu-app.vercel.app/api/health`
   - Deve retornar `{"status": "ok"}`

### 3. Verificar Logs

Se algo não funcionar:

**Via Dashboard:**
```
Vercel Dashboard > Deployments > [seu deploy] > Logs
```

**Via CLI:**
```bash
vercel logs
```

---

## ⚙️ Configurações Avançadas

### Domínio Personalizado

**1. No Vercel Dashboard:**
```
Settings > Domains > Add Domain
```

**2. Configure DNS:**
```
Type: CNAME
Name: www (ou @)
Value: cname.vercel-dns.com
```

**3. Aguarde propagação (5-30 min)**

### Configurar Build & Development

**No vercel.json (já configurado):**
```json
{
  "buildCommand": "pnpm build",
  "framework": "nextjs",
  "regions": ["gru1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Headers CORS (se necessário)

**Já configurado no vercel.json para APIs:**
```json
{
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE" }
      ]
    }
  ]
}
```

---

## 🔧 Troubleshooting

### Build Falha

**Erro: "Failed to fetch Geist from Google Fonts"**
✅ Já corrigido - Fonts desabilitados no código

**Erro: "Missing environment variables"**
```bash
# Verifique no Vercel Dashboard > Settings > Environment Variables
# Redeploy após adicionar variáveis
```

**Erro: "Module not found"**
```bash
# Limpe cache e redeploy
vercel --force
```

### Runtime Errors

**Erro 500 nas API Routes:**
- Verifique logs no Vercel Dashboard
- Confirme se `OPENAI_API_KEY` está configurada
- Teste a chave localmente primeiro

**Erro de conexão Supabase:**
```bash
# Verifique se as URLs estão corretas
# Formato: https://[projeto].supabase.co
# Confirme se RLS está configurado
```

**Sofia não responde:**
1. Verifique `OPENAI_API_KEY` no Vercel
2. Teste a API OpenAI diretamente:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```
3. Verifique limites da sua conta OpenAI

---

## 📊 Monitoramento

### Vercel Analytics

**Ativar (grátis):**
```
Project Settings > Analytics > Enable
```

**Métricas disponíveis:**
- Page views
- Unique visitors
- Top pages
- Devices & browsers

### Vercel Speed Insights

**Ativar:**
```
Project Settings > Speed Insights > Enable
```

**Já integrado no código:**
```typescript
// app/layout.tsx
import { Analytics } from "@vercel/analytics/next"
```

---

## 🎯 Próximos Passos

### 1. Configurar Supabase (se ainda não fez)

**Execute os scripts SQL:**
```bash
# No Supabase Dashboard > SQL Editor
# Execute em ordem:
frontend-platform/scripts/01_schema.sql
frontend-platform/scripts/02_rls.sql
frontend-platform/scripts/03_triggers.sql
frontend-platform/scripts/04_indexes.sql
```

**Verifique se criou:**
- ✅ 9 tabelas (tickets, customers, etc)
- ✅ Policies RLS
- ✅ Triggers
- ✅ Índices

### 2. Testar Integrações (Opcional)

**Se configurou webhooks:**

```bash
# Teste webhook de compra
curl -X POST https://seu-app.vercel.app/api/webhooks/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "teste@example.com",
    "customer_name": "Teste",
    "product_id": "prod_123"
  }'
```

### 3. Customizar (Opcional)

Veja os guias detalhados:
- **[Customização Completa](../docs/GUIA_CUSTOMIZACAO_DETALHADO.md)**
- **[Exemplos Práticos](../docs/EXEMPLOS_PRATICOS.md)**

---

## 💰 Custos Estimados

### Vercel (Hobby - Grátis)
- ✅ 100 GB bandwidth/mês
- ✅ Deployments ilimitados
- ✅ Preview deployments
- ⚠️ Limite: 100 GB bandwidth

### Vercel (Pro - $20/mês)
- ✅ 1 TB bandwidth/mês
- ✅ Analytics avançado
- ✅ Suporte prioritário
- ✅ Proteção DDoS

### OpenAI (Pay-as-you-go)
- GPT-4o: ~$0.01 por 1K tokens
- Estimativa: $20-50/mês (1000-2000 conversas)
- **Use GPT-3.5-turbo para reduzir custos (50x mais barato)**

### Supabase (Free tier)
- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth
- ✅ 50 MB file uploads
- ⚠️ Pausa após 7 dias inativo

---

## ✅ Checklist Final

Antes de marcar como concluído:

- [ ] Push feito para GitHub
- [ ] Deploy executado com sucesso no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Aplicação acessível via URL
- [ ] Chat responde corretamente
- [ ] Tickets são criados
- [ ] Dashboard carrega
- [ ] Logs sem erros críticos
- [ ] SQL scripts executados no Supabase
- [ ] Domínio customizado configurado (opcional)
- [ ] Analytics ativado (opcional)

---

## 📞 Suporte

### Documentação Oficial
- **Vercel**: https://vercel.com/docs
- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs

### Guias deste Projeto
- [Análise do Frontend](../docs/ANALISE_FRONTEND.md)
- [Detalhamento Técnico](../docs/DETALHAMENTO_TECNICO.md)
- [Deploy Completo](./DEPLOY_COMPLETO.md)

### Logs e Debug
```bash
# Ver logs em tempo real
vercel logs --follow

# Ver logs de uma função específica
vercel logs --function=api/chat

# Baixar logs
vercel logs --output=logs.txt
```

---

**Status:** ✅ Pronto para deploy
**Última atualização:** 2025-12-23
**Branch:** claude/build-system-frontend-FUEYH
