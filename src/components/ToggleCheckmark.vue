<template>
  <div
    class="toggleCheckmark"
    @click="toggleArticleFinished"
    v-bind:class="{finished: finished}">

    <img v-if="finished" src="~assets/checkmark.svg" class="toggleCheckmark_checkmark" alt="checkmark">
  </div>
</template>

<script>
  export default {
    props: {
      toggleArticleFinished: { type: Function },
      finished: { type: Boolean }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~styles/global';

  .toggleCheckmark {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    margin-right: $scale-3-1;
    border: 1px solid $color-brandLight-darker-1;
    border-radius: 100%;
    background-color: $color-brandLight-lighter-1;

    &_checkmark {
      width: 16px;
      height: 16px;

      transform: scale(0);
      opacity: 0;
      animation: fadeIn 100ms $animationBezier, elasticScaleUp 200ms ease-out;
      animation-fill-mode: forwards;
    }

    &:hover {
      background-color: darken($color-brandLight-lighter-1, 2%);
      cursor: pointer;
      text-decoration: underline;
    }

    &.finished {
      background-color: $color-brandFirst;
      border: none;

      &:hover { background-color: darken($color-brandFirst, 2%); }
    }
  }

</style>
