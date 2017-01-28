<template>
  <div class="inputEmoji margin-right-2-1 display-flex flexDirection-column alignItems-center">

    <input
      class="inputEmoji_input"
      type="checkbox"
      name="difficulty"
      :id="id"
      :value="value"
      :checked="checked"
      ref="inputEmoji"
      v-on:change="emitId" />

    <label
      class="inputEmoji_label"
      :class="{
        'inputEmoji_label-1': this.id === 'easyRead',
        'inputEmoji_label-2': this.id === 'understandable',
        'inputEmoji_label-3': this.id === 'interesting'
      }"
      :for="id"
      v-html="this.label">
    </label>

  </div>
</template>

<script>
  export default {
    name: 'InputEmoji',
    props: {
      id: { type: String },
      label: { type: String },
      value: { type: String },
      checked: { type: Boolean }
    },
    methods: {
      emitId() {
        this.$emit('idEmit', this.$refs.inputEmoji.id)
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/vars';
  @import '~styles/breakpoints';
  @import '~styles/tooltip';

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

  .inputEmoji_label:hover:after { @extend .tooltip; border-radius: 1px; letter-spacing: 0.2px; font-size: 5px; padding: 2px 3px; }
  .inputEmoji_label-1:hover:after { content: 'Easy read' }
  .inputEmoji_label-2:hover:after { content: 'Understandable' }
  .inputEmoji_label-3:hover:after { content: 'Interesting' }

</style>
