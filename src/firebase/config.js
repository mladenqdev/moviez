import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
	apiKey: "AIzaSyAL3gFd6Zjvrw0NRCd0eJstkEeGTe7Gz4Q",
	authDomain: "moviez-5be36.firebaseapp.com",
	projectId: "moviez-5be36",
	storageBucket: "moviez-5be36.appspot.com",
	messagingSenderId: "216169792158",
	appId: "1:216169792158:web:3709e429c1ab9679ea718f"
  };

  // init firebase
  firebase.initializeApp(firebaseConfig)

  // init services
  const projectFirestore = firebase.firestore()
  const projectAuth = firebase.auth()
  const projectStorage = firebase.storage()

  // timestamp
  const timestamp = firebase.firestore.FieldValue.serverTimestamp

  export { projectFirestore, projectAuth, projectStorage, timestamp }