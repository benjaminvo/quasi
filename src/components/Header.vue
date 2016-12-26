<template>
  <header class="header">
    <grid-block columns="12" noPadding>
      <div class="header_inner span-12">
        <ul class="header-links span-6">
          <router-link :to="{ name: 'dashboard' }" tag="li" exact>Dashboard</router-link>
        </ul>
        <div class="header-logout span-6">
          <p>Hej {{ currentUser.displayName.substr(0, currentUser.displayName.indexOf(' ')) }}</p>
          <button v-on:click="logout()">Log ud</button>
        </div>
      </div>
    </grid-block>
  </header>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import firebase from 'firebase'
  export default {
    components: { 'grid-block': GridBlock },
    props: { currentUser: { type: Object } },
    methods: {
      logout() {
        firebase.auth().signOut().then( () => {
          window.location.href = '/auth.html'
        }, function(error) {
          console.log(error)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~styles/global';
  .header {
    width: 100%;
    background: $color-brandLight;

    &_inner {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding-bottom: 0;
    }

    &-logout {
      & p { display: inline-block; margin: $scale-1-2; }
    }

    li {
      display: inline-block;
      color: $color-brandDark !important;
      padding: $scale-1-2 0;
      text-decoration: none !important;
      margin-right: $scale;
      border-bottom: 3px solid transparent;
      padding-bottom: $scale-2-1;

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
