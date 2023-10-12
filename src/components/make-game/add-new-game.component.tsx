import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { makeid } from "../../utils";
import {
  getGame,
  addGame,
  getCreatorsGames,
  addUserToGame,
  User,
} from "../../fire";
import { useUser } from "@clerk/clerk-react";

interface Props {
  setGames: any;
  games:any[]
}
export const AddNewGame = ({ setGames,games }: Props) => {
  const { user } = useUser();
  const { register, handleSubmit } = useForm(); // initialise the hook

  const [success, setSuccess] = useState(false);

  const onSubmit = (gameDetails) => {
    const gameKey = makeid(6);
    const creatorId = user?.id;
    if (creatorId) {
      addGame({ ...gameDetails, gameKey, creatorId }, (game) => {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
       
        setGames([...games, game])
        addUserToGame(gameKey, user as unknown as User, () => {
          console.log("added to game");
        });
      });
    }
  };
  // https://santa-nator.com/dh2if5
  return (
    <form className="questionnaire" onSubmit={handleSubmit(onSubmit)}>
      <div className="question">
        <label>Name for the group</label>
        <textarea {...register("name")} required />
      </div>
      <div className="question">
        <label>Budget</label>
        <textarea {...register("budget")} />
      </div>
      <div className="question">
        <label>Anything else?</label>
        <textarea {...register("notes")} />
      </div>
      <div>
        <button type="submit">{success ? `success` : `save`} </button>
      </div>
    </form>
  );
};
