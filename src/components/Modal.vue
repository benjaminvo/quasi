<template>
  <div class="modal" :class="{ 'modal-opaque': opaque }">

    <a v-if="!notDismissable" @click="close" class="modal_close">
      <img src="~assets/cross.svg" width="16" />
    </a>

    <slot />

  </div>
</template>

<script>
  export default {
    name: 'Modal',
    props: {
      notDismissable: Boolean,
      opaque: Boolean
    },
    methods: {
      close() { this.$emit('close') }
    }
  }
</script>

<style lang="scss">
  @import '~styles/vars';

  .modal {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(white, 0.97);
    display: flex;
    align-items: center;
    flex-direction: column;
    z-index: 1001;

    opacity: 0;
    animation: fadeIn 200ms 200ms $animationBezier forwards;

    &-opaque { background-color: white; }

    &_close {
      position: absolute;
      top: $scale-5-1;
      right: $scale-5-1;
      z-index: 1;
    }
  }

</style>
