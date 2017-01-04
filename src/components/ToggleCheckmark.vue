<template>
  <div
    class="toggleCheckmark"
    @click="toggleArticleFinished"
    v-bind:class="{finished: finished}">
    <svg
      v-if="finished"
      class="toggleCheckmark_checkmark"
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
      <path fill="#FFFFFF" fill-rule="evenodd" d="M8.94 24c-.4 0-.77-.08-1.12-.23a2.2 2.2 0 0 1-.88-.7L.52 14.94a2.18 2.18 0 0 1-.5-1.75c.1-.66.43-1.18.99-1.56.54-.4 1.15-.56 1.84-.47.7.09 1.25.39 1.67.9l4.2 5.33L19.37 1.12c.35-.56.87-.91 1.55-1.06a2.5 2.5 0 0 1 1.9.32c.58.34.95.83 1.12 1.48.16.64.05 1.25-.32 1.8L11.05 22.9a2.37 2.37 0 0 1-2 1.11h-.11z"/>
    </svg>
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
    min-width: 32px;
    min-height: 32px;
    margin-right: $scale-2-1;
    border: 1px solid $color-brandLight-darker-1;
    border-radius: 100%;
    background-color: $color-brandLight-lighter-1;

    &_checkmark {
      padding: 1px 0 0 1px; // Making up for extending the viewbox attr on <svg> above
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
