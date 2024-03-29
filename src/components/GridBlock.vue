<template>
  <div
    class="gridBlock gridBlock-columns"
    :class="[
      this.columns ? 'gridBlock-columns-' + this.columns : null,
      {'gridBlock-noPadding': noPadding},
      {'gridBlock-noWrap': noWrap}
    ]">
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'GridBlock',
    props: {
      columns: String,
      noPadding: Boolean,
      noWrap: Boolean
    }
  }
</script>

<style lang="scss">
  @import '~styles/vars';
  @import '~styles/breakpoints';

  .gridBlock {
    display: flex;
    flex-wrap: wrap;
    padding: $scale-6-1 0;
    margin: 0 auto;

    &-noPadding { padding: 0;
      @include breakpoint( 'tablet' )        { padding: 0 $scale-2-1 !important; }
    }

    &-noWrap { flex-wrap: nowrap !important; }

    & > * { padding: 0 $scale-2-1; }

    // Content-widths
    @include breakpoint( 'desktop' )         { width: $contentWidth-desktop; }
    @include breakpoint( 'tablet' )          { width: $contentWidth-tablet; padding: $scale-2-1; }
    @include breakpoint( 'widescreen' )      { width: $contentWidth-widescreen; }
    @include breakpoint( 'extraWidescreen' ) { width: $contentWidth-extraWidescreen; }
  }

  // Grid
  $cols: 2 3 4 5 6 8 12;
  $spans: 0 1 2 3 4 5 6 7 8 9 10 11 12;
  @each $col in $cols {

    // Set num. columns with columns="X"
    .gridBlock-columns-#{$col} > * {
      width: percentage(1/$col) !important;

      @include breakpoint( 'tablet' ) {
        // Default to 100% width on tablet and below
        width: 100% !important;
      }
    }

    @each $span in $spans {
      // Set num. of columns to span for direct children
      .gridBlock-columns-#{$col} > *.span-#{$span} {
        @include breakpoint( 'tabletAbove' ) {
          width: percentage(1/$col * $span) !important;
        }
      }

      .gridBlock-columns-#{$col} > *.span-#{$span}-tablet {
        @include breakpoint( 'tabletOnly' ) {
          width: percentage(1/$col * $span) !important;
        }
      }

      .gridBlock-columns-#{$col} > *.span-#{$span}-mobile {
        @include breakpoint( 'mobile' ) {
          width: percentage(1/$col * $span) !important;
        }
      }

      // Set num. of columns to offset
      .gridBlock-columns-#{$col} > *.offset-#{$span} {
        @include breakpoint( 'tabletAbove' ) {
          margin-left: percentage(1/$col * $span) !important;
        }
      }

      .gridBlock-columns-#{$col} > *.offset-#{$span}-tablet {
        @include breakpoint( 'tabletOnly' ) {
          margin-left: percentage(1/$col * $span) !important;
        }
      }

      .gridBlock-columns-#{$col} > *.offset-#{$span}-mobile {
        @include breakpoint( 'mobile' ) {
          margin-left: percentage(1/$col * $span) !important;
        }
      }
    }
  }
</style>
