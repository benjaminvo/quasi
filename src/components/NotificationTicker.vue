<template>
  <div class="notificationTicker border-top border-nearWhite padding-top-2-1 padding-bottom-2-1" :class="{ 'notificationTicker-expanded': notificationTickerExpanded }">
    <grid-block columns="12" noPadding>

      <ul class="span-8 offset-2 notificationTicker_list list-unstyled padding-bottom">
        <li class="margin-top color-base-lighter-3" v-if="notifications.length === 0">No recent activity...</li>
        <li class="notification margin-bottom-3-1 display-block" v-for="(notification, index) in notifications" v-if="userHasArticle(notification.article.id)">

          <!-- WHO -->
          {{ notification.user.id === currentUser.uid ? 'You' : notification.user.name.split(' ')[0] }}

          <!-- EVENT -->
          {{ notification.type === 'articleFinished' ? 'finished' :
             notification.type === 'contributionAdded' ? 'added a thought to' : null }}
          <div v-if="notification.type === 'reactionAdded'" class="display-inlineBlock"> reacted with <span v-html="renderEmoji(notification.emoji)" />&nbsp; to </div>

          <!-- ARTICLE -->
          <router-link :to="{ name: 'article', params: { articleId: notification.article.id } }">
            <span class="color-dark fontWeight-semibold">{{ notification.article.title }}</span>
          </router-link>

          <div class="fontSize-small color-base-lighter-3 margin-top-1-2">{{ moment(notification.timestamp).fromNow() }}</div>

        </li>
      </ul>

      <span
        v-if="notifications.length > 1"
        class="span-2 h6 a float-right margin-top-2-1 textAlign-right"
        style="z-index: 1;"
        @click="notificationTickerExpanded = !notificationTickerExpanded" >
        {{ this.notificationTickerExpanded ? 'Close' : 'View recent' }}
      </span>

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
      currentUser: Object,
      user: Object,
      notifications: Array,
      userHasArticle: Function
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

<style lang="scss">
  @import '~styles/vars';

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
