import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { AboutMe } from './components/about-me.component';
import { MakeGame } from './components/make-game/make-game.component';
import { NavControls } from './components/nav-controls.component';
import { User, UserInterface, UserProviderHoc } from './store/user.store'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  useParams
} from 'react-router-dom'
import { updateUserInfo } from './fire/facebook.auth';
import { addUserToGame } from './fire';
import { useHistory } from 'react-router-dom'

const InitiateAboutMe = () => {
  const { userState } = useContext<UserInterface>(User);
  const { gameKey } = useParams();
  const history = useHistory();
  useEffect(() => {
    if (gameKey && gameKey !== '' && userState.user.uid !== '') {
      console.log(userState.user);
      if (userState.user.games && userState.user.games[gameKey]) {
        console.log('user has already been added to game');
        history.push('/')
      } else {
        console.log('lets add this bish', { gameKey });
        addUserToGame(gameKey, userState, (d) => {
          console.log('what did this func say', { d })
          updateUserInfo(userState, {
            games: {
              [gameKey]: {
                has: "",
                name: "",
              }
            }
          });
          console.log('added user info to the game');
          history.push('/');
        });
      }
    }
  }, [gameKey, userState.user.uid])

  return (
    <>
      {userState.user.uid !== '' &&
        <AboutMe />
      }
    </>
  );
}

const AppRouter = () => {
  return (
    <div className="App">
      <Router>
        <Route component={NavControls} />
        <Switch>
          <Route path="/create-game" component={MakeGame} />
          <Route path="/:gameKey" component={InitiateAboutMe} />
          <Route component={InitiateAboutMe} />
        </Switch>
      </Router>
    </div>
  )
}

export default UserProviderHoc(AppRouter);



