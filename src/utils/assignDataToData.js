export const assignDataToData = {
  methods: {
    assignDataToData(idToAssign, idToAssignEndpoint, idAssignedTo, idAssignedToEndpoint) {
      console.log('crash');
      if ( confirm('Assign ' + idToAssign + ' to ' + idAssignedTo + '?') ) {
        this.databaseRef.ref(idAssignedToEndpoint + '/' + idAssignedTo + '/' + idToAssignEndpoint + '/' + idToAssign).set(true)
        this.databaseRef.ref(idToAssignEndpoint + '/' + idToAssign + '/' + idAssignedToEndpoint + '/' + idAssignedTo).set(true)
      }
    }
  }
}
