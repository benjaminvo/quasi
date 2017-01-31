<template>
  <div class="appContainer" :authenticated="authenticated">
    <app-header :currentUser="currentUser" />
    <router-view :databaseRef="database" :currentUser="currentUser" />
    <app-footer />
  </div>
</template>

<script>
  import Header from 'components/Header'
  import Footer from 'components/Footer'
  export default {
    name: 'App',
    components: {
      'app-header': Header,
      'app-footer': Footer
    },
    props: {
      authenticated: { type: Boolean },
      currentUser: { type: Object },
      database: { type: Object }
    }
  }
</script>

<style lang="scss">
  @import './styles/main';

  .appContainer {
    height: 100%;
    width: 100%;
  }

</style>
