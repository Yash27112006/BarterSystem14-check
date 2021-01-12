import firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyCUuB0Q3EbZ530xDyNciaVbBPF1XNgeZMg",
  authDomain: "barter-system-a7ced.firebaseapp.com",
  databaseURL: "https://barter-system-a7ced.firebaseio.com",
  projectId: "barter-system-a7ced",
  storageBucket: "barter-system-a7ced.appspot.com",
  messagingSenderId: "790811302722",
  appId: "1:790811302722:web:a8bdc1c36cbcfffd1c86db"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();