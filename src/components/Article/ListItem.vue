<template>
  <router-link
    tag="li"
    :to="{ name: 'article', params: { articleId: articleId } }"
    :id="articleId"
    class="articleListItem">

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
      <div class="articleListItem_readers">
        <p>{{ articleFinishedByNum }} of {{ numOfUsers }} have read this</p>
      </div>
      <div class="articleListItem_reactions">
        <p>
          <span
            v-if="easyReadCount > 0"
            :class="{ 'color-brandFirst': easyReadReactedByCurrentUser }">{{ easyReadCount }} &#128526;</span>
          <span
            v-if="understandableCount > 0"
            class="margin-left"
            :class="{ 'color-brandFirst': understandableReactedByCurrentUser }">{{ understandableCount }} &#128519;</span>
          <span
            v-if="interestingCount > 0"
            class="margin-left"
            :class="{ 'color-brandFirst': interestingReactedByCurrentUser }">{{ interestingCount }} &#129300;</span>
        </p>
      </div>
    </div>

  </router-link>
</template>

<script>
  import ToggleCheckmark from 'components/ToggleCheckmark'
  export default {
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
      readerEmojiReactions: { type: Object },
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
      easyReadCount() { return this.readerEmojiReactions && this.readerEmojiReactions.easyRead ? this.readerEmojiReactions.easyRead.count : null },
      easyReadReactedByCurrentUser() { return this.reactionReactedByUser('easyRead') },
      understandableCount() { return this.readerEmojiReactions && this.readerEmojiReactions.understandable ? this.readerEmojiReactions.understandable.count : null },
      understandableReactedByCurrentUser() { return this.reactionReactedByUser('understandable') },
      interestingCount() { return this.readerEmojiReactions && this.readerEmojiReactions.interesting ? this.readerEmojiReactions.interesting.count : null },
      interestingReactedByCurrentUser() { return this.reactionReactedByUser('interesting') },
    },
    methods: {
      reactionReactedByUser(reaction) {
        if (
          this.readerEmojiReactions &&
          this.readerEmojiReactions[reaction] &&
          this.readerEmojiReactions[reaction].reactedBy &&
          this.readerEmojiReactions[reaction].reactedBy[this.currentUser.uid] &&
          this.readerEmojiReactions[reaction].reactedBy[this.currentUser.uid] === true
        ) { return true } else { return false }
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import '~styles/global';

  .articleListItem {
    cursor: pointer;
    background-color: white;
    border-radius: $borderRadius;
    box-shadow: $cardShadow;
    width: calc(100% + (#{$scale-3-1}*2)); // 100% + 48px
    margin-left: -#{$scale-3-1}; // -24px
    margin-bottom: $scale-3-1;
    transition: all 200ms ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.12); }

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
      color: $color-brandDark-lighter-3;

      p {
        line-height: 1.25;
      }
    }

    &_lower {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $scale $scale-3-1;
      background: $color-brandGrey-lighter-6;
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
      color: $color-brandGrey-lighter-4;
    }

    &_readers p,
    &_reactions p {
      font-size: $fontSize-xxsmall;
    }
  }

</style>
