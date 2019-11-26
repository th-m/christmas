import { db, CB, realTimedb } from './constants'
export { auth, db, firebase, provider, storage } from './constants'
export { fbSignUp } from './facebook.auth'

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

export const addUserToGame = (gameKey: string, { user }, cb) => {
  const data = user;
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