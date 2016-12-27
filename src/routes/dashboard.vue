<template>
  <div>
    <grid-block columns="12">
      <h1 class="span-12 fontFamily-body">Dine tekster</h1>
      <ul class="articleList span-12">
        <p v-if="articles.length === 0" class="articleList_loading">Tekster på vej... hvis du har nogle!</p>
        <li
          v-for="(article, index) in articles"
          :id="article.id"
          v-bind:class="{finished: article.finishedBy}">
          <router-link tag="p" :to="{ name: 'article', params: { articleId: article.id } }">{{article.title + ' af ' + article.author}}</router-link>
          <p class="articleFinishedToggle" @click="toggleArticleFinished">
            <span v-if="article.finishedBy" class="color-success">Læst</span>
            <span v-else>Ikke læst</span>
          </p>
        </li>
      </ul>
    </grid-block>
    <modal
      v-if="modalVisible"
      v-on:close="modalVisible = false"
      :currentUser="currentUser"
      :databaseRef="databaseRef"
      :clickedArticleId="clickedArticleId" />
  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  import Modal from 'components/Modal'
  export default {
    components: {
      'grid-block': GridBlock,
      'modal': Modal
    },
    props: {
      currentUser: { type: Object },
      databaseRef: { type: Object },
    },
    data() {
      return {
        articles: [],
        modalVisible: false,
        clickedArticleId: null
      }
    },
    created() {
      this.fetchArticles()
    },
    methods: {
      fetchArticles() {
        this.databaseRef.ref('articles/').on('value', (snapshot) => {
          let articlesArray = []
          const data = snapshot.val()
          for (let article in data) {
            const articleObj = data[article]
            articleObj.id = article // Add the article id, to the article object that is added to this.articles
            articlesArray.push(articleObj)
          }
          this.articles = articlesArray
        })
      },
      toggleArticleFinished(e) {
        this.clickedArticleId = e.currentTarget.parentNode.id
        const articleFinishedByPath = 'articles/' + this.clickedArticleId + '/finishedBy/'
        const articleFinishedPath = 'users/' + this.currentUser.uid + '/articles/' + this.clickedArticleId + '/finished'
        this.databaseRef.ref(articleFinishedPath).once('value', (snapshot) => {
          const data = snapshot.val()
          let update = {}
          if (data === true) {
            update[articleFinishedPath] = false
            this.databaseRef.ref().update(update)
            this.databaseRef.ref(articleFinishedByPath + this.currentUser.uid).remove()
          }
          else if (data === false || data === null) {
            update[articleFinishedPath] = true
            this.databaseRef.ref().update(update)
            const finishedByUserObj = {}
            finishedByUserObj[this.currentUser.uid] = true
            this.databaseRef.ref(articleFinishedByPath).set(finishedByUserObj)
            this.modalVisible = true
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/global';

  .articleList {

    &_loading {
      font-size: $fontSize-large;
      color: $color-brandLight-darker-1;
      margin-top: $scale-4-1;
      text-align: center;
    }

    li {
      padding: $scale-2-1;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      background-color: lighten($color-brandLight, 5%);

      &:hover { background-color: lighten($color-brandLight, 4%); }

      &.finished { background-color: $color-success-bg;
        &:hover { background: darken($color-success-bg, 2%); }
      }
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
