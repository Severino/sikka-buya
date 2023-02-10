<template>
  <footer>
    <div class="content-wrapper grid col-3">
      <div></div>
      <div>© 2023</div>
      <div>
        <ul>
          <li>
            <router-link> Mitarbeiter Login</router-link>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style lang="scss"  scoped>
footer {
  font-size: $large-font;
  padding: $big-padding 0;
  color: white;
  margin-top: 10rem;
  min-height: 500px;
  background-color: $gray;

  > * {
    text-align: center;
  }
}
</style>