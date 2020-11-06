

import { auth, db, firebase } from '.'
import { mobilecheck } from '../utils';

// const provider = new firebase.auth.FacebookAuthProvider();

export const updateUserInfo = (result, moreData = {}) => {
    // @ts-ignore
    const { uid, displayName, email, phoneNumber, providerData } = result.user;

    const updateInfo = { uid, displayName, email, providerId: 'facebook', phoneNumber, lastLogin: (new Date()) };
    if (providerData && providerData.length > 0) {
        // @ts-ignore
        updateInfo.photoURL = `https://avatars.io/facebook/${providerData[0].uid}`;
    }
    db.collection("users").doc(uid).set({ ...updateInfo, ...moreData }, { merge: true })
        .then(function () {
            console.log("user upated in db db!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
}

// export const fbSignUp = () => {
//     if (!mobilecheck()) {
//         auth.signInWithPopup(provider).then(updateUserInfo).catch((error) => console.log({ error }));
//     } else {
//         auth.signInWithRedirect(provider)
//             .then(updateUserInfo).catch((error) => console.log({ error }));
//     }
// }

