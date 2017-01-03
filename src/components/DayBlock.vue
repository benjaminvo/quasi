<template>
  <div class="dayBlock">
    <grid-block columns="12" noPadding>
      <div class="span-12">
        <h5 class="margin-bottom">{{ day }} <span class="dayBlock_emptyText" v-if="courses.length === 0">Ingen kurser - hurra!</span></h5>
        <article-list
          v-for="(course, index) in courses"
          :currentUser="currentUser"
          v-on:toggleArticleFinished="toggleArticleFinished"
          :courseName="course.course"
          :articles="course.articles" />
      </div>
    </grid-block>
  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import ArticleList from 'components/Article/List'
  export default {
    components: {
      'grid-block': GridBlock,
      'article-list': ArticleList
    },
    props: {
      currentUser: { type: Object },
      day: { type: String },
      courses: { type: Array }
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

  .dayBlock {
    width: 100%;
    background: $color-brandLight;
    border-bottom: 1px solid $color-brandLight-darker-1;
    padding: $scale-2-1 0;

    &_emptyText {
      color: $color-brandDark-lighter-3;
    }
  }
</style>
