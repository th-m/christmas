import { db, CB, realTimedb } from './constants'
export { auth, db, firebase, provider, storage } from './constants'
export { fbSignUp } from './facebook.auth'

export const getUser = (uid: string, cb: CB) => {
  db.collection('users').doc(uid).get().then(querySnapshot => cb({ ...querySnapshot.data() }));
}
export const getGame = (gameKey: string, cb: CB) => {
  db.collection('games').where("gameKey", "==", gameKey).get().then(querySnapshot => {

    querySnapshot.forEach(function (doc) {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      cb({ gid: doc.id, ...doc.data() })
    })
  });
}

export const getGameUser = (id: string, uid: string, cb: CB) => {
  db.collection('games').doc(id).collection('users').where("id", "==", uid).get().then(querySnapshot => {
    querySnapshot.forEach(function (doc) {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      cb(doc.data())
    })
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
  if (uid === '' || !uid) return;
  db.collection('users').doc(uid).set({ questionnaire: data }, { merge: true })
    .then(() => {
      cb('success');
    }).catch(error => {
      console.error("Error upsertQuestoinnaire: ", error);
    });
}


function get(path) {
  return realTimedb.ref(path).once("value").then(snapshot => {
    return snapshot.val();
  });
}