# Plataforma Mestra de Suporte - Bethel

Sistema inteligente de suporte com IA (Sofia) desenvolvido para gerenciar atendimentos, tickets e integrações com plataformas externas.

## Funcionalidades Implementadas

### Chat Público com IA (Sofia)
- Interface de chat acessível sem login
- IA GPT-4 com personalidade humanizada
- Coleta natural de dados (nome, email, CPF)
- Análise automática de problemas
- Criação de tickets automatizada
- Escalonamento inteligente para atendimento humano

### Sistema de Tickets
- Criação automática via chat
- Categorização (acesso, compra, técnico, outros)
- Priorização automática
- Histórico completo de conversas
- Status tracking (novo, em análise, resolvido, aguardando humano, fechado)

### Dashboard Administrativo
- Login com Supabase Auth
- Visão geral com estatísticas
- Lista de tickets com filtros
- Detalhes completos de tickets
- Gestão de base de conhecimento
- Notificações em tempo real
- Configurações de integrações

### Base de Conhecimento
- FAQ completo dos produtos Bethel
- Busca por palavras-chave
- Métricas de uso e efetividade
- CRUD completo via API

### Integrações Externas
- Webhook para plataforma de emails (SES/R2)
- Webhook para plataforma de pagamentos
- Webhook para área de membros
- Conectores preparados para suas plataformas customizadas
- Sistema de logging de integrações

### APIs REST Completas
- `/api/chat` - Chat com Sofia
- `/api/tickets` - CRUD de tickets
- `/api/notifications` - Notificações
- `/api/knowledge-base` - Base de conhecimento
- `/api/webhooks/*` - Recepção de dados externos

## Configuração

### 1. Executar Scripts SQL no Supabase

Execute os scripts na ordem:

```bash
# 1. Schema inicial (tabelas, índices, triggers, RLS)
scripts/001_initial_schema.sql

# 2. Base de conhecimento (FAQ)
scripts/002_seed_knowledge_base.sql
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` e adicione:

```env
# Supabase (já configurado)
NEXT_PUBLIC_SUPABASE_URL=https://lldhsfojdfstgrefdnyj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (OBRIGATÓRIO - adicionar sua chave)
OPENAI_API_KEY=sk-proj-...

# Plataformas Externas (suas plataformas customizadas)
PURCHASE_PLATFORM_URL=https://sua-plataforma-compras.com/api
PURCHASE_PLATFORM_API_KEY=sua_chave_api

MEMBER_PLATFORM_URL=https://sua-area-membros.com/api
MEMBER_PLATFORM_API_KEY=sua_chave_api

EMAIL_PLATFORM_API_KEY=sua_chave_ses
AWS_SES_REGION=us-east-1
```

### 3. Criar Usuário Admin no Supabase

No Supabase Dashboard, vá em Authentication > Users e crie um usuário:
- Email: seu-email@exemplo.com
- Password: senha-segura

### 4. Instalar e Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

Acesse:
- Chat público: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin

## Estrutura do Banco de Dados

### Tabelas Principais

- **public_chats** - Conversas no chat público
- **public_chat_messages** - Mensagens do chat
- **tickets** - Tickets de suporte
- **ticket_messages** - Mensagens dos tickets
- **customers** - Dados dos clientes
- **knowledge_base** - Base de conhecimento (FAQ)
- **admin_notifications** - Notificações para admins
- **platform_webhooks** - Logs de webhooks recebidos
- **integration_logs** - Logs de chamadas às plataformas

## Como Integrar suas Plataformas

Veja o arquivo `INTEGRATION_GUIDE.md` para instruções detalhadas de como:
1. Configurar webhooks nas suas plataformas
2. Enviar dados para a plataforma mestra
3. Testar integrações
4. Exemplos de payload

## Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Autenticação via Supabase Auth
- Middleware protegendo rotas admin
- Validação de dados com Zod
- Sanitização de inputs

## Performance

- Índices otimizados no PostgreSQL
- Supabase Realtime para atualizações em tempo real
- Cache de consultas frequentes
- Processamento assíncrono de webhooks

## Próximos Passos

1. Adicionar sua chave OpenAI no `.env.local`
2. Executar os scripts SQL no Supabase
3. Criar usuário admin
4. Testar o chat público
5. Configurar suas plataformas externas para enviar webhooks
6. Personalizar cores/logo conforme necessário

## Suporte

Para dúvidas sobre implementação, consulte:
- Documentação do código nos arquivos
- `INTEGRATION_GUIDE.md` para integrações
- Comentários nos componentes React
