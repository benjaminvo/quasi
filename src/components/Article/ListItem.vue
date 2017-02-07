<template>
  <router-link
    tag="li"
    :to="{ name: 'article', params: { articleId: articleId } }"
    :id="articleId"
    class="articleListItem card card-1 card-1-hover">

    <div class="articleListItem_upper">
      <toggle-checkmark
        :click="toggleArticleFinished"
        :checked="finished"
        class="margin-right-3-1 articleListItem_toggle" />

      <div class="articleListItem_info">
        <h4 class="articleListItem_title">{{title}}</h4>
        <div class="articleListItem_meta">
          <p>{{ author }} ({{ year }})</p>
          <p>{{ pageNum }} pages</p>
        </div>
      </div>
    </div>

    <div class="articleListItem_lower">
      <span class="articleListItem_readers fontSize-xsmall">{{ articleFinishedByNum }} out of {{ usersArray.length }} have read this</span>

      <div class="display-flex fontSize-xsmall">
        <div v-if="easyReadCount > 0" class="display-flex alignItems-center">
          <span class="margin-right-1-2" :class="{ 'color-primary': easyReadReactedByCurrentUser }">{{ easyReadCount }}</span>
          <img src="/dist/emoji_easy-read.svg" title="Easy read" width="12" />
        </div>
        <div v-if="interestingCount > 0" class="display-flex alignItems-center margin-left">
          <span class="margin-right-1-2" :class="{ 'color-primary': interestingReactedByCurrentUser }">{{ interestingCount }}</span>
          <img src="/dist/emoji_interesting.svg" title="Interesting" width="12" />
        </div>
        <div v-if="understandableCount > 0" class="display-flex alignItems-center margin-left">
          <span class="margin-right-1-2" :class="{ 'color-primary': understandableReactedByCurrentUser }">{{ understandableCount }}</span>
          <img src="/dist/emoji_understandable.svg" title="Understandable" width="12" />
        </div>
      </div>
    </div>

  </router-link>
</template>

<script>
  import ToggleCheckmark from 'components/ToggleCheckmark'
  export default {
    name: 'ArticleListItem',
    components: { 'toggle-checkmark': ToggleCheckmark },
    props: {
      currentUser: Object,
      articleId: String,
      finished: Boolean,
      title: String,
      author: String,
      pageNum: Number,
      year: Number,
      finishedBy: Object,
      reactions: Object,
      toggleArticleFinished: Function,
      users: Object
    },
    computed: {
      articleFinishedByNum() {
        let finishers = []
        for ( let finisher in this.finishedBy ) {
          if ( this.finishedBy[finisher] === true ) finishers.push(finisher)
        }
        return finishers.length
      },
      usersArray() {
        let usersArray = []
        for ( let user in this.users ) usersArray.push( this.users[user] )
        return usersArray
      },
      easyReadCount() { return this.reactions && this.reactions.easyRead ? this.reactions.easyRead.count : null },
      easyReadReactedByCurrentUser() { return this.reactionReactedByUser('easyRead') },
      understandableCount() { return this.reactions && this.reactions.understandable ? this.reactions.understandable.count : null },
      understandableReactedByCurrentUser() { return this.reactionReactedByUser('understandable') },
      interestingCount() { return this.reactions && this.reactions.interesting ? this.reactions.interesting.count : null },
      interestingReactedByCurrentUser() { return this.reactionReactedByUser('interesting') },
    },
    methods: {
      reactionReactedByUser(reaction) {
        if (
          this.reactions &&
          this.reactions[reaction] &&
          this.reactions[reaction].reactedBy &&
          this.reactions[reaction].reactedBy[this.currentUser.uid] &&
          this.reactions[reaction].reactedBy[this.currentUser.uid] === true
        ) { return true } else { return false }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~styles/vars';

  .articleListItem {
    cursor: pointer;
    width: calc(100% + (#{$scale-3-1}*2)); // 100% + 48px
    margin-left: -#{$scale-3-1}; // -24px
    margin-bottom: $scale-3-1;
    transition: all $animationSpeed ease;

    &:last-child { margin-bottom: 0; }

    &_upper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $scale-3-1;
    }

    &_info { flex: 1; }

    &_title {
      display: block;
      margin-bottom: $scale;
    }

    &_meta {
      display: flex;
      justify-content: space-between;
      color: $color-base;

      p {
        line-height: 1.25;
      }
    }

    &_lower {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $scale $scale-3-1;
      border-top: 1px solid $color-base-lighter-6;
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
      color: $color-base-lighter-3;
    }
  }

</style>
