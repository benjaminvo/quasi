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
        <div class="span-6 offset-3">

          <div class="display-flex justifyContent-spaceBetween alignItems-flexEnd margin-bottom-2-1">
            <h2>Reader notes</h2>
            <p @click="sortReaderChallenges" class="a">Sort by most thanked</p>
          </div>

          <hr>
          <h6 class="margin-top">Challenges</h6>
          <ul class="list-unstyled">
            <li v-for="(challenge, index) in readerChallenges" :id="challenge.id" class="margin-top-3-1">
              {{ challenge.challenge }}
              <div class="display-flex alignItems-center margin-top">
                <button class="toggle margin-right" v-bind:class="{ active: challenge.thankedBy && challenge.thankedBy[currentUser.uid] ? challenge.thankedBy[currentUser.uid] : null }">
                  <div v-if="challenge.thankedBy && challenge.thankedBy[currentUser.uid] ? challenge.thankedBy[currentUser.uid] : null" @click="decrementThanks">
                    <span v-html="challenge.thankedBy && challenge.thankedBy[currentUser.uid] ? challenge.thankedBy[currentUser.uid].emoji : null" class="emoji margin-right-1-3"></span> Thanks!
                  </div>
                  <span v-else @click="incrementThanks">Say thanks!</span>
                </button>
                <p class="color-brandGrey-lighter-2">
                  {{ challenge.thanksCount === 0 || challenge.thanksCount === 1 && challenge.thankedBy[currentUser.uid] ? 'Like no one else' : null }}
                  {{ challenge.thanksCount > 0 && !challenge.thankedBy[currentUser.uid] ? 'Like ' + challenge.thanksCount + ' other' + (challenge.thanksCount > 1 ? 's' : '') : null }}
                  {{ challenge.thanksCount > 1 && challenge.thankedBy[currentUser.uid] ? 'Said you and ' + (challenge.thanksCount - 1) + ' other' + (challenge.thanksCount > 2 ? 's' : '') : null }}
                </p>
              </div>
            </li>
          </ul>

          <form v-on:submit.prevent="handleChallengeSubmit" class="display-flex margin-top-6-1 margin-bottom-4-1">
            <input class="padding-2-1 margin-right backgroundColor-white width-full" v-model="challenge" type="text" placeholder="Challenge" maxlength="140">
            <button class="button submit" type="submit">Go</button>
          </form>

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
        readerChallenges: [],
        emojis: ['&#128077;', '&#128076;', '&#128074;', '&#128591;', '&#9994;', '&#128406;'],
        challenge: null
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
      '$route': 'setArticle'
    },
    methods: {
      setReaderChallenges() {
        let readerChallenges = []
        for (let challenge in this.article.readerChallenges) {
          this.article.readerChallenges[challenge].id = challenge
          readerChallenges.push(this.article.readerChallenges[challenge])
        }
        this.readerChallenges = readerChallenges
      },
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
          this.setReaderChallenges()
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
        const challengeRef = this.databaseRef.ref('articles/' + this.$route.params.articleId + '/readerChallenges/' + e.target.parentNode.parentNode.parentNode.id)
        const thankedByUserRef = challengeRef.child('thankedBy/' + this.currentUser.uid)
        const thankedByUserEmojiRef = thankedByUserRef.child('emoji')
        const thanksCountRef = challengeRef.child('thanksCount')

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
        const challengeRef = this.databaseRef.ref('articles/' + this.$route.params.articleId + '/readerChallenges/' + e.target.parentNode.parentNode.parentNode.id)
        const thankedByUserRef = challengeRef.child('thankedBy/' + this.currentUser.uid)
        const thanksCountRef = challengeRef.child('thanksCount')

        thankedByUserRef.set(false)

        thanksCountRef.once('value', (snapshot) => {
          const thanksCountCurrentValue = snapshot.val()
          const thanksCountNewValue = thanksCountCurrentValue - 1
          thanksCountRef.set(thanksCountNewValue)
        })
      },
      handleChallengeSubmit() {
        const articleReaderChallengesPath = 'articles/' + this.$route.params.articleId + '/readerChallenges/'
        const userChallengesPath = 'users/' + this.currentUser.uid + '/challenges/'

        // Set challenge on Firebase
        if (this.challenge) {
          this.databaseRef.ref(articleReaderChallengesPath).push({
            author: this.currentUser.uid,
            challenge: this.challenge
          }).then((snapshot) => {
            const newChallengeId = snapshot.key
            this.databaseRef.ref(userChallengesPath + '/' + newChallengeId).set(true)
          })
        }

        this.challenge = ''
      },
      sortReaderChallenges() {
        console.log('tes');
        console.log(this.readerChallenges, 'THIS');
        let sortedChallenges = []
        sortedChallenges = this.readerChallenges.sort( (a,b) => { return b.thanksCount - a.thanksCount } )
        this.readerChallenges = sortedChallenges
        console.log(sortedChallenges);
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
