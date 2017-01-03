<template>
  <li class="articleListItem" :id="articleId">
    <div class="articleListItem_finishedToggle" @click="toggleArticleFinished" v-bind:class="{finished: finished}"></div>
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
  export default {
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
    box-shadow: 0px 1px 2px 0px rgba($color-brandDark, 0.1);
    display: flex;
    align-items: center;

    &_title { display: block; }

    &_info {
      width: 100%;
    }

    &_meta {
      display: flex;
      justify-content: space-between;
      color: $color-brandDark-lighter-3;
    }

    &_finishedToggle {
      display: block;
      min-width: 32px;
      min-height: 32px;
      margin-right: $scale-2-1;
      border: 1px solid $color-brandLight-darker-1;
      border-radius: 100%;
      background-color: $color-brandLight-lighter-1;

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
  }

</style>
