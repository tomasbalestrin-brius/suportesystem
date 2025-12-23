-- Script para corrigir permissões e expor tabelas na API

-- Desabilitar RLS temporariamente nas tabelas públicas para debug
ALTER TABLE public_chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public_chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base DISABLE ROW LEVEL SECURITY;

-- Garantir que as tabelas estão no schema público
-- (já estão, mas confirmando)

-- Conceder permissões explícitas
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Atualizar as permissões padrão para objetos futuros
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
