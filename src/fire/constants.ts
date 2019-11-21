// import firebase from 'firebase'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/messaging';

const config = {
    apiKey: "AIzaSyBiy8ikGtlf8MVWeWkDlZFRHkY5WhDppVU",
    authDomain: "christmas-464ee.firebaseapp.com",
    databaseURL: "https://christmas-464ee.firebaseio.com",
    projectId: "christmas-464ee",
    storageBucket: "christmas-464ee.appspot.com",
    messagingSenderId: "763611236376",
    appId: "1:763611236376:web:1295b2a40fc1b28a421b6d"
}

firebase.initializeApp(config)
export const realTimedb = firebase.database();
const db = firebase.firestore();
db.enablePersistence()
    .catch(function (err) {
        if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
        } else if (err.code === 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
        }
    });

const auth = firebase.auth();
const provider = new firebase.auth.FacebookAuthProvider();

const storage = firebase.storage();

export type CB = (querySnapshot: Object | any) => any;

// const messaging = firebase.messaging();
// messaging.usePublicVapidKey("BBO_ykHs1baLCNx8XINwHREnwFva6z7R8TNgGRC2UW9dRlzAapHynvpcvAW3PhpL83jS9miMPomtKd9l9dY_cn8");
// messaging.requestPermission()
//     .then(() => {
//         console.log('permission granted');
//         return messaging.getToken();
//     }).then(token => {
//         console.log({ token }) // associate this token with user
//     }).catch(() => {
//         console.log('permission denied');
//     })

export { auth, db, firebase, provider, storage };

