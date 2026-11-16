
"use strict";

const ART = {
  sonic: {
    "0": [9,9,29,39], "1": [57,10,30,38], "2": [105,10,30,38], "3": [153,10,30,38],
    "4": [201,10,30,38], "7": [252,11,24,37], "8": [294,11,36,37], "9": [345,10,29,38],
    "10": [10,59,27,37], "11": [53,59,37,37], "12": [104,58,32,38], "19": [152,60,31,36],
    "20": [201,61,30,35], "21": [248,60,31,36], "22": [296,61,31,35], "23": [341,64,38,32],
    "24": [4,113,39,31], "25": [52,112,39,32], "26": [100,113,39,31], "29": [153,114,29,30],
    "30": [201,115,30,29], "31": [249,114,29,30], "32": [297,115,30,29], "33": [345,114,30,30],
  },
  ring: {
    "0": [2,146,16,16], "1": [24,146,12,16], "2": [47,146,6,16], "3": [64,146,12,16],
    "5": [82,148,16,14], "6": [102,148,16,14], "7": [122,148,16,14], "10": [142,148,16,14],
  },
  sign: {
    "0": [1,166,48,48], "1": [59,166,32,48], "2": [121,166,8,48], "3": [151,166,48,48],
  },
  world: {
    "grass": [0,220,62,26], "dirt": [64,220,32,32], "palm": [204,148,37,97], "smallPalm": [245,147,39,80],
    "sunflower": [289,147,32,81], "flower": [325,147,28,49], "loop": [384,0,128,126],
  },
};

const CLUES = [
  { x: 423, label: "Aniversariante", value: "Josué" },
  { x: 940, label: "Dia da festa", value: "Domingo, 22 de novembro" },
  { x: 1510, label: "Hora da festa", value: "17h30" },
  { x: 2150, label: "Local da festa", value: "Praça do Meio do Mundo · Macapá" },
];

const HEIGHT = 224;
const FINISH = 2635;
const WORLD_END = 3230;
const TERRAIN = [
  [0, 192], [230, 192], [340, 179], [514, 179], [642, 195],
  [802, 195], [916, 177], [1100, 177], [1305, 196], [1452, 196],
  [1588, 181], [1770, 181], [1896, 167], [2118, 167], [2262, 191],
  [2475, 191], [2584, 188], [WORLD_END, 188],
];
const LEDGES = [
  { x: 755, width: 95, y: 161 },
  { x: 1195, width: 66, y: 144 },
  { x: 1770, width: 83, y: 138 },
  { x: 2288, width: 70, y: 158 },
];
const PLANTS = [
  [119, "palm"], [181, "flower"], [263, "sunflower"], [350, "smallPalm"],
  [573, "flower"], [645, "palm"], [702, "sunflower"], [849, "smallPalm"],
  [1025, "palm"], [1086, "flower"], [1296, "smallPalm"], [1360, "palm"],
  [1433, "sunflower"], [1581, "flower"], [1667, "palm"], [1761, "flower"],
  [1958, "smallPalm"], [2068, "palm"], [2249, "sunflower"], [2375, "palm"],
  [2483, "flower"], [2573, "palm"], [2863, "smallPalm"], [2945, "flower"],
  [3035, "palm"], [3178, "sunflower"],
];
const POSES = {
  idle: [0, 0, 0, 0, 0, 1, 2, 3, 4, 3, 2, 1],
  walk: [7, 8, 9, 10, 11, 12],
  run: [19, 20, 21, 22],
  dash: [23, 24, 25, 26],
  roll: [29, 30, 31, 32, 33],
};
const RING_FRAMES = [0, 1, 2, 3];
const SPARKLE_FRAMES = [5, 6, 7, 10];
const SIGN_FRAMES = [0, 1, 2, 1, 3, 1, 2, 1];
const FIREWORKS = [
  { t: .14, x: .52, y: 67, color: "#ffe270" },
  { t: .43, x: .84, y: 39, color: "#7edbff" },
  { t: .70, x: .69, y: 106, color: "#ff7d9e" },
  { t: 1.02, x: .30, y: 65, color: "#f4ffff" },
  { t: 1.36, x: .85, y: 78, color: "#ffe270" },
  { t: 1.60, x: .59, y: 42, color: "#ddadff" },
  { t: 1.86, x: .76, y: 68, color: "#7edbff" },
];

const byId = (id) => document.getElementById(id);
const arcade = byId("arcade");
const stage = byId("stage");
const canvas = stage.getContext("2d", { alpha: false });
const hud = byId("hud");
const controls = byId("controls");
const controlButtons = [...controls.querySelectorAll("[data-input]")];
const progressMarks = [...hud.querySelectorAll(".hud-progress i")];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const atlas = new Image();
atlas.src = "assets/atlas.png";
const landscape = new Image();
landscape.src = "assets/green-hill.png";

function soundFile(path, volume, loop = false) {
  const audio = new Audio(path);
  audio.preload = "none";
  audio.volume = volume;
  audio.loop = loop;
  return audio;
}
const music = soundFile("assets/green-hill.ogg", .36, true);
const sounds = {
  ring: soundFile("assets/argola.wav", .46),
  jump: soundFile("assets/salto.wav", .24),
  clear: soundFile("assets/chegada.wav", .43),
};

const keys = new Set();
const pointers = new Map();
let soundOn = false;
let state = "intro";
let player;
let camera = 0;
let revealUntil = 0;
let clock = 0;
let finishTime = 0;
let finishFrom = 0;
let burstIndex = 0;
let bursts = [];
let jumpQueued = false;
let collectibles = [];
let count = 0;

function clamp(number, min, max) {
  return Math.min(max, Math.max(min, number));
}

function approach(current, target, amount) {
  const distance = target - current;
  return current + clamp(distance, -amount, amount);
}

function floorAt(x) {
  const value = clamp(x, 0, WORLD_END);
  for (let index = 1; index < TERRAIN.length; index++) {
    const [to, level] = TERRAIN[index];
    if (value <= to) {
      const [from, start] = TERRAIN[index - 1];
      return start + (level - start) * ((value - from) / (to - from));
    }
  }
  return TERRAIN.at(-1)[1];
}

function resetPlayer() {
  player = { x: 52, y: floorAt(52), vx: 0, vy: 0, facing: 1, base: "floor", animation: 0 };
  collectibles = CLUES.map((clue) => ({ ...clue, collectedAt: null }));
  camera = 0;
  clock = 0;
  finishTime = 0;
  burstIndex = 0;
  bursts = [];
  revealUntil = 0;
  count = 0;
  clearInput();
  updateHud();
}

function updateHud() {
  byId("ring-count").textContent = count + "/" + CLUES.length;
  progressMarks.forEach((mark, index) => mark.classList.toggle("on", index < count));
}

function setState(next) {
  state = next;
  arcade.dataset.state = next;
  byId("intro").hidden = next !== "intro";
  byId("help").hidden = next !== "intro";
  controls.hidden = next !== "playing";
  hud.hidden = !["playing", "celebrating"].includes(next);
  byId("skip").hidden = !["intro", "playing"].includes(next);
  byId("result").hidden = next !== "finished";
  byId("actions").hidden = next !== "finished";
}

function playAudio(audio, restart = false) {
  if (!soundOn) return;
  if (restart) audio.currentTime = 0;
  audio.play().catch(() => {});
}

function start() {
  resetPlayer();
  byId("clue").classList.remove("show");
  byId("clue-label").textContent = "";
  byId("clue-text").textContent = "";
  setState("playing");
  stage.focus({ preventScroll: true });
  playAudio(music, true);
}

function clearInput() {
  keys.clear();
  pointers.clear();
  jumpQueued = false;
  controlButtons.forEach((button) => button.classList.remove("active"));
}

function showClue(clue) {
  clue.collectedAt = clock;
  count++;
  updateHud();
  byId("clue-label").textContent = clue.label;
  byId("clue-text").textContent = clue.value;
  byId("clue").classList.add("show");
  revealUntil = clock + 2.8;
  playAudio(sounds.ring, true);
}

function arrive() {
  finishFrom = player.x;
  finishTime = 0;
  clearInput();
  byId("clue").classList.remove("show");
  setState("celebrating");
  music.pause();
  playAudio(sounds.clear, true);
}

function showResult(completed) {
  clearInput();
  byId("clue").classList.remove("show");
  byId("result-kicker").textContent = completed ? "Fase concluída!" : "Você está convidado!";
  if (!completed) {
    player.x = FINISH + 71;
    player.y = floorAt(player.x);
    player.vx = 0;
    player.base = "floor";
    camera = clamp(player.x - stage.width * .75, 0, WORLD_END - stage.width);
    finishTime = 3;
    burstIndex = FIREWORKS.length;
    music.pause();
  }
  setState("finished");
  byId("event-title").focus({ preventScroll: true });
}

function isHeld(input) {
  return keys.has(input) || pointers.has(input);
}

function movePlayer(dt) {
  const direction = Number(isHeld("right")) - Number(isHeld("left"));
  const pace = direction ? (player.base ? 377 : 274) : 492;
  player.vx = approach(player.vx, direction * 164, pace * dt);
  if (direction) player.facing = direction;

  if (jumpQueued && player.base) {
    player.base = null;
    player.vy = -251;
    playAudio(sounds.jump, true);
  }
  jumpQueued = false;
  const oldFeet = player.y;
  player.x = clamp(player.x + player.vx * dt, 19, FINISH + 2);
  const floor = floorAt(player.x);

  if (player.base === "floor") {
    player.y = floor;
  } else if (player.base && player.x >= player.base.x && player.x <= player.base.x + player.base.width) {
    player.y = player.base.y;
  } else {
    player.base = null;
    player.vy += 677 * dt;
    player.y += player.vy * dt;
    if (player.vy >= 0) {
      const ledge = LEDGES.find(({ x, width, y }) =>
        player.x >= x && player.x <= x + width && oldFeet <= y + .5 && player.y >= y,
      );
      if (ledge) {
        player.y = ledge.y;
        player.vy = 0;
        player.base = ledge;
      } else if (player.y >= floor) {
        player.y = floor;
        player.vy = 0;
        player.base = "floor";
      }
    }
  }

  player.animation += dt * (player.base ? 3.6 + Math.abs(player.vx) * .074 : 22);
  for (const clue of collectibles) {
    if (clue.collectedAt === null && player.x >= clue.x - 18) showClue(clue);
  }
  if (player.x >= FINISH) arrive();
}

function update(dt) {
  clock += dt;
  if (state === "playing") movePlayer(dt);
  if (revealUntil && clock >= revealUntil) {
    revealUntil = 0;
    byId("clue").classList.remove("show");
  }

  if (state === "celebrating" || state === "finished") {
    finishTime += dt;
    if (state === "celebrating") {
      const travel = Math.min(1, finishTime / .75);
      player.x = finishFrom + 71 * (1 - (1 - travel) ** 3);
      player.y = floorAt(player.x);
      player.facing = 1;
      player.base = "floor";
      player.vx = travel < 1 ? 113 * (1 - travel) : 0;
      player.animation += dt * (player.vx ? 13 : 3);
      if (finishTime >= 1.45) showResult(true);
    }
    while (burstIndex < FIREWORKS.length && FIREWORKS[burstIndex].t <= finishTime) {
      const burst = FIREWORKS[burstIndex++];
      burst.actualTime = finishTime;
      if (!reducedMotion) bursts.push(burst);
    }
    bursts = bursts.filter((burst) => finishTime - burst.actualTime < 1.24);
  }

  const offset = state === "playing" ? .35 : .75;
  const target = clamp(player.x - stage.width * offset, 0, WORLD_END - stage.width);
  const cameraSpeed = state === "playing" ? 10 : 5;
  if (state !== "intro") camera += (target - camera) * Math.min(1, dt * cameraSpeed);
}

function sprite(frame, x, y, scale = 1, mirrored = false) {
  if (!frame || !atlas.naturalWidth) return;
  const [sx, sy, width, height] = frame;
  const left = Math.round(x - width * scale / 2);
  const top = Math.round(y - height * scale);
  if (mirrored) {
    canvas.save();
    canvas.translate(left + Math.round(width * scale), top);
    canvas.scale(-1, 1);
    canvas.drawImage(atlas, sx, sy, width, height, 0, 0, Math.round(width * scale), Math.round(height * scale));
    canvas.restore();
    return;
  }
  canvas.drawImage(atlas, sx, sy, width, height, left, top, Math.round(width * scale), Math.round(height * scale));
}

function background(cam) {
  canvas.fillStyle = "#217ce9";
  canvas.fillRect(0, 0, stage.width, HEIGHT);
  if (!landscape.naturalWidth) return;
  const span = landscape.naturalWidth;
  const skyline = Math.floor(cam * .21) % span;
  const water = Math.floor(cam * .38) % span;
  for (let x = -skyline; x < stage.width; x += span) {
    canvas.drawImage(landscape, 0, 0, span, 153, x, 0, span, 153);
  }
  for (let x = -water; x < stage.width; x += span) {
    canvas.drawImage(landscape, 0, 153, span, HEIGHT - 153, x, 153, span, HEIGHT - 153);
  }
}

function terrainStrip(x, y, width, height, textureOffset) {
  const top = Math.round(y);
  if (atlas.naturalWidth) {
    const [gx, gy, , grassH] = ART.world.grass;
    const [dx, dy, , dirtH] = ART.world.dirt;
    for (let row = top + grassH; row < height; row += dirtH) {
      canvas.drawImage(atlas, dx + textureOffset % 32, dy, width, dirtH, x, row, width, dirtH);
    }
    const coverH = Math.min(grassH, height - top);
    canvas.drawImage(atlas, gx + textureOffset % 60, gy, width, coverH, x, top, width, coverH);
  } else {
    canvas.fillStyle = textureOffset % 16 < 8 ? "#9b4a04" : "#ca6910";
    canvas.fillRect(x, top, width, height - top);
    canvas.fillStyle = "#59bc22";
    canvas.fillRect(x, top, width, 6);
  }
}

function drawWorld(cam) {
  background(cam);
  const viewEnd = cam + stage.width + 60;

  const loopX = 1248;
  if (loopX > cam - 100 && loopX < viewEnd) {
    sprite(ART.world.loop, loopX - cam, floorAt(loopX) + 23, 1.15);
  }
  for (const [x, plant] of PLANTS) {
    if (x > cam - 56 && x < viewEnd) {
      const scale = plant === "sunflower" ? .46 : plant === "flower" ? .45 : 1;
      sprite(ART.world[plant], x - cam, floorAt(x) + 4, scale);
    }
  }
  for (const ledge of LEDGES) {
    if (ledge.x + ledge.width < cam || ledge.x >= viewEnd) continue;
    for (let step = 0; step < ledge.width; step += 4) {
      terrainStrip(Math.round(ledge.x + step - cam), ledge.y,
        Math.min(4, ledge.width - step), ledge.y + 22, step);
    }
  }

  for (let x = Math.floor(cam / 4) * 4; x < cam + stage.width; x += 4) {
    terrainStrip(Math.round(x - cam), floorAt(x + 2), 4, HEIGHT, x);
  }
}

function drawRing(x, y, animation = clock, scale = 2) {
  const index = reducedMotion ? 0 : Math.floor(animation * 7) % RING_FRAMES.length;
  if (atlas.naturalWidth) {
    sprite(ART.ring[RING_FRAMES[index]], x, y, scale);
    return;
  }
  canvas.strokeStyle = "#ffe768";
  canvas.lineWidth = 3;
  canvas.beginPath();
  canvas.arc(x, y - 8 * scale, 7 * scale, 0, Math.PI * 2);
  canvas.stroke();
}

function drawClues(cam) {
  for (let index = 0; index < collectibles.length; index++) {
    const clue = collectibles[index];
    const x = clue.x - cam;
    if (x < -20 || x > stage.width + 20) continue;
    const floor = floorAt(clue.x);
    if (clue.collectedAt === null) {
      const bob = reducedMotion ? 0 : Math.round(Math.sin(clock * 4 + index) * 3);
      drawRing(x, floor - 7 + bob, clock + index * .08);
    } else {
      const frame = Math.floor((clock - clue.collectedAt) * 13);
      if (frame < SPARKLE_FRAMES.length) sprite(ART.ring[SPARKLE_FRAMES[frame]], x, floor - 6, 2);
    }
  }
}

function drawPlayer(x, y, zoom = 1, intro = false) {
  const running = Math.abs(player.vx);
  let sequence = POSES.idle;
  if (!intro) {
    if (!player.base) sequence = POSES.roll;
    else if (running > 153) sequence = POSES.dash;
    else if (running > 105) sequence = POSES.run;
    else if (running > 9) sequence = POSES.walk;
  }
  const animation = intro ? (reducedMotion ? 0 : clock * 3) : player.animation;
  const frame = sequence[Math.floor(animation) % sequence.length];
  if (atlas.naturalWidth) {
    sprite(ART.sonic[frame], x, y + 1, zoom, player.facing < 0 && !intro);
  } else {
    canvas.fillStyle = "#0732b0";
    canvas.fillRect(Math.round(x - 10), Math.round(y - 30), 20, 27);
    canvas.fillStyle = "#ed3034";
    canvas.fillRect(Math.round(x - 11), Math.round(y - 4), 23, 4);
  }
}

function drawSign(cam) {
  const x = FINISH - cam;
  if (x < -30 || x > stage.width + 30) return;
  let frame = 0;
  if (finishTime >= .88) frame = 3;
  else if (finishTime) frame = SIGN_FRAMES[Math.floor(finishTime * 17) % SIGN_FRAMES.length];
  sprite(ART.sign[frame], x, floorAt(FINISH) + 1);
}

function drawBursts() {
  for (const burst of bursts) {
    const age = finishTime - burst.actualTime;
    const width = stage.width;
    const x = width * burst.x;
    const y = burst.y + age * age * 18;
    canvas.globalAlpha = clamp(1 - age * .82, 0, 1);
    for (let n = 0; n < 23; n++) {
      const angle = n * Math.PI * 2 / 23;
      const radius = (14 + (n % 4) * 8) * Math.min(1.21, age * 1.85);
      canvas.fillStyle = n % 5 === 0 ? "#fffdf4" : burst.color;
      canvas.fillRect(Math.round(x + Math.cos(angle) * radius),
        Math.round(y + Math.sin(angle) * radius), n % 3 ? 2 : 3, n % 3 ? 2 : 3);
    }
  }
  canvas.globalAlpha = 1;
}

function draw() {
  if (state === "intro") {
    drawWorld(76);
    const heroX = stage.width * (stage.width < 285 ? .64 : .76);
    const ground = floorAt(76 + heroX);
    drawRing(heroX - 44, ground - 58, clock + .3, 1.35);
    drawRing(heroX + 43, ground - 82, clock + .5, 1.35);
    drawRing(heroX + 74, ground - 49, clock + .7, 1.35);
    drawPlayer(heroX, ground, 1.8, true);
    return;
  }
  const cam = Math.round(camera);
  drawWorld(cam);
  drawClues(cam);
  drawSign(cam);
  drawPlayer(player.x - cam, player.y);
  drawBursts();
}

function sizeStage() {
  const { width, height } = stage.getBoundingClientRect();
  if (!height) return;
  const logicalWidth = Math.round(HEIGHT * width / height);
  if (stage.width !== logicalWidth) stage.width = logicalWidth;
  canvas.imageSmoothingEnabled = false;
}

const keyboard = {
  ArrowLeft: "left", KeyA: "left",
  ArrowRight: "right", KeyD: "right",
  Space: "jump", ArrowUp: "jump", KeyW: "jump",
};

window.addEventListener("keydown", (event) => {
  const input = keyboard[event.code];
  if (!input || state !== "playing" || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target instanceof Element && event.target.closest("a, button") && event.code === "Space") return;
  event.preventDefault();
  keys.add(input);
  if (input === "jump" && !event.repeat) jumpQueued = true;
});
window.addEventListener("keyup", (event) => keys.delete(keyboard[event.code]));
window.addEventListener("blur", clearInput);

for (const button of controlButtons) {
  const input = button.dataset.input;
  button.addEventListener("pointerdown", (event) => {
    if (state !== "playing" || event.button !== 0) return;
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    pointers.set(input, event.pointerId);
    button.classList.add("active");
    if (input === "jump") jumpQueued = true;
  });
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
    button.addEventListener(type, (event) => {
      if (pointers.get(input) !== event.pointerId) return;
      pointers.delete(input);
      button.classList.remove("active");
    });
  }
  button.addEventListener("click", (event) => {
    if (!event.detail && input === "jump" && state === "playing") jumpQueued = true;
  });
}

byId("sound").addEventListener("click", () => {
  soundOn = !soundOn;
  byId("sound").setAttribute("aria-pressed", String(soundOn));
  byId("sound").setAttribute("aria-label", soundOn ? "Desligar som" : "Ativar som");
  byId("sound-text").textContent = soundOn ? "Som ligado" : "Som desligado";
  if (soundOn && state === "playing") playAudio(music);
  if (!soundOn) {
    music.pause();
    Object.values(sounds).forEach((effect) => effect.pause());
  }
});

document.addEventListener("visibilitychange", () => {
  clearInput();
  if (document.hidden) music.pause();
  else if (state === "playing") playAudio(music);
});
byId("skip").addEventListener("click", () => showResult(false));
byId("start").addEventListener("click", start);
byId("replay").addEventListener("click", start);

resetPlayer();
sizeStage();
if ("ResizeObserver" in window) new ResizeObserver(sizeStage).observe(stage);
else window.addEventListener("resize", sizeStage);

const STEP = 1 / 120;
let last = performance.now();
let elapsed = 0;

function frame(now) {
  elapsed += clamp((now - last) / 1000, 0, .05);
  last = now;
  while (elapsed >= STEP) {
    update(STEP);
    elapsed -= STEP;
  }
  draw();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
