<template>
  <footer>
    <div class="social">
      <a target="_blank" href="https://github.com/3036-pcc">
        <img src="/social/github_white.svg" alt="GitHub" />
      </a>
      <a target="_blank" href="https://www.instagram.com/hoyu_pc" hidden>
        <img src="/social/instagram_white.svg" alt="Instagram" />
      </a>
    </div>
    <p class="copyright">&copy; 朋優学院高等学校 PC部</p>
    <p class="bragging">このウェブサイトはパソコン部の部員によって作成されました。</p>
  </footer>
</template>

<style scoped lang="css">
footer {
  background-color: gray;
  color: white;
  margin-top: 24px;
  padding-top: 16px;
  padding-bottom: 16px;
  width: 100%;
  font-size: 0.75rem;
  border-top: 2px solid var(--color-1);
  box-shadow: 0 0 8px var(--color-2);
}

.social a {
  margin: 0 8px;
}

.social a img {
  width: 3em;
  height: 3em;
  opacity: 50%;
  transition: opacity 250ms;
  padding: 2px;
  margin: 0;
  border: none;
  border-radius: 4px;
  box-shadow: 0 0 2px darkgray;
  background-color: darkgray;

  &:hover {
    opacity: 75%;
  }
}

.copyright {
  margin-top: 12px;
}

.bragging {
  margin-top: 4px;
  font-size: 0.95em;
}
</style>
