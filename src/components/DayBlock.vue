<template>
  <div class="dayBlock width-full padding-top-5-1 padding-bottom-5-1 border-top border-lightGrey">
    <grid-block columns="12" noPadding>
      <div class="span-2">
        <h5 class="margin-bottom-2-1">{{ day }}</h5>
      </div>
      <div class="span-8">
        <h2 class="dayBlock_emptyText color-base-lighter-4" v-if="courses.length === 0">You're free</h2>
        <article-list
          v-for="(course, index) in courses"
          :currentUser="currentUser"
          :toggleArticleFinished="toggleArticleFinished"
          :courseName="course.course"
          :articles="course.articles"
          :numOfUsers="numOfUsers" />
      </div>
    </grid-block>
  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import ArticleList from 'components/Article/List'
  export default {
    name: 'DayBlock',
    components: {
      'grid-block': GridBlock,
      'article-list': ArticleList
    },
    props: {
      currentUser: { type: Object },
      day: { type: String },
      courses: { type: Array },
      toggleArticleFinished: { type: Function },
      numOfUsers: { type: Number }
    }
  }
</script>

<style lang="scss">
  @import '~styles/vars';

  .dayBlock {
    background-color: $color-base-lighter-6;
  }
</style>
