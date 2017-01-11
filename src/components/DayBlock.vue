<template>
  <div class="dayBlock">
    <grid-block columns="12" noPadding>
      <div class="span-2">
        <h5 class="margin-bottom">{{ day }}</h5>
      </div>
      <div class="span-8">
        <h2 class="dayBlock_emptyText" v-if="courses.length === 0">No courses - hurray!</h2>
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
    border-top: 1px solid $color-brandLight-darker-1;
    padding: $scale-5-1 0;

    &_emptyText { color: $color-brandLight-darker-2; }
  }
</style>
