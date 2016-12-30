<template>
  <div class="dayBlock">
    <grid-block columns="12" noPadding>
      <div class="span-12">
        <h2 class="margin-bottom">{{ day }}</h2>
        <h5 v-if="courses.length === 0">Ingen kurser - hurra!</h5>
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
    background: lighten($color-brandLight, 4%);
    margin-bottom: 2px;
  }
</style>
