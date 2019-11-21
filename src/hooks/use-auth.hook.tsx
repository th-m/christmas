import { useContext, useEffect } from "react";
import { getUser, firebase } from '../fire'
import { User, UserInterface } from "../store/user.store";
import { updateUserInfo, fbSignUp } from "../fire/facebook.auth";
import {
    useParams
} from 'react-router-dom'
export const useAuth = () => {
    let { gameId } = useParams()
    const { userState, dispatchUser } = useContext<UserInterface>(User);

    const handleUserLogin = (userData) => {
        dispatchUser({ type: 'login', payload: userData });
    }

    const handleUserLogout = () => {
        dispatchUser({ type: 'logout' });
    }
    const logout = async () => {
        try {
            await firebase.auth().signOut();
            handleUserLogout();
            // signed out
        } catch (e) {
            console.warn(e);
            // an error
        }
    }
    const login = () => {
        fbSignUp();
    }
    useEffect(() => {
        // Handle active user
        firebase.auth().onAuthStateChanged(function (result) {
            if (result && userState.user.uid === '') {
                console.log(gameId);
                if (gameId) {
                    updateUserInfo({ user: result }, {
                        games: {
                            [gameId]: {
                                has: "",
                                name: "",
                            }
                        }
                    });
                } else {
                    updateUserInfo({ user: result });
                }
                getUser(result.uid, handleUserLogin)
            } else if (!result && userState.user) {
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

    return { login, logout }
}