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

## Como rodar via Portainer (recomendado pra você)

1. Suba o projeto no seu GitHub (veja seção de Git mais abaixo, se ainda não fez)
2. No Portainer: **Stacks** → **Add stack** → método **Repository**
3. Cole a URL do repositório. Se for privado, preencha usuário/token do GitHub no campo de autenticação
4. Em **Compose path**, deixe `docker-compose.yml`
5. Na seção **Environment variables**, cole o conteúdo do arquivo `.env.example` da raiz, preenchido com seus valores reais (chave do Grok, token do GitHub, seu número de WhatsApp, domínios)
6. Clique em **Deploy the stack**
7. Pra escanear o QR code do WhatsApp na primeira vez: vá no container `websec-bot` → aba **Logs**, o QR aparece ali em texto (ASCII), escaneie com o WhatsApp do celular
8. Rode o seed uma vez: no container `websec-backend`, use o **Console** do Portainer (botão `>_`) e execute `node src/db/seed.js`

Sempre que atualizar o código no GitHub, no Portainer basta ir na stack e clicar em **Pull and redeploy** (ou **Update the stack**) pra puxar a versão nova.

## Como rodar com Docker Compose puro (linha de comando)

## Como rodar localmente sem Docker (desenvolvimento)

1. `cd backend && npm install && npm run dev` — sobe a API na porta 3001
2. `cd frontend && npm install && npm run dev` — sobe a página na porta 3000
3. `cd bot && npm install && npm start` — conecta o bot (vai pedir scan de QR code na primeira vez)

## Variáveis de ambiente necessárias

Veja o arquivo `.env.example` na raiz do projeto — ele lista todas as variáveis que o `docker-compose.yml` espera (Grok, GitHub, WhatsApp, domínios). No Portainer, cole o conteúdo direto na seção de environment variables da stack.

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
