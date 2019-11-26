import React, { useState, useEffect } from 'react';
import { useContext } from "react";
import { UserInterface, User } from "../store/user.store";
import { useGames } from '../hooks/use-games.hook';
import { Questionnaire } from './questionnaire.component';
import { getUser } from '../fire';
import { updateUserInfo } from '../fire/facebook.auth';
import { Beneficiary } from './beneficiary.component';

const initialBeneficiary = {
    displayName: '',
    photoURL: ''
}

export const AboutMe = () => {
    const { userState } = useContext<UserInterface>(User);
    const [showQuestions, setShowQuestions] = useState(true);
    const [beneficiary, setBeneficiary] = useState<any>(initialBeneficiary);
    const { games, selectedGame, setSelectedGame, secrets } = useGames(userState.user.games)

    useEffect(() => {
        console.log({ games, selectedGame })
        if (selectedGame && secrets && secrets.has && userState.user && userState.user.uid) {
            updateUserInfo(userState, { games: { [selectedGame.gameKey]: secrets } })
        }
    }, [JSON.stringify(selectedGame), JSON.stringify(secrets)])

    useEffect(() => {
        if (selectedGame && secrets && secrets.has) {
            getUser(secrets.has, (data) => setBeneficiary(data))
        }
    }, [JSON.stringify(secrets)])


    const handleChange = (event) => {
        setSelectedGame(event.target.value);
    }
    return (
        <div>
            <div className="avatar_container">
                {showQuestions
                    ? <img className="avatar" onClick={() => setShowQuestions(false)} alt={userState.user.displayName} src={`${userState.user.photoURL}/medium`} />
                    : <img className="avatar" onClick={() => setShowQuestions(true)} alt={beneficiary.displayName} src={`${beneficiary.photoURL}/medium`} />
                }
            </div>
            {games && games.length > 1 &&
                <select onChange={handleChange}>
                    {
                        // @ts-ignore }
                    }{games.map(game => <option key={game.id} value={game.id}>{game.name}</option>)}
                </select>
            }
            {showQuestions
                ? <Questionnaire />
                : <Beneficiary beneficiary={beneficiary} />
            }
        </div>
    )
}