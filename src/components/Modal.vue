<template>
  <div class="modal">
    <div class="modal_inner">
      <h1 class="modal_headline">Nu kan du...</h1>
      <form v-on:submit.prevent="handleSubmit">
        <input class="modal_input" v-model="wish" type="text" placeholder="Skrive ønske til din underviser (maks. 140 tegn)" maxlength="140">
        <input class="modal_input" v-model="tip" type="text" placeholder="Give tip til en fremtidig læser (maks. 140 tegn)" maxlength="140">
        <p class="modal_text">Alt er anonymt</p>
        <button class="button" @click="close">Nej tak</button>
        <button class="button modal_submit" type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      currentUser: { type: Object },
      databaseRef: { type: Object },
      clickedArticleId: { type: String }
    },
    data() {
      return {
        wish: null,
        tip: null
      }
    },
    methods: {
      close() {
        this.$emit('close')
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
    background: rgba($color-brandDark, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;

    &_inner {
      position: relative;
      max-width: 800px;
      background: $color-brandLight;
    }

    &_close {
      position: absolute;
      right: $scale;
      top: $scale;
    }

    &_headline {
      width: 100%;
      text-align: center;
      margin-top: $scale-2-1;
      margin-bottom: $scale;
    }

    &_input {
      width: 100%;
      padding: $scale-2-1;

      &:first-child {
        margin-bottom: $scale-1-2;
      }
    }

    &_text {
      text-align: center;
      margin-top: $scale-2-1;
      color: $color-brandLight-darker-2;
    }

    .button {
      width: 50%;
      display: inline-block;
      float: left;
      margin-top: $scale-2-1;
    }

    &_dismiss {
      color: $color-brandDark;
    }

    &_submit {
      background-color: $color-brandFirst;
    }
  }

</style>
