import { createElement } from "../../utils/elements";

const COLS = 16;
const ROWS = 16;
const KEY = {
  LEFT: 37,
  TOP: 38,
  RIGHT: 39,
  BOTTOM: 40,
};

const createCanvas = () => {
  const canvas = createElement("canvas", { className: "game" });
  return canvas;
};

const resize = (canvas, width, height) => {
  canvas.width = width;
  canvas.height = height;
};

const clear = (canvas) => {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const drawPlayer = (canvas, player) => {
  const cellWidth = canvas.width / COLS;
  const cellHeight = canvas.height / ROWS;
  const offsetLeft = player.left * cellWidth;
  const offsetTop = player.top * cellHeight;

  const context = canvas.getContext("2d");
  context.beginPath();
  context.rect(offsetLeft, offsetTop, cellWidth, cellHeight);
  context.fillStyle = "red";
  context.fill();
  context.closePath();
};

const createPlayer = () => {
  return {
    left: COLS / 2,
    top: ROWS / 2,
    length: 1,
    speed: 5, // fields per second
    direction: "RIGHT", // TOP, RIGHT, BOTTOM, LEFT
  };
};

const movePlayer = (player, timeGone) => {
  const positionOffset = (player.speed * timeGone) / 1000;
  switch (player.direction) {
    case "TOP":
      player.top = (player.top - positionOffset) % COLS;
      if (player.top < 0) {
        player.top = ROWS;
      }
      break;
    case "RIGHT":
      player.left = (player.left + positionOffset) % COLS;
      break;
    case "BOTTOM":
      player.top = (player.top + positionOffset) % COLS;
      break;
    case "LEFT":
      player.left = player.left - positionOffset;
      if (player.left < 0) {
        player.left = COLS;
      }
      break;
  }
};

export const createGame = (width, height) => {
  const canvas = createCanvas();
  const player = createPlayer();

  resize(canvas, width, height);

  const startLoop = () => {
    let lastDrawing = Date.now();
    const loop = () => {
      clear(canvas);
      const now = Date.now();
      movePlayer(player, now - lastDrawing);
      drawPlayer(canvas, player);
      lastDrawing = now;

      requestAnimationFrame(loop);
    };
    loop();
  };

  window.addEventListener("keydown", (event) => {
    if (event.keyCode === KEY.TOP) {
      player.direction = "TOP";
      return;
    }
    if (event.keyCode === KEY.RIGHT) {
      player.direction = "RIGHT";
      return;
    }
    if (event.keyCode === KEY.BOTTOM) {
      player.direction = "BOTTOM";
      return;
    }
    if (event.keyCode === KEY.LEFT) {
      player.direction = "LEFT";
      return;
    }
  });

  startLoop();

  return { canvas, player };
};

export const createControls = (game) => {
  const controls = createElement("div", { className: "controls " });
  const faster = createElement("button", {
    innerText: "FASTER!",
    className: "controls__btn",
  });

  faster.addEventListener("click", () => {
    game.player.speed++;
  });

  const slower = createElement("button", {
    innerText: "SLOWER!",
    className: "controls__btn",
  });
  slower.addEventListener("click", () => {
    game.player.speed--;
  });

  controls.append(faster);
  controls.append(slower);
  return controls;
};
