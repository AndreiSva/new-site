import './style.css';
import { initGraphics } from './graphics';

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div class="card small-card">
      <img class="profile-image" src="/ubc.jpg" alt="Image of Andrei" width="150" height="150">
      <h1 class="title">Hello</h1>
      <p class="title subtitle">I'm Andrei, nice to meet you</p>
      <div class="showcase">
        <a href="https://github.com/AndreiSva/">GitHub</a>
        <a>About</a>
        <a>Resumé</a>
      </div>
    </div>

    <div class="card">
      <h2 class="title">Projects</h2>
      <div class="showcase">
        <div class="card">
          <a class="title">Prosperity</a>
        </div>
        <div class="card">
          <a class="title">Continuity</a>
        </div>
        <div class="card">
          <a class="title">mIRCy</a>
        </div>
        <div class="card">
          <a class="title">Websites</a>
        </div>
        <div class="card">
          <a class="title">Photography</a>
        </div>
      </div>
</div>
`;

document.addEventListener("DOMContentLoaded", () => {
  initGraphics();
  console.log("loaded");
})
