<template>
  <header class="header">
    <grid-block columns="12" noPadding>
      <div class="header_inner span-12">
        <h2 class="color-brandFirst">Quasi</h2>
        <div class="header_period">
          <div class="arrowWrap">
            <div class="arrow arrow-left"></div>
          </div>
          <h6 class="textAlign-center margin-left-4-1 margin-right-4-1">
            <span>Week 6, 2017</span>
            <span class="header_period_date margin-top">Feb 6 – Feb 10</span>
          </h6>
          <div class="arrowWrap">
            <div class="arrow arrow-right"></div>
          </div>
        </div>
        <h6>
          {{ currentUser.displayName.substr(0, currentUser.displayName.indexOf(' ')) }},
          <a class="h6" v-on:click="logout()">Sign out</a>
        </h6>
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
    height: 96px;
    display: flex;
    align-items: center;

    &_inner {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &_period {
      display: flex;
      align-items: center;

      &_date {
        display: block;
        color: $color-brandDark-lighter-3;
      }
    }
  }

  .arrowWrap {
    width: 32px;
    height: 32px;
    background: $color-brandLight;
    padding: $scale;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .arrow {
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    display: inline-block;

    &-right { margin-left: 2px; border-left: 7px solid $color-brandDark-lighter-3; }
    &-left { margin-right: 2px; border-right: 7px solid $color-brandDark-lighter-3; }
  }
</style>
