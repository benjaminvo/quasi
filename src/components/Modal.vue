<template>
  <div class="modal">
    <div class="modal_inner">
      <div class="modal_header">
        <toggle-checkmark finished disabled class="margin-bottom-2-1" />
        <h1>Good job!</h1>
      </div>

      <form v-on:submit.prevent="handleSubmit">

        <h6 class="color-brandLight-darker-2 textAlign-center">How was it to read {{ article.title }}?</h6>
        <div class="margin-top-4-1 margin-bottom-6-1 display-flex justifyContent-center">
          <input-emoji id="emoji-1" label="&#128526;" value="1" />
          <input-emoji id="emoji-2" label="&#128519;" value="2" />
          <input-emoji id="emoji-3" label="&#129300;" value="3" />
        </div>

        <input class="modal_form_input margin-bottom" v-model="challenge" type="text" placeholder="What was difficult to understand?" maxlength="140">
        <input class="modal_form_input" v-model="takeaway" type="text" placeholder="What was your key takeaway?" maxlength="140">

        <div class="modal_form_footer">
          <p class="modal_form_footer_text">Everything is anonymous</p>
          <div class="modal_form_footer_actions">
            <a @click="close">No thanks</a>
            <button class="button submit" type="submit">Go</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import ToggleCheckmark from 'components/ToggleCheckmark'
  import InputEmoji from 'components/InputEmoji'
  export default {
    components: {
      'toggle-checkmark': ToggleCheckmark,
      'input-emoji': InputEmoji
    },
    props: {
      currentUser: { type: Object },
      databaseRef: { type: Object },
      clickedArticleId: { type: String },
    },
    data() {
      return {
        article: {},
        challenge: null,
        takeaway: null
      }
    },
    created() {
      this.getArticleData()
    },
    methods: {
      close() { this.$emit('close') },
      getArticleData() {
        this.databaseRef.ref('articles/' + this.clickedArticleId).once('value', (snapshot) => { this.article = snapshot.val() })
      },
      handleSubmit() {
        const articleReaderChallengesPath = 'articles/' + this.clickedArticleId + '/readerChallenges/'
        const articleReaderTakeawaysPath = 'articles/' + this.clickedArticleId + '/readerTakeaways/'
        const userChallengesPath = 'users/' + this.currentUser.uid + '/challenges/'
        const userTakeawaysPath = 'users/' + this.currentUser.uid + '/takeaways/'

        // Set challenge on Firebase
        if (this.challenge) {
          this.databaseRef.ref(articleReaderChallengesPath)
          .push({
            author: this.currentUser.uid,
            challenge: this.challenge
          })
          .then((snapshot) => {
            const newChallengeId = snapshot.key
            this.databaseRef.ref(userChallengesPath + '/' + newChallengeId).set(true)
          })
        }

        // Set takeaway on Firebase
        if (this.takeaway) {
          this.databaseRef.ref(articleReaderTakeawaysPath)
          .push({
            author: this.currentUser.uid,
            takeaway: this.takeaway
          })
          .then((snapshot) => {
            const newTakeawayId = snapshot.key
            this.databaseRef.ref(userTakeawaysPath + '/' + newTakeawayId).set(true)
          })
        }

        // Reset inputs
        this.challenge = ''
        this.takeaway = ''

        this.close()
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import '~styles/global';

  .modal {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(white, 0.97);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;

    opacity: 0;
    animation: fadeIn 200ms 200ms $animationBezier forwards;

    &_inner {
      position: relative;
      max-width: 600px;
      margin-top: -10%;
      padding: $scale-2-1;

      transform: scale(0);
      opacity: 0;
      animation: fadeIn 100ms 200ms $animationBezier, scaleUp 300ms 400ms ease-out;
      animation-fill-mode: forwards;
    }

    &_close {
      position: absolute;
      right: $scale;
      top: $scale;
    }

    &_header {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-bottom: $scale-3-1;

      p {
        max-width: 80%;
        text-align: center;
      }
    }

    &_form {
      display: flex;
      align-items: center;

      &_input {
        min-width: 100%;
        padding: $scale-2-1;
      }

      &_footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: $scale-2-1;

        &_text { color: $color-brandLight-darker-2; }

        &_actions {
          .button {
            display: inline-block;
            margin-left: $scale-2-1; }
        }
      }
    }
  }

</style>
