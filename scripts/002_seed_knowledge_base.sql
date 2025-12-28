-- Seed Knowledge Base with FAQ Data

-- =====================================================
-- FAQ GERAL - Acesso e Login
-- =====================================================
INSERT INTO knowledge_base (category, title, question, answer, keywords) VALUES
('acesso', 'Como acessar produtos Julia Ottoni', 'Como faço para acessar meu produto após a compra - Julia Ottoni?', 
'Acesse: https://juliaacademy.com.br/
Login: Seu e-mail de compra
Senha: ottoni123', 
ARRAY['julia', 'acesso', 'login', 'senha', 'juliaacademy']),

('acesso', 'Como acessar produtos Cleiton', 'Como faço para acessar meu produto após a compra - Cleiton?',
'Acesse: https://cleitonquerobin1.com.br/area-de-membros/
Login: Seu e-mail de compra
Senha: performance123',
ARRAY['cleiton', 'acesso', 'login', 'senha', 'performance']),

('acesso', 'Como acessar Script GO', 'Como faço para acessar o Script GO?',
'Acesse: https://www.scriptgo.app/login
Login: Seu e-mail de compra
Senha padrão: Script@2025 (você irá trocar depois)',
ARRAY['script', 'scriptgo', 'acesso', 'login', 'senha']),

('acesso', 'Como acessar Couply', 'Como faço para acessar o Couply?',
'Acesse: www.usecouply.app/login
Login: Seu e-mail de compra
Senha padrão: Couply@2025 (você irá trocar depois)',
ARRAY['couply', 'acesso', 'login', 'senha']),

('acesso', 'Como acessar AutentiQ', 'Como faço para acessar o AutentiQ?',
'Acesse: https://authentiq.app/login
Login: Seu e-mail de compra
Senha padrão: AutentiQ@2025 (você irá trocar depois)',
ARRAY['authentiq', 'autentiq', 'acesso', 'login', 'senha']),

('acesso', 'Como acessar Teste dos Arquétipos', 'Como faço para acessar o Teste dos Arquétipos?',
'Acesse: https://testedosarquetipos.com.br/',
ARRAY['teste', 'arquetipos', 'acesso', 'login']),

('acesso', 'Não consigo acessar conta', 'Não consigo acessar minha conta. O que fazer?',
'Passo a passo:
1. Verifique se está usando o e-mail correto (o mesmo usado na compra)
2. Confirme se está usando a senha padrão correta do produto
3. Verifique se digitou corretamente (sem espaços extras)
4. Limpe o cache do navegador
5. Tente acessar em outro navegador
6. Teste em outro dispositivo

Se ainda não conseguir, vou te ajudar a resolver isso! Me passa seu email de compra e qual produto você adquiriu.',
ARRAY['problema', 'acesso', 'nao', 'consigo', 'entrar', 'login']),

('acesso', 'Trocar email de acesso', 'Posso trocar o e-mail de acesso?',
'Não é possível alterar o e-mail diretamente. Você precisa solicitar a alteração através do suporte.

Vou precisar de:
- E-mail usado na compra (antigo)
- E-mail novo que deseja cadastrar
- Nome do produto

Me passa essas informações que eu vou te ajudar!',
ARRAY['trocar', 'mudar', 'email', 'alterar', 'acesso']);

-- =====================================================
-- FAQ GERAL - Recuperação de Senha
-- =====================================================
INSERT INTO knowledge_base (category, title, question, answer, keywords) VALUES
('acesso', 'Esqueci minha senha', 'Esqueci minha senha. Como recupero?',
'Em todas as plataformas:
1. Na tela de login, clique em "Perdeu sua senha?"
2. Digite seu e-mail de compra
3. Você receberá um e-mail com instruções para redefinir

Não recebeu o email? Me avisa que eu te ajudo!',
ARRAY['esqueci', 'senha', 'recuperar', 'redefinir']),

('acesso', 'Não recebi email recuperação', 'Não recebi o e-mail de recuperação de senha. E agora?',
'Vamos fazer assim:
✅ Verifica sua caixa de spam ou lixo eletrônico
✅ Aguarda até 15 minutos (pode demorar um pouco)
✅ Confirma se digitou o e-mail certo
✅ Tenta solicitar novamente

Se após 15 minutos não receber, me avisa! Vou verificar se o e-mail foi cadastrado corretamente.',
ARRAY['nao', 'recebi', 'email', 'recuperacao', 'senha']);

-- =====================================================
-- FAQ GERAL - Problemas Técnicos
-- =====================================================
INSERT INTO knowledge_base (category, title, question, answer, keywords) VALUES
('tecnico', 'Navegadores compatíveis', 'Quais navegadores são compatíveis?',
'Todos os navegadores principais funcionam:
✅ Google Chrome
✅ Mozilla Firefox
✅ Safari
✅ Microsoft Edge
✅ Opera

Recomendação: Usa sempre a versão mais atualizada do navegador.',
ARRAY['navegador', 'compativel', 'chrome', 'firefox', 'safari']),

('tecnico', 'Vídeo não carrega', 'O vídeo não carrega ou está travando. O que fazer?',
'Vamos tentar resolver:
1. Limpa o cache do navegador
2. Atualiza a página (F5)
3. Troca de navegador
4. Testa em outro dispositivo
5. Verifica sua conexão com a internet

Se continuar com problema, me passa:
- Nome do produto
- Nome da aula/vídeo específico
- Navegador que está usando
- Tipo de dispositivo (PC, celular, tablet)',
ARRAY['video', 'nao', 'carrega', 'trava', 'problema', 'tecnico']),

('tecnico', 'Posso baixar materiais', 'Posso baixar os materiais para acesso offline?',
'Sim, parcialmente:
✅ PDFs podem ser baixados
✅ Alguns materiais de apoio estão disponíveis para download
❌ Vídeos das aulas não podem ser baixados (apenas visualização online)

⚠️ Importante: Salve os PDFs no seu dispositivo antes do término do período de acesso.',
ARRAY['baixar', 'download', 'offline', 'pdf', 'video']),

('tecnico', 'Acesso pelo celular', 'Posso acessar pelo celular?',
'Sim! Todos os produtos funcionam em:
📱 Smartphone (Android e iOS)
💻 Computador (Windows, Mac, Linux)
📲 Tablet

A plataforma é responsiva e se adapta a qualquer tela.',
ARRAY['celular', 'mobile', 'smartphone', 'tablet', 'android', 'ios']);

-- =====================================================
-- FAQ GERAL - Pagamentos e Reembolsos
-- =====================================================
INSERT INTO knowledge_base (category, title, question, answer, keywords) VALUES
('financeiro', 'Formas de pagamento', 'Quais são as formas de pagamento?',
'Aceitamos:
✅ PIX (pagamento à vista com aprovação instantânea)
✅ Cartão de crédito (parcelamento em até 12x)
❌ Boleto bancário (não disponível)
❌ PayPal (não disponível)',
ARRAY['pagamento', 'pix', 'cartao', 'credito', 'boleto']),

('financeiro', 'Garantia e reembolso', 'Tem garantia? Como funciona o reembolso?',
'Sim! Você tem 7 dias de garantia a partir da data da compra.

Para solicitar reembolso:
- Hotmart: através da própria área de compras
- Pagtrust: através da plataforma

O prazo de 7 dias é contado a partir da data de aprovação da compra.

Quer solicitar? Me avisa que te ajudo com o passo a passo!',
ARRAY['garantia', 'reembolso', 'devolucao', 'dinheiro', 'volta']),

('compra', 'Não recebi confirmação', 'Comprei o produto mas não recebi o e-mail de confirmação. E agora?',
'Vamos verificar:
1. Olha na caixa de spam ou lixo eletrônico
2. Aguarda até 15 minutos
3. Verifica se o pagamento foi aprovado (pode estar em análise)

Se não encontrar, me passa:
- Nome completo
- E-mail de compra
- Nome do produto
- Comprovante de pagamento (se tiver)',
ARRAY['nao', 'recebi', 'email', 'confirmacao', 'compra']);

-- =====================================================
-- FAQ GERAL - Renovação e Expiração
-- =====================================================
INSERT INTO knowledge_base (category, title, question, answer, keywords) VALUES
('acesso', 'Tempo de acesso', 'Por quanto tempo terei acesso ao produto?',
'Depende do produto:
📅 Maioria dos produtos: 1 ano a partir da data da compra
♾️ Materiais no Trello: Acesso vitalício (enquanto o link estiver salvo)
🔄 Produtos com assinatura: Conforme plano contratado

Me fala qual produto você adquiriu que eu te confirmo o tempo exato!',
ARRAY['tempo', 'acesso', 'quanto', 'expira', 'validade']),

('acesso', 'Renovar acesso', 'Como faço para renovar meu acesso?',
'Para renovar com condição especial:
Entre em contato comigo! Temos condições especiais para renovação.

Para renovar sem desconto:
Você pode recomprar o produto normalmente pela página de vendas.

Quer renovar? Me avisa que te ajudo!',
ARRAY['renovar', 'renovacao', 'acesso', 'expirou', 'venceu']);

-- =====================================================
-- PRODUTOS ESPECÍFICOS
-- =====================================================
INSERT INTO knowledge_base (category, title, question, answer, keywords) VALUES
('produtos', 'Couply - Informações', 'O que é o Couply?',
'O Couply é um aplicativo de gestão de cupons e descontos que facilita a organização e uso de códigos promocionais.

Acesso: www.usecouply.app/login
Senha padrão: Couply@2025

Precisa de ajuda com alguma funcionalidade?',
ARRAY['couply', 'cupom', 'desconto', 'aplicativo']),

('produtos', 'Script GO - Informações', 'O que é o Script GO?',
'O Script GO é uma ferramenta de automação de scripts para WhatsApp que ajuda a otimizar seu atendimento e vendas.

Acesso: https://www.scriptgo.app/login
Senha padrão: Script@2025

Tem alguma dúvida específica sobre o Script GO?',
ARRAY['scriptgo', 'script', 'whatsapp', 'automacao']),

('produtos', 'AutentiQ - Informações', 'O que é o AutentiQ?',
'O AutentiQ é uma plataforma de autenticidade e posicionamento de marca pessoal, criada pela Julia Ottoni.

Acesso: https://authentiq.app/login
Senha padrão: AutentiQ@2025

Como posso te ajudar com o AutentiQ?',
ARRAY['authentiq', 'autentiq', 'julia', 'branding', 'marca']),

('produtos', 'Bethel Finance - Informações', 'O que é o Bethel Finance?',
'O Bethel Finance é uma plataforma de gestão financeira para empreendedores digitais.

Precisa de ajuda para acessar ou usar o Bethel Finance?',
ARRAY['bethel', 'finance', 'financeiro', 'gestao']);

-- =====================================================
-- SUPORTE
-- =====================================================
INSERT INTO knowledge_base (category, title, question, answer, keywords) VALUES
('geral', 'Contato suporte', 'Como entro em contato com o suporte?',
'Você já está falando comigo! Sou a Sofia, da equipe de suporte da BETHEL. 😊

Estou aqui para te ajudar com qualquer dúvida ou problema. Me conta o que precisa!',
ARRAY['suporte', 'contato', 'ajuda', 'atendimento']);
