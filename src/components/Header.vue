<template>
  <header class="header">
    <grid-block columns="12" noPadding>
      <div class="header_inner span-12">
        <ul class="header-links span-6">
          <router-link :to="{ name: 'dashboard' }" tag="li" exact>Dashboard</router-link>
        </ul>
        <div class="header_period">
          <div class="arrow arrow-left"></div>
          <div class="header_period_inner">
            <h4 class="header_period_week">Uge 6</h4>
            <p class="header_period_dates">6-10 feb</p>
          </div>
          <div class="arrow arrow-right"></div>
        </div>
        <div class="header-logout span-6">
          <p>{{ currentUser.displayName.substr(0, currentUser.displayName.indexOf(' ')) }}</p>
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
      padding-top: 0;
      padding-bottom: 0;
      align-items: center;
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
      padding-bottom: $scale-3-1;
      margin-top: $scale-3-1;

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

    &_period {
      display: flex;
      align-items: center;

      &_inner {
        text-align: center;
        margin: 0 $scale-2-1;
      }

      &_week {}

      &_dates {
        font-size: $fontSize-xxsmall;
        color: $color-brandDark-lighter-3;
        text-transform: uppercase;
      }
    }
  }

  .arrow {
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    display: inline-block;

    &-right { border-left: 5px solid $color-brandDark; }
    &-left { border-right: 5px solid $color-brandDark; }
  }
</style>
