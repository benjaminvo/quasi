export const addData = {
  methods: {
    addData(firstProp, endPoint, dataBindingObject) {
      if ( dataBindingObject[firstProp] != '' ) {
        this.databaseRef.ref(endPoint).push(dataBindingObject)
        for ( let prop in dataBindingObject ) dataBindingObject[prop] = '' // Reset input fields
      }
    }
  }
}
