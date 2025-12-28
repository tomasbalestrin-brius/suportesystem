# Guia de Integração - Plataforma de Suporte Bethel

## Visão Geral

Este documento descreve como integrar suas plataformas externas com a Plataforma de Suporte Bethel.

## Webhooks Disponíveis

### 1. Webhook de Email

**Endpoint:** `POST /api/webhooks/email`

**Payload:**
```json
{
  "from": "cliente@example.com",
  "to": "suporte@bethel.com",
  "subject": "Problema com acesso",
  "body": "Não consigo acessar meu curso...",
  "html": "<p>Não consigo acessar meu curso...</p>",
  "attachments": [],
  "timestamp": "2025-01-18T10:00:00Z",
  "messageId": "msg_12345"
}
```

**Resposta:**
```json
{
  "success": true,
  "response": "Resposta da Sofia"
}
```

### 2. Webhook de Pagamentos

**Endpoint:** `POST /api/webhooks/payment`

**Payload:**
```json
{
  "event": "purchase.approved",
  "customer": {
    "email": "cliente@example.com",
    "name": "João Silva",
    "cpf": "123.456.789-00"
  },
  "product": {
    "id": "prod_123",
    "name": "Curso Completo"
  },
  "transaction": {
    "id": "txn_456",
    "amount": 197.00,
    "currency": "BRL",
    "status": "approved"
  },
  "platform": "hotmart",
  "timestamp": "2025-01-18T10:00:00Z"
}
```

### 3. Webhook de Área de Membros

**Endpoint:** `POST /api/webhooks/members`

**Payload:**
```json
{
  "event": "access.created",
  "customer": {
    "email": "cliente@example.com",
    "name": "João Silva"
  },
  "access": {
    "product_id": "prod_123",
    "product_name": "Curso Completo",
    "status": "active",
    "expiration_date": "2026-01-18T10:00:00Z"
  },
  "timestamp": "2025-01-18T10:00:00Z"
}
```

## APIs de Consulta

### Verificar Compra

```typescript
import { purchasePlatform } from '@/lib/integrations/purchase-platform'

const result = await purchasePlatform.verifyPurchase('cliente@example.com', 'prod_123')
```

### Verificar Acesso

```typescript
import { memberPlatform } from '@/lib/integrations/member-platform'

const result = await memberPlatform.checkAccess('cliente@example.com')
```

### Criar Acesso

```typescript
import { memberPlatform } from '@/lib/integrations/member-platform'

const result = await memberPlatform.createAccess('cliente@example.com', 'prod_123')
```

### Enviar Email

```typescript
import { emailPlatform } from '@/lib/integrations/email-platform'

const result = await emailPlatform.sendSupportResponse(
  'cliente@example.com',
  'BET-2025-0001',
  'Seu problema foi resolvido!'
)
```

## Configuração

1. Adicione as URLs e API Keys das suas plataformas no arquivo `.env.local`
2. Implemente a lógica de autenticação específica de cada plataforma nos clients
3. Configure os webhooks nas suas plataformas para apontar para os endpoints acima
4. Teste cada integração individualmente

## Segurança

- Todos os webhooks devem incluir assinatura ou token de validação
- Use HTTPS para todas as comunicações
- Valide os payloads recebidos
- Implemente rate limiting
- Registre todas as tentativas de acesso

## Suporte

Para dúvidas sobre integração, entre em contato com a equipe de desenvolvimento.
