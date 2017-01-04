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
    padding-top: $scale-3-1 - 4px;
    cursor: pointer;
    background-color: white;
    border-radius: $borderRadius;
    margin-top: $scale-2-1;
    box-shadow: $cardShadow;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &_title { display: block; }

    &_info { flex: 1; }

    &_meta {
      display: flex;
      justify-content: space-between;
      color: $color-brandDark-lighter-3;
    }
  }

</style>
