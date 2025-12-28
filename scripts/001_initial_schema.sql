-- Bethel AI Support Platform - Initial Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PUBLIC CHATS (Conversas na tela pública)
-- =====================================================
CREATE TABLE public_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    visitor_name TEXT,
    visitor_email TEXT,
    visitor_cpf TEXT,
    status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'finalizado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_public_chats_session_id ON public_chats(session_id);
CREATE INDEX idx_public_chats_email ON public_chats(visitor_email);

-- =====================================================
-- PUBLIC CHAT MESSAGES (Mensagens do chat público)
-- =====================================================
CREATE TABLE public_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES public_chats(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_public_chat_messages_chat_id ON public_chat_messages(chat_id);
CREATE INDEX idx_public_chat_messages_created_at ON public_chat_messages(created_at DESC);

-- =====================================================
-- CUSTOMERS (Clientes do sistema)
-- =====================================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    cpf TEXT,
    phone TEXT,
    purchase_platform_id TEXT, -- ID na plataforma de compras
    member_platform_id TEXT,   -- ID na área de membros
    purchase_status TEXT,
    access_status TEXT,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_cpf ON customers(cpf);

-- =====================================================
-- TICKETS (Tickets de suporte)
-- =====================================================
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number TEXT UNIQUE NOT NULL,
    chat_id UUID REFERENCES public_chats(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_cpf TEXT,
    subject TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('acesso', 'compra', 'tecnico', 'financeiro', 'outros')),
    priority TEXT NOT NULL DEFAULT 'media' CHECK (priority IN ('baixa', 'media', 'alta', 'urgente')),
    status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'em_analise', 'resolvido_ia', 'aguardando_humano', 'em_atendimento', 'fechado')),
    ai_analysis JSONB DEFAULT '{}',
    ai_resolution JSONB DEFAULT '{}',
    requires_human BOOLEAN DEFAULT false,
    assigned_to UUID, -- FK para admins (criado depois)
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tickets_number ON tickets(ticket_number);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_customer_email ON tickets(customer_email);
CREATE INDEX idx_tickets_requires_human ON tickets(requires_human);
CREATE INDEX idx_tickets_created_at ON tickets(created_at DESC);

-- =====================================================
-- TICKET MESSAGES (Mensagens dos tickets)
-- =====================================================
CREATE TABLE ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'ai', 'admin')),
    sender_name TEXT NOT NULL,
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX idx_ticket_messages_created_at ON ticket_messages(created_at DESC);

-- =====================================================
-- KNOWLEDGE BASE (Base de conhecimento / FAQ)
-- =====================================================
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    usage_count INTEGER DEFAULT 0,
    effectiveness_score FLOAT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX idx_knowledge_base_keywords ON knowledge_base USING GIN(keywords);
CREATE INDEX idx_knowledge_base_active ON knowledge_base(is_active);

-- =====================================================
-- ADMIN NOTIFICATIONS (Notificações para admins)
-- =====================================================
CREATE TABLE admin_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('novo_ticket', 'ticket_urgente', 'sem_resolucao', 'cliente_insatisfeito')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_notifications_read ON admin_notifications(is_read);
CREATE INDEX idx_admin_notifications_created_at ON admin_notifications(created_at DESC);

-- =====================================================
-- PLATFORM WEBHOOKS (Webhooks das plataformas externas)
-- =====================================================
CREATE TABLE platform_webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform_type TEXT NOT NULL CHECK (platform_type IN ('email', 'payment', 'members')),
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_platform_webhooks_processed ON platform_webhooks(processed);
CREATE INDEX idx_platform_webhooks_type ON platform_webhooks(platform_type);

-- =====================================================
-- INTEGRATION LOGS (Logs de integração)
-- =====================================================
CREATE TABLE integration_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform_type TEXT NOT NULL,
    action TEXT NOT NULL,
    request JSONB,
    response JSONB,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_integration_logs_platform ON integration_logs(platform_type);
CREATE INDEX idx_integration_logs_success ON integration_logs(success);
CREATE INDEX idx_integration_logs_created_at ON integration_logs(created_at DESC);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Função para gerar número de ticket
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    ticket_count INTEGER;
    year TEXT;
BEGIN
    year := TO_CHAR(NOW(), 'YYYY');
    SELECT COUNT(*) + 1 INTO ticket_count 
    FROM tickets 
    WHERE ticket_number LIKE 'BET-' || year || '-%';
    
    RETURN 'BET-' || year || '-' || LPAD(ticket_count::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em tabelas relevantes
CREATE TRIGGER update_public_chats_updated_at
    BEFORE UPDATE ON public_chats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at
    BEFORE UPDATE ON knowledge_base
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS nas tabelas sensíveis
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para acesso público (público pode criar chats e mensagens)
ALTER TABLE public_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create chats" ON public_chats
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view their own chat" ON public_chats
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create messages" ON public_chat_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view messages" ON public_chat_messages
    FOR SELECT USING (true);

-- Nota: Políticas para admins serão criadas após setup de autenticação
