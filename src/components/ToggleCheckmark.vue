<template>
  <div
    class="toggleCheckmark"
    v-bind:class="{
      finished: finished,
      disabled: disabled,
      small: small
    }"
    @click.stop="toggleArticleFinished">

    <img v-if="finished" src="~assets/checkmark.svg" class="toggleCheckmark_checkmark" alt="checkmark">
  </div>
</template>

<script>
  export default {
    name: 'ToggleCheckmark',
    props: {
      toggleArticleFinished: { type: Function },
      finished: { type: Boolean },
      disabled: { type: Boolean },
      small: { type: Boolean },
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
    border: 1px solid $color-base-lighter-3;
    border-radius: 100%;
    background-color: $color-base-lighter-8;
    transition: background-color $animationSpeed ease;

    &_checkmark {
      width: 16px;
      height: 16px;
      transform: scale(0);
      opacity: 0;
      animation: fadeIn 100ms $animationBezier, elasticScaleUp 200ms ease-out;
      animation-fill-mode: forwards;
    }

    &:hover {
      background-color: $color-base-lighter-6;
      cursor: pointer;
    }

    &.disabled {
      &:hover {
        cursor: default;
        background-color: $color-base-lighter-6; }
    }

    &.finished {
      background-color: $color-primary;
      border: none;

      &:hover { background-color: darken($color-primary, 2%); }

      &.disabled {
        &:hover {
          cursor: default;
          background-color: $color-primary;
        }
      }
    }

    &.small { width: 20px; height: 20px;
      & .toggleCheckmark_checkmark { width: 10px; height: 10px; }
    }
  }

</style>
