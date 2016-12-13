import firebase from 'firebase'

export function fireInit(func) {

	const config = {
    apiKey: "AIzaSyAUxfsOXV74HSo9OAuWeh0-EtfAr0IlmAU",
    authDomain: "quasi-d6c39.firebaseapp.com",
    databaseURL: "https://quasi-d6c39.firebaseio.com",
    storageBucket: "quasi-d6c39.appspot.com",
	}
	firebase.initializeApp(config)

	firebase.auth().onAuthStateChanged( (user) => {
	  if (user) {
	    func(true, user)
	  } else {
	    func(false)
	  }
	}, function(error) {
	  console.log(error)
	})

}
