import React, { useContext, useEffect } from 'react';
import './App.css';
import { AboutMe } from './components/about-me.component';
import { Loading } from './components/loading.component';
import { UserProvider, User, UserInterface } from './store/user.store'
import { fbSignUp } from './fire';
import { useAuth } from './hooks/use-auth.hook';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const App = () => {
  const { userState } = useContext<UserInterface>(User);
  const { login, logout, loading } = useAuth();
  return (
    <div className="App">
      {userState.user.uid === '' && !loading &&
        <button onClick={login}> Sign In</button>
      }
      {userState.user.uid !== '' &&
        <button onClick={logout}>Sign out</button>

      }

      <h3>
        Secret Santanator Game 3000-v0.2
      </h3>
      {loading && <Loading />}
      {userState.user.uid !== '' && <AboutMe />}
    </div>
  );
}

const WrappedApp = () => (
  <UserProvider>
    <Router>
      <Switch>
        <Route path="/:gameId" component={App} />
        <Route component={App} />
      </Switch>
    </Router>
  </UserProvider>
)

export default WrappedApp;



