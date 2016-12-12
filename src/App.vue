<template>
  <div class="app">
    <app-header />
    <router-view />
  </div>
</template>

<script>
  import Header from 'components/Header'
  export default {
    components: { 'app-header': Header }
  }
</script>

<style lang="scss">
  @import './styles/reset';
  @import './styles/global';
  @import './styles/helpers';

  .app {
    min-height: 100%;
    width: 100%;
    background: lighten($color-brandLight, 4%);
  }
</style>
