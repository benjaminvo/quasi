<template>
  <header class="header">
    <grid-block columns="12" noPadding noWrap class="height-full">

      <div class="span-3 display-flex alignItems-center">
        <router-link tag="a" class="h2 fontWeight-bold" :to="{ name: 'dashboard' }">Quasi</router-link>
      </div>

      <div class="span-6 display-flex alignItems-center justifyContent-center hide-tablet">
        <div class="display-flex alignItems-center">
          <div class="arrowWrap" @click="showNoFunctionMessageThenHide">
            <div class="arrow arrow-left"></div>
          </div>
          <div class="h6 textAlign-center margin-left-4-1 margin-right-4-1">
            <div class="margin-bottom fontWeight-semibold">Week 2</div>
            <div class="color-base-lighter-2 fontWeight-medium">Feb 6 – Feb 10</div>
          </div>
          <div class="arrowWrap" @click="showNoFunctionMessageThenHide">
            <div class="arrow arrow-right"></div>
          </div>
        </div>
      </div>

      <div class="span-3 textAlign-right display-flex alignItems-center justifyContent-flexEnd">
          <router-link tag="a" class="a h6 margin-right-4-1" :to="{ name: 'settings' }">Settings</router-link>
          <a class="h6 fontWeight-semibold whiteSpace-noWrap" v-on:click="logout()">Sign out</a>
      </div>

    </grid-block>
  </header>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import firebase from 'firebase'
  import { showNoFunctionMessageThenHide } from 'utils/showNoFunctionMessageThenHide'
  export default {
    name: 'Header',
    components: { 'grid-block': GridBlock },
    props: { currentUser: Object },
    mixins: [showNoFunctionMessageThenHide],
    methods: {
      logout() {
        firebase.auth().signOut().then( () => {
          window.Intercom( 'shutdown' )
          window.location.href = '/auth.html'
        }, function(error) {
          console.log(error)
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/vars';

  .header {
    height: 96px;
  }

  .arrowWrap {
    position: relative;
    width: 32px;
    height: 32px;
    background: $color-light;
    border: 1px solid $color-base-lighter-5;
    padding: $scale;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: border-color 150ms ease;

    &:hover {
      border-color: $color-base-lighter-4;
    }
  }

  .arrow {
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    display: inline-block;

    &-right { margin-left: 2px; border-left: 7px solid $color-base-lighter-1; pointer-events: none; }
    &-left { margin-right: 2px; border-right: 7px solid $color-base-lighter-1; pointer-events: none; }
  }
</style>
