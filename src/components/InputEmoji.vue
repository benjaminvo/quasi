<template>
  <div class="inputEmoji display-flex flexDirection-column alignItems-center">

    <input
      class="inputEmoji_input"
      type="checkbox"
      name="difficulty"
      :id="id"
      :value="value"
      :checked="checked"
      ref="inputEmoji"
      v-on:change="emitId" />

    <label class="inputEmoji_label" :for="id">
      <img :src="symbolPath" :title="value" width="24" height="24" class="display-inlineBlock margin-right" />
      <p class="display-inlineBlock whiteSpace-noWrap margin-right-1-2">{{ value }}</p>
    </label>

  </div>
</template>

<script>
  export default {
    name: 'InputEmoji',
    props: {
      id: String,
      label: String,
      value: String,
      checked: Boolean,
      symbolPath: String
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

  .inputEmoji {
    &_label {
      display: flex;
      margin-top: -20px;
      cursor: pointer;
      background: $color-base-lighter-6;
      border-radius: 18px;
      transition: background-color 150ms ease-out;
      padding: 6px 9px;

      &:hover { background-color: $color-base-lighter-7; }
    }
  }

  .inputEmoji_input:checked + label {
    background-color: $color-base-darker-4;
    color: white;

    &:hover { background-color: $color-base-darker-3; }
  }

</style>
