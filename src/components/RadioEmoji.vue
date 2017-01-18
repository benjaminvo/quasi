<template>
  <div class="radioEmoji margin-right-2-1 display-flex flexDirection-column alignItems-center">

    <input
      class="radioEmoji_radio"
      type="radio"
      name="difficulty"
      :id="id"
      :value="value"
      :checked="checked">

    <label class="radioEmoji_label"
      :class="{
        'radioEmoji_label-1': this.id === 'difficulty-1',
        'radioEmoji_label-2': this.id === 'difficulty-2',
        'radioEmoji_label-3': this.id === 'difficulty-3',
        'radioEmoji_label-4': this.id === 'difficulty-4',
        'radioEmoji_label-5': this.id === 'difficulty-5'
      }"
      :for="id"
      v-html="this.label">
    </label>

  </div>
</template>

<script>
  export default {
    props: {
      id: { type: String },
      label: { type: String },
      value: { type: String },
      checked: { type: Boolean }
    },
  }
</script>

<style lang="scss" scoped>

  @import '~styles/global';

  .radioEmoji {
    position: relative;
    width: 48px;

    &_label {
      position: absolute;
      top: -10px;
      font-size: 32px;
      line-height: 1;
      transform: scale(1);
      transition: transform 150ms ease-out;

      &:hover {
        transform: scale(1.4);
        cursor: pointer;

        &:after { @extend .tooltip; border-radius: 1px; letter-spacing: 0.2px; font-size: 5px; padding: 2px 3px; }
      }

      &-1:hover:after { content: 'Frustrating' }
      &-2:hover:after { content: 'Difficult' }
      &-3:hover:after { content: 'OK' }
      &-4:hover:after { content: 'Easy' }
      &-5:hover:after { content: 'Interesting' }
    }

    &_radio {
      &:checked + label {
        transform: scale(1.4);
        transition: transform 150ms ease-out;

        &:after { @extend .tooltip; border-radius: 1px; letter-spacing: 0.2px; font-size: 5px; padding: 2px 3px; }

        &.radioEmoji_label-1:after { content: 'Frustrating' }
        &.radioEmoji_label-2:after { content: 'Difficult' }
        &.radioEmoji_label-3:after { content: 'OK' }
        &.radioEmoji_label-4:after { content: 'Easy' }
        &.radioEmoji_label-5:after { content: 'Interesting' }
      }
    }
  }

</style>
