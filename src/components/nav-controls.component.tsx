import React, { useContext } from 'react';

import { Loading } from "./loading.component";
import { User, UserInterface } from '../store/user.store'
import { useAuth } from '../hooks/use-auth.hook';
import { useHistory } from 'react-router-dom'
export const NavControls = () => {
    const { userState } = useContext<UserInterface>(User);
    const { login, logout, loading } = useAuth();
    const history = useHistory();
    return (
        <>
            {userState.user.uid === '' && !loading &&
                <div className="login-container">
                    <button className="login" onClick={login}> Sign In</button>
                </div>
            }
            <div className="nav-button-wrapper">
                {userState.user.uid !== '' &&
                    <div>
                        {history.location.pathname === '/create-game'
                            ? <button onClick={() => { history.push('/') }}>active games</button>
                            : <button onClick={() => { history.push('/create-game') }}>organize games</button>
                        }
                        <button className="logout" onClick={logout}>Sign out</button>
                    </div>

                }
            </div>
            {/* <h3>Secret Santanator Game 3000-v0.2</h3> */}
            {loading && <Loading />}
        </>
    )
}