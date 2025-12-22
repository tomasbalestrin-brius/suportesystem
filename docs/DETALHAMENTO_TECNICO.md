# Detalhamento Técnico Completo do Sistema

Este documento explica **COMO** o sistema funciona internamente, a arquitetura de cada componente e o fluxo de dados.

---

## 📋 Índice

1. [Arquitetura Geral](#arquitetura-geral)
2. [Fluxo de Dados](#fluxo-de-dados)
3. [Sistema de IA (Sofia)](#sistema-de-ia-sofia)
4. [Sistema de Chat](#sistema-de-chat)
5. [Sistema de Tickets](#sistema-de-tickets)
6. [APIs e Rotas](#apis-e-rotas)
7. [Banco de Dados](#banco-de-dados)
8. [Integrações](#integrações)
9. [Autenticação](#autenticação)
10. [Performance e Otimizações](#performance-e-otimizações)

---

## Arquitetura Geral

### Stack Completo

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
├─────────────────────────────────────────────────────────┤
│  App Router      │  React 19    │  TypeScript 5         │
│  Server/Client   │  Components  │  Type Safety          │
└────────┬─────────────────────────────────────────┬──────┘
         │                                         │
         ▼                                         ▼
┌─────────────────────┐                 ┌──────────────────┐
│   API ROUTES        │                 │   SUPABASE       │
│   (Next.js)         │◄───────────────►│   (Backend)      │
├─────────────────────┤                 ├──────────────────┤
│ • /api/chat         │                 │ • PostgreSQL     │
│ • /api/tickets      │                 │ • Auth           │
│ • /api/webhooks     │                 │ • Realtime       │
│ • /api/knowledge    │                 │ • Storage        │
└─────────┬───────────┘                 └────────┬─────────┘
          │                                      │
          ▼                                      ▼
┌─────────────────────┐                 ┌──────────────────┐
│   OPENAI API        │                 │   ROW LEVEL      │
│   (GPT-4)           │                 │   SECURITY       │
├─────────────────────┤                 ├──────────────────┤
│ • Text Generation   │                 │ • Policies       │
│ • Function Calling  │                 │ • Permissions    │
│ • Streaming         │                 │ • Triggers       │
└─────────────────────┘                 └──────────────────┘
```

### Padrões de Arquitetura

**1. Server Components (Default)**
```typescript
// app/(admin)/admin/page.tsx
export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data } = await supabase.from("tickets").select("*")

  return <TicketList tickets={data} />
}
```
- Renderiza no servidor
- Acesso direto ao banco
- Sem JavaScript no cliente
- SEO otimizado

**2. Client Components (Interatividade)**
```typescript
// components/chat/chat-interface.tsx
"use client"

export function ChatInterface() {
  const [messages, setMessages] = useState([])
  // Hooks, state, eventos
}
```
- Renderiza no cliente
- Usa React hooks
- Interativo
- Necessário para chat, formulários

**3. API Routes (Backend)**
```typescript
// app/api/chat/route.ts
export async function POST(request: Request) {
  const { message } = await request.json()
  const response = await processMessage(message)
  return NextResponse.json({ response })
}
```
- Serverless functions
- Rodam no servidor
- Protegem secrets
- Rate limiting

---

## Fluxo de Dados

### Fluxo Completo: Usuário Envia Mensagem

```
┌──────────────────────────────────────────────────────────┐
│ 1. USUÁRIO DIGITA E ENVIA MENSAGEM                       │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 2. COMPONENTE ChatInterface (Cliente)                    │
│    - Adiciona mensagem ao estado local                   │
│    - Mostra mensagem imediatamente (optimistic UI)       │
│    - Chama handleSendMessage()                           │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 3. FETCH POST /api/chat                                  │
│    Payload: {                                            │
│      sessionId: "uuid",                                  │
│      message: "Olá, preciso de ajuda",                   │
│      messageHistory: [...]                               │
│    }                                                     │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 4. API ROUTE /api/chat/route.ts                          │
│    - Valida sessionId                                    │
│    - Chama processMessage()                              │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 5. FUNÇÃO processMessage (lib/ai/sofia.ts)               │
│    a) Salva mensagem do usuário no DB                    │
│    b) Prepara contexto (system prompt + histórico)       │
│    c) Chama OpenAI API                                   │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 6. OPENAI API (GPT-4)                                    │
│    - Processa mensagem com context                       │
│    - Decide se precisa chamar tools                      │
│    - Retorna resposta OU tool calls                      │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│ SE TOOL CALL     │          │ SE RESPOSTA      │
│                  │          │ DIRETA           │
│ 7a. executeToolCall()       │ 7b. Retorna      │
│   - search_kb    │          │    texto         │
│   - create_ticket│          │                  │
│   - check_customer          └──────┬───────────┘
└────────┬─────────┘                 │
         │                           │
         │ 8. Tool retorna dados     │
         │                           │
         ▼                           │
┌──────────────────┐                 │
│ 9. OpenAI API    │                 │
│    (2ª chamada)  │                 │
│    - Usa dados   │                 │
│    - Gera resposta                 │
└────────┬─────────┘                 │
         │                           │
         └───────────────┬───────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 10. SALVA RESPOSTA NO DB                                 │
│     - public_chat_messages                               │
│     - role: "assistant"                                  │
│     - content: "Olá! Como posso ajudar?"                 │
│     - metadata: { toolCalls: [...] }                     │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 11. RETORNA RESPONSE                                     │
│     return NextResponse.json({                           │
│       response: "Olá! Como posso ajudar?"                │
│     })                                                   │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 12. COMPONENTE ChatInterface RECEBE RESPOSTA             │
│     - Adiciona mensagem ao estado                        │
│     - UI atualiza (scroll to bottom)                     │
│     - Para typing indicator                              │
└──────────────────────────────────────────────────────────┘
```

### Fluxo de Criação de Ticket

```
┌──────────────────────────────────────────────────────────┐
│ 1. IA DECIDE CRIAR TICKET                                │
│    - Cliente forneceu dados (nome, email, CPF)           │
│    - Problema foi categorizado                           │
│    - IA tentou resolver OU precisa escalar               │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 2. TOOL CALL: create_ticket                              │
│    {                                                     │
│      customer_name: "João Silva",                        │
│      customer_email: "joao@email.com",                   │
│      customer_cpf: "123.456.789-00",                     │
│      subject: "Problema de acesso ao Couply",            │
│      category: "acesso",                                 │
│      priority: "alta",                                   │
│      resolved: false,                                    │
│      resolution_summary: "Cliente não recebeu email..."  │
│    }                                                     │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 3. FUNÇÃO createTicket() (lib/ai/sofia.ts:175)           │
│    a) Gera ticket_number via function SQL                │
│    b) Insere ticket na tabela                            │
│    c) Se requires_human = true:                          │
│       - Cria admin_notification                          │
│       - (Opcional) Envia email/push                      │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 4. BANCO DE DADOS                                        │
│                                                          │
│    INSERT INTO tickets                                   │
│    VALUES (                                              │
│      id: uuid_generate_v4(),                             │
│      ticket_number: 'TICK-00123',                        │
│      customer_email: 'joao@email.com',                   │
│      ...                                                 │
│      status: 'aguardando_humano',                        │
│      requires_human: true                                │
│    )                                                     │
│                                                          │
│    INSERT INTO admin_notifications                       │
│    VALUES (                                              │
│      type: 'novo_ticket',                                │
│      title: 'Novo ticket: Problema de acesso...',        │
│      related_ticket_id: <ticket_id>                      │
│    )                                                     │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 5. TRIGGERS SQL (Automáticos)                            │
│    - update_updated_at_column() → Atualiza updated_at    │
│    - generate_ticket_number() → Gera número sequencial   │
│    - (Se configurado) notify_admins() → Realtime event   │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 6. REALTIME (Supabase)                                   │
│    - Broadcast para dashboards admin conectados          │
│    - Admin vê notificação em tempo real                  │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 7. TOOL RETORNA                                          │
│    return {                                              │
│      success: true,                                      │
│      ticket_number: "TICK-00123"                         │
│    }                                                     │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ 8. IA USA RESULTADO                                      │
│    "Criei o ticket TICK-00123 para você. Nossa equipe    │
│     vai entrar em contato em breve!"                     │
└──────────────────────────────────────────────────────────┘
```

---

## Sistema de IA (Sofia)

### Componentes

#### 1. System Prompt (prompts.ts)

**Função:** Define a personalidade e regras da IA

```typescript
export const SOFIA_SYSTEM_PROMPT = `
  🔵 IDENTIDADE: Quem a IA é
  🟦 ESTILO: Como ela fala
  ⚠️ COLETA DE DADOS: O que ela pede
  😊 EMOJIS: Quando e como usar
  🔁 VARIAÇÃO: Evitar repetição
  ⭐ REGRAS: O que SEMPRE fazer
  ❌ PROIBIÇÕES: O que NUNCA fazer
  🚨 ESCALONAMENTO: Quando passar para humano
`
```

**Técnicas usadas:**
- **Few-shot learning**: Exemplos de frases
- **Tone setting**: Tom de conversa WhatsApp
- **Constraint setting**: Regras explícitas
- **Context priming**: Pre-setar dados do cliente

#### 2. Tools/Functions (tools.ts)

**Conceito:** Function Calling do OpenAI

A IA pode "chamar funções" para executar ações:

```typescript
// Definição do tool
{
  search_knowledge_base: {
    description: "Busca na base de conhecimento...",
    parameters: {
      type: "object",
      properties: {
        keywords: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["keywords"]
    }
  }
}
```

**Quando a IA decide usar:**
```
User: "Como configurar o Couply?"
↓
IA analisa e decide: "Preciso buscar info sobre Couply"
↓
IA retorna tool_call: {
  name: "search_knowledge_base",
  arguments: {
    keywords: ["couply", "configurar"],
    category: "produtos"
  }
}
```

**Fluxo interno:**
```typescript
// sofia.ts
const result = await generateText({
  model: "openai/gpt-4o",
  messages: [...],
  tools: sofiaTools,  // ← Tools disponíveis
  maxSteps: 5         // ← Permite até 5 tool calls
})

// Se houve tool call:
if (result.toolCalls) {
  for (const call of result.toolCalls) {
    const toolResult = await executeToolCall(call.name, call.arguments)
    // Resultado é enviado de volta à IA
  }
}
```

#### 3. Processamento (sofia.ts)

**Fluxo de processMessage():**

```typescript
async function processMessage(context, userMessage) {
  // 1. SALVAR mensagem do usuário
  await supabase
    .from("public_chat_messages")
    .insert({ role: "user", content: userMessage })

  // 2. PREPARAR contexto
  const messages = [
    { role: "system", content: SOFIA_SYSTEM_PROMPT },
    ...context.messageHistory,  // Histórico anterior
    { role: "user", content: userMessage }
  ]

  // 3. CHAMAR OpenAI
  const result = await generateText({
    model: "openai/gpt-4o",
    messages,
    tools: sofiaTools,
    maxSteps: 5,
    onStepFinish: (step) => {
      // Log de cada passo
      console.log("Tool calls:", step.toolCalls)
    }
  })

  // 4. SALVAR resposta
  await supabase
    .from("public_chat_messages")
    .insert({
      role: "assistant",
      content: result.text,
      metadata: { toolCalls: result.steps }
    })

  // 5. RETORNAR
  return result.text
}
```

### Function Calling Detalhado

**Exemplo real:**

```
USER: "Não consigo acessar o Couply"

↓ IA processa ↓

STEP 1: IA decide usar tools
{
  toolCalls: [
    {
      name: "search_knowledge_base",
      arguments: {
        keywords: ["couply", "acesso", "login"],
        category: "acesso"
      }
    }
  ]
}

↓ executeToolCall ↓

STEP 2: Busca no banco
SELECT * FROM knowledge_base
WHERE keywords @> ARRAY['couply', 'acesso', 'login']
LIMIT 5

↓ Resultado ↓

{
  found: true,
  results: [
    {
      question: "Como acessar o Couply?",
      answer: "1. Acesse couply.com.br\n2. Clique em Login..."
    }
  ]
}

↓ IA usa resultado ↓

STEP 3: IA gera resposta usando a informação
"Para acessar o Couply, siga estes passos:

1. Acesse couply.com.br
2. Clique em Login
3. Use o email que você comprou

Deu certo aí? 🫡"
```

---

## Sistema de Chat

### Arquitetura de Componentes

```
app/page.tsx (Client Component)
  ↓ gerencia estado
  ├─ ChatInterface
  │   ├─ ScrollArea (mensagens)
  │   │   ├─ MessageBubble (cada msg)
  │   │   └─ TypingIndicator
  │   ├─ QuickReplies
  │   └─ ChatInput
  └─ PWAInstallPrompt
```

### Estado e Ciclo de Vida

**Estado principal (page.tsx):**

```typescript
const [messages, setMessages] = useState<Message[]>([])
const [isTyping, setIsTyping] = useState(false)
const [sessionId, setSessionId] = useState<string>("")
```

**Ciclo de vida:**

```typescript
// 1. MOUNT - Componente monta
useEffect(() => {
  // Gera/recupera sessionId
  const id = getOrCreateSessionId()  // localStorage
  setSessionId(id)

  // Inicializa chat
  initializeChat(id)
}, [])

// 2. INIT - Busca ou cria chat
async function initializeChat(sessionId) {
  const response = await fetch("/api/chat/init", {
    method: "POST",
    body: JSON.stringify({ sessionId })
  })

  // Se é primeira vez, cria chat e retorna welcome
  // Se já existe, retorna histórico de mensagens

  const data = await response.json()
  setMessages(data.messages || [data.welcomeMessage])
}

// 3. SEND - Envia mensagem
async function handleSendMessage(content) {
  // Optimistic UI - adiciona mensagem imediatamente
  setMessages(prev => [...prev, userMessage])
  setIsTyping(true)

  // Chama API
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      sessionId,
      message: content,
      messageHistory: messages
    })
  })

  const data = await response.json()

  // Adiciona resposta da IA
  setMessages(prev => [...prev, assistantMessage])
  setIsTyping(false)
}
```

### Session Management

**getOrCreateSessionId():**

```typescript
export function getOrCreateSessionId(): string {
  // Verifica localStorage
  let sessionId = localStorage.getItem('chat_session_id')

  if (!sessionId) {
    // Gera novo UUID
    sessionId = crypto.randomUUID()
    localStorage.setItem('chat_session_id', sessionId)
  }

  return sessionId
}
```

**Por que Session ID?**
- Identifica usuário anônimo
- Mantém histórico
- Permite retomar conversa
- Funciona sem login

### Optimistic UI

**Conceito:** Mostrar mudanças antes de confirmar com servidor

```typescript
async function handleSend(message) {
  // ✅ OTIMISTA - Adiciona imediatamente
  const tempMessage = {
    id: crypto.randomUUID(),
    role: "user",
    content: message,
    timestamp: new Date()
  }
  setMessages(prev => [...prev, tempMessage])

  // Chama API (pode demorar)
  try {
    const response = await fetch(...)
    // Se sucesso, mantém
  } catch {
    // Se erro, remove
    setMessages(prev => prev.filter(m => m.id !== tempMessage.id))
  }
}
```

**Benefícios:**
- UI instantânea
- Não trava
- Melhor UX

---

## Sistema de Tickets

### Modelo de Dados

```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identificação
  ticket_number TEXT UNIQUE NOT NULL,  -- TICK-00123

  -- Relacionamentos
  chat_id UUID REFERENCES public_chats(id),
  customer_id UUID REFERENCES customers(id),

  -- Dados do cliente (duplicados para histórico)
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_cpf TEXT,

  -- Informações do ticket
  subject TEXT NOT NULL,
  category TEXT NOT NULL CHECK (...),
  priority TEXT NOT NULL CHECK (...),
  status TEXT NOT NULL CHECK (...),

  -- Análise de IA
  ai_analysis JSONB DEFAULT '{}',
  ai_resolution JSONB DEFAULT '{}',
  requires_human BOOLEAN DEFAULT false,

  -- Atribuição
  assigned_to UUID,  -- FK para auth.users

  -- Timestamps
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Estados do Ticket

```
┌──────────────────────────────────────────────────┐
│                   NOVO                           │
│  - Ticket criado pela IA                         │
│  - Ainda não foi visualizado                     │
└──────────────┬───────────────────────────────────┘
               │
               ▼
      ┌────────────────┐
      │  EM_ANALISE    │
      │  - Admin abriu │
      └───────┬────────┘
              │
      ┌───────┴────────┐
      │                │
      ▼                ▼
┌─────────────┐   ┌────────────────┐
│ RESOLVIDO_IA│   │ AGUARDANDO_    │
│ - IA resolveu   │   HUMANO       │
│ - Automático│   │ - Precisa aten.│
└─────────────┘   └────────┬───────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ EM_ATENDIMENTO  │
                  │ - Admin atendendo│
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │    FECHADO      │
                  │ - Resolvido     │
                  └─────────────────┘
```

### Function: generate_ticket_number

```sql
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  next_id INTEGER;
  ticket_num TEXT;
BEGIN
  -- Pega o maior ID atual
  SELECT COALESCE(
    MAX(CAST(SUBSTRING(ticket_number FROM 6) AS INTEGER)),
    0
  ) + 1
  INTO next_id
  FROM tickets;

  -- Formata: TICK-00001
  ticket_num := 'TICK-' || LPAD(next_id::TEXT, 5, '0');

  RETURN ticket_num;
END;
$$ LANGUAGE plpgsql;
```

**Uso:**
```sql
INSERT INTO tickets (ticket_number, ...)
VALUES (generate_ticket_number(), ...);
```

### Trigger: update_updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tickets_updated_at
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**Funcionamento:**
- Toda vez que um ticket é atualizado
- O campo `updated_at` é automaticamente atualizado
- Não precisa especificar no código

---

## APIs e Rotas

### Estrutura de Rotas

```
app/api/
├── chat/
│   ├── route.ts              → POST /api/chat
│   └── init/
│       └── route.ts          → POST /api/chat/init
│
├── tickets/
│   ├── route.ts              → GET, POST /api/tickets
│   ├── [id]/
│   │   ├── route.ts          → GET, PATCH, DELETE /api/tickets/:id
│   │   └── messages/
│   │       └── route.ts      → GET, POST /api/tickets/:id/messages
│
├── knowledge-base/
│   ├── route.ts              → GET, POST /api/knowledge-base
│   └── [id]/
│       └── route.ts          → GET, PATCH, DELETE /api/knowledge-base/:id
│
├── notifications/
│   ├── route.ts              → GET /api/notifications
│   └── [id]/
│       └── read/
│           └── route.ts      → PATCH /api/notifications/:id/read
│
└── webhooks/
    ├── payment/
    │   └── route.ts          → POST /api/webhooks/payment
    ├── members/
    │   └── route.ts          → POST /api/webhooks/members
    └── email/
        └── route.ts          → POST /api/webhooks/email
```

### Padrão de API Route

**Exemplo completo:**

```typescript
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/tickets
export async function GET(request: Request) {
  try {
    // 1. Parse query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')

    // 2. Autenticação (se necessário)
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // 3. Query database
    let query = supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    // 4. Error handling
    if (error) {
      console.error("[API] Get tickets error:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // 5. Return response
    return NextResponse.json({
      tickets: data,
      count: data.length
    })

  } catch (error) {
    console.error("[API] Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/tickets
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validação (pode usar Zod)
    if (!body.subject || !body.customer_email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Gerar ticket number
    const { data: ticketNumber } = await supabase
      .rpc("generate_ticket_number")

    // Inserir ticket
    const { data, error } = await supabase
      .from("tickets")
      .insert({
        ticket_number: ticketNumber,
        ...body
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### Dynamic Routes

**Exemplo: /api/tickets/[id]/route.ts**

```typescript
// GET /api/tickets/123
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const ticketId = params.id  // ← Pega o ID da URL

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", ticketId)
    .single()

  if (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
```

---

## Banco de Dados

### Row Level Security (RLS)

**Conceito:** Segurança a nível de linha

```sql
-- Habilitar RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários autenticados podem ver seus próprios tickets
CREATE POLICY "Users can view own tickets"
ON tickets
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND customer_email = auth.email()
);

-- Policy: Admins podem ver todos
CREATE POLICY "Admins can view all tickets"
ON tickets
FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM admin_users
  )
);
```

**Como funciona:**

```typescript
// Cliente faz query
const { data } = await supabase
  .from("tickets")
  .select("*")

// Supabase automaticamente adiciona WHERE:
// SELECT * FROM tickets
// WHERE customer_email = 'user@email.com'  ← RLS
```

### Índices

**Arquivo SQL:**

```sql
-- Índices para performance
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_customer_email ON tickets(customer_email);
CREATE INDEX idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX idx_tickets_requires_human ON tickets(requires_human);

-- Índice composto
CREATE INDEX idx_tickets_status_priority
ON tickets(status, priority)
WHERE status IN ('novo', 'aguardando_humano');
```

**Por que?**
```sql
-- SEM índice: Full table scan (lento)
SELECT * FROM tickets WHERE status = 'novo';
-- Scan: 10000 rows → 500ms

-- COM índice: Index scan (rápido)
-- Scan: 50 rows → 5ms
```

### Triggers Úteis

**1. Auto-update timestamp:**
```sql
CREATE TRIGGER update_tickets_updated_at
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**2. Notificar admins em novo ticket:**
```sql
CREATE OR REPLACE FUNCTION notify_admins_new_ticket()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.requires_human = true THEN
    INSERT INTO admin_notifications (
      ticket_id,
      type,
      title,
      message
    ) VALUES (
      NEW.id,
      'novo_ticket',
      'Novo ticket: ' || NEW.subject,
      'Cliente ' || NEW.customer_name || ' precisa de atendimento'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_on_new_ticket
AFTER INSERT ON tickets
FOR EACH ROW
EXECUTE FUNCTION notify_admins_new_ticket();
```

---

## Integrações

### Webhook Pattern

**1. Receber webhook:**
```typescript
export async function POST(request: Request) {
  // 1. Parse payload
  const payload = await request.json()

  // 2. Validar assinatura (segurança)
  const signature = request.headers.get('X-Webhook-Signature')
  if (!validateSignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid' }, { status: 401 })
  }

  // 3. Salvar payload completo (auditoria)
  await supabase.from("platform_webhooks").insert({
    platform_type: "payment",
    payload: payload,
    processed: false
  })

  // 4. Processar de forma assíncrona
  await processPaymentWebhook(payload)

  // 5. Retornar 200 rapidamente
  return NextResponse.json({ success: true })
}
```

**2. Processar assíncrono:**
```typescript
async function processPaymentWebhook(payload) {
  try {
    // Lógica de negócio
    // ...

    // Marcar como processado
    await supabase
      .from("platform_webhooks")
      .update({ processed: true })
      .eq("id", webhookId)

  } catch (error) {
    // Log erro
    await supabase
      .from("platform_webhooks")
      .update({
        processed: true,
        error_message: error.message
      })
      .eq("id", webhookId)
  }
}
```

---

## Performance e Otimizações

### 1. Server Components (Padrão)

```typescript
// ✅ Server Component - Grátis
export default async function Page() {
  const data = await fetchData()  // No servidor
  return <div>{data}</div>
}

// ❌ Client Component - Custo
"use client"
export default function Page() {
  const [data, setData] = useState()
  useEffect(() => {
    fetchData().then(setData)  // No cliente
  }, [])
  return <div>{data}</div>
}
```

### 2. Caching

```typescript
// Revalidar a cada 60 segundos
export const revalidate = 60

export default async function TicketsPage() {
  const tickets = await fetchTickets()  // Cached
  return <TicketList tickets={tickets} />
}
```

### 3. Parallel Queries

```typescript
// ❌ Sequencial - Lento
const tickets = await supabase.from("tickets").select()
const notifications = await supabase.from("notifications").select()
const stats = await supabase.from("stats").select()

// ✅ Paralelo - Rápido
const [tickets, notifications, stats] = await Promise.all([
  supabase.from("tickets").select(),
  supabase.from("notifications").select(),
  supabase.from("stats").select()
])
```

### 4. Lazy Loading

```typescript
// Componente pesado carrega só quando necessário
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <Skeleton />
})
```

---

## Resumo da Arquitetura

```
Frontend (Next.js)
  ↓
  ├─ Server Components (SEO, performance)
  ├─ Client Components (interatividade)
  └─ API Routes (backend logic)
      ↓
      ├─ Supabase (database, auth)
      ├─ OpenAI (IA processing)
      └─ External APIs (integrações)

Segurança:
  ├─ RLS (row level security)
  ├─ Middleware (route protection)
  └─ Env vars (secrets)

Performance:
  ├─ Server Components (zero JS)
  ├─ Caching (revalidate)
  ├─ Parallel queries
  └─ Lazy loading
```

---

**Data:** 2025-12-19
**Versão:** 1.0
**Arquivo:** `docs/DETALHAMENTO_TECNICO.md`
