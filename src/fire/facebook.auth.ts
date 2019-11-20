

import { auth, db, firebase } from '.'
import { mobilecheck } from '../utils';

const provider = new firebase.auth.FacebookAuthProvider();
export const handleSignin = (result) => {
    // @ts-ignore
    const { uid, displayName, email, phoneNumber, providerData } = result.user;

    const coll = { uid, displayName, email, providerId: 'facebook', photoURL: `https://avatars.io/facebook/${providerData[0].uid}`, phoneNumber, lastLogin: (new Date()) };
    db.collection("users").doc(uid).set(coll, { merge: true })
        .then(function () {
            console.log("user upated in db db!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
}

export const fbSignUp = () => {
    if (mobilecheck()) {
        auth.signInWithPopup(provider).then(handleSignin).catch((error) => console.log({ error }));
    } else {
        auth.signInWithRedirect(provider).then(handleSignin).catch((error) => console.log({ error }));
    }
}

