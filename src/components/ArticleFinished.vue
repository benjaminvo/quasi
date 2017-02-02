<template>
  <div class="wrap">

    <img src="~assets/checkmark-on-blue.svg" class="illustration" />

    <div class="inner">

      <h1 class="textAlign-center margin-top-3-1">{{ randomEncouragement }}, {{ currentUser.displayName.substr(0, currentUser.displayName.indexOf(' ')) }}!</h1>

      <form v-on:submit.prevent="handleSubmit" class="form margin-top-3-1">

        <p class="textAlign-center">Any positive reactions?</p>
        <div class="margin-top-2-1 margin-bottom-6-1 display-flex justifyContent-center flexDirection-column-tablet">
          <input-emoji
            class="margin-right-2-1 margin-top-2-1"
            v-for="(reaction, key, index) in article.reactions"
            :id="key"
            :label="reaction.symbol"
            :value="reaction.name"
            :symbolPath="'/dist/' + reaction.symbol + '.svg'"
            v-on:idEmit="toggleReaction"
            v-bind:checked="userReactions.includes(key)" />
        </div>

        <p class="textAlign-center">Anything else you'd like to share?</p>
        <textarea
          class="form_input margin-top-2-1 margin-bottom border border-nearWhite backgroundColor-light"
          v-model="contribution"
          type="text"
          placeholder="Tips, questions, frustrations etc."
          rows="3"></textarea>

        <div class="form_footer">
          <div class="form_footer_checkbox">
            <input type="checkbox" id="hideName" v-model="userAnonymous" />
            <label class="margin-left-1-2 color-base-lighter-3 fontSize-small" for="hideName">Hide my name in notifications</label>
          </div>
          <button class="button submit" type="submit">Post</button>
        </div>

      </form>

    </div>

  </div>
</template>

<script>
  import InputEmoji from 'components/InputEmoji'
  import { notification } from 'utils/notification'
  export default {
    name: 'ModalArticleFinished',
    components: { 'input-emoji': InputEmoji },
    mixins: [notification],
    props: {
      currentUser: Object,
      databaseRef: Object,
      articleId: String
    },
    data() {
      return {
        article: {},
        encouragements: ['Good job', 'Way to go', 'Great job', 'Excellent', 'High five'],
        contribution: null,
        userAnonymous: null
      }
    },
    computed: {
      userReactions() {
        let userReactions = []
        if ( this.article.reactions ) {
          for ( let reaction in this.article.reactions ) {
            if ( this.article.reactions[reaction].reactedBy && this.article.reactions[reaction].reactedBy[this.currentUser.uid] ) {
              userReactions.push(reaction)
            }
          }
        }
        return userReactions
      },
      randomEncouragement() {
        return this.encouragements[Math.floor(Math.random() * this.encouragements.length)]
      }
    },
    created() {
      this.setArticle()
      this.setAnonymousState()
    },
    methods: {
      setArticle() {
        this.databaseRef.ref('articles/' + this.articleId).once('value', (snapshot) => { this.article = snapshot.val() })
      },
      setAnonymousState() {
        this.databaseRef.ref('users/' + this.currentUser.uid + '/anonymous').once('value', (snapshot) => { this.userAnonymous = snapshot.val() })
      },
      toggleReaction(id) {
        const idIndex = this.userReactions.indexOf(id)
        if (idIndex > -1) this.userReactions.splice(idIndex, 1)
        else this.userReactions.push(id)
      },
      handleSubmit() {
        // Set contribution on Firebase
        const articleContributionsPath = 'articles/' + this.articleId + '/contributions/'
        const userContributionsPath = 'users/' + this.currentUser.uid + '/contributions/'

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
            this.notification('contributionAdded', this.articleId, this.article.title, this.currentUser.uid, this.currentUser.displayName, null, this.userAnonymous)
          })

        }

        this.contribution = '' // Reset inputs

        // Set userReactions on Firebase
        const articleReactionsPath = 'articles/' + this.articleId + '/reactions/'

        if ( this.userReactions.length ) {
          for ( let i = 0; i < this.userReactions.length; i++ ) {

            const reactionPath = this.databaseRef.ref(articleReactionsPath + this.userReactions[i])

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

          }
        }

        // Set anonymity for user
        this.databaseRef.ref('users/' + this.currentUser.uid + '/anonymous').set(this.userAnonymous)

        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/vars';

  .inputEmoji:last-child { margin-right: 0 !important; }

  .wrap {
    max-width: 600px;
    margin: 0 $scale-2-1;
  }

  .illustration {
    transform: translate3d(0, -100vh, 0);
    animation: slideDown 1200ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
    width: 100%;
  }

  .inner {
    position: relative;
    width: 100%;
    padding-top: $scale-2-1;

    transform: scale(0);
    opacity: 0;
    animation: fadeIn 100ms 200ms $animationBezier, scaleUp 300ms 400ms ease-out;
    animation-fill-mode: forwards;
  }

  .form {
    width: 100%;

    &_input {
      width: 100%;

      &:focus {
        background-color: $color-base-lighter-7;
      }
    }

    &_footer {
      display: flex;
      width: 100%;
      margin-top: $scale;

      &_checkbox { flex: 5; }

      button {
        flex: 1;
        width: 20px;
        margin-left: $scale-2-1;
      }
    }
  }

</style>
