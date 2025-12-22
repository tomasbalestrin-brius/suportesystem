# Exemplos Práticos de Uso e Customização

Este documento contém exemplos prontos para copiar e colar de customizações comuns.

---

## 📋 Índice

1. [Trocar Identidade da IA](#1-trocar-identidade-da-ia)
2. [Mudar Tema de Cores](#2-mudar-tema-de-cores)
3. [Adicionar Novo Tool](#3-adicionar-novo-tool)
4. [Customizar Categorias](#4-customizar-categorias)
5. [Configurar Integração Real](#5-configurar-integração-real)
6. [Adicionar Notificações Email](#6-adicionar-notificações-email)
7. [Customizar Dashboard](#7-customizar-dashboard)
8. [Importar FAQ de Excel](#8-importar-faq-de-excel)

---

## 1. Trocar Identidade da IA

### Cenário: Mudar de "Sofia" para "Alex" (suporte técnico)

**Passo 1:** Editar `lib/ai/prompts.ts`

```typescript
export const ALEX_SYSTEM_PROMPT = `🔵 IDENTIDADE DO AGENTE

Você é Alex, engenheiro de suporte da TechDesk, especializado em resolver problemas técnicos de software.

Quando perguntarem quem está falando, você se apresenta como:

"Sou o Alex, engenheiro de suporte da TechDesk."

⚠️ INSTRUÇÃO IMPORTANTE – DADOS DO CLIENTE

Colete apenas:
- Nome
- E-mail
- Número do ticket ou produto (se já tiver)

🟦 ESTILO DE CONVERSA

Você é técnico mas amigável:
- Use linguagem clara e objetiva
- Explique termos técnicos quando necessário
- Seja paciente e didático
- Tom profissional mas acessível
- Evite jargões complexos sem explicação

😊 USO DE EMOJIS

Use emojis com moderação (máximo 1 por mensagem):
- ✅ Para confirmações
- 🔧 Para questões técnicas
- 💡 Para dicas
- ⚠️ Para alertas importantes

🔁 VARIAÇÃO DE RESPOSTAS

Evite responder sempre da mesma forma:
- "Conseguiu resolver?" / "Funcionou?" / "Deu certo?"
- "Estou aqui!" / "Conte comigo!" / "Qualquer dúvida, me avisa!"

⭐ REGRAS DE OURO

✅ SEMPRE FAÇA:
- Confirme entendimento: "Entendi que o problema é X, correto?"
- Explique passo a passo
- Peça feedback após cada solução
- Use a base de conhecimento antes de escalar

❌ NUNCA FAÇA:
- Inventar informações técnicas
- Prometer prazos não confirmados
- Culpar o usuário pelo erro
- Dar soluções sem ter certeza

🚨 QUANDO ESCALAR PARA HUMANO

Escale imediatamente quando:
- Bug crítico ou erro não documentado
- Cliente tentou solução 3x sem sucesso
- Problema requer acesso direto ao sistema
- Cliente extremamente insatisfeito
- Solicitação de customização/desenvolvimento

Frase para escalar:
"Vou conectar você com nosso time de engenharia que tem acesso direto ao sistema para resolver isso rapidamente. Só um momento! 🔧"

Use as ferramentas (functions) disponíveis para buscar informações e executar ações.
`

export function getWelcomeMessage(): string {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite"

  return `${greeting}! 👋

Sou o Alex, engenheiro de suporte da TechDesk.

Estou aqui para ajudar com:
• Problemas técnicos
• Erros e bugs
• Configurações
• Dúvidas sobre funcionalidades

Como posso te ajudar hoje?`
}
```

**Passo 2:** Editar `lib/ai/sofia.ts` (renomear import se quiser)

```typescript
import { ALEX_SYSTEM_PROMPT } from "./prompts"

export async function processMessage(context: ChatContext, userMessage: string) {
  // ...
  const messages = [
    { role: "system" as const, content: ALEX_SYSTEM_PROMPT }, // ← Alterado
    // ...
  ]
  // ...
}
```

**Passo 3:** Editar UI em `app/page.tsx`

```typescript
// Linha 146
<h2 className="font-bold text-lg sm:text-xl">Alex</h2>  {/* ← Alterado */}
<p className="text-xs sm:text-sm text-white/90 font-medium">
  Engenheiro de Suporte da TechDesk  {/* ← Alterado */}
</p>

// Linha 140 - Alterar emoji
<div className="...">
  🔧  {/* ← Alterado (ou use imagem) */}
</div>
```

---

## 2. Mudar Tema de Cores

### Cenário: Tema Verde/Natureza (E-commerce Eco)

**Arquivo:** `app/globals.css`

```css
/* Tema CLARO - Verde Natureza */
:root {
  /* Verde principal - Botões, links */
  --primary: oklch(0.55 0.18 145);

  /* Verde azulado - Secundário */
  --secondary: oklch(0.45 0.15 170);

  /* Dourado/Amarelo - Destaque */
  --accent: oklch(0.70 0.20 85);

  /* Cores de gráficos */
  --chart-1: oklch(0.55 0.18 145);  /* Verde */
  --chart-2: oklch(0.70 0.20 85);   /* Dourado */
  --chart-3: oklch(0.45 0.15 170);  /* Azul esverdeado */
  --chart-4: oklch(0.65 0.15 110);  /* Verde claro */
  --chart-5: oklch(0.50 0.12 180);  /* Ciano */

  /* Resto mantém igual */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --radius: 0.75rem;
}

/* Tema ESCURO */
.dark {
  --primary: oklch(0.65 0.18 145);      /* Verde mais claro */
  --secondary: oklch(0.55 0.15 170);
  --accent: oklch(0.75 0.20 85);

  /* Charts */
  --chart-1: oklch(0.65 0.18 145);
  --chart-2: oklch(0.75 0.20 85);
  --chart-3: oklch(0.55 0.15 170);
  --chart-4: oklch(0.70 0.15 110);
  --chart-5: oklch(0.60 0.12 180);

  /* Backgrounds escuros */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
```

**Gradiente do header (app/page.tsx linha 136):**

```typescript
<div className="... bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 ...">
```

**Background da página (linha 112):**

```typescript
<div className="... bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50 dark:from-gray-950 dark:via-green-950/20 dark:to-gray-950">
```

---

## 3. Adicionar Novo Tool

### Cenário: Consultar Status de Pedido

**Passo 1:** Criar tabela (SQL)

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('processing', 'shipped', 'delivered', 'cancelled')),
  tracking_code TEXT,
  estimated_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_order_number ON orders(order_number);
```

**Passo 2:** Definir tool (`lib/ai/tools.ts`)

```typescript
export const sofiaTools: Record<string, CoreTool> = {
  // ... tools existentes

  check_order_status: {
    description:
      "Consulta o status de um pedido. Use quando o cliente perguntar 'onde está meu pedido', 'rastreamento', ou informar número de pedido.",
    parameters: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Email do cliente",
        },
        order_number: {
          type: "string",
          description: "Número do pedido (opcional, ex: #12345)",
        },
      },
      required: ["email"],
    },
  },
}
```

**Passo 3:** Implementar tool (`lib/ai/sofia.ts`)

```typescript
export async function executeToolCall(toolName: string, args: any): Promise<any> {
  console.log(`[v0] Executing tool: ${toolName}`, args)

  switch (toolName) {
    // ... cases existentes

    case "check_order_status":
      return await checkOrderStatus(args.email, args.order_number)

    default:
      return { error: "Tool not found" }
  }
}

// Nova função
async function checkOrderStatus(email: string, orderNumber?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("orders")
    .select("*")
    .eq("customer_email", email)
    .order("created_at", { ascending: false })

  if (orderNumber) {
    // Remove # se tiver
    const cleanNumber = orderNumber.replace("#", "")
    query = query.eq("order_number", cleanNumber)
  }

  const { data, error } = await query.limit(orderNumber ? 1 : 5)

  if (error || !data || data.length === 0) {
    return {
      found: false,
      message: "Não encontrei pedidos com este email" + (orderNumber ? " e número" : ""),
    }
  }

  // Se buscou por número específico
  if (orderNumber) {
    const order = data[0]
    return {
      found: true,
      order: {
        number: order.order_number,
        status: order.status,
        tracking: order.tracking_code,
        estimatedDelivery: order.estimated_delivery,
        statusMessage: getStatusMessage(order.status),
      },
    }
  }

  // Se buscou todos os pedidos do email
  return {
    found: true,
    orders: data.map((order) => ({
      number: order.order_number,
      status: order.status,
      tracking: order.tracking_code,
      createdAt: order.created_at,
    })),
    count: data.length,
  }
}

function getStatusMessage(status: string): string {
  const messages = {
    processing: "Seu pedido está sendo preparado",
    shipped: "Seu pedido foi enviado e está a caminho",
    delivered: "Seu pedido foi entregue",
    cancelled: "Seu pedido foi cancelado",
  }
  return messages[status] || "Status desconhecido"
}
```

**Passo 4:** Instruir IA (`lib/ai/prompts.ts`)

Adicione no system prompt:

```typescript
🔧 FERRAMENTAS DISPONÍVEIS

Você tem acesso a:

1. **check_order_status**: Use quando cliente perguntar sobre pedido
   - "Onde está meu pedido?"
   - "Qual o status do pedido #12345?"
   - "Quando vai chegar?"
   → Use este tool para consultar

// ... resto das ferramentas
```

---

## 4. Customizar Categorias

### Cenário: E-commerce (Produto, Entrega, Pagamento, Devolução)

**Passo 1:** Alterar constraint SQL

```sql
-- Remover constraint antiga
ALTER TABLE tickets DROP CONSTRAINT tickets_category_check;

-- Adicionar nova constraint
ALTER TABLE tickets ADD CONSTRAINT tickets_category_check
  CHECK (category IN ('produto', 'entrega', 'pagamento', 'devolucao', 'outros'));
```

**Passo 2:** Atualizar TypeScript (`lib/ai/tools.ts`)

```typescript
create_ticket: {
  description: "Cria um ticket de suporte...",
  parameters: {
    type: "object",
    properties: {
      // ...
      category: {
        type: "string",
        enum: ["produto", "entrega", "pagamento", "devolucao", "outros"],
        description: "Categoria do problema",
      },
      // ...
    },
  },
},
```

**Passo 3:** Instruir IA no prompt

```typescript
export const SYSTEM_PROMPT = `
// ...

📊 CATEGORIZAÇÃO DE PROBLEMAS

Categorize os problemas assim:

- **produto**: Defeito, não funciona, diferente do anunciado
- **entrega**: Não chegou, prazo, rastreamento, entrega errada
- **pagamento**: Cobrança indevida, cartão recusado, boleto
- **devolucao**: Quer devolver, trocar, reembolso
- **outros**: Qualquer outra coisa

// ...
`
```

---

## 5. Configurar Integração Real

### Cenário: Integrar com Hotmart (Plataforma de Pagamentos)

**Passo 1:** Variáveis de ambiente

```env
# .env.local
HOTMART_WEBHOOK_SECRET=seu_secret_aqui
HOTMART_API_TOKEN=seu_token_aqui
HOTMART_API_URL=https://developers.hotmart.com/payments/api/v1
```

**Passo 2:** Implementar cliente (`lib/integrations/hotmart.ts`)

```typescript
export class HotmartClient {
  private apiUrl: string
  private token: string

  constructor() {
    this.apiUrl = process.env.HOTMART_API_URL!
    this.token = process.env.HOTMART_API_TOKEN!
  }

  async verifyPurchase(email: string, productId?: string) {
    try {
      const response = await fetch(`${this.apiUrl}/sales/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyer_email: email,
          product_id: productId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Hotmart API error: ${response.status}`)
      }

      const data = await response.json()

      return {
        success: true,
        data: {
          hasPurchase: data.items && data.items.length > 0,
          purchases: data.items?.map((item: any) => ({
            productName: item.product.name,
            purchaseDate: item.purchase.approved_date,
            status: item.purchase.status,
            transactionId: item.purchase.transaction,
          })),
        },
      }
    } catch (error) {
      console.error("[Hotmart] Verification error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

export const hotmart = new HotmartClient()
```

**Passo 3:** Validar webhook (`app/api/webhooks/hotmart/route.ts`)

```typescript
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

function validateHotmartSignature(payload: string, signature: string): boolean {
  const secret = process.env.HOTMART_WEBHOOK_SECRET!
  const hash = crypto.createHmac("sha256", secret).update(payload).digest("hex")

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature))
}

export async function POST(request: Request) {
  try {
    // 1. Validar assinatura
    const signature = request.headers.get("X-Hotmart-Hottok")
    const rawBody = await request.text()

    if (!signature || !validateHotmartSignature(rawBody, signature)) {
      console.error("[Hotmart] Invalid signature")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    console.log("[Hotmart] Webhook received:", payload.event)

    const supabase = await createClient()

    // 2. Salvar webhook
    await supabase.from("platform_webhooks").insert({
      platform_type: "hotmart",
      payload: payload,
      processed: false,
    })

    // 3. Processar evento
    if (payload.event === "PURCHASE_APPROVED") {
      const buyer = payload.data.buyer
      const product = payload.data.product

      // Criar/atualizar cliente
      await supabase
        .from("customers")
        .upsert({
          email: buyer.email,
          name: buyer.name,
          cpf: buyer.checkout_phone || null,
          purchase_status: "approved",
          purchase_platform_id: payload.data.purchase.transaction,
          last_sync_at: new Date().toISOString(),
        })
        .eq("email", buyer.email)

      console.log(`[Hotmart] Customer ${buyer.email} updated`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Hotmart] Webhook error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
```

**Passo 4:** Configurar no Hotmart

1. Login em Hotmart
2. Ir em Ferramentas > Webhooks
3. Adicionar webhook:
   - URL: `https://seudominio.com/api/webhooks/hotmart`
   - Eventos: `PURCHASE_APPROVED`, `PURCHASE_REFUNDED`
   - Secret: Copiar e adicionar em `.env.local`

---

## 6. Adicionar Notificações Email

### Cenário: Enviar email quando ticket urgente é criado

**Passo 1:** Instalar Resend

```bash
cd frontend-platform
pnpm add resend
```

**Passo 2:** Configurar env

```env
RESEND_API_KEY=re_xxx
NOTIFICATION_EMAIL_FROM=suporte@seudominio.com
NOTIFICATION_EMAIL_TO=admin@seudominio.com
```

**Passo 3:** Criar função (`lib/notifications/email.ts`)

```typescript
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface TicketEmailData {
  id: string
  ticket_number: string
  customer_name: string
  customer_email: string
  subject: string
  category: string
  priority: string
  created_at: string
}

export async function sendUrgentTicketNotification(ticket: TicketEmailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.NOTIFICATION_EMAIL_FROM!,
      to: process.env.NOTIFICATION_EMAIL_TO!,
      subject: `🚨 [URGENTE] Ticket ${ticket.ticket_number}: ${ticket.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f7fafc; padding: 20px; border-radius: 0 0 8px 8px; }
            .info { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #f56565; }
            .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; }
            .priority-urgent { color: #f56565; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🚨 Novo Ticket Urgente</h2>
            </div>
            <div class="content">
              <p>Um novo ticket de <span class="priority-urgent">PRIORIDADE URGENTE</span> foi criado e requer atenção imediata.</p>

              <div class="info">
                <p><strong>Ticket:</strong> ${ticket.ticket_number}</p>
                <p><strong>Cliente:</strong> ${ticket.customer_name}</p>
                <p><strong>Email:</strong> ${ticket.customer_email}</p>
                <p><strong>Assunto:</strong> ${ticket.subject}</p>
                <p><strong>Categoria:</strong> ${ticket.category}</p>
                <p><strong>Prioridade:</strong> ${ticket.priority}</p>
                <p><strong>Criado em:</strong> ${new Date(ticket.created_at).toLocaleString("pt-BR")}</p>
              </div>

              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/tickets/${ticket.id}" class="button">
                Ver Ticket no Dashboard
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("[Email] Failed to send notification:", error)
      return { success: false, error }
    }

    console.log("[Email] Notification sent:", data?.id)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("[Email] Unexpected error:", error)
    return { success: false, error }
  }
}
```

**Passo 4:** Usar no create_ticket (`lib/ai/sofia.ts`)

```typescript
import { sendUrgentTicketNotification } from "@/lib/notifications/email"

async function createTicket(args: any) {
  const supabase = await createClient()

  // ... código existente de criação do ticket

  const { data, error } = await supabase.from("tickets").insert(ticketData).select().single()

  if (error) {
    console.error("[v0] Create ticket error:", error)
    return { success: false, error: error.message }
  }

  // Criar notificação no DB
  if (!args.resolved) {
    await supabase.from("admin_notifications").insert({
      ticket_id: data.id,
      type: "novo_ticket",
      title: `Novo ticket: ${args.subject}`,
      message: `Cliente ${args.customer_name} precisa de atendimento humano`,
    })

    // ✅ ENVIAR EMAIL SE URGENTE
    if (args.priority === "urgente" || args.priority === "alta") {
      await sendUrgentTicketNotification({
        id: data.id,
        ticket_number: ticketNumberData,
        customer_name: args.customer_name,
        customer_email: args.customer_email,
        subject: args.subject,
        category: args.category,
        priority: args.priority,
        created_at: data.created_at,
      })
    }
  }

  return { success: true, ticket_number: ticketNumberData }
}
```

---

## 7. Customizar Dashboard

### Cenário: Adicionar Gráfico de Tickets por Categoria

**Passo 1:** Query de dados (`app/(admin)/admin/page.tsx`)

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketsByCategoryChart } from "@/components/admin/tickets-by-category-chart"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // ... queries existentes

  // ✅ NOVA QUERY: Tickets por categoria
  const { data: ticketsByCategory } = await supabase
    .from("tickets")
    .select("category")
    .order("created_at", { ascending: false })

  // Agrupar por categoria
  const categoryCounts = ticketsByCategory?.reduce((acc: any, ticket: any) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(categoryCounts || {}).map(([category, count]) => ({
    category,
    count,
  }))

  return (
    <div className="min-h-screen bg-background">
      <AdminNav unreadCount={unreadNotifications || 0} />

      <main className="container mx-auto p-6 space-y-6">
        {/* ... Stats existentes */}

        {/* ✅ NOVO CARD: Gráfico */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <TicketsByCategoryChart data={chartData} />
          </CardContent>
        </Card>

        {/* ... Resto do código */}
      </main>
    </div>
  )
}
```

**Passo 2:** Componente do gráfico (`components/admin/tickets-by-category-chart.tsx`)

```typescript
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface ChartData {
  category: string
  count: number
}

export function TicketsByCategoryChart({ data }: { data: ChartData[] }) {
  // Traduzir categorias
  const categoryNames: Record<string, string> = {
    acesso: "Acesso",
    compra: "Compra",
    tecnico: "Técnico",
    financeiro: "Financeiro",
    outros: "Outros",
  }

  const chartData = data.map((item) => ({
    ...item,
    categoryLabel: categoryNames[item.category] || item.category,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="categoryLabel" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  )
}
```

---

## 8. Importar FAQ de Excel

### Cenário: Importar 100+ perguntas de planilha

**Passo 1:** Preparar CSV

```csv
category,question,answer,keywords,tags
acesso,Como resetar minha senha?,Acesse 'Esqueci minha senha' na tela de login...,senha;reset;login,comum
tecnico,Erro 500 ao fazer login,Esse erro indica problema no servidor...,erro;500;servidor,crítico
produto,Como usar o recurso X?,O recurso X permite...,recurso;tutorial,feature
```

**Passo 2:** Script de importação (`scripts/import-faq.ts`)

```typescript
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import Papa from "papaparse"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ Service role - usar com cuidado
)

async function importFAQ() {
  console.log("📚 Importando FAQ...")

  // Ler CSV
  const csvFile = fs.readFileSync("./faq.csv", "utf8")
  const { data } = Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
  })

  console.log(`Encontradas ${data.length} perguntas`)

  let imported = 0
  let errors = 0

  for (const row of data as any[]) {
    try {
      const { error } = await supabase.from("knowledge_base").insert({
        category: row.category,
        question: row.question,
        answer: row.answer,
        keywords: row.keywords?.split(";") || [],
        tags: row.tags?.split(";") || [],
        is_active: true,
      })

      if (error) throw error

      imported++
      console.log(`✅ ${imported}/${data.length} - ${row.question.substring(0, 50)}...`)
    } catch (error) {
      errors++
      console.error(`❌ Erro ao importar: ${row.question}`, error)
    }
  }

  console.log(`\n✨ Importação concluída!`)
  console.log(`   Importadas: ${imported}`)
  console.log(`   Erros: ${errors}`)
}

importFAQ()
```

**Passo 3:** Executar

```bash
cd frontend-platform
npx tsx scripts/import-faq.ts
```

---

## 🎯 Casos de Uso Completos

### E-commerce: Loja de Roupas Online

```typescript
// prompts.ts
export const MODA_AI_PROMPT = `
Você é Luna, consultora de moda da FashionStore.
Especialista em ajudar clientes a encontrar looks perfeitos.

Coleta: Nome, Email, Tamanho preferido (opcional)

Estilo: Amigável, fashion, entusiasmada com moda
Emojis: 👗 💕 ✨ (moderado)

Ferramentas:
- check_order_status: Status de pedidos
- check_size_availability: Disponibilidade de tamanhos
- suggest_similar_products: Sugerir produtos similares
`

// Tools extras
check_size_availability: {
  description: "Verifica se um produto tem o tamanho disponível",
  parameters: {
    productId: { type: "string" },
    size: { type: "string", enum: ["PP", "P", "M", "G", "GG"] }
  }
}
```

### SaaS B2B: Software Empresarial

```typescript
// prompts.ts
export const ENTERPRISE_AI_PROMPT = `
Você é Marcus, analista de suporte da EnterpriseSoft.
Especialista em resolver problemas técnicos de software empresarial.

Coleta: Nome, Email, Empresa, Cargo

Estilo: Profissional, técnico, consultivo
Emojis: Mínimo (apenas ✅ e ⚠️)

Sempre pergunte:
- Qual módulo está usando?
- Há mensagem de erro?
- Já tentou limpar cache?

Escale para engenharia se:
- Bug não documentado
- Problema de integração API
- Questão de performance
- Solicitação de feature
`

// Tools extras
check_api_status: {
  description: "Verifica status da API e integrações",
}

check_license: {
  description: "Verifica licença do cliente e módulos ativos",
}
```

---

**Data:** 2025-12-19
**Versão:** 1.0
**Arquivo:** `docs/EXEMPLOS_PRATICOS.md`
