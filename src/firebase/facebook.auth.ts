
import { auth, db, push, get } from '.'
import firebase from 'firebase'
const provider = new firebase.auth.FacebookAuthProvider();
import { mobilecheck } from '../utils';

const handleResponse = result => {
    // @ts-ignore
    const { uid, displayName, email, phoneNumber, providerData } = result.user;
    const coll = { uid, displayName, email, providerId: 'facebook', photoURL: `https://avatars.io/facebook/${providerData[0].uid}`, phoneNumber };
    get(`/users/${uid}`).then(x => {
        if (!x) {
            push(`/users/${uid}`, coll);
        }
    })
}

export const fbSignUp = () => {
    if (mobilecheck()) {
        auth.signInWithPopup(provider).then(handleResponse).catch(error => {
            console.warn({ error });
        })
    } else {
        auth.signInWithRedirect(provider).then(handleResponse).catch(error => {
            console.warn({ error });
        });
    }
}


