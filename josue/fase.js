
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
  { x: 1510, label: "Hora da festa", value: "17h" },
  { x: 2150, label: "Local da festa", value: "Praça do Meio do Mundo · Macapá" },
];

const HEIGHT = 224;
const MIN_VIEW_WIDTH = 224;
const PARK_START = 2260;
const PAVING_START = 2652;
const FINISH = 2744;
const GOAL_POST = FINISH - 53;
const WORLD_END = 3500;
const RUN_TOP = 224;
const RUN_ACCEL = 88;
const AIR_ACCEL = 102;
const RUN_BRAKE = 385;
const GROUND_FRICTION = 164;
const AIR_FRICTION = 67;
const DASH_MIN = 280;
const DASH_MAX = 390;
const DASH_CHARGE_TIME = .78;
const DASH_BRAKE = 615;
const DASH_FRICTION = 159;
const TERRAIN = [
  [0, 192], [230, 192], [340, 179], [514, 179], [642, 195],
  [802, 195], [916, 177], [1100, 177], [1305, 196], [1452, 196],
  [1588, 181], [1770, 181], [1896, 167], [2118, 167], [2262, 191],
  [2330, 187], [WORLD_END, 187],
];
const LEDGES = [
  { x: 755, width: 95, y: 161 },
  { x: 1195, width: 66, y: 144 },
  { x: 1770, width: 83, y: 138 },
];
const PLANTS = [
  [119, "palm"], [181, "flower"], [263, "sunflower"], [350, "smallPalm"],
  [573, "flower"], [645, "palm"], [702, "sunflower"], [849, "smallPalm"],
  [1025, "palm"], [1086, "flower"], [1296, "smallPalm"], [1360, "palm"],
  [1433, "sunflower"], [1581, "flower"], [1667, "palm"], [1761, "flower"],
  [1958, "smallPalm"], [2068, "palm"], [2232, "sunflower"],
];
const PARK_ART = {
  monument: [8, 5, 40, 135],
  letters: [57, 35, 166, 52],
  playground: [236, 14, 117, 94],
  macaw: [12, 146, 71, 91],
  turtle: [110, 160, 70, 74],
  birds: [215, 160, 76, 72],
};
const PARK_OBJECTS = [
  { x: 2841, sprite: "monument", scale: .94, setback: 19 },
  { x: 2333, sprite: "birds", scale: .74, setback: 12 },
  { x: 2460, sprite: "playground", scale: 1.2, setback: 12 },
  { x: 2569, sprite: "turtle", scale: .84, setback: 10 },
  { x: 2656, sprite: "macaw", scale: .86, setback: 14 },
  { x: 2790, sprite: "letters", scale: 1, setback: 20 },
  { x: 2960, sprite: "birds", scale: .68, setback: 15 },
];
const PARK_LAMPS = [2293, 2398, 2616, 2701, 2895, 3051, 3244, 3399];
const PARK_SKY = [
  "#111746", "#1a215b", "#282a70", "#3b337f",
  "#573986", "#714589", "#91518e", "#b96796",
  "#d48098", "#ef9b9b", "#f7b699", "#ffd1a0",
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
const dashButton = byId("dash");
const progressMarks = [...hud.querySelectorAll(".hud-progress i")];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const atlas = new Image();
atlas.src = "assets/atlas.png";
const landscape = new Image();
landscape.src = "assets/green-hill.png";
const parkAtlas = new Image();
parkAtlas.src = "assets/praca-sprites.png";

function soundFile(path, volume, loop = false) {
  const audio = new Audio(path);
  audio.preload = "none";
  audio.volume = volume;
  audio.loop = loop;
  return audio;
}
const music = soundFile("assets/green-hill.ogg", .36, true);
music.preload = "auto";
const sounds = {
  ring: soundFile("assets/argola.wav", .46),
  jump: soundFile("assets/salto.wav", .24),
  dash: soundFile("assets/spin-dash.wav", .32),
  clear: soundFile("assets/chegada.wav", .31),
};

const keys = new Set();
const pointers = new Map();
let soundOn = true;
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
let dashStartedAt = null;
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
  player = { x: 52, y: floorAt(52), vx: 0, vy: 0, facing: 1, base: "floor", animation: 0, spinning: false };
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

function keepMusicPlaying() {
  if (music.paused) playAudio(music);
}

function start() {
  keepMusicPlaying();
  enterFullscreen();
  resetPlayer();
  byId("clue").classList.remove("show");
  byId("clue-label").textContent = "";
  byId("clue-text").textContent = "";
  setState("playing");
  stage.focus({ preventScroll: true });
}

function clearInput() {
  keys.clear();
  pointers.clear();
  jumpQueued = false;
  cancelDash();
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
  player.spinning = false;
  byId("clue").classList.remove("show");
  setState("celebrating");
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
    player.facing = 1;
    player.base = "floor";
    player.spinning = false;
    camera = cameraTarget(.69);
    finishTime = 3;
    burstIndex = FIREWORKS.length;
  }
  setState("finished");
  byId("event-title").focus({ preventScroll: true });
}

function isHeld(input) {
  return keys.has(input) || pointers.has(input);
}

function inputDirection() {
  return Number(isHeld("right")) - Number(isHeld("left"));
}

function dashCharge() {
  return dashStartedAt === null ? 0 : clamp((clock - dashStartedAt) / DASH_CHARGE_TIME, 0, 1);
}

function beginDash() {
  if (!player.base || dashStartedAt !== null) return;
  dashStartedAt = clock;
  player.spinning = false;
}

function cancelDash() {
  if (dashStartedAt === null) return;
  dashStartedAt = null;
  dashButton.style.removeProperty("--dash-fill");
  dashButton.classList.remove("charged");
}

function launchDash() {
  if (dashStartedAt === null) return;
  const charge = dashCharge();
  cancelDash();
  if (!player.base) return;
  player.facing = inputDirection() || player.facing;
  player.vx = player.facing * (DASH_MIN + (DASH_MAX - DASH_MIN) * charge);
  player.spinning = true;
  playAudio(sounds.dash, true);
}

function accelerate(direction, dt) {
  if (dashStartedAt !== null) {
    const charge = dashCharge();
    player.vx = approach(player.vx, 0, DASH_BRAKE * dt);
    dashButton.style.setProperty("--dash-fill", Math.round(charge * 100) + "%");
    dashButton.classList.toggle("charged", charge === 1);
    return;
  }

  if (player.spinning) {
    const braking = player.vx * direction < 0;
    const friction = braking ? RUN_BRAKE : DASH_FRICTION;
    player.vx = approach(player.vx, 0, friction * dt);
    player.spinning = Math.abs(player.vx) > RUN_TOP;
    return;
  }

  let rate = player.base ? GROUND_FRICTION : AIR_FRICTION;
  if (direction) rate = player.base ? RUN_ACCEL : AIR_ACCEL;
  if (player.vx * direction < 0) rate = RUN_BRAKE;
  player.vx = approach(player.vx, direction * RUN_TOP, rate * dt);
}

function movePlayer(dt) {
  const direction = inputDirection();
  if (direction && !player.spinning) player.facing = direction;
  if (isHeld("dash")) beginDash();
  accelerate(direction, dt);

  if (jumpQueued && player.base) {
    cancelDash();
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

  if (!player.base) cancelDash();
  const rolling = dashStartedAt !== null || player.spinning || !player.base;
  player.animation += dt * (rolling ? 25 + dashCharge() * 17 : 3.6 + Math.abs(player.vx) * .087);
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
      if (finishTime >= 2.35) showResult(true);
    }
    while (burstIndex < FIREWORKS.length && FIREWORKS[burstIndex].t <= finishTime) {
      const burst = FIREWORKS[burstIndex++];
      if (!reducedMotion) bursts.push({ ...burst, actualTime: finishTime });
    }
    bursts = bursts.filter((burst) => finishTime - burst.actualTime < 1.24);
  }

  const offset = state === "playing" ? .33 : .69;
  const speed = state === "playing" ? 10 : 5;
  if (state !== "intro") camera += (cameraTarget(offset) - camera) * Math.min(1, dt * speed);
}

function cameraTarget(offset) {
  return clamp(player.x - stage.width * offset, 0, Math.max(0, WORLD_END - stage.width));
}

function sprite(frame, x, y, scale = 1, mirrored = false, sheet = atlas) {
  if (!frame || !sheet.naturalWidth) return;
  const [sx, sy, width, height] = frame;
  const left = Math.round(x - width * scale / 2);
  const top = Math.round(y - height * scale);
  if (mirrored) {
    canvas.save();
    canvas.translate(left + Math.round(width * scale), top);
    canvas.scale(-1, 1);
    canvas.drawImage(sheet, sx, sy, width, height, 0, 0, Math.round(width * scale), Math.round(height * scale));
    canvas.restore();
    return;
  }
  canvas.drawImage(sheet, sx, sy, width, height, left, top, Math.round(width * scale), Math.round(height * scale));
}

function background(cam, offset) {
  const width = stage.width;
  const upperSky = Math.max(1, offset + 4);
  const skyColors = ["#1856c8", "#195ed1", "#1d6ddd", "#2080ed", "#2192f7"];
  skyColors.forEach((color, n) => {
    const start = Math.floor(n * upperSky / skyColors.length);
    const end = Math.ceil((n + 1) * upperSky / skyColors.length);
    canvas.fillStyle = color;
    canvas.fillRect(0, start, width, end - start);
  });
  canvas.fillStyle = skyColors.at(-1);
  canvas.fillRect(0, upperSky, width, stage.height - upperSky);
  if (landscape.naturalWidth) {
    const span = landscape.naturalWidth;
    const skyline = Math.floor(cam * .21) % span;
    const water = Math.floor(cam * .38) % span;
    for (let x = -skyline; x < width; x += span) {
      canvas.drawImage(landscape, 0, 0, span, 153, x, offset, span, 153);
    }
    for (let x = -water; x < width; x += span) {
      canvas.drawImage(landscape, 0, 153, span, HEIGHT - 153, x, offset + 153, span, HEIGHT - 153);
    }
  }

  const blend = clamp((cam + width * .54 - PARK_START + 55) / 152, 0, 1);
  if (blend > 0) {
    canvas.save();
    canvas.globalAlpha = blend;
    drawParkSky(cam, offset);
    canvas.restore();
  }
}

function drawParkSky(cam, offset) {
  const width = stage.width;
  const horizon = Math.round(offset + 154);
  for (let n = 0; n < PARK_SKY.length; n++) {
    const start = Math.floor(n * horizon / PARK_SKY.length);
    const end = Math.ceil((n + 1) * horizon / PARK_SKY.length);
    canvas.fillStyle = PARK_SKY[n];
    canvas.fillRect(0, start, width, end - start);
  }
  canvas.fillStyle = "#5b9561";
  canvas.fillRect(0, horizon, width, stage.height - horizon);
  canvas.fillStyle = "#42685d";
  canvas.fillRect(0, horizon - 5, width, 6);
  canvas.fillStyle = "#aec776";
  canvas.fillRect(0, horizon + 1, width, 3);

  const drift = Math.floor(cam * .18) % 126;
  const season = [45, 72, 48, 57, 37];
  for (let x = -drift - 40, n = 0; x < width + 65; x += 126, n++) {
    const y = Math.round(horizon * .61 + season[n % season.length] * .43);
    canvas.fillStyle = "#ba698f";
    canvas.fillRect(x, y, 60, 5);
    canvas.fillRect(x + 16, y - 4, 28, 7);
    canvas.fillStyle = "#f4aca1";
    canvas.fillRect(x + 6, y - 3, 47, 3);
    canvas.fillRect(x + 17, y - 6, 24, 3);
  }

  const foliage = Math.floor(cam * .39) % 27;
  for (let x = -foliage - 27, n = Math.floor(cam * .39 / 27); x < width; x += 27, n++) {
    const lift = 3 + (n * 7 % 12);
    canvas.fillStyle = "#475261";
    canvas.fillRect(x + 3, horizon - lift, 18, lift);
    canvas.fillRect(x + 7, horizon - lift - 4, 11, 5);
    canvas.fillStyle = "#597269";
    canvas.fillRect(x, horizon - 4, 24, 5);
    canvas.fillRect(x + 5, horizon - lift + 3, 19, 5);
  }
}

function parkSurface(x, y, width, height, worldX) {
  const top = Math.round(y);
  if (worldX < PAVING_START) {
    canvas.fillStyle = worldX % 28 < 14 ? "#52963a" : "#4b8a36";
    canvas.fillRect(x, top, width, height - top);
    canvas.fillStyle = worldX % 16 < 8 ? "#7ed64a" : "#6ab83d";
    canvas.fillRect(x, top, width, 5);
    canvas.fillStyle = "#407f32";
    canvas.fillRect(x, top + 11, width, 3);
    return;
  }

  canvas.fillStyle = "#dec4a5";
  canvas.fillRect(x, top, width, 3);
  const slabs = ["#93879a", "#a99ba7", "#a193a0", "#b3a3a5"];
  const seam = "#6f657f";
  for (let row = 0, destY = top + 3; destY < height; destY += 12, row++) {
    const slab = worldX + row % 2 * 14;
    canvas.fillStyle = slabs[(Math.floor(slab / 24) + row) % slabs.length];
    canvas.fillRect(x, destY, width, 11);
    canvas.fillStyle = seam;
    canvas.fillRect(x, destY + 11, width, 1);
    if (slab % 24 < 4) canvas.fillRect(x, destY, 1, 11);
  }
  if (worldX >= 2810 && worldX < 2818) {
    canvas.fillStyle = "#51435f";
    canvas.fillRect(x, top + 1, width, height - top);
    canvas.fillStyle = "#ffdf92";
    canvas.fillRect(x, top + 1, 1, height - top);
  }
}

function drawParkLamps(cam, viewEnd) {
  for (const worldX of PARK_LAMPS) {
    if (worldX < cam - 18 || worldX > viewEnd) continue;
    const x = Math.round(worldX - cam);
    const y = 173 + (worldX % 4);
    canvas.fillStyle = "#3c4265";
    canvas.fillRect(x, y - 49, 2, 49);
    canvas.fillRect(x - 7, y - 53, 16, 2);
    canvas.fillStyle = "#f6c78f";
    canvas.fillRect(x - 9, y - 53, 6, 2);
    canvas.fillRect(x + 6, y - 53, 6, 2);
    canvas.fillStyle = "#fff1bf";
    canvas.fillRect(x - 8, y - 53, 4, 1);
    canvas.fillRect(x + 7, y - 53, 4, 1);
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

function drawWorld(cam, offset) {
  background(cam, offset);
  canvas.save();
  canvas.translate(0, offset);
  const viewEnd = cam + stage.width + 68;
  const height = stage.height - offset;

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
  if (viewEnd >= PARK_START) {
    drawParkLamps(cam, viewEnd);
    for (const { x, sprite: name, scale, setback } of PARK_OBJECTS) {
      if (x + 90 < cam || x - 25 > viewEnd) continue;
      sprite(PARK_ART[name], x - cam, floorAt(x) - setback, scale, false, parkAtlas);
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
    const y = floorAt(x + 2);
    if (x < PARK_START) terrainStrip(Math.round(x - cam), y, 4, height, x);
    else parkSurface(Math.round(x - cam), y, 4, height, x);
  }
  canvas.restore();
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
    if (!player.base || dashStartedAt !== null || player.spinning) sequence = POSES.roll;
    else if (running > 168) sequence = POSES.dash;
    else if (running > 77) sequence = POSES.run;
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

function drawDashTrail(x, y) {
  if (!player.spinning || reducedMotion) return;
  const trail = Math.floor(clock * 120) % 8;
  const colors = ["#eaf8ff", "#84dcff", "#bbf2ff", "#439eff"];
  for (let n = 0; n < 7; n++) {
    const width = 5 + n % 3 * 4;
    const left = x - player.facing * (19 + n * 5 + trail) - (player.facing === 1 ? width : 0);
    const top = y - 6 - n % 4 * 6;
    canvas.fillStyle = colors[n % colors.length];
    canvas.fillRect(Math.round(left), Math.round(top), width, 1 + n % 2);
  }
}

function drawSign(cam) {
  const x = GOAL_POST - cam;
  if (x < -30 || x > stage.width + 30) return;
  let frame = 0;
  if (finishTime >= .88) frame = 3;
  else if (finishTime) frame = SIGN_FRAMES[Math.floor(finishTime * 17) % SIGN_FRAMES.length];
  sprite(ART.sign[frame], x, floorAt(GOAL_POST) + 1, .83);
}

function drawBursts() {
  for (const burst of bursts) {
    const age = finishTime - burst.actualTime;
    const width = stage.width;
    const x = width * burst.x;
    const y = Math.max(12, Math.round(stage.height * .05)) + burst.y * .88 + age * age * 18;
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
  const reserve = clamp(Math.round(stage.height * .071), 17, 29);
  const offset = stage.height - HEIGHT - reserve;

  if (state === "intro") {
    const introCamera = 76;
    drawWorld(introCamera, offset);
    canvas.save();
    canvas.translate(0, offset);
    const heroX = stage.width * (stage.height > stage.width ? .55 : .76);
    const ground = floorAt(introCamera + heroX);
    drawRing(heroX - 53, ground - 62, clock + .3, 1.35);
    drawRing(heroX + 47, ground - 92, clock + .5, 1.35);
    drawRing(heroX + 70, ground - 45, clock + .7, 1.35);
    drawPlayer(heroX, ground, stage.height > stage.width ? 2.2 : 1.85, true);
    canvas.restore();
    return;
  }

  const cam = Math.round(camera);
  drawWorld(cam, offset);
  canvas.save();
  canvas.translate(0, offset);
  drawClues(cam);
  drawSign(cam);
  drawDashTrail(player.x - cam, player.y);
  drawPlayer(player.x - cam, player.y);
  canvas.restore();
  drawBursts();
}

function sizeStage() {
  const { width, height } = stage.getBoundingClientRect();
  if (!(width > 0 && height > 0)) return;
  const ratio = width / height;
  const logicalWidth = Math.max(MIN_VIEW_WIDTH, Math.round(HEIGHT * ratio));
  const logicalHeight = Math.max(HEIGHT, Math.round(logicalWidth / ratio));
  if (stage.width !== logicalWidth) stage.width = logicalWidth;
  if (stage.height !== logicalHeight) stage.height = logicalHeight;
  canvas.imageSmoothingEnabled = false;
}

function fullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement;
}

function enterFullscreen() {
  if (fullscreenElement()) return;
  try {
    if (arcade.requestFullscreen) {
      arcade.requestFullscreen({ navigationUI: "hide" })?.catch(() => {});
    } else {
      arcade.webkitRequestFullscreen?.();
    }
  } catch {
    // The game already fills the available viewport in embedded browsers.
  }
}

const fullscreenButton = byId("full");
fullscreenButton.hidden = !(arcade.requestFullscreen || arcade.webkitRequestFullscreen)
  || (document.fullscreenEnabled === false && !document.webkitFullscreenEnabled);
fullscreenButton.addEventListener("click", () => {
  if (!fullscreenElement()) {
    keepMusicPlaying();
    enterFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen()?.catch(() => {});
  } else {
    document.webkitExitFullscreen?.();
  }
});

function onFullscreenChange() {
  const active = Boolean(fullscreenElement());
  fullscreenButton.setAttribute("aria-pressed", String(active));
  fullscreenButton.setAttribute("aria-label", active ? "Sair da tela cheia" : "Tela cheia");
  sizeStage();
}
document.addEventListener("fullscreenchange", onFullscreenChange);
document.addEventListener("webkitfullscreenchange", onFullscreenChange);
window.visualViewport?.addEventListener("resize", sizeStage);

const keyboard = {
  ArrowLeft: "left", KeyA: "left",
  ArrowRight: "right", KeyD: "right",
  Space: "jump", ArrowUp: "jump", KeyW: "jump",
  ShiftLeft: "dash", ShiftRight: "dash",
};

window.addEventListener("keydown", (event) => {
  const input = keyboard[event.code];
  if (!input || state !== "playing" || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target instanceof Element && event.target.closest("a, button") && event.code === "Space") return;
  event.preventDefault();
  keys.add(input);
  if (event.repeat) return;
  if (input === "jump") jumpQueued = true;
  if (input === "dash") beginDash();
});
window.addEventListener("keyup", (event) => {
  const input = keyboard[event.code];
  if (keys.delete(input) && input === "dash" && !isHeld("dash")) launchDash();
});
window.addEventListener("blur", clearInput);

for (const button of controlButtons) {
  const input = button.dataset.input;
  button.addEventListener("pointerdown", (event) => {
    if (state !== "playing" || pointers.has(input) || (event.pointerType !== "touch" && event.button !== 0)) return;
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    pointers.set(input, event.pointerId);
    button.classList.add("active");
    if (input === "jump") jumpQueued = true;
    if (input === "dash") beginDash();
  });
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
    button.addEventListener(type, (event) => {
      if (pointers.get(input) !== event.pointerId) return;
      pointers.delete(input);
      button.classList.remove("active");
      if (input === "dash" && !isHeld("dash")) {
        if (type === "pointerup") launchDash();
        else cancelDash();
      }
    });
  }
  button.addEventListener("click", (event) => {
    if (event.detail || state !== "playing") return;
    if (input === "jump") {
      jumpQueued = true;
    } else if (input === "dash") {
      beginDash();
      launchDash();
    } else {
      player.facing = input === "right" ? 1 : -1;
      player.vx = player.facing * 98;
    }
  });
}

byId("sound").addEventListener("click", () => {
  soundOn = !soundOn;
  byId("sound").setAttribute("aria-pressed", String(soundOn));
  byId("sound").setAttribute("aria-label", soundOn ? "Desligar som" : "Ativar som");
  if (soundOn) {
    keepMusicPlaying();
  } else {
    music.pause();
    Object.values(sounds).forEach((effect) => effect.pause());
  }
});

document.addEventListener("visibilitychange", () => {
  clearInput();
  if (!document.hidden && state !== "intro") keepMusicPlaying();
});
arcade.addEventListener("contextmenu", (event) => {
  if (event.target instanceof Element && event.target.closest("#controls, #stage")) event.preventDefault();
});
byId("skip").addEventListener("click", () => {
  keepMusicPlaying();
  showResult(false);
});
byId("gifts").addEventListener("click", () => {
  byId("gift-panel").showModal();
});
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
