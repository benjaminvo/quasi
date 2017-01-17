<template>
  <div class="modal">
    <div class="modal_inner">
      <div class="modal_header">
        <toggle-checkmark finished disabled class="margin-bottom-2-1" />
        <h1 class="margin-bottom">Good job!</h1>
        <p>Ask your lecturer or tip one of your fellow students about something in {{ article.title }}</p>
      </div>

      <form v-on:submit.prevent="handleSubmit">
        <input class="modal_form_input" v-model="wish" type="text" placeholder="Ask" maxlength="140">
        <input class="modal_form_input" v-model="tip" type="text" placeholder="Tip" maxlength="140">
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
  export default {
    components: { 'toggle-checkmark': ToggleCheckmark },
    props: {
      currentUser: { type: Object },
      databaseRef: { type: Object },
      clickedArticleId: { type: String },
    },
    data() {
      return {
        article: {},
        wish: null,
        tip: null
      }
    },
    created() {
      this.getArticleData()
    },
    methods: {
      close() {
        this.$emit('close')
      },
      getArticleData() {
        this.databaseRef.ref('articles/' + this.clickedArticleId).once('value', (snapshot) => { this.article = snapshot.val() })
      },
      handleSubmit() {
        const articleReaderWishesPath = 'articles/' + this.clickedArticleId + '/readerWishes/'
        const articleReaderTipsPath = 'articles/' + this.clickedArticleId + '/readerTips/'
        const userWishesPath = 'users/' + this.currentUser.uid + '/wishes/'
        const userTipsPath = 'users/' + this.currentUser.uid + '/tips/'

        // Set wish on Firebase
        if (this.wish) {
          this.databaseRef.ref(articleReaderWishesPath)
          .push({
            author: this.currentUser.uid,
            wish: this.wish
          })
          .then((snapshot) => {
            const newWishId = snapshot.key
            this.databaseRef.ref(userWishesPath + '/' + newWishId).set(true)
          })
        }

        // Set tip on Firebase
        if (this.tip) {
          this.databaseRef.ref(articleReaderTipsPath)
          .push({
            author: this.currentUser.uid,
            tip: this.tip
          })
          .then((snapshot) => {
            const newTipId = snapshot.key
            this.databaseRef.ref(userTipsPath + '/' + newTipId).set(true)
          })
        }

        // Reset inputs
        this.wish = ''
        this.tip = ''

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

      &_input {
        min-width: 100%;
        padding: $scale-2-1;

        &:first-child { margin-bottom: $scale; }
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
