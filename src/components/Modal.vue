<template>
  <div class="modal">

    <a @click="close" class="modal_close">
      <img src="~assets/cross.svg" width="16" />
    </a>

    <slot />

  </div>
</template>

<script>
  export default {
    name: 'Modal',
    methods: {
      close() { this.$emit('close') }
    }
  }
</script>

<style lang="scss" scoped>

  @import '~styles/global';

  .modal {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(white, 0.97);
    display: flex;
    align-items: center;
    flex-direction: column;
    z-index: 1001;

    opacity: 0;
    animation: fadeIn 200ms 200ms $animationBezier forwards;

    &_close {
      position: absolute;
      top: $scale;
      right: $scale;
    }
  }

</style>
