<template>
  <router-link
    tag="li"
    :to="{ name: 'article', params: { articleId: articleId } }"
    :id="articleId"
    class="articleListItem">

    <toggle-checkmark
      :toggleArticleFinished="toggleArticleFinished"
      :finished="finished"
      class="margin-right-3-1 articleListItem_toggle" />

    <div class="articleListItem_info">
      <h4 class="articleListItem_title">{{title}}</h4>
      <div class="articleListItem_meta">
        <p>{{ author }} ({{ year }})</p>
        <p>{{ pageNum }} pages</p>
      </div>
    </div>

  </router-link>
</template>

<script>
  import ToggleCheckmark from 'components/ToggleCheckmark'
  export default {
    components: { 'toggle-checkmark': ToggleCheckmark },
    props: {
      currentUser: { type: Object },
      articleId: { type: String },
      finished: { type: Boolean },
      title: { type: String },
      author: { type: String },
      pageNum: { type: Number },
      year: { type: Number }
    },
    methods: {
      toggleArticleFinished(e) {
        this.$emit('toggleArticleFinished', e)
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import '~styles/global';

  .articleListItem {
    padding: $scale-3-1;
    cursor: pointer;
    background-color: white;
    border-radius: $borderRadius;
    box-shadow: $cardShadow;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% + (#{$scale-3-1}*2)); // 100% + 48px
    margin-left: -#{$scale-3-1}; // -24px
    margin-bottom: $scale-3-1;
    transition: all 400ms $animationBezier;

    &:hover {
      transform: translate3d(0,-2px,0);
      box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.08); }

    // &:active {
    //   transition-duration: 100ms;
    //   transform: translate3d(0,0,0);
    //   box-shadow: $cardShadow; }

    &:last-child { margin-bottom: 0; }

    &_info { flex: 1; }

    &_title {
      display: block;
      margin-bottom: $scale;
    }

    &_meta {
      display: flex;
      justify-content: space-between;
      color: $color-brandDark-lighter-3;

      p {
        line-height: 1.25;
      }
    }
  }

</style>
