<template>
  <div class="modal">

    <img src="~assets/checkmark-on-blue.svg" width="600" class="modal_illustration" />

    <a @click="close" class="modal_close">
      <img src="~assets/cross.svg" width="16" />
    </a>

    <div class="modal_inner">

      <h1 class="margin-top-3-1">{{ randomEncouragement }}, {{ currentUser.displayName.substr(0, currentUser.displayName.indexOf(' ')) }}!</h1>

      <form v-on:submit.prevent="handleSubmit" class="margin-top-3-1">

        <p class="textAlign-center">How was it to read?</p>
        <div class="margin-top-4-1 margin-bottom-6-1 display-flex justifyContent-center">
          <input-emoji
            v-for="(reaction, key, index) in article.reactions"
            :id="key"
            :label="reaction.emoji"
            :value="reaction.name"
            v-on:idEmit="toggleReaction"
            v-bind:checked="reactions.includes(key)" />
        </div>

        <p class="textAlign-center">Any thoughts on the text? Frustrations, aha-moments etc.</p>
        <textarea class="modal_form_input margin-top-2-1 margin-bottom border border-nearWhite backgroundColor-light" v-model="contribution" type="text" rows="3"></textarea>

        <div class="modal_form_footer">
          <p class="modal_form_footer_text color-base-lighter-3">Everything is anonymous</p>
          <div class="modal_form_footer_actions">
            <button class="button submit" type="submit">Go</button>
          </div>
        </div>

      </form>

    </div>
  </div>
</template>

<script>
  import InputEmoji from 'components/InputEmoji'
  export default {
    name: 'Modal',
    components: {
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
        contribution: null
      }
    },
    computed: {
      reactions() {
        let reactions = []
        if ( this.article.reactions ) {
          for ( let reaction in this.article.reactions ) {
            if ( this.article.reactions[reaction].reactedBy && this.article.reactions[reaction].reactedBy[this.currentUser.uid] ) {
              reactions.push(reaction)
            }
          }
        }
        return reactions
      },
      randomEncouragement() {
        return this.encouragements[Math.floor(Math.random() * this.encouragements.length)]
      }
    },
    created() {
      this.setArticle()
    },
    methods: {
      toggleReaction(id) {
        const idIndex = this.reactions.indexOf(id)
        if (idIndex > -1) this.reactions.splice(idIndex, 1)
        else this.reactions.push(id)
      },
      close() { this.$emit('close') },
      setArticle() {
        this.databaseRef.ref('articles/' + this.articleId).once('value', (snapshot) => { this.article = snapshot.val() })
      },
      handleSubmit() {
        const articleContributionsPath = 'articles/' + this.articleId + '/contributions/'
        const userContributionsPath = 'users/' + this.currentUser.uid + '/contributions/'

        const articleReactionsPath = 'articles/' + this.articleId + '/reactions/'

        // Set contribution on Firebase
        if ( this.contribution ) {

          this.databaseRef.ref('contributions')
          .push({
            author: this.currentUser.uid,
            text: this.contribution,
            agrees: 0,
            article: this.articleId })

          .then( (snapshot) => {
            this.databaseRef.ref(userContributionsPath + snapshot.key).set(true)
            this.databaseRef.ref(articleContributionsPath + snapshot.key).set(true)
            // Add notification about added contribution to notifications node on database
            const notification = {
              type: 'contributionAdded',
              timestamp: new Date().getTime(),
              article: {
                id: this.articleId,
                title: this.article.title },
              user: {
                id: this.currentUser.uid,
                name: this.currentUser.displayName }}
            this.databaseRef.ref('notifications').push(notification)
          })

        }

        // Set reactions on Firebase
        if ( this.reactions.length ) {
          for ( let i = 0; i < this.reactions.length; i++ ) {

            const reactionPath = this.databaseRef.ref(articleReactionsPath + this.reactions[i])
            const reactionCountPath = reactionPath.child('count')
            const reactionReactedByPath = reactionPath.child('reactedBy')

            reactionPath.once( 'value', (snapshot) => {
              const reaction = snapshot.val()
              let newReactionObj = {}
              if ( reaction ) newReactionObj = Object.assign({}, reaction) // Create a copy of object on database
              if ( !newReactionObj.count ) newReactionObj.count = 0 // If no count prop, create it
              if ( !newReactionObj.reactedBy ) newReactionObj.reactedBy = {} // if no reactedBy prop, create it
              if ( !newReactionObj.reactedBy[this.currentUser.uid] ) { // If not already reacted by this user
                newReactionObj.count++
                newReactionObj.reactedBy[this.currentUser.uid] = true
              }
              reactionPath.update(newReactionObj) // Update database with the new object
            })

            .then( () => {
              // Add notification about added emoji reaction to notifications node on database
              const notification = {
                type: 'reactionAdded',
                timestamp: new Date().getTime(),
                emoji: this.reactions[i],
                article: {
                  id: this.articleId,
                  title: this.article.title },
                user: {
                  id: this.currentUser.uid,
                  name: this.currentUser.displayName }}
              this.databaseRef.ref('notifications').push(notification)
            })

          }
        }

        // Reset inputs
        this.contribution = ''

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
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    z-index: 1001;

    opacity: 0;
    animation: fadeIn 200ms 200ms $animationBezier forwards;

    &_close {
      position: absolute;
      top: $scale;
      right: $scale;
    }

    &_illustration {
      transform: translate3d(0, -100vh, 0);
      animation: slideDown 1200ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
    }

    &_inner {
      position: relative;
      max-width: 600px;
      min-width: 400px;
      padding: $scale-2-1 0 0;

      transform: scale(0);
      opacity: 0;
      animation: fadeIn 100ms 200ms $animationBezier, scaleUp 300ms 400ms ease-out;
      animation-fill-mode: forwards;
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
