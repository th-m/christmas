import React, { useContext, useEffect } from 'react';
import './App.css';
import { AboutMe } from './components/about-me/about-me.component';
import { UserProvider, User, UserInterface } from './store/user.store'
import { fbSignUp } from './fire';
import { useAuth } from './hooks/auth.hook';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { realTimedb, db } from './fire/constants';
import { updateUserInfo } from './fire/facebook.auth';
function get(path) {
  return realTimedb.ref(path).once("value").then(snapshot => {
    return snapshot.val();
  });
}
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
  <Router>
    <Switch>

      <Route path="/:gameId" render={() => <UserProvider>
        <App />
      </UserProvider>} />
      <Route render={() => <UserProvider>
        <App />
      </UserProvider>} />

    </Switch>
  </Router>
)

export default WrappedApp;



