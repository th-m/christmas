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

// firebase.initializeApp(config)
firebase.initializeApp(config);
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
// const provider = new firebase.auth.FacebookAuthProvider();

const storage = firebase.storage();

export type CB = (querySnapshot: Object | any) => any;
function isFacebookApp() {
  // @ts-ignore
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
}

if (!isFacebookApp()) {
  const messaging = firebase.messaging();
  messaging.usePublicVapidKey("BBO_ykHs1baLCNx8XINwHREnwFva6z7R8TNgGRC2UW9dRlzAapHynvpcvAW3PhpL83jS9miMPomtKd9l9dY_cn8");
  messaging.requestPermission()
    .then(() => {
      console.log('permission granted');
      return messaging.getToken();
    }).then(token => {
      console.log({ token }) // associate this token with user
    }).catch(() => {
      console.log('permission denied');
    })
}

export { auth, db, firebase, storage };



export const getUser = (uid: string, cb: CB) => {
  db.collection('users').doc(uid).get().then(querySnapshot => cb({ ...querySnapshot.data() }));
}
export const getGame = (gameKey: string, cb: CB) => {
  db.collection('games').where("gameKey", "==", gameKey).get().then(querySnapshot => {
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
  db.collection('games').doc(gid).collection('users').doc(uid).get().then(doc => {
    const d = doc.data();
    cb(d)
  })
}

export const getGameUsers = (gid: string, cb: CB) => {
  db.collection('games').doc(gid).collection('users').onSnapshot(querySnapshot => {
    const users: Object[] = [];
    querySnapshot.forEach(function (doc) {
      users.push({ uid: doc.id, ...doc.data() })
    })
    cb(users)
  });
}
export const getCreatorsGames = (uid: string, cb: CB) => {
  db.collection('games').where("creatorId", "==", uid).onSnapshot(querySnapshot => {
    const games: Object[] = [];
    querySnapshot.forEach(function (doc) {
      games.push({ gid: doc.id, ...doc.data() })
    })
    cb(games)
  });
}

export const getQuestions = (uid: string, cb: CB) => {
  if (uid === '' || !uid) { return }
  return db.collection('users').doc(uid).get().then(querySnapshot => cb({ ...querySnapshot.data() }));
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
  db.collection('users').doc(uid).set({ questionnaire: data }, { merge: true })
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
  db.collection('games').doc(gid).collection('users').doc(data.uid).set({ ...data }, { merge: true })
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
    db.collection('games').doc(responseData.gid).collection('users').doc(data.uid).set(updateData, { merge: true })
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

  db.collection('games').add(data).then(d => { cb(true) }).catch(e => { console.error(e) })

}


// function get(path) {
//   return realTimedb.ref(path).once("value").then(snapshot => {
//     return snapshot.val();
//   });
// }