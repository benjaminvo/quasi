<template>
  <li class="articleListItem"
    :id="articleId"
    v-bind:class="{finished: finished}">
    <router-link tag="p" :to="{ name: 'article', params: { articleId: articleId } }">{{title + ' af ' + author}}</router-link>
    <p class="articleFinishedToggle" @click="toggleArticleFinished">
      <span v-if="finished" class="color-success">Læst</span>
      <span v-else>Ikke læst</span>
    </p>
  </li>
</template>

<script>
  export default {
    props: {
      currentUser: { type: Object },
      articleId: { type: String },
      finished: { type: Boolean },
      title: { type: String },
      author: { type: String }
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
    padding: $scale-2-1;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    background-color: white;

    &:hover { background-color: lighten($color-brandLight, 4%); }

    &.finished { background-color: $color-success-bg;
      &:hover { background: darken($color-success-bg, 2%); }
    }
  }

  .articleFinishedToggle {
    text-transform: uppercase;
    font-size: $fontSize-small;
    letter-spacing: 0.5px;

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }

</style>
