import React, { useState, useEffect } from 'react';
import { useContext } from "react";
import { UserInterface, User } from "../store/user.store";
import { Questionnaire } from './questionnaire.component';
import { getUser, getGame, getGameUser } from '../fire';
import { updateUserInfo } from '../fire/facebook.auth';
import { Beneficiary } from './beneficiary.component';

const initialBeneficiary = {
    displayName: '',
    photoURL: ''
}
const useGames = (games) => {
    const [gamesArr, setGamesArr] = useState<any[]>([]);
    const [selectedGame, setSelectedGame] = useState<string>('');
    const [gameDetails, setGameDetails] = useState<any>({ gid: '' });
    useEffect(() => {
        if (games) {
            setGamesArr(Object.keys(games))
            setSelectedGame(Object.keys(games)[0])
        }
    }, [JSON.stringify(games)])

    useEffect(() => {
        getGame(selectedGame, (gameData) => {
            // console.log({ gameData });
            setGameDetails(gameData)
        })
    }, [selectedGame])
    return { games: gamesArr, selectedGame: gameDetails, setSelectedGame }
}

const useGamesSecret = ({ gid }, uid) => {
    const [secrets, setSecrets] = useState()
    useEffect(() => {
        if (gid !== '' && uid) {
            getGameUser(gid, uid, (data) => {
                setSecrets(data);
            })
        }
    }, [gid, uid])

    return { secrets: { ...secrets, uid, id: gid } }
}

export const AboutMe = () => {
    const { userState } = useContext<UserInterface>(User);
    const [showQuestions, setShowQuestions] = useState(true);
    const [beneficiary, setBeneficiary] = useState<any>(initialBeneficiary);
    const { games, selectedGame, setSelectedGame } = useGames(userState.user.games)
    const { secrets } = useGamesSecret(selectedGame, userState.user.uid)

    useEffect(() => {
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
                    }{games.map(game => <option key={game} value={game}>{game}</option>)}
                </select>
            }
            {showQuestions
                ? <Questionnaire />
                : <Beneficiary beneficiary={beneficiary} />
            }
        </div>
    )
}