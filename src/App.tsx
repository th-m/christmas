import React, { useContext, useEffect } from 'react';
import './App.css';
import { AboutMe } from './components/about-me.component';
import { UserProvider, User, UserInterface } from './store/user.store'
import { fbSignUp } from './fire';
import { useAuth } from './hooks/auth.hook';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const App = () => {
  const { userState } = useContext<UserInterface>(User);
  useAuth();

  return (
    <div className="App">
      <h3>
        Secret Santanator Game 3000-v0.2
      </h3>
      {userState.user.uid !== ''
        ?
        <AboutMe />
        : <button onClick={fbSignUp}> Sign In</button>
      }
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



