export const fetchDataRelatedToData = {
  methods: {
    fetchDataRelatedToData(databaseEndpoint, dataIdsToMatch, includeKeysAsIds) {

      let finalDataArray = []
      this.databaseRef.ref(databaseEndpoint).once('value', (snapshot) => {
        const data = snapshot.val()
        for (let dataKey in data) {
          for (let dataId in dataIdsToMatch) {
            if (dataKey === dataId) {
              if (includeKeysAsIds) data[dataKey].id = dataKey
              finalDataArray.push(data[dataKey]) }}}})

      return finalDataArray

    }
  }
}
