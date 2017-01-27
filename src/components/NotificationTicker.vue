<template>
  <div class="notificationTicker border-top border-nearWhite padding-top-2-1 padding-bottom-2-1" :class="{ 'notificationTicker-expanded': notificationTickerExpanded }">
    <grid-block columns="12" noPadding>

      <ul class="span-8 offset-2 notificationTicker_list list-unstyled padding-bottom">
        <li class="margin-top color-base-lighter-3" v-if="notifications.length === 0">Loading...</li>
        <li class="margin-bottom-3-1 display-block" v-else v-for="(notification, index) in notifications">

          <div v-if="notification.type === 'articleFinished'" class="notification display-inlineBlock">
            {{ notification.user.id === currentUser.uid ? 'You' : 'Someone' }} finished  <span class="fontWeight-semibold">{{ notification.article.title }}</span>
          </div>

          <div v-if="notification.type === 'contributionAdded'" class="notification display-inlineBlock">
            {{ notification.user.id === currentUser.uid ? 'You' : 'Someone' }} added a contribution to <span class="fontWeight-semibold">{{ notification.article.title }}</span>
          </div>

          <div v-if="notification.type === 'reactionAdded'" class="notification display-inlineBlock">
            {{ notification.user.id === currentUser.uid ? 'You' : 'Someone' }} reacted with
            <span v-html="renderEmoji(notification.emoji)" />&nbsp; to <span class="fontWeight-semibold">{{ notification.article.title }}</span>
          </div>

          <div class="fontSize-small color-base-lighter-3">{{ moment(notification.timestamp).fromNow() }}</div>

        </li>
      </ul>

      <div class="span-2">
        <span
          class="h6 a float-right margin-top-2-1"
          style="z-index: 1;"
          @click="notificationTickerExpanded = !notificationTickerExpanded" >
          {{ this.notificationTickerExpanded ? 'Close' : 'View recent' }}
        </span>
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
      moment(timestamp) { return moment(timestamp) },
      renderEmoji(emoji) {
        if ( emoji == 'easyRead' ) return '&#128526;'
        else if ( emoji == 'understandable' ) return '&#128519;'
        else if ( emoji == 'interesting' ) return '&#129300;'
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '~styles/global';

  .notificationTicker {
    background-color: rgba(255,255,255,.92);
    backdrop-filter: saturate(180%) blur(2px);
    position: relative;
    height: 80px;
    overflow: hidden;
    transition: height 1000ms cubic-bezier(0.23, 1, 0.32, 1);
    will-change: height;

    &-expanded {
      height: 352px;
      //transition: height 1000ms cubic-bezier(0.23, 1, 0.32, 1);
    }
  }
  .notification {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
