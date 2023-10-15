import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { AboutMe } from "./components/about-me.component";
import { MakeGame } from "./components/make-game/make-game.component";
import { NavControls } from "./components/nav-controls.component";

import {
  BrowserRouter as Router,
  Route,
  useNavigate,
  Routes,
  useLocation,
} from "react-router-dom";
import { useParams } from "react-router-dom";
import { User, addUserToGame, addUser, getUser } from "./fire";

import { ClerkProvider, useUser } from "@clerk/clerk-react";

const clerkPubKey = "pk_test_c3VpdGVkLWZhbGNvbi00Ni5jbGVyay5hY2NvdW50cy5kZXYk";

const InitiateAboutMe = () => {
  const { user } = useUser();
  const { gameKey } = useParams<any>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (gameKey) {
      localStorage.setItem("gameKey", gameKey);
    }
    
    if (user?.id) {
      getUser(user.id, (_user) => {
        if (!_user) {
          // @ts-ignore
          addUser(user);
        }

        const storageGameKey = localStorage.getItem("gameKey");
        if (storageGameKey) {
          const inGame = _user?.games?.findIndex((g) => g.gameKey === gameKey);
          if (inGame !== undefined && inGame >= 0) {
            localStorage.removeItem("gameKey");
            navigate("/");
          } else {
            addUserToGame(storageGameKey, _user as unknown as User, (d) => {
              console.log("added")
            });
          }
        }
      });
    }
  }, [gameKey, user?.id]);

  if (location.pathname.includes("create-game")) {
    return null;
  }
  return <>{!!user?.id && <AboutMe />}</>;
};

const AppRouter = () => {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <div className="App">
        <Router>
          <NavControls />

          <Routes>
            <Route path="/" element={<InitiateAboutMe />} />
            <Route path="/:gameKey" element={<InitiateAboutMe />} />
            <Route path="/create-game" element={<MakeGame />} />
          </Routes>
        </Router>
      </div>
    </ClerkProvider>
  );
};

export default AppRouter;
