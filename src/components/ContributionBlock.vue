<template>
  <div class="contributionBlock">
    <h6 class="margin-top">{{ title }}</h6>
    <ul class="list-unstyled">
      <li v-for="(contribution, index) in contributions" :id="contribution.id" class="margin-top-3-1">
        {{ contribution[type] }}
        <div class="display-flex alignItems-center margin-top">
          <button class="toggle margin-right" v-bind:class="{ active: contribution.thankedBy && contribution.thankedBy[currentUser.uid] ? contribution.thankedBy[currentUser.uid] : null }">
            <div v-if="contribution.thankedBy && contribution.thankedBy[currentUser.uid] ? contribution.thankedBy[currentUser.uid] : null" @click="decrementThanks">
              <span v-html="contribution.thankedBy && contribution.thankedBy[currentUser.uid] ? contribution.thankedBy[currentUser.uid].emoji : null" class="emoji margin-right-1-3"></span> Thanks!
            </div>
            <span v-else @click="incrementThanks">Say thanks!</span>
          </button>
          <p class="color-brandGrey-lighter-2">
            {{ contribution.thanksCount === 0 || contribution.thanksCount === 1 && contribution.thankedBy[currentUser.uid] ? 'Like no one else' : null }}
            {{ contribution.thanksCount > 0 && !contribution.thankedBy[currentUser.uid] ? 'Like ' + contribution.thanksCount + ' other' + (contribution.thanksCount > 1 ? 's' : '') : null }}
            {{ contribution.thanksCount > 1 && contribution.thankedBy[currentUser.uid] ? 'Said you and ' + (contribution.thanksCount - 1) + ' other' + (contribution.thanksCount > 2 ? 's' : '') : null }}
          </p>
        </div>
      </li>
    </ul>

    <form v-on:submit.prevent="handleContributionSubmit" class="display-flex margin-top-6-1 margin-bottom-4-1">
      <input class="padding-2-1 margin-right backgroundColor-white width-full" v-model="contribution" type="text" :placeholder="inputPlaceholder" maxlength="140">
      <button class="button submit" type="submit">Go</button>
    </form>
  </div>
</template>

<script>
  export default {
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
      incrementThanks(e) {
        const contributionRef = this.databaseRef.ref('articles/' + this.$route.params.articleId + '/' + this.articleReaderContributionsPathEndpoint + '/' + e.target.parentNode.parentNode.parentNode.id)
        const thankedByUserRef = contributionRef.child('thankedBy/' + this.currentUser.uid)
        const thankedByUserEmojiRef = thankedByUserRef.child('emoji')
        const thanksCountRef = contributionRef.child('thanksCount')

        thankedByUserRef.set(true)

        const randomNumber = Math.floor(Math.random() * this.emojis.length)
        const randomEmoji = this.emojis[randomNumber]
        thankedByUserEmojiRef.set(randomEmoji)

        thanksCountRef.once('value', (snapshot) => {
          const thanksCountCurrentValue = snapshot.val()
          const thanksCountNewValue = thanksCountCurrentValue ? thanksCountCurrentValue + 1 : 1
          thanksCountRef.set(thanksCountNewValue)
        })
      },
      decrementThanks(e) {
        const contributionRef = this.databaseRef.ref('articles/' + this.$route.params.articleId + '/' + this.articleReaderContributionsPathEndpoint + '/' + e.target.parentNode.parentNode.parentNode.id)
        const thankedByUserRef = contributionRef.child('thankedBy/' + this.currentUser.uid)
        const thanksCountRef = contributionRef.child('thanksCount')

        thankedByUserRef.set(false)

        thanksCountRef.once('value', (snapshot) => {
          const thanksCountCurrentValue = snapshot.val()
          const thanksCountNewValue = thanksCountCurrentValue - 1
          thanksCountRef.set(thanksCountNewValue)
        })
      }
    }
  }
</script>

<style lang="scss" scoped></style>
