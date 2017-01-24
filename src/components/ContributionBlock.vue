<template>
  <div class="contributionBlock">

    <h3 class="float-left">{{ title }}</h3>
    <p @click="sortContributions" class="a h6 margin-top-1-2 margin-left display-inlineBlock float-right">Sort by most agreed</p>

    <div class="clear-both"></div>

    <ul class="list-unstyled">
      <li v-for="(contribution, index) in contributions" :id="contribution.id" class="margin-top-3-1">
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

    <form v-on:submit.prevent="handleContributionSubmit" class="display-flex margin-top-4-1">
      <input class="padding-2-1 margin-right backgroundColor-white width-full" v-model="contribution" type="text" :placeholder="inputPlaceholder" maxlength="140">
      <button class="button submit" type="submit">Go</button>
    </form>

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
      },
      sortContributions() {
        let sortedContributions = []
        sortedContributions = this.contributions.sort( (a,b) => { return b.agreesCount - a.agreesCount } )
        this.contributions = sortedContributions
      }
    }
  }
</script>

<style lang="scss" scoped></style>
