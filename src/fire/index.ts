import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  getDoc,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { Questionnaire } from "../components/questionnaire.component";

const config = {
  apiKey: "AIzaSyBiy8ikGtlf8MVWeWkDlZFRHkY5WhDppVU",
  authDomain: "christmas-464ee.firebaseapp.com",
  databaseURL: "https://christmas-464ee.firebaseio.com",
  projectId: "christmas-464ee",
  storageBucket: "christmas-464ee.appspot.com",
  messagingSenderId: "763611236376",
  appId: "1:763611236376:web:1295b2a40fc1b28a421b6d",
};

const app = initializeApp(config);

export const store = getFirestore(app);

export type CB = (querySnapshot: Object | any) => any;

const gamesCol = collection(store, "games");
export const getUser = async (uid: string, cb: CB) => {
  const userDoc = doc(store, `users/${uid}`);
  const usersSnapshot = await getDoc(userDoc);
  cb(usersSnapshot.data());
};
export interface GameUser {
  fullName: string;
  exclude: string[];
  has: string;
  id: string;
  name: string;
  imageUrl: string;
  uid: string;
  gameKey: string;
}
export interface User {
  id: string;
  fullName: string;
  emailAddresses: string;
  userName: string;
  phone: string;
  imageUrl: string;
  games: [GameUser];
  questionnaire: any;
}
export const getCleanedUserObject = (user: any) => {
  const { fullName, emailAddresses, id, imageUrl, userName } = user;
  return JSON.parse(
    JSON.stringify({ fullName, emailAddresses, id, imageUrl, userName })
  );
};
export const updateUserInfo = (user: any) => {
  const userDoc = doc(store, `users/${user.id}`);

  // const _data = { ...getCleanedUserObject(user), ...moreData };
  // console.log({user,moreData,_data})
  updateDoc(userDoc, user)
    .then(function () {
      console.log("user upated in db!", { user });
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
};

export const addUser = (user: User, moreData = {}) => {
  // const usersCol = collection(store, `users`);
  const userDoc = doc(store, `users/${user.id}`);
  const data = { ...getCleanedUserObject(user), ...moreData };
  setDoc(userDoc, { ...getCleanedUserObject(user), ...moreData })
    .then(function () {
      console.log("added user in db db!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
};
export const getGame = async (gameKey: string, cb: CB) => {
  const q = query(gamesCol, where("gameKey", "==", gameKey));
  const snapshot = await getDocs(q);
  const gamesList = snapshot.docs.map((doc) => ({
    gid: doc.id,
    ...doc.data(),
  }));
  console.log({gameKey,gamesList})
  cb(gamesList[0]);
  return gamesList[0];
};

export const getGameUser = async (gid: string, uid: string, cb: CB) => {
  const userDoc = doc(store, `games/${gid}/users/${uid}`);
  const snapshot = await getDoc(userDoc);
  cb(snapshot.data());
};

export const getGameUsers = async (gid: string, cb: CB) => {
  const usersCol = collection(store, `games/${gid}/users`);
  const snapshot = await getDocs(usersCol);
  const users = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
  cb(users);
};
export const getCreatorsGames = async (uid: string, cb: CB) => {
  const q = query(gamesCol, where("creatorId", "==", uid));
  const snapshot = await getDocs(q);
  const gamesList = snapshot.docs.map((doc) => ({
    gid: doc.id,
    ...doc.data(),
  }));
  cb(gamesList);
};



export const upsertQuestoinnaire = (uid: string, data: Questionnaire, cb) => {
  if (!uid || uid === "") {
    console.log(`if (!uid || uid === '' ) `);
    return;
  }
  const userDoc = doc(store, `users/${uid}`);

  setDoc(userDoc, { questionnaire: data }, { merge: true })
    .then(function () {
      console.log("user questionnair in db db!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
};

// TODO CHECK THIS OUT
export const updateGameUserInfo = (gameKey: string, user: GameUser, cb) => {
  if (!gameKey || gameKey === "") {
    console.log(`updateGameUserInfo if (!uid || uid === '' ) `);
    return;
  }
  if (!user || !user.id || user.id === "") {
    console.log(
      `updateGameUserInfo if (!data || !data.uid || data.uid === '' ) `
    );
    return;
  }
  console.log({user})
  getGame(gameKey, ({gid})=>{

  
  const userDoc = doc(store, `games/${gid}/users/${user.id}`);

  setDoc(userDoc, { ...user }, { merge: true })
    .then(function () {
      console.log("udpate game users!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
  
    getUser(user.id, (_user) => {
      const games = _user.games;
      const hasGame = games.findIndex((g) => g.gameKey === gameKey);
      if (hasGame === -1) {
        //@ts-ignore
        // games.push({user});

      }else{
        delete _user.games
        games[hasGame] = {...games[hasGame],...user}
      }
      // console.log({_user, games});
      updateUserInfo({..._user,games})
    
    })
  })
};

export const addUserToGame = (gameKey: string, user: User, cb) => {
  if (gameKey === "" || !gameKey) {
    console.log(`if (gameKey === '' || !gameKey)`);
    return;
  }
  if (!user || !user.id || user.id === "") {
    console.log(`if (!data || !data.uid || data.uid === '')`);
    return;
  }


  getGame(gameKey, (responseData) => {
    console.log(responseData);

   
    if (!responseData || !responseData.gid) {
      console.log("woops that game dont exist");
      return;
    }
    console.log("lets update", user);
    const games = user?.games ?? [];
    const hasGame = games.findIndex((g) => g.gameKey === gameKey);
    if (hasGame === -1) {
      //@ts-ignore
      games.push({ gameKey, ...responseData });
      console.log({ games });
      updateUserInfo({ ...user, games });
    }
    // https://santa-nator.com/030w64
    const userDoc = doc(store, `games/${responseData.gid}/users/${user.id}`);

    setDoc(userDoc, { ...getCleanedUserObject(user) }, { merge: true })
      .then(function () {
        console.log("user questionnair in db db!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });

    cb();
  });
};

export const addGame = async (data, cb) => {
  if (!data || !data.creatorId || data.creatorId === "") {
    console.error("(!data || !data.creatorId || data.creatorId === ");
    return;
  }
  if (!data.gameKey || data.gameKey === "") {
    console.error("(!data.gameKey || data.gameKey === ");
    return;
  }
  const resp = await addDoc(gamesCol, data);
  cb({ gid: resp.id, ...data });
  // store.collection('games').add(data).then(d => { cb(true) }).catch(e => { console.error(e) })
};
