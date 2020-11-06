import firebase from 'firebase';
import React, { useContext, useEffect, useState } from 'react';
import { Loading } from "./loading.component";
import { User } from '../store/user.store'
import { useAuth } from '../hooks/use-auth.hook';
import { useHistory } from 'react-router-dom'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {
    useParams
} from 'react-router-dom'
import { isFacebookApp } from '../fire';

const uiConfig = {
    signInFlow: 'redirect',
    signInOptions: [
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ]
};


const cookie = key => ((new RegExp((key || '=') + '=(.*?); ', 'gm')).exec(document.cookie + '; ') || ['', null])[1]

const signInKey = 'signing-in-loading';
export const NavControls = () => {
    const { state: { user, isAuthenticated } } = useContext(User);
    const { logout, loading } = useAuth();
    const [signIn, setSignIn] = useState(false);
    const history = useHistory();
    const { gameKey } = useParams();

    const handleSignIn = () => {
        setSignIn(true)
        if (isFacebookApp()) {
            document.cookie = `${signInKey}=true`;
            localStorage.setItem(signInKey, signIn ? 'true' : 'false');
        }
    }

    useEffect(() => {
        const isSigningIn = localStorage.getItem(signInKey);
        const signInCookie = cookie(signInKey)
        if (isSigningIn === "true" || signInCookie === "true") {
            setSignIn(true)

            localStorage.setItem(signInKey, 'false');
            document.cookie = `${signInKey}=false`;
        }
    }, [])
    useEffect(() => {
        if (user.uid !== "") {
            setSignIn(false);
        }
    }, [user.uid ?? ''])
    console.log({ gameKey })
    return (
        <>
            {loading && <Loading />}
            {signIn &&
                <div className="login-container">
                    <StyledFirebaseAuth uiConfig={{ ...uiConfig, signInFlow: isFacebookApp() ? 'redirect' : 'popup', signInSuccessUrl: `/${gameKey ?? ''}` }} firebaseAuth={firebase.auth()} />
                </div>
            }

            <div className="amazon-banner">
                <div className={user.uid === '' ? "nav-button-wrapper-logged-out" : "nav-button-wrapper-logged-in"}>
                    {user.uid !== '' &&
                        <>
                            {history.location.pathname === '/create-game'
                                ? <button onClick={() => { history.push('/') }}>active games</button>
                                : <button onClick={() => { history.push('/create-game') }}>organize games</button>
                            }
                        </>
                    }
                    <a href="https://www.amazon.com/?tag=thmcodes-20&linkCode=ez" target="_blank"><button>Buy Stuff</button></a>
                    {user.uid !== '' ? <button onClick={logout}>Sign out</button> : <button onClick={handleSignIn}>Sign in</button>}
                </div>
            </div>


        </>
    )
}

                        // {/* <iframe src="//rcm-na.amazon-adsystem.com/e/cm?o=1&p=26&l=ur1&category=amazonhomepage&f=ifr&linkID=3bbe1b0cd2947cd880f38191e5cc9720&t=thmcodes-20&tracking_id=thmcodes-20" width="468" height="60" scrolling="no" marginWidth={0} style={{ border: "none;" }} frameBorder="0"></iframe> */}
