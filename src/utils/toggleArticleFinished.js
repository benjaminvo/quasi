import { notification } from 'utils/notification'

export const toggleArticleFinished = {
  mixins: [notification],
  methods: {
    toggleArticleFinished(articleId, articleTitle, userId, userName, modalToShow) {
      const articleFinishedByPath = 'articles/' + articleId + '/finishedBy/' + userId
      const articleFinishedPath = 'users/' + userId + '/articlesFinished/' + articleId

      this.databaseRef.ref(articleFinishedPath).once( 'value', (snapshot) => {
        const data = snapshot.val()
        if (data === false || data === null || !data) {
          this.databaseRef.ref(articleFinishedPath).set(true)
          this.databaseRef.ref(articleFinishedByPath).set(true)

          if ( modalToShow ) this.modalsVisible[modalToShow] = true

          this.notification('articleFinished', articleId, articleTitle, userId, userName)

        } else {
          this.databaseRef.ref(articleFinishedPath).set(false)
          this.databaseRef.ref(articleFinishedByPath).set(false)
        }
      })
    }
  }
}
