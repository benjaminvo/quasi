<template>
  <div class="notificationTicker">
    <grid-block columns="12" noPadding>

      <!-- <div class="span-2 color-brandLight-darker-3 margin-top margin-bottom">
        <p>Time</p>
      </div> -->

      <ul class="offset-2 span-6 color-brandLight-darker-3 margin-top list-unstyled">
        <li v-for="notification in notifications">{{ notification }}</li>
      </ul>

    </grid-block>
  </div>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  export default {
    name: 'notification-ticker',
    components: {
      'grid-block': GridBlock
    },
    props: {
      databaseRef: { type: Object },
      articles: { type: Object }
    },
    data() {
      return {
        notificationTypes: [
          'Someone finished',
          'A reaction was added to'
        ],
        notifications: []
      }
    },
    computed: {
      articleTitles() {
        let articleTitles = []
        for ( let article in this.articles ) { articleTitles.push(this.articles[article].title) }
        return articleTitles
      }
    },
    mounted() {
      const notificationsInterval = setInterval( () => {
        this.deliverNotification()
      }, 10000)
    },
    beforeDestroy() {
      clearInterval(notificationsInterval)
    },
    watch: {
      articleTitles: 'deliverNotification'
    },
    methods: {
      deliverNotification() {
        const numberOfNotificationTypes = this.notificationTypes.length
        const numberOfArticleTitles = this.articleTitles.length

        const randomNotificationTypePickerInt = Math.floor(Math.random() * numberOfNotificationTypes)
        const randomArticleTitlePickerInt = Math.floor(Math.random() * numberOfArticleTitles)

        const randomNotificationType = this.notificationTypes[randomNotificationTypePickerInt]
        const randomArticleTitle = this.articleTitles[randomArticleTitlePickerInt]

        const notification = randomNotificationType + ' ' + randomArticleTitle

        this.notifications.unshift(notification)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~styles/global';

  .notificationTicker {
    background-color: white;
    border-top: 1px solid $color-brandLight;
    position: relative;
    height: 64px;
    overflow: hidden;

    &:after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 60px;
      background: linear-gradient(to top, white 0%, transparent 100%);
    }
  }
</style>
