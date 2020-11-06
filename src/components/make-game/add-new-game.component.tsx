import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { makeid } from "../../utils";
import { User, UserInterface } from '../../store/user.store'
import { getGame, addGame } from "../../fire";

export const AddNewGame = () => {
    const { state } = useContext(User);
    const { register, handleSubmit, errors } = useForm(); // initialise the hook
    const [validKey, setValidKey] = useState<string>();
    const [gameKey, setGameKey] = useState(makeid(6));
    const [success, setSuccess] = useState(false);


    const generateKey = () => {
        setGameKey(makeid(6))
    }

    useEffect(() => {
        getGame(gameKey, (game) => {
            if (!game) {
                console.log('found valid key');
                setValidKey(gameKey)
            } else {
                generateKey();
            }
        })

    }, [gameKey])

    const onSubmit = (gameDetails) => {
        console.log(gameDetails);
        addGame(gameDetails, () => {
            setSuccess(true)
            setTimeout(() => {
                setSuccess(false);
            }, 2000)
        })
    }
    return (
        <form className="questionnaire" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" ref={register} name="creatorId" defaultValue={state.user.uid} />
            <input type="hidden" ref={register} name="gameKey" defaultValue={validKey} />
            <div className="question">
                <label>Name for the group</label>
                <textarea ref={register({ required: 'Required' })} name="name" />
                {errors.name && <span>"wow buddy you gotta name the group"</span>}
            </div>
            <div className="question">
                <label>Budget</label>
                <textarea ref={register} name="budget" />
            </div>
            <div className="question">
                <label>Anything else?</label>
                <textarea ref={register} name="notes" />
            </div>
            <div>
                <button type="submit">{success ? `success` : `save`} </button>
            </div>
        </form>
    )
}