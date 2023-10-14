import React, { useState, useEffect } from "react";

import { useGames } from "../hooks/use-games.hook";
import { Questionnaire } from "./questionnaire.component";
import { User, getCleanedUserObject, getUser } from "../fire";
import { updateUserInfo } from "../fire";
import { Beneficiary } from "./beneficiary.component";
import { useUser } from "@clerk/clerk-react";

const initialBeneficiary = {
  fullName: "",
  imageUrl: "",
};

export const AboutMe = () => {
  const { user } = useUser();

  const [showQuestions, setShowQuestions] = useState(true);
  const [beneficiary, setBeneficiary] = useState<any>(initialBeneficiary);
  const { games, selectedGame, setSelectedGame, secrets } = useGames();

  useEffect(() => {
    if (selectedGame && secrets && secrets.has && user && user.id) {
      if (user?.id) {
        getUser(user?.id, (_user) => {
          const games = _user.games;
          const i = games.findIndex((g) => g.gid === secrets.id);
          if (i < 0) {
            games.push({ gameKey: secrets });
          } else [(games[i] = { ...games[i], ...secrets })];
        });
      }
    }
  }, [selectedGame, JSON.stringify(secrets)]);

  const handleChange = (event) => {
    if (event.target.value !== selectedGame) {
      setBeneficiary(initialBeneficiary);
      setShowQuestions(true);
      setSelectedGame(event.target.value);
    }
  };

  const handleClick = () => {
    setShowQuestions(!showQuestions);
    if (!beneficiary.fullName) {
      getUser(secrets.has, (data) => setBeneficiary(data));
    }
  };
  return (
    <div>
      <div>
       
        <div
          style={{
            display: "flex",
            paddingTop: '1rem',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
             maxWidth:600, margin:'auto'
          }}
        >
          {!!secrets?.has && (
            <button onClick={handleClick}>
              <h5>
                {showQuestions
                  ? "Click to see who you got"
                  : "Back to your profile"}
              </h5>
            </button>
          )}

          {games && games.length >= 1 && (
            <select onChange={handleChange}>
              {
                // @ts-ignore }
              }
              {games.map((game, i) => (
                <option key={`${i}-${game.gameKey}`} value={game.gameKey}>
                  {game.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="avatar_container">
          <img
            className="avatar"
            alt={
              showQuestions ? user?.fullName ?? "" : beneficiary?.fullName ?? ""
            }
            src={
              showQuestions ? `${user?.imageUrl}` : `${beneficiary?.imageUrl}`
            }
            style={{ width: 100, height: 100 }}
          />
        </div>
      </div>
      {showQuestions ? (
        <Questionnaire />
      ) : (
        <Beneficiary beneficiary={beneficiary} />
      )}
    </div>
  );
};
