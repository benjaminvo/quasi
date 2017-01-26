<template>
  <router-link
    tag="li"
    :to="{ name: 'article', params: { articleId: articleId } }"
    :id="articleId"
    class="articleListItem card card-1 card-1-hover">

    <div class="articleListItem_upper">
      <toggle-checkmark
        :toggleArticleFinished="toggleArticleFinished"
        :finished="finished"
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
      <span class="articleListItem_readers fontSize-xsmall">{{ articleFinishedByNum }} out of {{ numOfUsers }} have read this</span>

      <div class="articleListItem_reactions fontSize-xsmall">
          <span
            v-if="easyReadCount > 0"
            :class="{ 'color-primary': easyReadReactedByCurrentUser }">{{ easyReadCount }} &#128526;</span>
          <span
            v-if="understandableCount > 0"
            class="margin-left"
            :class="{ 'color-primary': understandableReactedByCurrentUser }">{{ understandableCount }} &#128519;</span>
          <span
            v-if="interestingCount > 0"
            class="margin-left"
            :class="{ 'color-primary': interestingReactedByCurrentUser }">{{ interestingCount }} &#129300;</span>
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
      currentUser: { type: Object },
      articleId: { type: String },
      finished: { type: Boolean },
      title: { type: String },
      author: { type: String },
      pageNum: { type: Number },
      year: { type: Number },
      finishedBy: { type: Object },
      reactions: { type: Object },
      toggleArticleFinished: { type: Function },
      numOfUsers: { type: Number }
    },
    computed: {
      articleFinishedByNum() {
        let finishers = []
        for ( let finisher in this.finishedBy ) {
          if ( this.finishedBy[finisher] === true ) finishers.push(finisher)
        }
        return finishers.length
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

  @import '~styles/global';
  @import '~styles/card';

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
