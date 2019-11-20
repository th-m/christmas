import { useContext, useEffect } from "react";
import { getUser, db, firebase } from '../fire'
import { User, UserInterface } from "../store/user.store";
export const useAuth = () => {
    const { userState, dispatchUser } = useContext<UserInterface>(User);

    const handleUserLogin = (userData) => {
        dispatchUser({ type: 'login', payload: userData });
    }

    const handleUserLogout = () => {
        dispatchUser({ type: 'logout' });
    }

    useEffect(() => {
        // Handle active user
        firebase.auth().onAuthStateChanged(function (user) {
            console.log(user);
            if (user && userState.user.uid === '') {
                getUser(user.uid, handleUserLogin)
            } else if (!user && userState.user) {
                handleUserLogout()
            }
        });

        // // Handle oauth redirect for mobile
        // firebase.auth().getRedirectResult().then(function (result) {
        //     // @ts-ignore
        //     const { uid, displayName, email, phoneNumber, providerData } = result.user;
        //     const coll = { uid, displayName, email, providerId: 'facebook', photoURL: `https://avatars.io/facebook/${providerData[0].uid}`, phoneNumber };
        //     db.collection("users").doc(uid).set(coll)
        //         .then(function () {
        //             console.log("user added to db!");
        //         })
        //         .catch(function (error) {
        //             console.error("Error writing document: ", error);
        //         });
        // }).catch(function (error) {
        //     console.log(error);
        // });
    });

}