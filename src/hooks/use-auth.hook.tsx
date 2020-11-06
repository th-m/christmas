import { useContext, useEffect, useState } from "react";
import { getUser, firebase } from '../fire'
import { User, UserInterface } from "../store/user.store";
import { updateUserInfo } from "../fire/facebook.auth";
import {
    useParams
} from 'react-router-dom'
const santaLoadingKey = 'santa-nator-loading';

const checkLocalStorageLoading = () => {
    const isLoading = localStorage.getItem(santaLoadingKey);
    if (!isLoading) {
        return false;
    }
    return isLoading === "true" ? true : false;
}
export const useAuth = () => {
    // let { gameId } = useParams()
    const { state, dispatch } = useContext(User);
    const [loading, setLoading] = useState(checkLocalStorageLoading());

    const handleUserLogin = (userData) => {
        dispatch({ type: 'login', payload: userData });
        handleLoadingChange(false);
    }
    const handleLoadingChange = (b: boolean) => {
        setLoading(b);
        localStorage.setItem(santaLoadingKey, b ? 'true' : 'false');
    }
    const handleUserLogout = () => {
        dispatch({ type: 'logout' });
    }
    const logout = async () => {
        try {
            await firebase.auth().signOut();
            handleUserLogout();
        } catch (e) {
            console.warn(e);
        }
    }
    // const login = () => {
    //     handleLoadingChange(true);
    //     fbSignUp();
    // }
    useEffect(() => {
        // Handle active user
        firebase.auth().onAuthStateChanged(function (result) {
            if (result && state.user.uid === '') {
                // console.log(gameId);
                // if (gameId) {
                //     updateUserInfo({ user: result }, {
                //         games: {
                //             [gameId]: {
                //                 has: "",
                //                 name: "",
                //             }
                //         }
                //     });
                // } else {
                updateUserInfo({ user: result });
                // }
                getUser(result.uid, handleUserLogin)
            } else if (!result && state.user) {
                handleUserLogout()
            }
        });

        firebase.auth().getRedirectResult().then(function (result) {
            // @ts-ignore
            if (result.user && userState.user.uid === '') {
                updateUserInfo(result);
                getUser(result.user.uid, handleUserLogin);
            }
        }).catch(function (error) {
            console.log(error);
        });
        // Handle oauth redirect for mobile
    });

    return { logout, loading }
}