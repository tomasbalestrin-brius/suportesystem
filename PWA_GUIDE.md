# Guia de Instalação PWA - Bethel Support

## O que é PWA?

Progressive Web App (PWA) permite que a plataforma seja instalada no dispositivo do usuário como um aplicativo nativo, oferecendo:

- Acesso rápido via ícone na tela inicial
- Funcionalidade offline básica
- Experiência de app nativo
- Notificações push (futuro)
- Menor consumo de dados

## Como Instalar

### Android (Chrome/Edge)

1. Acesse a plataforma no navegador
2. Toque no menu (⋮) no canto superior direito
3. Selecione "Instalar app" ou "Adicionar à tela inicial"
4. Confirme a instalação

### iOS (Safari)

1. Acesse a plataforma no Safari
2. Toque no ícone de compartilhamento (□↑)
3. Role para baixo e toque em "Adicionar à Tela Início"
4. Nomeie o app e toque em "Adicionar"

### Desktop (Chrome/Edge)

1. Acesse a plataforma no navegador
2. Clique no ícone de instalação (⊕) na barra de endereços
3. Ou clique no menu (⋮) → "Instalar Bethel Support"
4. Confirme a instalação

## Recursos PWA

### Cache e Offline

- Páginas visitadas são cacheadas automaticamente
- Interface básica funciona offline
- Sincronização automática quando online

### Atualizações

- Service Worker verifica atualizações a cada 60 segundos
- Novas versões são baixadas em background
- Atualização aplicada no próximo carregamento

### Performance

- Carregamento instantâneo de recursos cacheados
- Redução de consumo de dados
- Melhor performance em conexões lentas

## Manutenção

### Limpeza de Cache

Se necessário limpar o cache:

1. Acesse as configurações do navegador
2. Vá em "Privacidade e segurança"
3. Selecione "Limpar dados de navegação"
4. Marque "Imagens e arquivos em cache"
5. Selecione o período e confirme

### Desinstalar

**Android/Desktop:**
- Botão direito no ícone → "Desinstalar"

**iOS:**
- Pressione e segure o ícone → "Remover App"

## Desenvolvimento

### Testar Localmente

```bash
npm run build
npm run start
```

Acesse https://localhost:3000 e teste a instalação.

### Atualizar Service Worker

1. Edite `public/sw.js`
2. Altere `CACHE_NAME` para nova versão
3. Faça deploy
4. Usuários receberão atualização automaticamente

### Debug

**Chrome DevTools:**
1. F12 → Application → Service Workers
2. Verifique status e logs
3. Teste offline mode

## Troubleshooting

**Prompt de instalação não aparece:**
- Certifique-se que está em HTTPS
- Verifique se o manifest.json está acessível
- Confirme que o Service Worker foi registrado

**App não atualiza:**
- Force atualização: DevTools → Application → Service Workers → Update
- Ou limpe o cache e reinstale

**Offline não funciona:**
- Verifique console para erros do Service Worker
- Confirme que recursos estão sendo cacheados
- Teste network throttling no DevTools
