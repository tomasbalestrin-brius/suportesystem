-- Garantir que as tabelas estejam acessíveis via API REST

-- Verificar e recriar as policies se necessário
DROP POLICY IF EXISTS "Anyone can create chats" ON public_chats;
DROP POLICY IF EXISTS "Anyone can view their own chat" ON public_chats;
DROP POLICY IF EXISTS "Anyone can update their own chat" ON public_chats;
DROP POLICY IF EXISTS "Anyone can create messages" ON public_chat_messages;
DROP POLICY IF EXISTS "Anyone can view messages" ON public_chat_messages;

-- Recriar policies para public_chats
CREATE POLICY "Enable insert for all users" ON public_chats
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON public_chats
    FOR SELECT USING (true);

CREATE POLICY "Enable update for all users" ON public_chats
    FOR UPDATE USING (true);

-- Recriar policies para public_chat_messages
CREATE POLICY "Enable insert for all users" ON public_chat_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON public_chat_messages
    FOR SELECT USING (true);

-- Garantir que outras tabelas também estejam expostas
CREATE POLICY "Enable read for all users" ON knowledge_base
    FOR SELECT USING (is_active = true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
