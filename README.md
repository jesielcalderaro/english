# English Road

App de leitura em inglês com flashcards, sequência de dias e histórias do dia.

## Rodar localmente

Pré-requisito: [Node.js](https://nodejs.org) instalado (versão 18+).

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente `http://localhost:5173`).

## O que muda em relação à versão do Claude

O app original usava `window.storage`, uma API que só existe dentro do Claude.
Aqui ela foi recriada em `src/storage.js` usando `localStorage` do navegador —
o componente `EnglishRoad.jsx` não precisou de nenhuma alteração.

**Importante:** os dados (progresso, flashcards) ficam salvos só no navegador
e no dispositivo onde você usar o app. Se abrir em outro computador ou limpar
os dados do navegador, o progresso não estará lá. Se no futuro você quiser
sincronizar entre dispositivos, será preciso trocar `src/storage.js` por
chamadas a um backend real (ex: Supabase, Firebase, ou uma API própria).

## Colocar online (deploy)

Opção mais simples — **Vercel** ou **Netlify**, ambos gratuitos para uso pessoal:

1. Crie um repositório no GitHub e suba esta pasta
2. Acesse vercel.com (ou netlify.com), faça login com GitHub
3. Selecione "New Project" / "Add new site" e escolha o repositório
4. Configuração de build (geralmente detectado automaticamente):
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
5. Deploy — em ~1 minuto você recebe uma URL pública (ex: `english-road.vercel.app`)

Alternativa sem GitHub: rode `npm run build` localmente, isso gera a pasta
`dist/`, e arraste essa pasta direto na área de upload do Netlify
(netlify.com/drop) — fica no ar em segundos.

## Adicionar novas histórias

As histórias ficam no array `STORIES`, no topo de `src/EnglishRoad.jsx`.
Para adicionar Noé ou José, basta seguir o mesmo formato (título, parágrafos,
lista de vocabulário `[palavra, tradução]`).
