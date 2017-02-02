export const notification = {
  methods: {
    notification(type, articleId, articleTitle, userId, userName, emoji = null, anonymous = null) {

      const notification = {
        type: type,
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

      if ( emoji ) notification['emoji'] = emoji
      if ( anonymous ) notification['anonymous'] = anonymous

      this.databaseRef.ref('notifications').push(notification)

    }
  }
}
