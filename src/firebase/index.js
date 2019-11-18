import { ref, db, firebaseAuth } from './constants.js'

const auth = firebaseAuth;

function get(path) {
  return db.ref(path).once("value").then(snapshot => {
    return snapshot.val();
  });
}

function listen(path) {
  return db.ref(path);
}

function update(path, data) {
  return db.ref(path).set(data);
}

function push(path, data) {
  db.ref(path).push(data);
}

function remove(path) {
  db.ref(path).remove();
}

export { auth, db, get, listen, push, update, remove };