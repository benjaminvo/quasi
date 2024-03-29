<template>
  <div class="contributionBlock">

    <form v-on:submit.prevent="handleContributionSubmit" class="margin-bottom-4-1">
      <label for="contributionInput">Anything you'd like to share about the text?</label>

      <div class="display-flex margin-top-2-1">
        <input
          id="contributionInput"
          class="withButton padding-2-1 width-full backgroundColor-white border border-nearWhite"
          v-model="contribution"
          type="text" placeholder="Tips, questions, frustrations, etc.">
        <button class="button withInput submit" type="submit">Post</button>
      </div>
    </form>

    <ul class="list-unstyled">
      <li v-for="(contribution, index) in contributionsReversed" :id="contribution.id" class="contribution">
        {{ contribution.text }}
        <div class="display-flex alignItems-center margin-top">
          <button class="toggle margin-right" v-bind:class="{ active: contribution.agreedBy && contribution.agreedBy[currentUser.uid] ? contribution.agreedBy[currentUser.uid] : null }">
            <div v-if="contribution.agreedBy && contribution.agreedBy[currentUser.uid] ? contribution.agreedBy[currentUser.uid] : null" @click="decrementAgrees">
              <span v-html="contribution.agreedBy && contribution.agreedBy[currentUser.uid] ? contribution.agreedBy[currentUser.uid].emoji : null" class="emoji margin-right-1-3"></span> Agreed
            </div>
            <span v-else @click="incrementAgrees">Agree</span>
          </button>
          <p class="color-base-lighter-2 fontSize-xxsmall">
            <!-- No yet -->
            {{ !contribution.agrees || contribution.agrees === 0 ? 'Be the first to agree' : null }}
            <!-- Only you -->
            {{ contribution.agrees === 1 && contribution.agreedBy[currentUser.uid] ? 'You’ve agreed': null }}
            <!-- One other -->
            {{ contribution.agrees === 1 && !contribution.agreedBy[currentUser.uid] ? '1 has agreed': null }}
            <!-- More than one other -->
            {{ contribution.agrees > 1 && !contribution.agreedBy[currentUser.uid] ? contribution.agrees + ' have agreed' : null }}
            <!-- One other and you -->
            {{ contribution.agrees === 2 && contribution.agreedBy[currentUser.uid] ? 'You and 1 other have agreed' : null }}
            <!-- Two or more others and you -->
            {{ contribution.agrees > 2 && contribution.agreedBy[currentUser.uid] ? 'You and ' + (contribution.agrees - 1) + ' others have agreed' : null }}
          </p>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
  import { notification } from 'utils/notification'
  export default {
    name: 'ContributionBlock',
    mixins: [notification],
    props: {
      currentUser: Object,
      databaseRef: Object,
      userAnonymous: Boolean,
      contributions: Object,
      article: Object
    },
    data() {
      return {
        emojis: ['&#128077;', '&#128076;', '&#128074;', '&#128591;', '&#9994;', '&#128406;'],
        contribution: null
      }
    },
    computed: {
      contributionsReversed() {
        let contributionsArray = []
        for ( let contributionKey in this.contributions ) {
          this.contributions[contributionKey].id = contributionKey
          contributionsArray.push( this.contributions[contributionKey] )
        }
        return contributionsArray.reverse()
      }
    },
    methods: {
      handleContributionSubmit() {

        const contribution = {}
        contribution['text'] = this.contribution
        contribution['author'] = this.currentUser.uid
        contribution['agrees'] = 0
        contribution['article'] = this.$route.params.articleId

        if ( this.contribution ) {
          this.databaseRef.ref( 'contributions' ).push( contribution ).then( (snapshot) => {
            const newContributionId = snapshot.key
            this.databaseRef.ref('users/' + this.currentUser.uid + '/contributions/' + newContributionId).set(true)
            this.databaseRef.ref('articles/' + this.$route.params.articleId + '/contributions/' + newContributionId).set(true)

            // Add notification about added contribution to notifications node on database
            this.notification('contributionAdded', this.$route.params.articleId, this.article.title, this.currentUser.uid, this.currentUser.displayName, null, this.userAnonymous)
          })}

        this.contribution = ''

      },
      incrementAgrees(e) {

        const contributionRef = this.databaseRef.ref('contributions/' + e.target.parentNode.parentNode.parentNode.id)

        const randomEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)]

        let newContributionObj = {}
        contributionRef.once( 'value', (snapshot) => {
          const contribution = snapshot.val()
          if ( contribution ) newContributionObj = Object.assign({}, contribution)
          if ( !newContributionObj.agreedBy ) newContributionObj.agreedBy = {}
          if ( !newContributionObj.agreedBy[this.currentUser.uid] ) {
            newContributionObj.agrees++
            newContributionObj.agreedBy[this.currentUser.uid] = { emoji: randomEmoji }
          }
        })
        contributionRef.update(newContributionObj)

        this.$emit('agreesChanged')

      },
      decrementAgrees(e) {

        const contributionRef = this.databaseRef.ref('contributions/' + e.target.parentNode.parentNode.parentNode.id)

        let newContributionObj = {}
        contributionRef.once( 'value', (snapshot) => {
          const contribution = snapshot.val()
          if ( contribution ) newContributionObj = Object.assign({}, contribution)
          if ( !newContributionObj.agreedBy ) newContributionObj.agreedBy = {}
          if ( newContributionObj.agreedBy[this.currentUser.uid] ) {
            if ( newContributionObj.agrees > 0 ) newContributionObj.agrees--
            newContributionObj.agreedBy[this.currentUser.uid] = false
          }
        })
        contributionRef.update(newContributionObj)

        this.$emit('agreesChanged')

      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/vars';

  .contribution {
    padding: $scale-3-1 0 $scale-4-1;
    border-top: 1px solid $color-base-lighter-6;

    &:first-child {
      border-top: 0;
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: $scale-4-1;
    }
  }

</style>
