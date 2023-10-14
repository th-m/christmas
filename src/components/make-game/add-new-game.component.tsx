import React, { useContext, useState, useEffect } from "react";
import { makeid } from "../../utils";
import { addGame, addUserToGame, User } from "../../fire";
import { useUser } from "@clerk/clerk-react";

interface Props {
  setGames: any;
  games: any[];
}
export const AddNewGame = ({ setGames, games }: Props) => {
  const { user } = useUser();

  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const myFormData = new FormData(e.currentTarget);

    const gameDetails = {};
    myFormData.forEach((value, key) => (gameDetails[key] = value));

    const gameKey = makeid(6);
    const creatorId = user?.id;
    if (creatorId) {
      addGame({ ...gameDetails, gameKey, creatorId }, (game) => {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);

        setGames([...games, game]);
        addUserToGame(gameKey, user as unknown as User, () => {
          console.log("added to game");
        });
      });
    }
  };
  // https://santa-nator.com/dh2if5
  return (
    <form className="questionnaire" onSubmit={handleSubmit}>
      <div className="question">
        <label>Name for the group</label>
        <textarea id={"name"} name={"name"}></textarea>
      </div>
      <div className="question">
        <label>Budget</label>
        <textarea id={"budget"} name={"budget"}></textarea>
      </div>
      <div className="question">
        <label>Anything else?</label>
        <textarea id={"notes"} name={"notes"}></textarea>
      </div>
      <div>
        <button type="submit">{success ? `success` : `save`} </button>
      </div>
    </form>
  );
};
