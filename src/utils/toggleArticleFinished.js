export const toggleArticleFinished = {
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

          const notification = {
            type: 'articleFinished',
            timestamp: new Date().getTime(),
            article: {
              id: articleId,
              title: articleTitle
            },
            user: {
              id: userId,
              name: userName
            }
          }

          this.databaseRef.ref( 'notifications' ).push( notification )

        } else {
          this.databaseRef.ref(articleFinishedPath).set(false)
          this.databaseRef.ref(articleFinishedByPath).set(false)
        }
      })
    }
  }
}
