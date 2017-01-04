<template>
  <header class="header">
    <grid-block columns="12" noPadding>
      <div class="header_inner span-12">
        <h2>Quasi</h2>
        <div class="header_period">
          <div class="arrowWrap">
            <div class="arrow arrow-left"></div>
          </div>
          <h6 class="header_period_inner">
            <span>Uge 6, 2017</span>
            <span class="header_period_inner_date">6 feb - 10 feb</span>
          </h6>
          <div class="arrowWrap">
            <div class="arrow arrow-right"></div>
          </div>
        </div>
        <div class="header-logout">
          <p>{{ currentUser.displayName.substr(0, currentUser.displayName.indexOf(' ')) }},</p>
          <a v-on:click="logout()">Log ud</a>
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

  .headerLink {
    display: inline-block;
    text-transform: uppercase;
    font-size: $fontSize-small;
    font-weight: 600;
  }

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

    &-logout {
      & * { @extend .headerLink; }
    }

    li {
      @extend .headerLink;
      &.active { font-weight: bold; }
    }

    &_period {
      display: flex;
      align-items: center;

      &_inner {
        text-align: center;
        margin: 0 $scale-4-1;

        &_date {
          display: block;
          color: $color-brandDark-lighter-3;
          margin-top: $scale-1-2;
        }
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
