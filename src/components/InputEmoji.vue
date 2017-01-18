<template>
  <div class="inputEmoji margin-right-2-1 display-flex flexDirection-column alignItems-center">

    <input
      class="inputEmoji_input"
      type="checkbox"
      name="difficulty"
      :id="id"
      :value="value"
      :checked="checked">

    <label class="inputEmoji_label"
      :class="{
        'inputEmoji_label-1': this.id === 'difficulty-1',
        'inputEmoji_label-2': this.id === 'difficulty-2',
        'inputEmoji_label-3': this.id === 'difficulty-3',
        'inputEmoji_label-4': this.id === 'difficulty-4',
        'inputEmoji_label-5': this.id === 'difficulty-5'
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

  .inputEmoji { position: relative; width: 48px;

    &_label {
      position: absolute;
      top: -10px;
      font-size: 32px;
      line-height: 1;
      transform: translateY(0px) scale(1);
      transition: transform 150ms ease-out;
      cursor: pointer;

      &:hover:active { transform: scale(1.4); }}}

  .inputEmoji_input:checked + label,
  .inputEmoji_input:checked + label:active { transform: scale(1.4); transition: transform 150ms ease-out;
    &:hover { transform: scale(1.5);
    &:active { transform: scale(1); }}}

  .inputEmoji_label:hover:after, .inputEmoji_input:checked + label:after { @extend .tooltip; border-radius: 1px; letter-spacing: 0.2px; font-size: 5px; padding: 2px 3px; }
  .inputEmoji_label-1:hover:after, .inputEmoji_input:checked + label.inputEmoji_label-1:after { content: 'Confusing' }
  .inputEmoji_label-2:hover:after, .inputEmoji_input:checked + label.inputEmoji_label-2:after { content: 'Frustrating' }
  .inputEmoji_label-3:hover:after, .inputEmoji_input:checked + label.inputEmoji_label-3:after { content: 'Mmh' }
  .inputEmoji_label-4:hover:after, .inputEmoji_input:checked + label.inputEmoji_label-4:after { content: 'Easyread' }
  .inputEmoji_label-5:hover:after, .inputEmoji_input:checked + label.inputEmoji_label-5:after { content: 'Inspiring' }

</style>
