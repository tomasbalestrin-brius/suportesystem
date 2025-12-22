# Sistema de Suporte Inteligente com IA

Sistema completo de suporte ao cliente com inteligência artificial, tickets automáticos, dashboard administrativo e integrações externas.

---

## 📚 Documentação

### Análise e Arquitetura
- **[Análise do Frontend](./docs/ANALISE_FRONTEND.md)** - Análise técnica completa do repositório v0-ai-support-platform
- **[Arquitetura Proposta](./docs/ARQUITETURA_PROPOSTA.md)** - Proposta de arquitetura e integração do sistema
- **[Detalhamento Técnico](./docs/DETALHAMENTO_TECNICO.md)** - Como tudo funciona internamente (fluxos, APIs, banco de dados)

### Guias Práticos
- **[Guia de Setup Rápido](./setup/GUIA_SETUP_RAPIDO.md)** - Configure o sistema em 30-60 minutos
- **[Guia de Customização](./docs/GUIA_CUSTOMIZACAO_DETALHADO.md)** - Como personalizar cada aspecto do sistema
- **[Exemplos Práticos](./docs/EXEMPLOS_PRATICOS.md)** - Código pronto para copiar e usar

---

## 🚀 Início Rápido

### 1. Clone este repositório

```bash
git clone https://github.com/tomasbalestrin-brius/suportesystem.git
cd suportesystem
```

### 2. Frontend já está clonado

O frontend v0-ai-support-platform já está na pasta `frontend-platform/`

### 3. Próximos passos

Consulte a [Arquitetura Proposta](./docs/ARQUITETURA_PROPOSTA.md) para decidir qual caminho seguir:
- **Opção A**: Setup rápido com Supabase + Vercel
- **Opção B**: Backend customizado com NestJS
- **Opção C**: Híbrido (Supabase + Microserviços)

---

## 📁 Estrutura do Projeto

```
suportesystem/
├── frontend-platform/         # Frontend Next.js (v0-ai-support-platform)
│   ├── app/                   # Rotas e páginas
│   ├── components/            # Componentes React
│   ├── lib/                   # Lógica e utilitários
│   ├── scripts/               # Scripts SQL
│   └── public/                # Assets estáticos
│
├── docs/                      # Documentação do projeto
│   ├── ANALISE_FRONTEND.md
│   └── ARQUITETURA_PROPOSTA.md
│
├── setup/                     # Scripts e guias de setup
│
└── README.md                  # Este arquivo
```

---

## 🎯 Funcionalidades

### ✅ Já Implementadas (Frontend)

- **Chat Público com IA (Sofia)**
  - Interface acessível sem login
  - IA GPT-4 com personalidade humanizada
  - Coleta natural de dados do cliente
  - Criação automática de tickets

- **Sistema de Tickets**
  - Categorização automática
  - Priorização inteligente
  - Análise e resolução por IA
  - Histórico completo

- **Dashboard Administrativo**
  - Gestão de tickets
  - Base de conhecimento (FAQ)
  - Notificações em tempo real
  - Estatísticas e métricas

- **Integrações (Webhooks)**
  - Plataforma de emails
  - Plataforma de pagamentos
  - Área de membros

### 🔄 A Implementar

- [ ] Configuração do Supabase
- [ ] Deploy do frontend
- [ ] Integração com OpenAI
- [ ] Configuração de webhooks
- [ ] Customização de branding
- [ ] Testes automatizados
- [ ] CI/CD

---

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Runtime:** React 19
- **Linguagem:** TypeScript 5
- **Estilização:** Tailwind CSS 4
- **UI Components:** Radix UI
- **Formulários:** React Hook Form + Zod

### Backend
- **BaaS:** Supabase (PostgreSQL + Auth + Realtime)
- **IA:** OpenAI GPT-4
- **APIs:** Next.js API Routes

### Banco de Dados
- **PostgreSQL** com:
  - Row Level Security (RLS)
  - Triggers e Functions
  - Índices otimizados
  - 9 tabelas principais

---

## 📊 Status do Projeto

| Componente | Status | Progresso |
|------------|--------|-----------|
| Análise do Frontend | ✅ Concluído | 100% |
| Proposta de Arquitetura | ✅ Concluído | 100% |
| Detalhamento Técnico | ✅ Concluído | 100% |
| Guia de Setup | ✅ Concluído | 100% |
| Guia de Customização | ✅ Concluído | 100% |
| Exemplos Práticos | ✅ Concluído | 100% |
| Setup do Supabase | ⏳ Próximo | 0% |
| Deploy | ⏳ Próximo | 0% |

---

## 🔐 Configuração de Ambiente

### Variáveis Necessárias

Crie um arquivo `.env.local` na pasta `frontend-platform/`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima

# OpenAI (OBRIGATÓRIO)
OPENAI_API_KEY=sk-proj-...

# Integrações (Opcional)
PURCHASE_PLATFORM_URL=
PURCHASE_PLATFORM_API_KEY=
MEMBER_PLATFORM_URL=
MEMBER_PLATFORM_API_KEY=
EMAIL_PLATFORM_API_KEY=
```

---

## 📖 Guias Disponíveis

### No Frontend (frontend-platform/)
- `SETUP.md` - Setup do banco de dados
- `INTEGRATION_GUIDE.md` - Configuração de integrações
- `PWA_GUIDE.md` - Configuração PWA
- `README.md` - Documentação principal do frontend

### Neste Repositório (docs/)
- `ANALISE_FRONTEND.md` - Análise técnica detalhada
- `ARQUITETURA_PROPOSTA.md` - Proposta de arquitetura

---

## 🤝 Contribuindo

Este é um projeto em desenvolvimento. Contribuições são bem-vindas!

---

## 📝 Licença

[Definir licença]

---

## 📞 Próximos Passos

1. **Ler a documentação**
   - [Análise do Frontend](./docs/ANALISE_FRONTEND.md)
   - [Arquitetura Proposta](./docs/ARQUITETURA_PROPOSTA.md)

2. **Decidir a arquitetura**
   - Opção A: Supabase (rápido)
   - Opção B: Backend próprio (escalável)
   - Opção C: Híbrido (flexível)

3. **Configurar ambiente**
   - Criar projeto Supabase
   - Obter OpenAI API Key
   - Configurar variáveis de ambiente

4. **Executar setup**
   - Rodar scripts SQL
   - Instalar dependências
   - Testar localmente

5. **Deploy**
   - Vercel/Netlify para frontend
   - Configurar domínio
   - Testar em produção

---

**Status:** 🏗️ Em construção
**Última atualização:** 2025-12-19
**Branch:** claude/build-system-frontend-FUEYH
