<template>
  <div class="modal">
    <div class="modal_inner">
      <div class="modal_header">
        <toggle-checkmark finished disabled class="margin-bottom-2-1" />
        <h1>{{ randomEncouragement }}, {{ currentUser.displayName.substr(0, currentUser.displayName.indexOf(' ')) }}!</h1>
      </div>

      <form v-on:submit.prevent="handleSubmit">

        <h6 class="textAlign-center">How was it to read {{ article.meta ? article.meta.title : null }}?</h6>
        <div class="margin-top-4-1 margin-bottom-6-1 display-flex justifyContent-center">
          <input-emoji
            id="easyRead"
            label="&#128526;"
            value="Easy read"
            v-on:idEmit="toggleEmojiReaction"
            v-bind:checked="emojiReactions.includes('easyRead')" />
          <input-emoji
            id="understandable"
            label="&#128519;"
            value="Understandable"
            v-on:idEmit="toggleEmojiReaction"
            v-bind:checked="emojiReactions.includes('understandable')" />
          <input-emoji
            class="margin-none"
            id="interesting"
            label="&#129300;"
            value="Interesting"
            v-on:idEmit="toggleEmojiReaction"
            v-bind:checked="emojiReactions.includes('interesting')" />
        </div>

        <h6 class="textAlign-center">What frustrated you about the text, if anything?</h6>
        <textarea class="modal_form_input margin-top-2-1 margin-bottom border border-nearWhite backgroundColor-light" v-model="challenge" type="text" rows="3"></textarea>

        <div class="modal_form_footer">
          <p class="modal_form_footer_text color-base-lighter-3">Everything is anonymous</p>
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
    name: 'Modal',
    components: {
      'toggle-checkmark': ToggleCheckmark,
      'input-emoji': InputEmoji
    },
    props: {
      currentUser: Object,
      databaseRef: Object,
      articleId: String
    },
    data() {
      return {
        article: {},
        encouragements: ['Good job', 'Way to go', 'Great job', 'Excellent', 'High five'],
        challenge: null
      }
    },
    computed: {
      emojiReactions() {
        let emojiReactions = []
        if ( this.article.readerEmojiReactions ) {
          for (let reaction in this.article.readerEmojiReactions) {
            if ( this.article.readerEmojiReactions[reaction].reactedBy && this.article.readerEmojiReactions[reaction].reactedBy[this.currentUser.uid] ) {
              emojiReactions.push(reaction)
            }
          }
        }
        return emojiReactions
      },
      randomEncouragement() {
        return this.encouragements[Math.floor(Math.random() * this.encouragements.length)]
      }
    },
    created() {
      this.getArticleData()
    },
    methods: {
      toggleEmojiReaction(id) {
        const idIndex = this.emojiReactions.indexOf(id)
        if (idIndex > -1) this.emojiReactions.splice(idIndex, 1)
        else this.emojiReactions.push(id)
      },
      close() { this.$emit('close') },
      getArticleData() {
        this.databaseRef.ref('articles/' + this.articleId).once('value', (snapshot) => { this.article = snapshot.val() })
      },
      handleSubmit() {
        const articleReaderChallengesPath = 'articles/' + this.articleId + '/readerChallenges/'
        const userChallengesPath = 'users/' + this.currentUser.uid + '/challenges/'

        const articleReaderEmojiReactionsPath = 'articles/' + this.articleId + '/readerEmojiReactions/'

        // Set challenge on Firebase
        if (this.challenge) {
          this.databaseRef.ref(articleReaderChallengesPath)
          .push({
            author: this.currentUser.uid,
            challenge: this.challenge,
            agreesCount: 0
          })
          .then((snapshot) => {
            const newChallengeId = snapshot.key
            this.databaseRef.ref(userChallengesPath + '/' + newChallengeId).set(true)
          })

          // Add notification about added frustration to notifications node on database
          this.databaseRef.ref('articles/' + this.articleId).once('value', (snapshot) => {
            const notification = {
              type: 'frustrationAdded',
              timestamp: new Date().getTime(),
              article: {
                id: this.articleId,
                title: snapshot.val().meta.title
              },
              user: {
                id: this.currentUser.uid,
                name: this.currentUser.displayName
              }
            }
            this.databaseRef.ref('notifications').push(notification)
          })
        }

        // Set emojiReactions on Firebase
        if (this.emojiReactions.length) {
          for ( let i = 0; i < this.emojiReactions.length; i++ ) {

            const emojiReactionPath = this.databaseRef.ref(articleReaderEmojiReactionsPath + '/' + this.emojiReactions[i])
            const emojiReactionCountPath = emojiReactionPath.child('count')
            const emojiReactionReactedByPath = emojiReactionPath.child('reactedBy')

            emojiReactionPath.once('value', (snapshot) => {
              const reaction = snapshot.val()
              let newReactionObj = {}
              if ( reaction ) newReactionObj = Object.assign({}, reaction) // Create a copy of object on database
              if ( !newReactionObj.count ) newReactionObj.count = 0 // If no count prop, create it
              if ( !newReactionObj.reactedBy ) newReactionObj.reactedBy = {} // if no reactedBy prop, create it
              if ( !newReactionObj.reactedBy[this.currentUser.uid] ) { // If not already reacted by this user
                newReactionObj.count++
                newReactionObj.reactedBy[this.currentUser.uid] = true
              }
              emojiReactionPath.update(newReactionObj) // Update database with the new object
            })

            // Add notification about added emoji reaction to notifications node on database
            this.databaseRef.ref('articles/' + this.articleId).once('value', (snapshot) => {
              const notification = {
                type: 'emojiReactionAdded',
                timestamp: new Date().getTime(),
                emoji: this.emojiReactions[i],
                article: {
                  id: this.articleId,
                  title: snapshot.val().meta.title
                },
                user: {
                  id: this.currentUser.uid,
                  name: this.currentUser.displayName
                }
              }
              this.databaseRef.ref('notifications').push(notification)
            })

          }
        }

        // Reset inputs
        this.challenge = ''

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
      min-width: 400px;
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

        &:focus {
          background-color: $color-base-lighter-7;
        }
      }

      &_footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: $scale-2-1;

        &_actions {
          .button {
            display: inline-block;
            margin-left: $scale-2-1; }
        }
      }
    }
  }

</style>
