import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBiy8ikGtlf8MVWeWkDlZFRHkY5WhDppVU",
    authDomain: "christmas-464ee.firebaseapp.com",
    databaseURL: "https://christmas-464ee.firebaseio.com",
    projectId: "christmas-464ee",
    storageBucket: "christmas-464ee.appspot.com",
    messagingSenderId: "763611236376"
}

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const db = firebase.database()
export const firebaseAuth = firebase.auth