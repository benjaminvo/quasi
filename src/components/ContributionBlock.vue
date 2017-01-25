<template>
  <div class="contributionBlock">

    <h6 v-if="title">{{ title }}</h6>

    <form v-on:submit.prevent="handleContributionSubmit">
      <label for="contributionInput">{{ inputPlaceholder }}</label>
      <div class="display-flex margin-top">
        <input id="contributionInput" class="withButton padding-2-1 width-full backgroundColor-white" v-model="contribution" type="text">
        <button class="button withInput submit" type="submit">Go</button>
      </div>
    </form>

    <ul class="list-unstyled margin-top-4-1">
      <li v-for="(contribution, index) in contributionsReversed" :id="contribution.id" class="backgroundColor-white padding-2-1 borderRadius-1-2 margin-top-2-1 border border-nearWhite">
        {{ contribution[type] }}
        <div class="display-flex alignItems-center margin-top">
          <button class="toggle margin-right" v-bind:class="{ active: contribution.agreedBy && contribution.agreedBy[currentUser.uid] ? contribution.agreedBy[currentUser.uid] : null }">
            <div v-if="contribution.agreedBy && contribution.agreedBy[currentUser.uid] ? contribution.agreedBy[currentUser.uid] : null" @click="decrementAgrees">
              <span v-html="contribution.agreedBy && contribution.agreedBy[currentUser.uid] ? contribution.agreedBy[currentUser.uid].emoji : null" class="emoji margin-right-1-3"></span> Agreed
            </div>
            <span v-else @click="incrementAgrees">Agree</span>
          </button>
          <p class="color-brandGrey-lighter-2 fontSize-xxsmall">
            {{ !contribution.agreesCount || contribution.agreesCount === 0 || contribution.agreesCount === 1 && contribution.agreedBy[currentUser.uid] ? 'Like no one else' : null }}
            {{ contribution.agreesCount > 0 && !contribution.agreedBy[currentUser.uid] ? 'Like ' + contribution.agreesCount + ' other' + (contribution.agreesCount > 1 ? 's' : '') : null }}
            {{ contribution.agreesCount > 1 && contribution.agreedBy[currentUser.uid] ? 'Said you and ' + (contribution.agreesCount - 1) + ' other' + (contribution.agreesCount > 2 ? 's' : '') : null }}
          </p>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
  export default {
    name: 'ContributionBlock',
    props: {
      currentUser: { type: Object },
      databaseRef: { type: Object },
      type: { type: String },
      title: { type: String },
      contributions: { type: Array },
      inputPlaceholder: { type: String },
      articleReaderContributionsPathEndpoint: { type: String },
      userContributionsPathEndpoint: { type: String }
    },
    data() {
      return {
        emojis: ['&#128077;', '&#128076;', '&#128074;', '&#128591;', '&#9994;', '&#128406;'],
        contribution: null
      }
    },
    computed: {
      contributionsReversed() { return this.contributions.reverse() }
    },
    methods: {
      handleContributionSubmit() {
        const articleReaderContributionsPath = 'articles/' + this.$route.params.articleId + '/' + this.articleReaderContributionsPathEndpoint
        const userContributionsPath = 'users/' + this.currentUser.uid + '/' + this.userContributionsPathEndpoint

        const contribution = {}
        contribution['author'] = this.currentUser.uid
        contribution[this.type] = this.contribution

        // Set contribution on Firebase
        if (this.contribution) {
          this.databaseRef.ref(articleReaderContributionsPath).push(contribution)
          .then((snapshot) => {
            const newContributionsId = snapshot.key
            this.databaseRef.ref(userContributionsPath + '/' + newContributionsId).set(true)
          })
        }

        this.contribution = ''
      },
      incrementAgrees(e) {
        const contributionRef = this.databaseRef.ref('articles/' + this.$route.params.articleId + '/' + this.articleReaderContributionsPathEndpoint + '/' + e.target.parentNode.parentNode.parentNode.id)

        const randomNumber = Math.floor(Math.random() * this.emojis.length)
        const randomEmoji = this.emojis[randomNumber]

        contributionRef.once('value', (snapshot) => {
          const contribution = snapshot.val()
          let newContributionObj = {}
          if ( contribution ) newContributionObj = Object.assign({}, contribution) // Create a copy of object on database
          if ( !newContributionObj.agreesCount ) newContributionObj.agreesCount = 0 // If no count prop, create it
          if ( !newContributionObj.agreedBy ) newContributionObj.agreedBy = {} // if no agreedBy prop, create it
          if ( !newContributionObj.agreedBy[this.currentUser.uid] ) { // If not already agreed by this user
            newContributionObj.agreesCount++
            newContributionObj.agreedBy[this.currentUser.uid] = { emoji: randomEmoji }
          }
          contributionRef.update(newContributionObj) // Update database with the new object
        })
      },
      decrementAgrees(e) {
        const contributionRef = this.databaseRef.ref('articles/' + this.$route.params.articleId + '/' + this.articleReaderContributionsPathEndpoint + '/' + e.target.parentNode.parentNode.parentNode.id)

        contributionRef.once('value', (snapshot) => {
          const contribution = snapshot.val()
          let newContributionObj = {}
          if ( contribution ) newContributionObj = Object.assign({}, contribution) // Create a copy of object on database
          if ( !newContributionObj.agreesCount ) newContributionObj.agreesCount = 0 // If no count prop, create it
          if ( !newContributionObj.agreedBy ) newContributionObj.agreedBy = {} // if no agreedBy prop, create it
          if ( newContributionObj.agreedBy[this.currentUser.uid] ) { // If not already agreed by this user
            if ( newContributionObj.agreesCount > 0 ) newContributionObj.agreesCount--
            newContributionObj.agreedBy[this.currentUser.uid] = false
          }
          contributionRef.update(newContributionObj) // Update database with the new object
        })
      }
    }
  }
</script>

<style></style>
