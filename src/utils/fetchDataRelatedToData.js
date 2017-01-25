export const fetchDataRelatedToData = {
  methods: {
    fetchDataRelatedToData(databaseEndpoint, dataIdsToMatch) {
      let finalDataArray = []
      this.databaseRef.ref(databaseEndpoint).on('value', (snapshot) => {
        const data = snapshot.val()
        for (let dataKey in data) {
          for (let dataId in dataIdsToMatch) {
            if (dataKey === dataId) finalDataArray.push(data[dataKey])
          }
        }
      })
      return finalDataArray
    }
  }
}
