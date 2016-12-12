<template>
  <grid-block columns="12" noPadding>
    <ul class="header span-12">
      <router-link :to="{ name: 'texts' }" tag="li" active-class="active" exact>Tekster</router-link>
    </ul>
  </grid-block>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  export default {
    components: { 'grid-block': GridBlock }
  }
</script>

<style lang="scss" scoped>
  @import '~styles/vars';
  .header {
    width: 100%;
    padding: 0;

    li {
      font-family: $fontFamily-headline;
      display: inline-block;
      color: $color-brandDark !important;
      padding: $scale-1-2 $scale;
      text-decoration: none !important;

      &:hover {
        cursor: pointer;
        border-bottom: 3px solid $color-brandLight-darker-1;
      }

      &.active {
        transition: all $animationSpeed $animationBezier;
        border-bottom: 3px solid $color-brandDark;
        font-weight: bold;
      }
    }
  }
</style>
