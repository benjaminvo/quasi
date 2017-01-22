<template>
  <footer class="footer padding-top-4-1 padding-bottom-4-1 textAlign-center">
    <p class="copyright fontSize-small">Quasi &copy; <span>2017 {{ toCurrentYear }}</span></p>
  </footer>
</template>

<script>
  export default {
    name: 'Footer',
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

  .footer {
    border-top: 1px solid $color-brandGrey-lighter-5;
  }

  .copyright {
    color: $color-brandDark-lighter-3;
  }
</style>
