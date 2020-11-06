import React, { useState, useEffect } from 'react';
import { useContext } from "react";
import { UserInterface, User } from "../store/user.store";
import { useGames } from '../hooks/use-games.hook';
import { Questionnaire } from './questionnaire.component';
import { getUser } from '../fire';
import { updateUserInfo } from '../fire';
import { Beneficiary } from './beneficiary.component';

const initialBeneficiary = {
    displayName: '',
    photoURL: ''
}

export const AboutMe = () => {
    const { state } = useContext(User);
    const [showQuestions, setShowQuestions] = useState(true);
    const [beneficiary, setBeneficiary] = useState<any>(initialBeneficiary);
    const { games, selectedGame, setSelectedGame, secrets } = useGames(state.user.games)
    useEffect(() => {
        if (selectedGame && secrets && secrets.has && state.user && state.user.uid) {
            updateUserInfo(state, { games: { [selectedGame.gameKey]: secrets } })
        }
    }, [JSON.stringify(selectedGame), JSON.stringify(secrets)])

    useEffect(() => {
        if (selectedGame && secrets && secrets.has) {
            getUser(secrets.has, (data) => setBeneficiary(data))
        }
    }, [JSON.stringify(secrets)])


    const handleChange = (event) => {
        if (event.target.value !== selectedGame) {
            setBeneficiary(initialBeneficiary);
            setShowQuestions(true);
            setSelectedGame(event.target.value);
        }
    }
    return (
        <div>
            <div onClick={() => beneficiary.displayName !== "" ? setShowQuestions(!showQuestions) : null}>
                <div className="avatar_container">
                    {showQuestions
                        ? <img className="avatar" alt={state.user.displayName} src={`${state.user.photoURL}/medium`} />
                        : <img className="avatar" alt={beneficiary.displayName} src={`${beneficiary.photoURL}/medium`} />
                    }
                </div>
                <h6>{beneficiary.displayName !== "" && showQuestions ? 'Click to see who you got' : ''}</h6>
                <h6>{!showQuestions ? 'Click to your profile' : ''}</h6>
            </div>
            {games && games.length > 1 &&
                <select onChange={handleChange}>
                    {
                        // @ts-ignore }
                    }{games.map(game => <option key={game.gameKey} value={game.gameKey}>{game.name}</option>)}
                </select>
            }
            {showQuestions
                ? <Questionnaire />
                : <Beneficiary beneficiary={beneficiary} />
            }
        </div>
    )
}