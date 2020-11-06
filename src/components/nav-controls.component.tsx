import firebase from 'firebase';
import React, { useContext } from 'react';
import { Loading } from "./loading.component";
import { User } from '../store/user.store'
import { useAuth } from '../hooks/use-auth.hook';
import { useHistory } from 'react-router-dom'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { auth } from '../fire';

const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ]
};

export const NavControls = () => {
    const { state: { user, isAuthenticated } } = useContext(User);
    const { logout, loading } = useAuth();
    const history = useHistory();

    return (
        <>
            {loading
                ? <Loading />
                :
                <div className="amazon-banner">
                    <div className={user.uid === '' ? "nav-button-wrapper-logged-out" : "nav-button-wrapper-logged-in"}>
                        {user.uid === '' && !loading &&
                            <div className="login-container">
                                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
                            </div>
                        }
                        {user.uid !== '' &&
                            <>
                                {history.location.pathname === '/create-game'
                                    ? <button onClick={() => { history.push('/') }}>active games</button>
                                    : <button onClick={() => { history.push('/create-game') }}>organize games</button>
                                }
                            </>
                        }
                        <a href="https://www.amazon.com/?tag=thmcodes-20&linkCode=ez" target="_blank"><button>Buy Stuff</button></a>
                        {/* <iframe src="//rcm-na.amazon-adsystem.com/e/cm?o=1&p=26&l=ur1&category=amazonhomepage&f=ifr&linkID=3bbe1b0cd2947cd880f38191e5cc9720&t=thmcodes-20&tracking_id=thmcodes-20" width="468" height="60" scrolling="no" marginWidth={0} style={{ border: "none;" }} frameBorder="0"></iframe> */}
                        {user.uid !== '' && <button onClick={logout}>Sign out</button>}
                    </div>
                </div>
            }
        </>
    )
}