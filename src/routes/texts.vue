<template>
  <grid-block columns="12" noPadding>
    <h1 class="span-12">Dine tekster</h1>
    <form class="span-12" v-on:submit.prevent="addText">
      <input type="text" placeholder="Titel" v-model="newText.title">
      <input type="text" placeholder="Forfatter" v-model="newText.author">
      <button type="submit">Tilføj tekst</button
    </form>
    <ul class="textList margin-top span-12">
      <p v-if="texts.length === 0" class="textList_loading">Tekster på vej... hvis du har nogle!</p>
      <li v-for="(text, index) in texts" :id="text.id">
        <p>{{text.title + ', ' + text.author}}</p>
        <p class="text_remove" @click="removeText">Remove</p>
      </li>
    </ul>
  </grid-block>
</template>

<script>
  import GridBlock from 'components/GridBlock'
  export default {
    components: { 'grid-block': GridBlock },
    props: {
      currentUser: { type: Object },
      databaseRef: { type: Object }
    },
    data() {
      return {
        currentUserRef: this.databaseRef.ref('users/' + this.currentUser.uid),
        textsRef: this.databaseRef.ref('users/' + this.currentUser.uid + '/texts'),
        newText: {
          title: '',
          author: '',
        },
        texts: []
      }
    },
    created() {
      this.fetchTexts()
    },
    methods: {
      fetchTexts() {
        this.textsRef.on('value', (snapshot) => {
          let textsArray = [];
          const data = snapshot.val()
          for (let text in data) {
            const textObj = data[text]
            textObj.id = text // Add the text id, to the text object that is added to this.texts
            textsArray.push(textObj)
          }
          this.texts = textsArray
        })
      },
      addText() {
        this.textsRef.push(this.newText)
        this.newText.title = ''
        this.newText.author = ''
      },
      removeText(e) {
        // console.log(e.target.parentNode.id);
        this.databaseRef.ref('users/' + this.currentUser.uid + '/texts/' + e.target.parentNode.id).remove()
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/global';

  .textList {
    list-style: none;

    &_loading {
      font-size: $fontSize-large;
      color: $color-brandLight-darker-1;
      margin-top: $scale-4-1;
      text-align: center;
    }

    li {
      padding: $scale;
      border: 1px solid $color-brandLight;
      border-width: 0px 1px 1px 1px;
      display: flex;
      justify-content: space-between;

      &:first-child {
        border-width: 1px;
        border-top-left-radius: $borderRadius;
        border-top-right-radius: $borderRadius;
      }

      &:last-child {
        border-bottom-left-radius: $borderRadius;
        border-bottom-right-radius: $borderRadius;
        border-bottom-width: 2px;
        border-bottom-style: solid;
      }
    }
  }

  .text {

    &_remove {
      color: red;
      text-transform: uppercase;
      font-size: $fontSize-small;
      letter-spacing: 0.5px;

      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }

  }
</style>
