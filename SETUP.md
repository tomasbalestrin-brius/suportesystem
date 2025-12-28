# Setup da Plataforma Bethel AI Support

## Passo 1: Executar o Script SQL no Supabase

### Opção A: Via Interface Web do Supabase (Recomendado)

1. Acesse seu projeto no Supabase: https://lldhsfojdfstgrefdnyj.supabase.co
2. No menu lateral, clique em **SQL Editor**
3. Clique em **New Query**
4. Copie todo o conteúdo do arquivo `scripts/001_initial_schema.sql`
5. Cole no editor SQL
6. Clique em **Run** (ou pressione Ctrl/Cmd + Enter)
7. Aguarde a confirmação "Success. No rows returned"

### Opção B: Via CLI do Supabase

Se você tem o Supabase CLI instalado:

```bash
# Executar o script
supabase db reset --db-url "postgresql://postgres:[SUA_SENHA]@db.lldhsfojdfstgrefdnyj.supabase.co:5432/postgres"

# Ou executar diretamente
psql "postgresql://postgres:[SUA_SENHA]@db.lldhsfojdfstgrefdnyj.supabase.co:5432/postgres" < scripts/001_initial_schema.sql
```

## Passo 2: Popular a Base de Conhecimento (FAQ)

Após criar as tabelas, execute o segundo script para popular o FAQ:

1. No SQL Editor do Supabase
2. Copie o conteúdo de `scripts/002_seed_knowledge_base.sql`
3. Cole e execute

## Passo 3: Configurar Variáveis de Ambiente

As seguintes variáveis já estão no `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://lldhsfojdfstgrefdnyj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (necessário adicionar)
OPENAI_API_KEY=sk-...

# Integrações (quando disponível)
PURCHASE_PLATFORM_API_URL=
PURCHASE_PLATFORM_API_KEY=
MEMBER_PLATFORM_API_URL=
MEMBER_PLATFORM_API_KEY=
EMAIL_PLATFORM_API_URL=
EMAIL_PLATFORM_API_KEY=
```

**IMPORTANTE:** Você precisa adicionar sua chave da OpenAI para a IA funcionar.

## Passo 4: Criar Usuário Admin (Opcional)

Para acessar o dashboard administrativo, crie um usuário:

```sql
-- No SQL Editor do Supabase, execute:
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES (
  'admin@bethel.com',
  crypt('SuaSenhaSegura', gen_salt('bf')),
  NOW()
);
```

Ou use a interface de autenticação do Supabase em **Authentication > Users > Invite user**

## Passo 5: Testar a Aplicação

1. Acesse a página inicial: `/`
2. Você verá o chat com a Sofia
3. Digite uma mensagem para testar
4. Acesse o dashboard admin: `/login`

## Verificação das Tabelas

Para verificar se as tabelas foram criadas corretamente:

```sql
-- No SQL Editor, execute:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Você deve ver estas tabelas:
- admin_notifications
- customers
- integration_logs
- knowledge_base
- platform_webhooks
- public_chat_messages
- public_chats
- ticket_messages
- tickets

## Troubleshooting

### Erro: "Could not find the table 'public.public_chats'"
**Solução:** Execute o script SQL conforme Passo 1

### Erro: "Invalid API key" ou erro relacionado a OpenAI
**Solução:** Adicione sua chave OpenAI no `.env.local`

### Não consigo fazer login no admin
**Solução:** Crie um usuário conforme Passo 4

## Próximos Passos

Após o setup básico:

1. Configure as integrações externas (ver `INTEGRATION_GUIDE.md`)
2. Personalize as respostas da Sofia editando os prompts em `lib/ai/prompts.ts`
3. Adicione mais artigos na base de conhecimento via dashboard admin
