<template>
  <div class="notificationTicker" :class="{ 'notificationTicker-expanded': notificationTickerExpanded }">
    <grid-block columns="12" noPadding>

      <!-- <div class="span-2 color-brandLight-darker-3 margin-top margin-bottom">
        <p>Recent activity</p>
      </div> -->

      <div class="display-flex justifyContent-spaceBetween offset-2 span-10 padding-top">

        <ul class="notificationTicker_list color-brandLight-darker-3 list-unstyled padding-bottom" :class="{ hideGradient: notificationTickerExpanded || notifications.length < 2 }">
          <li class="margin-bottom-1-3" v-if="notifications.length === 0">No recent happenings...</li>
          <li class="margin-bottom-1-3" v-else v-for="notification in notifications">{{ notification }}</li>
        </ul>
        <div
          class="h6 a"
          style="z-index: 1;"
          @click="notificationTickerExpanded = !notificationTickerExpanded"
          v-if="notifications.length > 2">
          {{ this.notificationTickerExpanded ? 'Close' : 'Expand' }}
        </div>

      </div>

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
        notifications: [],
        notificationTickerExpanded: null,
        notificationsInterval: null
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
      this.notificationsInterval = setInterval( () => {
        this.deliverNotification()
      }, 12000)
    },
    beforeDestroy() {
      clearInterval(this.notificationsInterval)
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
    height: 62px;
    overflow: hidden;
    transition: all 600ms cubic-bezier(0.6, -0.28, 0.735, 0.045);

    &-expanded {
      height: 298px;
      transition: all 1000ms cubic-bezier(0.23, 1, 0.32, 1);
    }

    &_list {

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60%;
        background: linear-gradient(to top, white 0%,  transparent 100%);
      }

      &.hideGradient {
        &:after {
          background: none;
        }
      }
    }
  }
</style>
