<template>
  <header class="margin-bottom-4-1">
    <grid-block columns="12" noPadding>
      <div class="header span-12">
        <ul class="header-links span-6">
          <router-link
            :to="{ name: 'dashboard' }"
            tag="li"
            active-class="active"
            exact>
            Tekster
          </router-link>
          <router-link
            :to="{ name: 'article' }"
            tag="li"
            active-class="active"
            exact>
            Læs
          </router-link>
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
    display: flex;
    justify-content: space-between;

    &-logout {
      & p { display: inline-block; margin: $scale-1-2; }
    }

    li {
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
