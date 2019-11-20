import { db, CB } from './constants'
export { auth, db, firebase, provider, storage } from './constants'
export { fbSignUp } from './facebook.auth'

export const getUser = (uid: string, cb: CB) => {
  db.collection('users').doc(uid).get().then(querySnapshot => cb({ ...querySnapshot.data() }));
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