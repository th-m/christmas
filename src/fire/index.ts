import { UserState } from '../store/user.store';
// export { auth, db, CB, firebase, storage } from './constants'

import firebase from 'firebase';
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

firebase.initializeApp(config);

const auth = firebase.auth();

export const storage = firebase.storage();
const db = firebase.database();
export const store = firebase.firestore();
store.enablePersistence()
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

export type CB = (querySnapshot: Object | any) => any;
export function isFacebookApp() {
  var ua = navigator.userAgent || navigator.vendor;
  return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
}


export const getUser = (uid: string, cb: CB) => {
  store.collection('users').doc(uid).get().then(querySnapshot => cb({ ...querySnapshot.data() }));
}

export const updateUserInfo = (result: { user: any }, moreData = {}) => {
  const { uid, displayName, email, phoneNumber, providerData, photoURL, ...rest } = result.user;

  const updateInfo = { uid, displayName, email, phoneNumber, photoURL, lastLogin: (new Date()) };

  store.collection("users").doc(uid).set({ ...updateInfo, ...moreData }, { merge: true })
    .then(function () {
      console.log("user upated in db db!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}
export const getGame = (gameKey: string, cb: CB) => {
  store.collection('games').where("gameKey", "==", gameKey).get().then(querySnapshot => {
    const games: any[] = []
    querySnapshot.forEach(function (doc) {
      games.push({ gid: doc.id, ...doc.data() })
    })
    if (games.length < 1) {
      console.log('no game with that key', { gameKey });
      cb(null)
    } else {
      cb(games[0])
    }
  });
}

export const getGameUser = (gid: string, uid: string, cb: CB) => {
  store.collection('games').doc(gid).collection('users').doc(uid).get().then(doc => {
    const d = doc.data();
    cb(d)
  })
}

export const getGameUsers = (gid: string, cb: CB) => {
  store.collection('games').doc(gid).collection('users').onSnapshot(querySnapshot => {
    const users: Object[] = [];
    querySnapshot.forEach(function (doc) {
      users.push({ uid: doc.id, ...doc.data() })
    })
    cb(users)
  });
}
export const getCreatorsGames = (uid: string, cb: CB) => {
  store.collection('games').where("creatorId", "==", uid).onSnapshot(querySnapshot => {
    const games: Object[] = [];
    querySnapshot.forEach(function (doc) {
      games.push({ gid: doc.id, ...doc.data() })
    })
    cb(games)
  });
}

export const getQuestions = (uid: string, cb: CB) => {
  if (uid === '' || !uid) { return }
  return store.collection('users').doc(uid).get().then(querySnapshot => cb({ ...querySnapshot.data() }));
}

interface Questionnaire {
  author: string;
  color: string;
  dislike: string;
  giftcard: string;
  id: string;
  music: string;
  perfectday: string;
  relax: string;
  treat: string;
  worstday: string;
}

export const upsertQuestoinnaire = (uid: string, data: Questionnaire, cb) => {
  if (!uid || uid === '') {
    console.log(`if (!uid || uid === '' ) `)
    return;
  }
  store.collection('users').doc(uid).set({ questionnaire: data }, { merge: true })
    .then(() => {
      cb('success');
    }).catch(error => {
      console.error("Error upsertQuestoinnaire: ", error);
    });
}

export const updateGameUserInfo = (gid: string, data, cb) => {
  if (!gid || gid === '') {
    console.log(`updateGameUserInfo if (!uid || uid === '' ) `)
    return;
  }
  if (!data || !data.uid || data.uid === '') {
    console.log(`updateGameUserInfo if (!data || !data.uid || data.uid === '' ) `)
    return;
  }
  store.collection('games').doc(gid).collection('users').doc(data.uid).set({ ...data }, { merge: true })
    .then(() => {
      cb('success');
    }).catch(error => {
      console.error("Error upsertQuestoinnaire: ", error);
    });
}

export const addUserToGame = (gameKey: string, data: UserState, cb) => {
  if (gameKey === '' || !gameKey) {
    console.log(`if (gameKey === '' || !gameKey)`)
    return;
  }
  if (!data || !data.uid || data.uid === '') {
    console.log(`if (!data || !data.uid || data.uid === '')`)
    return;
  }
  console.log('gameKey', gameKey);
  getGame(gameKey, (responseData) => {
    console.log(responseData);
    const updateData = {
      displayName: data.displayName,
      photoURL: data.photoURL,
      uid: data.uid,
      exclude: [],
      has: "",
      name: "",
    }
    if (!responseData || !responseData.gid) {
      console.log('woops that game dont exist');
      return;
    }
    store.collection('games').doc(responseData.gid).collection('users').doc(data.uid).set(updateData, { merge: true })
      .then(() => {
        cb('success');
      }).catch(error => {
        console.error("Error upsertQuestoinnaire: ", error);
      });
  })
}

export const addGame = (data, cb) => {
  if (!data || !data.creatorId || data.creatorId === '') {
    console.error('(!data || !data.creatorId || data.creatorId === ')
    return;
  }
  if (!data.gameKey || data.gameKey === '') {
    console.error('(!data.gameKey || data.gameKey === ')
    return;
  }

  store.collection('games').add(data).then(d => { cb(true) }).catch(e => { console.error(e) })

}
