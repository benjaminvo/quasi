export const addData = {
  methods: {
    addData(firstProp, endPoint, dataBindingObject) {

      if ( dataBindingObject[firstProp] !== '' ) {

        this.databaseRef.ref(endPoint).push(dataBindingObject)

        for ( let key in dataBindingObject )
          if ( typeof dataBindingObject[key] === 'object' ) {
            for ( let keyNested in dataBindingObject[key] ) {
              if ( typeof dataBindingObject[key][keyNested] === 'object' ) {
                for ( let keyNestedNested in dataBindingObject[key][keyNested] ) {
                  if ( typeof dataBindingObject[key][keyNested][keyNestedNested] === 'object' ) console.log('Nested nested nested object is... an object. So we can not reset the value')
                  else dataBindingObject[key][keyNested][keyNestedNested] = ''  // Reset input fields in NESTED NESTED props (if the key is not holding an object)
                }
              } else { dataBindingObject[key][keyNested] = '' } // Reset input fields in NESTED props (if the key is not holding an object)
            }
          } else { dataBindingObject[key] = '' }  // Reset input fields (if the key is not holding an object)

      } else { console.log( 'Nothing provided in the first input!' ) }

    }
  }
}
