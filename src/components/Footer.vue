<template>
  <footer class="footer padding-top-4-1 padding-bottom-4-1 textAlign-center">
    <p class="copyright fontSize-small">Quasi &copy; <span>2017 {{ toCurrentYear }}</span></p>
  </footer>
</template>

<script>
  export default {
    computed: {
      toCurrentYear() {
        const d = new Date().getFullYear()

        // Display "2017 – 2018" if year is e.g. 2018
        if (d > 2017) {
          return "– " + d
        } else {
          return "";
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~styles/global';

  .copyright {
    color: $color-brandDark-lighter-3;
  }
</style>
