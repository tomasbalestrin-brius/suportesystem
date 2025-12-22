# Guia Completo de Customização - Sistema de Suporte

Este guia detalha **COMO** customizar cada aspecto do sistema, com exemplos práticos de código.

---

## 📋 Índice

1. [Customizar IA (Sofia)](#1-customizar-ia-sofia)
2. [Customizar Aparência (Branding)](#2-customizar-aparência-branding)
3. [Customizar Chat e Mensagens](#3-customizar-chat-e-mensagens)
4. [Customizar Sistema de Tickets](#4-customizar-sistema-de-tickets)
5. [Customizar Dashboard Admin](#5-customizar-dashboard-admin)
6. [Configurar Integrações](#6-configurar-integrações)
7. [Customizar Base de Conhecimento](#7-customizar-base-de-conhecimento)
8. [Adicionar Novos Tools/Functions](#8-adicionar-novos-toolsfunctions)
9. [Customizar Webhooks](#9-customizar-webhooks)
10. [Customizar Notificações](#10-customizar-notificações)

---

## 1. Customizar IA (Sofia)

### 1.1 Alterar Nome e Personalidade da IA

**Arquivo:** `frontend-platform/lib/ai/prompts.ts`

```typescript
export const SOFIA_SYSTEM_PROMPT = `🔵 IDENTIDADE DO AGENTE

Você é [SEU_NOME_AQUI], assistente virtual da [SUA_EMPRESA], especializada em suporte de [SEUS_PRODUTOS].

Quando perguntarem quem está falando, você se apresenta como:

"Sou [SEU_NOME], faço parte do time de suporte da [SUA_EMPRESA]."

// ... resto do prompt
`

export function getWelcomeMessage(): string {
  return "Oi! Sou [SEU_NOME], da equipe [SUA_EMPRESA] 😊\nComo posso te ajudar hoje?"
}
```

**Exemplo customizado:**
```typescript
export const ALEX_SYSTEM_PROMPT = `🔵 IDENTIDADE DO AGENTE

Você é Alex, assistente virtual da TechSupport Pro, especializada em suporte técnico de software.

Quando perguntarem quem está falando, você se apresenta como:

"Sou o Alex, faço parte do time de suporte da TechSupport Pro."

⚠️ INSTRUÇÃO IMPORTANTE – DADOS DO CLIENTE

Colete apenas:
- Nome
- E-mail
- Empresa (se B2B)

🟦 ESTILO DE CONVERSA

Você é técnico mas amigável:
- Use linguagem clara e objetiva
- Evite jargões complexos
- Seja direto mas cordial
- Tom profissional mas acessível

😊 USO DE EMOJIS

Use emojis com moderação:
- ✅ Para confirmações
- 🔧 Para questões técnicas
- 💡 Para dicas
- Máximo 1 emoji por mensagem

// ... adapte o resto do prompt conforme necessário
`
```

### 1.2 Ajustar Comportamento da IA

**Arquivo:** `frontend-platform/lib/ai/sofia.ts`

```typescript
// Linha 50-54: Configurar modelo e parâmetros
const result = await generateText({
  model: "openai/gpt-4o", // ← Alterar modelo aqui
  messages,
  tools: sofiaTools,
  maxSteps: 5, // ← Número de tool calls permitidos
  temperature: 0.7, // ← Adicionar criatividade (0-2)
  maxTokens: 500, // ← Limitar tamanho da resposta
})
```

**Modelos disponíveis:**
- `openai/gpt-4o` - Mais inteligente (recomendado)
- `openai/gpt-4o-mini` - Mais rápido e barato
- `openai/gpt-3.5-turbo` - Econômico

**Parâmetros úteis:**
```typescript
temperature: 0.7,      // Criatividade (0 = determinístico, 2 = muito criativo)
maxTokens: 500,        // Limite de tokens na resposta
topP: 0.9,             // Diversidade de vocabulário
presencePenalty: 0.6,  // Evitar repetição de tópicos
frequencyPenalty: 0.3, // Evitar repetição de palavras
```

### 1.3 Customizar Tools/Functions da IA

**Arquivo:** `frontend-platform/lib/ai/tools.ts`

**Modificar descrição de um tool existente:**

```typescript
export const sofiaTools: Record<string, CoreTool> = {
  search_knowledge_base: {
    description:
      "Busca na base de conhecimento por [DESCRIÇÃO CUSTOMIZADA]. Use quando [CONTEXTO ESPECÍFICO].",
    // ... resto igual
  },
```

**Exemplo customizado:**
```typescript
search_knowledge_base: {
  description:
    "Busca artigos técnicos, tutoriais e FAQs sobre nossos produtos de software. Use quando o cliente perguntar sobre funcionalidades, erros conhecidos ou procedimentos.",
  // ...
},
```

### 1.4 Customizar Quando Escalar para Humano

**Arquivo:** `frontend-platform/lib/ai/prompts.ts` (linhas 172-206)

```typescript
🚨 QUANDO ESCALAR PARA HUMANO (CRÍTICO)

Escale imediatamente (usando escalate_to_human) quando:

// Adicione seus critérios aqui
Cliente não conseguiu resolver após [N] tentativas
Problema relacionado a [CATEGORIA_CRÍTICA]
Cliente mencionou palavras: ["cancelar", "reembolso", "processar"]
Bug não documentado
Solicitação de customização/desenvolvimento

Frase para escalar:
"Vou te conectar com nossa equipe especializada que pode resolver isso com mais agilidade. Só um momento! ⚙️"
```

---

## 2. Customizar Aparência (Branding)

### 2.1 Cores do Sistema

**Arquivo:** `frontend-platform/app/globals.css`

**Tema Claro:**
```css
:root {
  /* Cor primária (botões, links, destaques) */
  --primary: oklch(0.488 0.243 264.376); /* Purple - ALTERE AQUI */

  /* Cor secundária */
  --secondary: oklch(0.6 0.118 184.704); /* Blue - ALTERE AQUI */

  /* Cor de destaque/accent */
  --accent: oklch(0.769 0.188 70.08); /* Yellow/Gold - ALTERE AQUI */

  /* Cores para gráficos */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
}
```

**Tema Escuro:**
```css
.dark {
  --primary: oklch(0.588 0.243 264.376); /* Versão clara do purple */
  --secondary: oklch(0.269 0 0);
  /* ... */
}
```

**Exemplo: Tema Verde/Natureza**
```css
:root {
  --primary: oklch(0.55 0.18 145); /* Verde principal */
  --secondary: oklch(0.45 0.15 170); /* Verde azulado */
  --accent: oklch(0.70 0.20 85); /* Amarelo esverdeado */
}

.dark {
  --primary: oklch(0.65 0.18 145); /* Verde mais claro */
  --secondary: oklch(0.35 0.12 170);
  --accent: oklch(0.75 0.20 85);
}
```

**Dica:** Use [oklch.com](https://oklch.com) para gerar cores no formato OKLCH.

### 2.2 Logo e Ícones

**Logos:**

1. **Substituir logo claro:**
   - Arquivo: `frontend-platform/public/images/logo-bethel-preto.jpg`
   - Tamanho recomendado: 400x100px (formato wide)

2. **Substituir logo escuro:**
   - Arquivo: `frontend-platform/public/images/logo-bethel-branco.png`
   - Formato: PNG com fundo transparente

3. **Favicon:**
   - Arquivo: `frontend-platform/public/favicon.ico`
   - Tamanho: 32x32px ou 64x64px

**Alterar logo no código:**

`frontend-platform/app/page.tsx` (linhas 105-109):
```typescript
const logoSrc = !mounted
  ? "/images/SEU-LOGO-CLARO.png"  // ← Altere aqui
  : resolvedTheme === "dark"
    ? "/images/SEU-LOGO-ESCURO.png" // ← Altere aqui
    : "/images/SEU-LOGO-CLARO.png"
```

### 2.3 Título e Metadados

**Arquivo:** `frontend-platform/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: 'Sistema de Suporte - Sua Empresa', // ← Altere
  description: 'Central de atendimento inteligente com IA', // ← Altere
  keywords: ['suporte', 'atendimento', 'sua empresa'], // ← Altere
  authors: [{ name: 'Sua Empresa' }], // ← Altere
  // ...
}
```

**Arquivo:** `frontend-platform/app/page.tsx` (linha 122):
```typescript
<h1 className="text-base sm:text-lg font-semibold...">
  Central de Suporte  {/* ← Altere o texto */}
</h1>
```

### 2.4 Cabeçalho do Chat

**Arquivo:** `frontend-platform/app/page.tsx` (linhas 136-157)

```typescript
{/* Nome da IA */}
<h2 className="font-bold text-lg sm:text-xl">Sofia</h2>  {/* ← Altere */}

{/* Descrição */}
<p className="text-xs sm:text-sm text-white/90 font-medium">
  Assistente Virtual da Bethel  {/* ← Altere */}
</p>

{/* Emoji/Avatar */}
<div className="...">
  👋  {/* ← Altere o emoji ou adicione imagem */}
</div>
```

**Usar imagem em vez de emoji:**
```typescript
import Image from "next/image"

<div className="h-12 w-12 rounded-full overflow-hidden">
  <Image
    src="/images/avatar-ia.png"
    alt="Avatar IA"
    width={48}
    height={48}
  />
</div>
```

### 2.5 Gradientes e Cores de Fundo

**Chat Header (fundo roxo/azul):**

`frontend-platform/app/page.tsx` (linha 136):
```typescript
<div className="... bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 ...">
  {/* Altere as cores do gradiente aqui */}
</div>
```

**Exemplos de gradientes:**
```typescript
// Verde
from-green-600 via-green-500 to-emerald-600

// Laranja/Vermelho
from-orange-600 via-red-500 to-pink-600

// Azul
from-blue-600 via-cyan-500 to-teal-600

// Escuro profissional
from-gray-800 via-gray-700 to-gray-900
```

**Fundo da página:**

`frontend-platform/app/page.tsx` (linha 112):
```typescript
<div className="... bg-gradient-to-br from-purple-50 via-blue-50/30 to-indigo-50 ...">
  {/* Altere as cores de fundo aqui */}
</div>
```

---

## 3. Customizar Chat e Mensagens

### 3.1 Mensagem de Boas-Vindas

**Arquivo:** `frontend-platform/lib/ai/prompts.ts`

```typescript
export function getWelcomeMessage(): string {
  return "Oi! Sou a Sofia, da equipe BETHEL 😊\nComo posso te ajudar hoje?"
}
```

**Customizar:**
```typescript
export function getWelcomeMessage(): string {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite"

  return `${greeting}! 👋\n\nSou o Alex, assistente virtual da TechSupport.\n\nEstou aqui para ajudar com:\n• Problemas técnicos\n• Dúvidas sobre produtos\n• Configurações\n\nComo posso te ajudar?`
}
```

### 3.2 Placeholder do Input

**Arquivo:** Criar `frontend-platform/components/chat/chat-input.tsx` e editar

```typescript
<input
  type="text"
  placeholder="Digite sua mensagem..." // ← Altere aqui
  className="..."
/>
```

**Exemplos:**
```typescript
placeholder="Descreva seu problema aqui..."
placeholder="Como posso ajudar? Digite sua dúvida..."
placeholder="Fale conosco! Estamos online 😊"
```

### 3.3 Bolhas de Mensagem (Cores)

**Arquivo:** `frontend-platform/components/chat/message-bubble.tsx`

Encontre e customize as classes:
```typescript
// Mensagem do usuário (azul à direita)
<div className="bg-blue-600 text-white ...">  {/* ← Altere a cor */}

// Mensagem da IA (cinza à esquerda)
<div className="bg-gray-100 dark:bg-gray-800 ...">  {/* ← Altere a cor */}
```

**Exemplo: Estilo WhatsApp**
```typescript
// Usuário (verde WhatsApp)
<div className="bg-[#dcf8c6] dark:bg-[#056162] text-gray-900 dark:text-white ...">

// IA (branco)
<div className="bg-white dark:bg-gray-800 ...">
```

### 3.4 Indicador de Digitação

**Arquivo:** `frontend-platform/components/chat/typing-indicator.tsx`

```typescript
export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-in fade-in slide-in-from-left-5">
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl">
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-75" />
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-150" />
        </div>
        <span className="text-sm text-gray-500">Sofia está digitando...</span>
      </div>
    </div>
  )
}
```

**Customizar:**
```typescript
<span className="text-sm text-gray-500">[SEU_NOME] está digitando...</span>

// Ou mais criativo:
<span className="text-sm text-gray-500">Processando sua solicitação...</span>
<span className="text-sm text-gray-500">Consultando base de dados...</span>
```

---

## 4. Customizar Sistema de Tickets

### 4.1 Categorias de Tickets

**Banco de dados:** `frontend-platform/scripts/001_initial_schema.sql` (linha 71)

```sql
category TEXT NOT NULL CHECK (category IN ('acesso', 'compra', 'tecnico', 'financeiro', 'outros')),
```

**Para adicionar novas categorias:**

1. Edite o SQL:
```sql
category TEXT NOT NULL CHECK (category IN (
  'acesso',
  'compra',
  'tecnico',
  'financeiro',
  'billing',      -- Nova categoria
  'integração',   -- Nova categoria
  'outros'
)),
```

2. Execute no Supabase SQL Editor:
```sql
ALTER TABLE tickets DROP CONSTRAINT tickets_category_check;
ALTER TABLE tickets ADD CONSTRAINT tickets_category_check
  CHECK (category IN ('acesso', 'compra', 'tecnico', 'financeiro', 'billing', 'integração', 'outros'));
```

3. Atualize o TypeScript em `frontend-platform/lib/ai/tools.ts`:
```typescript
category: {
  type: "string",
  enum: ["acesso", "compra", "tecnico", "financeiro", "billing", "integração", "outros"],
  description: "Categoria do problema",
},
```

### 4.2 Prioridades de Tickets

**Arquivo SQL:** (linha 72)
```sql
priority TEXT NOT NULL DEFAULT 'media' CHECK (priority IN ('baixa', 'media', 'alta', 'urgente')),
```

**Adicionar nova prioridade "crítica":**
```sql
ALTER TABLE tickets DROP CONSTRAINT tickets_priority_check;
ALTER TABLE tickets ADD CONSTRAINT tickets_priority_check
  CHECK (priority IN ('baixa', 'media', 'alta', 'urgente', 'crítica'));
```

### 4.3 Status de Tickets

**Arquivo SQL:** (linha 73)
```sql
status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN (
  'novo',
  'em_analise',
  'resolvido_ia',
  'aguardando_humano',
  'em_atendimento',
  'fechado'
)),
```

**Adicionar status personalizado:**
```sql
ALTER TABLE tickets DROP CONSTRAINT tickets_status_check;
ALTER TABLE tickets ADD CONSTRAINT tickets_status_check
  CHECK (status IN (
    'novo',
    'triagem',           -- Novo
    'em_analise',
    'aguardando_cliente', -- Novo
    'resolvido_ia',
    'aguardando_humano',
    'em_atendimento',
    'resolvido',         -- Novo
    'fechado'
  ));
```

### 4.4 Número do Ticket (Formato)

**Banco de dados:** Criar function customizada

```sql
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  next_id INTEGER;
  ticket_num TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 6) AS INTEGER)), 0) + 1
  INTO next_id
  FROM tickets;

  -- Formato: TICK-00001
  ticket_num := 'TICK-' || LPAD(next_id::TEXT, 5, '0');

  RETURN ticket_num;
END;
$$ LANGUAGE plpgsql;
```

**Customizar formato:**
```sql
-- Formato: SUP-2025-00001
ticket_num := 'SUP-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(next_id::TEXT, 5, '0');

-- Formato: TS-A1B2C3
ticket_num := 'TS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));

-- Formato: 202501-00001 (AAAAMM-ID)
ticket_num := TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(next_id::TEXT, 5, '0');
```

---

## 5. Customizar Dashboard Admin

### 5.1 Estatísticas Personalizadas

**Arquivo:** `frontend-platform/app/(admin)/admin/page.tsx`

```typescript
// Adicionar novas estatísticas
const { count: ticketsHoje } = await supabase
  .from("tickets")
  .select("*", { count: "exact", head: true })
  .gte("created_at", new Date().toISOString().split('T')[0])

const { count: ticketsUrgentes } = await supabase
  .from("tickets")
  .select("*", { count: "exact", head: true })
  .eq("priority", "urgente")
  .neq("status", "fechado")
```

### 5.2 Filtros de Tickets

**Adicionar filtro por período:**

```typescript
const { data: ticketsUltimos7Dias } = await supabase
  .from("tickets")
  .select("*")
  .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  .order("created_at", { ascending: false })
```

### 5.3 Cores dos Status

**Arquivo:** `frontend-platform/components/admin/ticket-list.tsx`

```typescript
const statusColors = {
  novo: "bg-blue-100 text-blue-800",
  em_analise: "bg-yellow-100 text-yellow-800",
  resolvido_ia: "bg-green-100 text-green-800",
  aguardando_humano: "bg-orange-100 text-orange-800",
  em_atendimento: "bg-purple-100 text-purple-800",
  fechado: "bg-gray-100 text-gray-800",
}
```

---

## 6. Configurar Integrações

### 6.1 Plataforma de Pagamentos

**Arquivo:** `frontend-platform/lib/integrations/purchase-platform.ts`

```typescript
async verifyPurchase(email: string, productId?: string): Promise<IntegrationResponse> {
  try {
    // Exemplo: Hotmart
    const response = await fetch(`${this.baseUrl}/sales/users/email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        buyer_email: email,
        product_id: productId
      })
    })

    const data = await response.json()

    return {
      success: true,
      data: {
        hasPurchase: data.items && data.items.length > 0,
        purchases: data.items,
        lastPurchaseDate: data.items[0]?.purchase?.approved_date
      }
    }
  } catch (error) {
    console.error("[v0] Purchase verification error:", error)
    return {
      success: false,
      error: "Failed to verify purchase"
    }
  }
}
```

**Exemplo: Stripe**
```typescript
import Stripe from 'stripe'

async verifyPurchase(email: string): Promise<IntegrationResponse> {
  const stripe = new Stripe(this.apiKey)

  const customers = await stripe.customers.list({
    email: email,
    limit: 1
  })

  if (customers.data.length === 0) {
    return { success: true, data: { hasPurchase: false } }
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customers.data[0].id,
    status: 'active'
  })

  return {
    success: true,
    data: {
      hasPurchase: subscriptions.data.length > 0,
      subscriptions: subscriptions.data
    }
  }
}
```

### 6.2 Área de Membros

**Arquivo:** `frontend-platform/lib/integrations/member-platform.ts`

```typescript
async checkMemberAccess(email: string): Promise<IntegrationResponse> {
  try {
    const response = await fetch(`${this.baseUrl}/members/check-access`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })

    const data = await response.json()

    return {
      success: true,
      data: {
        hasAccess: data.active,
        expiresAt: data.expires_at,
        products: data.products
      }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

### 6.3 Webhook de Pagamentos

**Arquivo:** `frontend-platform/app/api/webhooks/payment/route.ts`

**Exemplo: Validar assinatura Hotmart**
```typescript
import crypto from 'crypto'

function validateHotmartSignature(payload: any, signature: string): boolean {
  const secret = process.env.HOTMART_WEBHOOK_SECRET
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')

  return hash === signature
}

export async function POST(request: Request) {
  const signature = request.headers.get('X-Hotmart-Signature')
  const payload = await request.json()

  if (!validateHotmartSignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Processar webhook...
}
```

---

## 7. Customizar Base de Conhecimento

### 7.1 Adicionar Categorias

**Arquivo SQL:** `frontend-platform/scripts/002_seed_knowledge_base.sql`

```sql
INSERT INTO knowledge_base (category, question, answer, keywords, tags) VALUES
-- Adicione suas categorias
('tutorial', 'Como configurar [PRODUTO]?', 'Passo 1...\nPasso 2...', ARRAY['configurar', 'setup'], ARRAY['iniciante']),
('api', 'Como usar a API?', 'Documentação da API...', ARRAY['api', 'integração'], ARRAY['dev']),
('billing', 'Como alterar forma de pagamento?', 'Acesse Configurações...', ARRAY['pagamento', 'cartão'], ARRAY['financeiro']);
```

### 7.2 Importar FAQ de CSV

**Script Node.js:**
```typescript
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import Papa from 'papaparse'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const csvFile = fs.readFileSync('./faq.csv', 'utf8')
const { data } = Papa.parse(csvFile, { header: true })

for (const row of data) {
  await supabase.from('knowledge_base').insert({
    category: row.category,
    question: row.question,
    answer: row.answer,
    keywords: row.keywords.split(','),
    tags: row.tags?.split(',') || []
  })
}
```

**Formato CSV:**
```csv
category,question,answer,keywords,tags
acesso,Como resetar senha?,Clique em Esqueci minha senha...,senha;reset;login,comum
tecnico,Erro 500,Verifique se...,erro;500;servidor,crítico
```

---

## 8. Adicionar Novos Tools/Functions

### 8.1 Criar Novo Tool

**Arquivo:** `frontend-platform/lib/ai/tools.ts`

```typescript
export const sofiaTools: Record<string, CoreTool> = {
  // ... tools existentes

  // Novo tool: Consultar status de pedido
  check_order_status: {
    description: "Consulta o status de um pedido pelo número ou email do cliente",
    parameters: {
      type: "object",
      properties: {
        order_number: {
          type: "string",
          description: "Número do pedido (ex: #12345)"
        },
        email: {
          type: "string",
          description: "Email do cliente"
        }
      },
      required: ["email"]
    }
  },

  // Novo tool: Agendar callback
  schedule_callback: {
    description: "Agenda um retorno de ligação para o cliente",
    parameters: {
      type: "object",
      properties: {
        customer_name: {
          type: "string",
          description: "Nome do cliente"
        },
        phone: {
          type: "string",
          description: "Telefone para contato"
        },
        preferred_time: {
          type: "string",
          description: "Horário preferido (ex: 'manhã', 'tarde', '14:00')"
        },
        reason: {
          type: "string",
          description: "Motivo do callback"
        }
      },
      required: ["customer_name", "phone", "reason"]
    }
  }
}
```

### 8.2 Implementar Tool

**Arquivo:** `frontend-platform/lib/ai/sofia.ts`

```typescript
export async function executeToolCall(toolName: string, args: any): Promise<any> {
  console.log(`[v0] Executing tool: ${toolName}`, args)

  switch (toolName) {
    // ... cases existentes

    case "check_order_status":
      return await checkOrderStatus(args.email, args.order_number)

    case "schedule_callback":
      return await scheduleCallback(args)

    default:
      return { error: "Tool not found" }
  }
}

async function checkOrderStatus(email: string, orderNumber?: string) {
  const supabase = await createClient()

  // Exemplo: buscar em tabela de pedidos
  let query = supabase
    .from("orders")
    .select("*")
    .eq("customer_email", email)

  if (orderNumber) {
    query = query.eq("order_number", orderNumber)
  }

  const { data, error } = await query.single()

  if (error || !data) {
    return {
      found: false,
      message: "Pedido não encontrado"
    }
  }

  return {
    found: true,
    order: {
      number: data.order_number,
      status: data.status,
      tracking: data.tracking_code,
      estimatedDelivery: data.estimated_delivery
    }
  }
}

async function scheduleCallback(args: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("callbacks")
    .insert({
      customer_name: args.customer_name,
      phone: args.phone,
      preferred_time: args.preferred_time,
      reason: args.reason,
      status: 'pendente',
      scheduled_for: parsePreferredTime(args.preferred_time)
    })
    .select()
    .single()

  if (error) {
    return {
      success: false,
      error: "Não foi possível agendar"
    }
  }

  return {
    success: true,
    message: "Callback agendado com sucesso",
    callbackId: data.id
  }
}

function parsePreferredTime(time: string): string {
  const now = new Date()

  if (time.toLowerCase().includes('manhã')) {
    now.setHours(10, 0, 0, 0)
  } else if (time.toLowerCase().includes('tarde')) {
    now.setHours(14, 0, 0, 0)
  } else {
    // Parse "14:00" format
    const [hour, minute] = time.split(':')
    now.setHours(parseInt(hour), parseInt(minute || '0'), 0, 0)
  }

  return now.toISOString()
}
```

### 8.3 Instruir IA a Usar o Tool

**Arquivo:** `frontend-platform/lib/ai/prompts.ts`

Adicione instruções no system prompt:

```typescript
export const SOFIA_SYSTEM_PROMPT = `
// ... identidade e comportamento

🔧 FERRAMENTAS DISPONÍVEIS

Você tem acesso às seguintes ferramentas:

1. **check_order_status**: Use quando o cliente perguntar sobre status de pedido, rastreamento, ou onde está seu produto.
   Exemplo: "Onde está meu pedido?" → Use este tool

2. **schedule_callback**: Use quando o cliente solicitar que liguem para ele, ou quando você não conseguir resolver online.
   Exemplo: "Podem me ligar?" → Use este tool

// ... resto do prompt
`
```

---

## 9. Customizar Webhooks

### 9.1 Adicionar Novo Webhook

**Criar arquivo:** `frontend-platform/app/api/webhooks/shipping/route.ts`

```typescript
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    console.log("[Shipping Webhook]", payload)

    const supabase = await createClient()

    // Salvar webhook
    await supabase.from("platform_webhooks").insert({
      platform_type: "shipping",
      payload: payload,
      processed: false
    })

    // Processar evento
    if (payload.event === "shipping.delivered") {
      // Atualizar pedido
      await supabase
        .from("orders")
        .update({
          status: "delivered",
          delivered_at: payload.delivered_at
        })
        .eq("tracking_code", payload.tracking_code)

      // Notificar cliente
      await supabase.from("admin_notifications").insert({
        type: "entrega_realizada",
        title: `Pedido ${payload.order_number} entregue`,
        message: `Cliente ${payload.customer_name} recebeu o pedido`
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Shipping Webhook Error]", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
```

### 9.2 Validar Webhook com Assinatura

```typescript
import crypto from 'crypto'

function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  const digest = hmac.digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  )
}

export async function POST(request: Request) {
  const signature = request.headers.get('X-Webhook-Signature')
  const rawBody = await request.text()

  if (!validateWebhookSignature(rawBody, signature, process.env.WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  // Processar...
}
```

---

## 10. Customizar Notificações

### 10.1 Tipos de Notificação

**Arquivo SQL:** Adicionar tipo customizado

```sql
-- Criar enum para tipos
CREATE TYPE notification_type AS ENUM (
  'novo_ticket',
  'ticket_urgente',
  'ticket_resolvido',
  'cliente_insatisfeito',
  'meta_atingida',          -- Novo
  'sla_prestes_expirar',    -- Novo
  'feedback_negativo'       -- Novo
);

-- Alterar tabela
ALTER TABLE admin_notifications
  ALTER COLUMN type TYPE notification_type USING type::notification_type;
```

### 10.2 Notificação por Email

**Criar função:** `frontend-platform/lib/notifications/email.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendTicketNotification(ticket: any) {
  await resend.emails.send({
    from: 'Suporte <suporte@seudominio.com>',
    to: ['admin@seudominio.com'],
    subject: `[URGENTE] Novo ticket: ${ticket.subject}`,
    html: `
      <h2>Novo ticket requer atenção</h2>
      <p><strong>Cliente:</strong> ${ticket.customer_name}</p>
      <p><strong>Email:</strong> ${ticket.customer_email}</p>
      <p><strong>Assunto:</strong> ${ticket.subject}</p>
      <p><strong>Prioridade:</strong> ${ticket.priority}</p>
      <p><strong>Categoria:</strong> ${ticket.category}</p>
      <br>
      <a href="https://seudominio.com/admin/tickets/${ticket.id}">
        Ver Ticket
      </a>
    `
  })
}
```

**Usar no webhook:**
```typescript
// Em create_ticket
if (!args.resolved) {
  await supabase.from("admin_notifications").insert({...})

  // Enviar email
  await sendTicketNotification({
    id: data.id,
    customer_name: args.customer_name,
    customer_email: args.customer_email,
    subject: args.subject,
    priority: args.priority,
    category: args.category
  })
}
```

### 10.3 Notificação Push (Browser)

**Adicionar ao PWA:**

```typescript
// lib/notifications/push.ts
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export function showBrowserNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo.png',
      badge: '/badge.png',
      ...options
    })
  }
}

// Uso
showBrowserNotification('Novo ticket!', {
  body: 'Cliente João precisa de ajuda urgente',
  tag: 'ticket-123',
  requireInteraction: true
})
```

---

## 🎨 Exemplos de Customização Completa

### Exemplo 1: TechSupport Pro

```typescript
// prompts.ts
export const ALEX_SYSTEM_PROMPT = `
Você é Alex, engenheiro de suporte da TechSupport Pro.
Especialista em resolver problemas técnicos de software.
Tom: Profissional, direto, técnico mas acessível.
`

// globals.css
:root {
  --primary: oklch(0.45 0.20 220);  /* Azul Tech */
  --secondary: oklch(0.35 0.15 200);
  --accent: oklch(0.60 0.18 150);   /* Verde Code */
}

// page.tsx
const logoSrc = "/images/techsupport-logo.png"
<h1>TechSupport Pro - Central de Ajuda</h1>
<h2>Alex - Engenheiro de Suporte</h2>
```

### Exemplo 2: EcoStore (E-commerce)

```typescript
// prompts.ts
export const GAIA_SYSTEM_PROMPT = `
Você é Gaia, assistente de compras da EcoStore.
Especialista em produtos sustentáveis e eco-friendly.
Tom: Amigável, educativo, apaixonado por natureza.
Coleta: Nome, Email, CEP (para frete)
`

// Adicionar tools
check_product_stock: { /* ... */ },
calculate_shipping: { /* ... */ },
apply_discount_code: { /* ... */ }

// globals.css (tema verde/natureza)
:root {
  --primary: oklch(0.55 0.18 145);  /* Verde */
  --secondary: oklch(0.70 0.15 110); /* Verde claro */
  --accent: oklch(0.70 0.20 85);     /* Dourado natural */
}
```

---

## 📝 Checklist de Customização

### Identidade Visual
- [ ] Logo claro substituído
- [ ] Logo escuro substituído
- [ ] Favicon atualizado
- [ ] Cores primárias definidas
- [ ] Gradientes customizados
- [ ] Título da página alterado

### IA e Personalidade
- [ ] Nome da IA definido
- [ ] System prompt customizado
- [ ] Mensagem de boas-vindas personalizada
- [ ] Tom de voz ajustado
- [ ] Critérios de escalonamento definidos

### Funcionalidades
- [ ] Categorias de tickets ajustadas
- [ ] Tools/functions necessários adicionados
- [ ] Integrações configuradas
- [ ] Base de conhecimento populada
- [ ] Webhooks configurados

### Dashboard Admin
- [ ] Estatísticas customizadas
- [ ] Filtros ajustados
- [ ] Notificações configuradas

---

## 🚀 Próximos Passos

Após customizar:

1. **Testar localmente**
   ```bash
   cd frontend-platform
   pnpm dev
   ```

2. **Verificar todas as customizações**
   - Abra http://localhost:3000
   - Teste o chat
   - Verifique cores/logo
   - Crie um ticket teste
   - Acesse dashboard admin

3. **Ajustes finos**
   - Corrigir textos
   - Ajustar espaçamentos
   - Testar em mobile

4. **Deploy**
   - Seguir `GUIA_SETUP_RAPIDO.md`
   - Deploy no Vercel
   - Configurar domínio

---

**Data:** 2025-12-19
**Versão:** 1.0
**Arquivo:** `docs/GUIA_CUSTOMIZACAO_DETALHADO.md`
