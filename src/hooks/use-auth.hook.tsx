import firebase from "firebase";
import { useContext, useEffect, useState } from "react";
import { getUser } from '../fire'
import { User } from "../store/user.store";
import { updateUserInfo } from "../fire";

const santaLoadingKey = 'santa-nator-loading';

const checkLocalStorageLoading = () => {
    const isLoading = localStorage.getItem(santaLoadingKey);
    if (!isLoading) {
        return false;
    }
    return isLoading === "true" ? true : false;
}
export const useAuth = () => {
    const { state, dispatch } = useContext(User);
    const [loading, setLoading] = useState(checkLocalStorageLoading());

    const handleUserLogin = (userData) => {
        dispatch({ type: 'login', payload: userData });
    }


    const logout = async () => {
        try {
            await firebase.auth().signOut();
            dispatch({ type: 'logout' });
        } catch (e) {
            console.warn(e);
        }
    }

    useEffect(() => {
        // Handle active user
        firebase.auth().onAuthStateChanged(function (result) {
            console.log('auth change', { result })
            if (result && state.user.uid === '') {
                updateUserInfo({ user: result });
                getUser(result.uid, handleUserLogin)
            }
        });



    }, []);

    return { logout, loading }
}