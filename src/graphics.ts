import * as THREE from 'three';

class Actor {
#updateCalls: ((dt: number) => void)[] = [];
  addUpdateCallback(newCallBack: (dt: number) => void) {
    this.#updateCalls.push(newCallBack);
  }

  update(dt: number) {
    this.#updateCalls.forEach((e) => {
      e(dt);
    });
  }
}

class GameState {
#actors: Actor[] = [];
#scene: THREE.Scene;
  constructor(scene: THREE.Scene) {
    this.#scene = scene;
  }

  get scene() {
    return this.#scene;
  }

  addActor(newActor: Actor) {
    this.#actors.push(newActor);
  }

  update(dt: number) {
    this.#actors.forEach((actor) => {
      actor.update(dt);
    });
  }
}

class GameObject extends Actor {
  x: number = 0;
  y: number = 0;
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }
}

class FallingObject extends GameObject {
  weight: number = 1;
  xvel: number = 0;
  yvel: number = 0;
  constructor(x: number, y: number, weight: number) {
    super(x, y);
    this.weight = weight;
    this.addUpdateCallback((dt) => {
      this.x += this.xvel * dt;
      this.y += this.yvel * dt;
    });
  }
}

class Ball extends FallingObject {
  mesh: THREE.Mesh;
  r: number
  constructor(x: number, y: number, r: number) {
    super(x, y, 1);
    this.r = r;

    const SEGMENTS: number = 32;
    const geometry = new THREE.CircleGeometry(r, SEGMENTS);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.mesh = new THREE.Mesh(geometry, material);

    this.addUpdateCallback(() => this.updateMesh());
  }

  updateMesh() {
    this.mesh.position.x = this.x;
    this.mesh.position.y = this.y;
  }

  collidingWith(other: Ball) {
    return Math.sqrt((other.x - this.x)**2 + (other.y - this.y)**2) <= other.r + this.r;
  }
}

class BouncyBallsManager extends Actor {
#balls: Ball[] = [];
#sizeX: number;
#sizeY: number;
#gameState: GameState;
  constructor(gameState: GameState, sizeX: number, sizeY: number) {
    super();
    this.#sizeX = sizeX;
    this.#sizeY = sizeY;
    this.#gameState = gameState;
    super.addUpdateCallback(() => this.bounceCheck());
  }

  bounceCheck() {
    for (let i = 0; i < this.#balls.length; i++) {
      let currentBall = this.#balls[i];

      const WINDOW_BUFFER = 50;
      if (currentBall.x + currentBall.r > this.#sizeX + WINDOW_BUFFER) {
        currentBall.xvel *= -1;
        currentBall.x = this.#sizeX + WINDOW_BUFFER - currentBall.r;
      } else if (currentBall.x - currentBall.r < 0 - WINDOW_BUFFER) {
        currentBall.xvel *= -1;
        currentBall.x = currentBall.r - WINDOW_BUFFER;
      }

      if (currentBall.y + currentBall.r > this.#sizeY + WINDOW_BUFFER) {
        currentBall.yvel *= -1;
        currentBall.y = this.#sizeY + WINDOW_BUFFER - currentBall.r;
      } else if (currentBall.y - currentBall.r < 0 - WINDOW_BUFFER) {
        currentBall.yvel *= -1;
        currentBall.y = currentBall.r - WINDOW_BUFFER;
      }
    }
  }

  addBall(ball: Ball) {
    this.#balls.push(ball);
    this.#gameState.addActor(ball);
    this.#gameState.scene.add(ball.mesh);
  }

  addRandomBall() {
    function getRandomInt(min: number, max: number) {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    }

    const x = getRandomInt(10, window.innerWidth);
    const y = getRandomInt(10, window.innerHeight);
    const r = getRandomInt(10, 100);
    let newBall = new Ball(x, y, r);

    const MAX_VEL = 15;
    newBall.xvel = getRandomInt(-MAX_VEL, MAX_VEL);
    newBall.yvel = getRandomInt(-MAX_VEL, MAX_VEL);
    this.addBall(newBall);
  }
}

export function initGraphics() {
  const scene = new THREE.Scene();

  const gameState = new GameState(scene);
  const ballManager = new BouncyBallsManager(gameState, window.innerWidth, window.innerHeight);
  gameState.addActor(ballManager);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const camera = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -1000, 1000);
  camera.position.set(0, 0, 1);
  camera.updateProjectionMatrix();

  let canvas: HTMLCanvasElement = renderer.domElement;
  canvas.style.position = "absolute";
  canvas.style.zIndex = "-1";
  canvas.style.top = "0px";
  document.body.appendChild(canvas);

  const numBalls = (window.innerWidth * window.innerHeight) / 20000;
  for (let i = 0; i < numBalls; i++) {
    ballManager.addRandomBall();
  }

  const clock = new THREE.Clock();
  function animate() {
    let dt = clock.getDelta();
    // clamp dt
    dt = Math.min(dt, 1/30)
    gameState.update(dt);
    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);
}
