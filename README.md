# Valentina faz 2 🍓

Convite interativo do aniversário de 2 anos da Valentina, tema Moranguinho.
Sábado, 17 de outubro, às 19h30.

## O que tem no convite

- Envelope que abre com confete quando a pessoa toca
- Bolo com duas velinhas pra assoprar com o dedo (toca "Parabéns pra você" quando as duas apagam)
- Contagem regressiva até a festa
- Data, horário, local, botão pro Google Maps e pra salvar na agenda
- Confirmação de presença que abre o WhatsApp com a mensagem pronta

## Onde trocar as informações

Tudo fica no bloco `FESTA`, no começo do `<script>` do `index.html`:

```js
const FESTA = {
  nome: "Valentina",
  inicio: "2026-10-17T19:30:00-03:00",
  fim: "",                 // deixe "" pra não mostrar horário de término
  local: "...",
  endereco: "...",
  comida: "...",           // deixe "" pra esconder
  whatsapp: "55DDDNUMERO", // só números, com 55 e DDD
  prazoRsvp: "",           // ex.: "até quinta, 15/10"
  assinatura: "..."
};
```

## Publicar no GitHub Pages

1. Settings → Pages
2. Em "Branch", escolha `main` e a pasta `/ (root)`, depois Save
3. Em um ou dois minutos o convite fica em
   `https://fliparaujor.github.io/aniversario-valentina-2-anos/`
