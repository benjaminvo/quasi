export const assignDataToData = {
  methods: {
    assignDataToData(idToAssign, idToAssignEndpoint, idAssignedTo, idAssignedToEndpoint, dontConfirm = false) {

      const assign = (idToAssign, idToAssignEndpoint, idAssignedTo, idAssignedToEndpoint) => {
        this.databaseRef.ref(idAssignedToEndpoint + '/' + idAssignedTo + '/' + idToAssignEndpoint + '/' + idToAssign).set(true)
        this.databaseRef.ref(idToAssignEndpoint + '/' + idToAssign + '/' + idAssignedToEndpoint + '/' + idAssignedTo).set(true)
      }

      if ( dontConfirm ) { assign(idToAssign, idToAssignEndpoint, idAssignedTo, idAssignedToEndpoint) }
      else {
        if ( confirm('Assign ' + idToAssign + ' to ' + idAssignedTo + '?') ) {
          assign(idToAssign, idToAssignEndpoint, idAssignedTo, idAssignedToEndpoint)
        }
      }

    }
  }
}
