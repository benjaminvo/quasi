<template>
  <div>
    <grid-block columns="12">

      <!-- Breadcrumb -->
      <ul class="article_breadcrumb span-12 padding-bottom-2-1 fontFamily-body fontSize-base list-unstyled">
        <router-link :to="{ name: 'dashboard' }" tag="li" class="a">Dashboard</router-link>
        <li><span class="color-brandLight-darker-3">/ </span> {{ article.title }} ({{ article.year }})</li>
      </ul>

      <!-- Article title -->
      <div class="span-12 padding-bottom-4-1">
        <div class="display-flex alignItems-center">
          <h1 class="margin-right-2-1">{{ article.title }}</h1>
          <toggle-checkmark
            finished
            disabled
            v-if="article.finishedBy ? article.finishedBy[currentUser.uid] : null" />
        </div>
        <p class="color-brandLight-darker-3">{{ 'Read for course' + (this.articleCourses.length > 1 ? 's' : '') }}
          <span v-for="(course, index) in this.articleCourses">
            {{ course.name }} on
            {{ course.weekday + (articleCourses.length > 1 && articleCourses.length !== index + 1 ? ', ' : '') }}</span>
        </p>
      </div>

      <!-- Article information -->

      <!-- Left column -->
      <div class="span-3">

        <!-- Article details -->
        <div class="backgroundColor-brandLight padding-2-1 margin-bottom-2-1">
          <h5 class="padding-bottom">Article details</h5>
          <ul class="list-unstyled">
            <li class="padding-bottom">{{ pagesTotal }} pages ({{ article.pageFrom }}-{{ article.pageTo}})</li>
            <li class="padding-bottom">Cited by {{ article.citeCount }}</li>
            <li class="padding-bottom">{{ article.journal }}</li>
            <li class="padding-none">{{ article.publisher }}</li>
          </ul>
        </div>

        <!-- Article structure -->
        <div>
          <h5 class="padding-bottom">Table of contents</h5>
          <ul class="list-unstyled">
            <li class="padding-bottom">Introduction: bringing the power debates together</li>
            <li class="padding-bottom">The first dimension of power</li>
            <li class="padding-bottom">The second dimension of power</li>
            <li class="padding-bottom">The third dimension of power</li>
            <li class="padding-bottom">Fourth dimension of power</li>
            <li class="padding-none">Conclusion</li>
          </ul>
        </div>

      </div>

      <!-- Right column -->
      <div class="article_meta span-9">

        <h5 class="padding-bottom-2-1">Teacher notes</h5>
        <p class="padding-bottom-4-1">{{ article.readingGuide }}</p>

        <h5 class="padding-bottom-2-1">Keywords</h5>
        <p class="padding-bottom-4-1">{{ article.keywords }}</p>

        <h5 class="padding-bottom-2-1">Abstract</h5>
        <p class="padding-bottom-4-1">{{ article.abstract }}</p>

      </div>

    </grid-block>

    <div class="backgroundColor-brandLight">
      <grid-block columns="12">
        <div class="span-12 offset-3">

          <h2>Reader notes</h2>
          <ul class="list-unstyled">
            <li v-for="(tip, key, index) in article.readerTips" :id="key" class="margin-top-3-1">
              {{ tip.tip }}
              <div class="display-flex alignItems-center margin-top">
                <button class="toggle margin-right" v-bind:class="{ active: tip.thankedBy && tip.thankedBy[currentUser.uid] ? tip.thankedBy[currentUser.uid] : null }">
                  <div
                    v-if="tip.thankedBy && tip.thankedBy[currentUser.uid] ? tip.thankedBy[currentUser.uid] : null"
                    @click="decrementThanks">
                    <span v-html="tip.thankedBy && tip.thankedBy[currentUser.uid] ? tip.thankedBy[currentUser.uid].emoji : null" class="emoji"></span> Thanks!
                  </div>
                  <span v-else @click="incrementThanks">Say thanks!</span>
                </button>
                <p class="color-brandGrey-lighter-2">
                  {{ tip.thanksCount === 0 || tip.thanksCount === 1 && tip.thankedBy[currentUser.uid] ? 'Like no one else' : null }}
                  {{ tip.thanksCount > 0 && !tip.thankedBy[currentUser.uid] ? 'Like ' + tip.thanksCount + ' other' + (tip.thanksCount > 1 ? 's' : '') : null }}
                  {{ tip.thanksCount > 1 && tip.thankedBy[currentUser.uid] ? 'Said you and ' + (tip.thanksCount - 1) + ' other' + (tip.thanksCount > 2 ? 's' : '') : null }}
                </p>
              </div>
            </li>
          </ul>

        </div>
      </grid-block>
    </div>

  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import ToggleCheckmark from 'components/ToggleCheckmark'
  export default {
    name: 'Article',
    components: {
      'grid-block': GridBlock,
      'toggle-checkmark': ToggleCheckmark
    },
    props: {
      currentUser: { type: Object },
      databaseRef: { type: Object },
    },
    data() {
      return {
        article: {},
        articleCourseIds: [],
        articleCourses: [],
        emojis: ['&#128077;', '&#128076;', '&#128074;', '&#128591;', '&#9994;', '&#128406;']
      }
    },
    computed: {
      pagesTotal() {
        return parseInt(this.article.pageTo, 10) - parseInt(this.article.pageFrom, 10)
      }
    },
    mounted() {
      this.setArticle()
      this.fetchCourses()
    },
    beforeDestroy() {
      this.databaseRef.ref('articles/').off()
    },
    watch: {
      '$route': 'setArticle',
    },
    methods: {
      setArticle() {
        const activeArticleId = this.$route.params.articleId
        this.databaseRef.ref('articles/').on('value', (snapshot) => {
          let articleObj = {}
          const data = snapshot.val()
          for (let article in data) {
            if (article === activeArticleId) {
              articleObj = data[article]
              for (let course in articleObj.courses) {
                this.articleCourseIds.push(course) // Get ids of courses that the article is part of
              }

            }
          }
          this.article = articleObj
        })
      },
      fetchCourses() {
        this.databaseRef.ref('courses/').once('value', (snapshot) => {
          const courses = snapshot.val()
          for (let course in courses) {
            for (let i = 0; i < this.articleCourseIds.length; i++) {
              if (course === this.articleCourseIds[i]) {
                this.articleCourses.push(courses[course])
              }
            }
          }
        })
      },
      incrementThanks(e) {
        const tipRef = this.databaseRef.ref('articles/' + this.$route.params.articleId + '/readerTips/' + e.target.parentNode.parentNode.parentNode.id)
        const thankedByUserRef = tipRef.child('thankedBy/' + this.currentUser.uid)
        const thankedByUserEmojiRef = thankedByUserRef.child('emoji')
        const thanksCountRef = tipRef.child('thanksCount')

        thankedByUserRef.set(true)

        const randomNumber = Math.floor(Math.random() * this.emojis.length)
        const randomEmoji = this.emojis[randomNumber]
        thankedByUserEmojiRef.set(randomEmoji)

        thanksCountRef.once('value', (snapshot) => {
          const thanksCountCurrentValue = snapshot.val()
          const thanksCountNewValue = thanksCountCurrentValue ? thanksCountCurrentValue + 1 : 1
          thanksCountRef.set(thanksCountNewValue)
        })
      },
      decrementThanks(e) {
        const tipRef = this.databaseRef.ref('articles/' + this.$route.params.articleId + '/readerTips/' + e.target.parentNode.parentNode.parentNode.id)
        const thankedByUserRef = tipRef.child('thankedBy/' + this.currentUser.uid)
        const thanksCountRef = tipRef.child('thanksCount')

        thankedByUserRef.set(false)

        thanksCountRef.once('value', (snapshot) => {
          const thanksCountCurrentValue = snapshot.val()
          const thanksCountNewValue = thanksCountCurrentValue - 1
          thanksCountRef.set(thanksCountNewValue)
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/global';

  .article {

    &_breadcrumb {
      & li {
        display: inline-block;
      }
    }

    &_meta {
      height: 100px;
    }

  }

</style>
