

import { db } from '.'


export const updateUserInfo = (result, moreData = {}) => {
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

