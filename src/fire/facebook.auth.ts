

import { auth, db, firebase } from '.'
import { mobilecheck } from '../utils';

const provider = new firebase.auth.FacebookAuthProvider();

const handleSignin = (result) => {
    // @ts-ignore
    const { uid, displayName, email, phoneNumber, providerData } = result.user;

    const coll = { uid, displayName, email, providerId: 'facebook', photoURL: `https://avatars.io/facebook/${providerData[0].uid}`, phoneNumber };
    db.collection("users").doc(uid).set(coll)
        .then(function () {
            console.log("user added to db!");
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


