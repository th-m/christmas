import { useContext, useEffect } from "react";
import { getUser, firebase } from '../fire'
import { User, UserInterface } from "../store/user.store";
import { handleSignin } from "../fire/facebook.auth";
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
        firebase.auth().onAuthStateChanged(function (result) {
            if (result && userState.user.uid === '') {
                handleSignin({ user: result });
                getUser(result.uid, handleUserLogin)
            } else if (!result && userState.user) {
                handleUserLogout()
            }
        });

        // Handle oauth redirect for mobile
        firebase.auth().getRedirectResult().then(function (result) {
            // @ts-ignore
            handleSignin(result);
        }).catch(function (error) {
            console.log(error);
        });
    });

}