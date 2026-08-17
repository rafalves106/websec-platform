# Plataforma de Estudo Gamificada — Web Security

MVP inicial: bot de WhatsApp + página web com sessão diária + integração GitHub + geração de conteúdo via Grok.

## Estrutura

```
websec-platform/
├── backend/           # API Node.js (Express) + banco de dados
│   └── src/
│       ├── db/         # schema e conexão com banco
│       ├── routes/      # rotas da API
│       └── services/    # integrações (Grok, GitHub, WhatsApp)
├── frontend/          # Next.js + Tailwind — a página da sessão diária
└── bot/               # bot de WhatsApp (whatsapp-web.js) que dispara o lembrete
```

## Como rodar com Docker Compose (produção / servidor)

1. Copie os arquivos de exemplo e preencha com suas chaves reais:
   ```
   cp backend/.env.example backend/.env
   cp bot/.env.example bot/.env
   ```
2. Suba tudo:
   ```
   docker compose up -d --build
   ```
3. Escaneie o QR code do WhatsApp na primeira vez:
   ```
   docker compose logs -f bot
   ```
   (aparece o QR direto no terminal — escaneia com o WhatsApp do celular)
4. Rode o seed dentro do container do backend (só na primeira vez):
   ```
   docker compose exec backend node src/db/seed.js
   ```

Serviços expostos: frontend na porta 3000, backend na porta 3001. No seu nginx + Cloudflare Tunnel, aponte o domínio da plataforma pra porta 3000, e (se quiser expor a API separadamente) um subdomínio pra porta 3001.

Os dados persistem em dois volumes Docker: `backend_data` (banco SQLite) e `bot_session` (sessão do WhatsApp, pra não precisar escanear o QR toda vez que reiniciar o container).

## Como rodar localmente sem Docker (desenvolvimento)

1. `cd backend && npm install && npm run dev` — sobe a API na porta 3001
2. `cd frontend && npm install && npm run dev` — sobe a página na porta 3000
3. `cd bot && npm install && npm start` — conecta o bot (vai pedir scan de QR code na primeira vez)

## Variáveis de ambiente necessárias

Crie um `.env` em `backend/` com:

```
DATABASE_URL=postgres://user:pass@localhost:5432/websec
GROK_API_KEY=sua_chave_aqui
GITHUB_TOKEN=seu_token_aqui
GITHUB_USERNAME=seu_usuario
JWT_SECRET=qualquer_string_secreta
```

## Fluxo do MVP

1. Bot manda mensagem no WhatsApp às 19h com link único da sessão do dia
2. Link abre o frontend, que busca a sessão no backend (gerada via Grok se ainda não existir)
3. Usuário completa o desafio → backend registra progresso, atualiza streak/XP, cria commit no repo do GitHub
4. Frontend mostra feedback imediato (conquista, XP, streak)

## Próximos passos depois do esqueleto

- Popular a trilha do mês 1 (fundamentos + SQLi + XSS)
- Estilizar o frontend com a identidade visual JDM/moto esportiva
- Trocar SQLite (dev) por PostgreSQL em produção
- Deploy: backend + frontend via Docker, como você já faz nas LPs
