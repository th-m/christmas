import { db, CB } from './constants'
export { auth, db, firebase, provider, storage } from './constants'
export { fbSignUp } from './facebook.auth'
export const getUser = (uid: string, cb: CB) => {
  db.collection('users').doc(uid).get().then(querySnapshot => cb({ ...querySnapshot.data() }));
}