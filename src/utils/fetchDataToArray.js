export const fetchDataToArray = {
  methods: {
    fetchDataToArray(endpoint, includeKeysAsIds) {

      let array = []
      this.databaseRef.ref(endpoint).once('value', (snapshot) => {
        const data = snapshot.val()
        for (let dataKey in data) {
          if (includeKeysAsIds) data[dataKey].id = dataKey
          array.push(data[dataKey] )}})

      return array
    }
  }
}
