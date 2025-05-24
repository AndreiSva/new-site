import * as THREE from 'three';

import basicVertexShader from "./shaders/basic.v.glsl?raw";
import metaballsFragmentShader from "./shaders/metaballs.f.glsl?raw";

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
  pos: THREE.Vector2 = new THREE.Vector2(0, 0);
  x: number = 0;
  y: number = 0;
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }
}

class MovingObject extends GameObject {
  weight: number = 1;
  vel: THREE.Vector2 = new THREE.Vector2(0, 0);
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

class Ball extends MovingObject {
  r: number
  constructor(x: number, y: number, r: number) {
    super(x, y, 1);
    this.r = r;
  }

  collidingWith(other: Ball) {
    return Math.sqrt((other.x - this.x)**2 + (other.y - this.y)**2) <= other.r + this.r;
  }
}

class BouncyBallsManager extends Actor {
#balls: Ball[] = [];
#sizeX: number;
#sizeY: number;
  mesh: THREE.Mesh;
#material: THREE.ShaderMaterial;
#gameState: GameState;
#maxBalls: number;
  constructor(gameState: GameState, sizeX: number, sizeY: number, maxBalls: number = 1000) {
    super();
    this.#sizeX = sizeX;
    this.#sizeY = sizeY;
    this.#maxBalls = maxBalls;

    const ballsUniformArray = Array.from(
      { length: maxBalls },
      () => new THREE.Vector3(0, 0, 0)
    );

    const geometry = new THREE.PlaneGeometry(sizeX, sizeY);
    this.#material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: {
        balls: { value: ballsUniformArray },
        size: { value: new THREE.Vector2(sizeX, sizeY) }
      },

      defines: {
        MAX_BALLS: maxBalls,
      },

      vertexShader: basicVertexShader,
      fragmentShader:metaballsFragmentShader
    });

    this.mesh = new THREE.Mesh(geometry, this.#material);
    this.mesh.position.x = this.#sizeX / 2;
    this.mesh.position.y = this.#sizeY / 2

    this.#gameState = gameState;
    super.addUpdateCallback(() => this.bounceCheck());
    super.addUpdateCallback(() => this.updateMaterial());
  }

  updateMaterial() {
    for (let i = 0; i < this.#balls.length; i++) {
      let currentBall: THREE.Vector3 = this.#material.uniforms.balls.value[i];

      currentBall.x = this.#balls[i].x;
      currentBall.y = this.#balls[i].y;
      currentBall.z = this.#balls[i].r;
    }
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
    if (this.#balls.length >= this.#maxBalls) {
      return;
    }

    this.#balls.push(ball);
    this.#gameState.addActor(ball);
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
  gameState.scene.add(ballManager.mesh);

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
