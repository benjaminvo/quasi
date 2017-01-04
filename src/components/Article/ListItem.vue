<template>
  <li class="articleListItem" :id="articleId">

    <toggle-checkmark
      :toggleArticleFinished="toggleArticleFinished"
      :finished="finished" />

    <div class="articleListItem_info">
      <router-link class="articleListItem_title" tag="h4" :to="{ name: 'article', params: { articleId: articleId } }">{{title}}</router-link>
      <div class="articleListItem_meta">
        <p>{{ author }} ({{ year }})</p>
        <p>{{ pageNum }} pages</p>
      </div>
    </div>

  </li>
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

    &:last-child {
      margin-bottom: 0;
    }

    &_title {
      display: block;
      margin-bottom: $scale;
    }

    &_info { flex: 1; }

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
