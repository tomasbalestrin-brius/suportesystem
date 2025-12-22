#!/bin/bash

# ==================================================
# SCRIPT DE SETUP - Sistema de Suporte
# ==================================================
#
# Este script auxilia na configuração inicial do sistema
# Execute: bash setup/setup.sh
#

set -e  # Parar em caso de erro

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   🚀 Setup do Sistema de Suporte Inteligente            ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diretório do script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
FRONTEND_DIR="$PROJECT_ROOT/frontend-platform"

echo -e "${BLUE}📁 Diretório do projeto:${NC} $PROJECT_ROOT"
echo ""

# ==================================================
# 1. VERIFICAR PRÉ-REQUISITOS
# ==================================================

echo -e "${BLUE}1. Verificando pré-requisitos...${NC}"
echo ""

# Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado${NC}"
    echo "   Instale em: https://nodejs.org"
    exit 1
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION"
fi

# pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm não encontrado. Instalando...${NC}"
    npm install -g pnpm
    echo -e "${GREEN}✓${NC} pnpm instalado"
else
    PNPM_VERSION=$(pnpm -v)
    echo -e "${GREEN}✓${NC} pnpm $PNPM_VERSION"
fi

# Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git não encontrado${NC}"
    echo "   Instale em: https://git-scm.com"
    exit 1
else
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    echo -e "${GREEN}✓${NC} Git $GIT_VERSION"
fi

echo ""

# ==================================================
# 2. VERIFICAR .ENV.LOCAL
# ==================================================

echo -e "${BLUE}2. Configurando variáveis de ambiente...${NC}"
echo ""

ENV_FILE="$FRONTEND_DIR/.env.local"
ENV_EXAMPLE="$FRONTEND_DIR/.env.example"

if [ -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env.local já existe${NC}"
    read -p "   Deseja sobrescrever? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${BLUE}   Mantendo arquivo existente${NC}"
    else
        cp "$ENV_EXAMPLE" "$ENV_FILE"
        echo -e "${GREEN}✓${NC} Arquivo .env.local criado"
    fi
else
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    echo -e "${GREEN}✓${NC} Arquivo .env.local criado de .env.example"
fi

echo ""
echo -e "${YELLOW}📝 IMPORTANTE: Você precisa editar o arquivo .env.local${NC}"
echo ""
echo "   Arquivo: $ENV_FILE"
echo ""
echo "   Preencha as seguintes variáveis:"
echo -e "   ${BLUE}• NEXT_PUBLIC_SUPABASE_URL${NC} (Supabase Project URL)"
echo -e "   ${BLUE}• NEXT_PUBLIC_SUPABASE_ANON_KEY${NC} (Supabase anon key)"
echo -e "   ${BLUE}• OPENAI_API_KEY${NC} (OpenAI API Key)"
echo ""
read -p "Pressione ENTER quando tiver configurado as variáveis..." dummy
echo ""

# Verificar se variáveis foram preenchidas
if grep -q "seu-projeto.supabase.co" "$ENV_FILE" || grep -q "sk-proj-..." "$ENV_FILE"; then
    echo -e "${YELLOW}⚠️  Parece que as variáveis ainda não foram preenchidas${NC}"
    echo "   Certifique-se de preencher TODAS as variáveis obrigatórias"
    echo ""
    read -p "Continuar mesmo assim? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo ""
        echo -e "${RED}Setup cancelado. Configure o .env.local e execute novamente.${NC}"
        exit 1
    fi
fi

# ==================================================
# 3. INSTALAR DEPENDÊNCIAS
# ==================================================

echo -e "${BLUE}3. Instalando dependências...${NC}"
echo ""

cd "$FRONTEND_DIR"

if [ -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules já existe${NC}"
    read -p "   Deseja reinstalar? (s/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo "   Removendo node_modules..."
        rm -rf node_modules
        echo "   Instalando..."
        pnpm install
        echo -e "${GREEN}✓${NC} Dependências reinstaladas"
    else
        echo -e "${BLUE}   Mantendo instalação existente${NC}"
    fi
else
    echo "   Instalando dependências (pode levar 2-3 minutos)..."
    pnpm install
    echo -e "${GREEN}✓${NC} Dependências instaladas"
fi

echo ""

# ==================================================
# 4. VERIFICAR SCRIPTS SQL
# ==================================================

echo -e "${BLUE}4. Verificando scripts SQL...${NC}"
echo ""

SQL_DIR="$FRONTEND_DIR/scripts"
REQUIRED_SCRIPTS=(
    "001_initial_schema.sql"
    "002_seed_knowledge_base.sql"
    "003_expose_tables_api.sql"
    "003_fix_permissions.sql"
)

ALL_FOUND=true
for script in "${REQUIRED_SCRIPTS[@]}"; do
    if [ -f "$SQL_DIR/$script" ]; then
        echo -e "${GREEN}✓${NC} $script"
    else
        echo -e "${RED}❌${NC} $script - NÃO ENCONTRADO"
        ALL_FOUND=false
    fi
done

echo ""

if [ "$ALL_FOUND" = false ]; then
    echo -e "${RED}⚠️  Alguns scripts SQL não foram encontrados${NC}"
    echo "   Verifique o diretório: $SQL_DIR"
else
    echo -e "${YELLOW}📝 PRÓXIMO PASSO: Execute estes scripts no Supabase${NC}"
    echo ""
    echo "   1. Acesse: https://supabase.com"
    echo "   2. Abra seu projeto"
    echo "   3. Vá em SQL Editor"
    echo "   4. Execute os scripts na ordem acima"
    echo ""
    echo "   Guia completo: setup/DEPLOY_COMPLETO.md"
fi

echo ""

# ==================================================
# 5. RESUMO
# ==================================================

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   ✅ Setup básico concluído!                             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}O que foi feito:${NC}"
echo -e "  ${GREEN}✓${NC} Pré-requisitos verificados"
echo -e "  ${GREEN}✓${NC} Arquivo .env.local criado"
echo -e "  ${GREEN}✓${NC} Dependências instaladas"
echo -e "  ${GREEN}✓${NC} Scripts SQL verificados"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo ""
echo "  1. Configure Supabase (executar scripts SQL)"
echo "     → Ver: setup/DEPLOY_COMPLETO.md (Etapa 1)"
echo ""
echo "  2. Testar localmente:"
echo "     → cd frontend-platform"
echo "     → pnpm dev"
echo "     → Abrir http://localhost:3000"
echo ""
echo "  3. Deploy no Vercel:"
echo "     → Ver: setup/DEPLOY_COMPLETO.md (Etapa 4)"
echo ""
echo -e "${BLUE}Documentação completa em:${NC}"
echo "  • setup/DEPLOY_COMPLETO.md - Guia passo a passo de deploy"
echo "  • docs/GUIA_CUSTOMIZACAO_DETALHADO.md - Customização"
echo "  • docs/EXEMPLOS_PRATICOS.md - Código pronto para usar"
echo ""
echo "🚀 Boa sorte com seu sistema de suporte!"
echo ""
