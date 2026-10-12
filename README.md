# Valentina faz 2 🍓

Convite interativo do aniversário de 2 anos da Valentina, tema Moranguinho.
Sábado, 17 de outubro, às 19h30.

## O que tem no convite

- O vídeo animado (`convite.mp4`) logo no topo, com botão pra tocar com som
- Bolo com duas velinhas pra assoprar com o dedo (toca "Parabéns pra você" quando as duas apagam)
- Contagem regressiva até a festa
- A Moranguinho no rodapé acenando, piscando e com o chapéu balançando (toque nela!)
- Data, horário e botão pra salvar na agenda

## Onde trocar as informações

Tudo fica no bloco `FESTA`, no começo do `<script>` do `index.html`:

```js
const FESTA = {
  nome: "Valentina",
  inicio: "2026-10-17T19:30:00-03:00",
  fim: "",                 // deixe "" pra não mostrar horário de término
  comida: "...",           // deixe "" pra esconder
  assinatura: "..."
};
```

## Publicar no GitHub Pages

1. Settings → Pages
2. Em "Branch", escolha `main` e a pasta `/ (root)`, depois Save
3. Em um ou dois minutos o convite fica em
   `https://fliparaujor.github.io/aniversario-valentina-2-anos/`

## Vídeo (Remotion)

Convite em vídeo de 20 segundos, vertical 1080x1920, pra Story e status do WhatsApp.
Fica na pasta `video/`.

- Textos do vídeo: `video/src/festa.ts`
- Camadas da Moranguinho: `video/public/moranguinho/`
- Trilha e efeitos sonoros são sintetizados por `video/scripts/trilha.py`
  (valsa com "Parabéns pra você", melodia em domínio público)

```bash
cd video
npm install
python3 scripts/trilha.py   # só se quiser regerar o áudio
npm run studio              # abre o editor no navegador
npm run render              # gera out/convite-valentina.mp4
```

Pra trocar o vídeo do convite depois de renderizar de novo:

```bash
ffmpeg -i video/out/convite-valentina.mp4 -vf scale=720:1280 -c:v libx264 -crf 25 -preset slow \
  -movflags +faststart -c:a aac -b:a 128k convite.mp4
```

`previa.png` é a imagem que aparece quando o link do convite é colado no WhatsApp.
Pra regerar: `cd video && npx remotion still Previa ../previa.png`.
