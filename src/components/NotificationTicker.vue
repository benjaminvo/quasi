<template>
  <div class="notificationTicker border-top border-nearWhite" :class="{ 'notificationTicker-expanded': notificationTickerExpanded }">
    <grid-block columns="12" noPadding>

      <div class="display-flex justifyContent-spaceBetween offset-2 span-10 padding-top">

        <ul class="notificationTicker_list list-unstyled padding-bottom" :class="{ hideGradient: notificationTickerExpanded || notifications.length < 2 }">
          <li class="margin-bottom-1-3" v-if="notifications.length === 0">No recent happenings...</li>
          <li class="margin-bottom-1-3" v-else v-for="(notification, index) in notifications">

            <p v-if="notification.type === 'articleFinished'" class="display-inlineBlock">
              {{ notification.user.id === currentUser.uid ? 'You' : 'Someone' }} finished {{ notification.article.title }}
            </p>

            <p v-if="notification.type === 'frustrationAdded'" class="display-inlineBlock">
              {{ notification.user.id === currentUser.uid ? 'You' : 'Someone' }} added a frustration to {{ notification.article.title }}
            </p>

            <p v-if="notification.type === 'emojiReactionAdded'" class="display-inlineBlock">
              {{ notification.user.id === currentUser.uid ? 'You' : 'Someone' }} added
              <span v-html="
                notification.emoji === 'easyRead' ? '&#128526;' :
                notification.emoji === 'understandable' ? '&#128519;' :
                notification.emoji === 'interesting' ? '&#129300;' : null" />
              to {{ notification.article.title }}
            </p>

            <p class="fontSize-xxsmall color-base-lighter-4 display-inlineBlock">{{ moment(notification.timestamp).fromNow() }}</p>

          </li>
        </ul>
        <div
          class="h6 a"
          style="z-index: 1;"
          @click="notificationTickerExpanded = !notificationTickerExpanded" >
          {{ this.notificationTickerExpanded ? 'Close' : 'Expand' }}
        </div>

      </div>

    </grid-block>
  </div>
</template>

<script>
  import moment from 'moment'
  import GridBlock from 'components/GridBlock'
  export default {
    name: 'NotificationTicker',
    components: { 'grid-block': GridBlock },
    props: {
      currentUser: { type: Object },
      notifications: { type: Array }
    },
    data() {
      return {
        notificationTickerExpanded: null
      }
    },
    methods: {
      moment(timestamp) { return moment(timestamp) }
    },
  }
</script>

<style lang="scss" scoped>
  @import '~styles/global';

  .notificationTicker {
    background-color: white;
    position: relative;
    height: 62px;
    overflow: hidden;
    transition: all 600ms cubic-bezier(0.6, -0.28, 0.735, 0.045);

    &-expanded {
      height: 296px;
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
        background: linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
      }

      &.hideGradient {
        &:after {
          background: none;
        }
      }
    }
  }
</style>
