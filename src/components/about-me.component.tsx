import React, { useState, useEffect } from 'react';


import { useGames } from '../hooks/use-games.hook';
import { Questionnaire } from './questionnaire.component';
import { User, getCleanedUserObject, getUser } from '../fire';
import { updateUserInfo } from '../fire';
import { Beneficiary } from './beneficiary.component';
import { useUser } from '@clerk/clerk-react';

const initialBeneficiary = {
    fullName: '',
    imageUrl: ''
}

export const AboutMe = () => {
    const {user} = useUser()
    
    const [showQuestions, setShowQuestions] = useState(true);
    const [beneficiary, setBeneficiary] = useState<any>(initialBeneficiary);
    const { games, selectedGame, setSelectedGame, secrets } = useGames()
 
    useEffect(() => {
        if (selectedGame && secrets && secrets.has && user && user.id) {
            if(user?.id){
                getUser(user?.id, (_user) => {
                    const games = _user.games;
                    const i = games.findIndex(g => g.gid === secrets.id);
                    if(i < 0){
                        games.push({gameKey:secrets})
                    }else[
                        games[i] = {...games[i],...secrets}
                    ]
                    updateUserInfo({..._user, games: { [selectedGame.gameKey]: secrets } })
                })
            }
        }
    }, [JSON.stringify(selectedGame), JSON.stringify(secrets)])

    const handleChange = (event) => {
        if (event.target.value !== selectedGame) {
            setBeneficiary(initialBeneficiary);
            setShowQuestions(true);
            setSelectedGame(event.target.value);
        }
    }

    const handleClick = () => {
        setShowQuestions(!showQuestions);
        if(!beneficiary.fullName){
            getUser(secrets.has, (data) => setBeneficiary(data))
        }
        
    }
    return (
        <div>
            <div onClick={handleClick}>
                <div className="avatar_container">
                    {showQuestions
                        ? <img className="avatar" alt={user?.fullName ?? ""} src={`${user?.imageUrl}`} style={{width:50, height:50}} />
                        : <img className="avatar" alt={beneficiary?.fullName ?? ""} src={`${beneficiary?.imageUrl}`}  style={{width:50, height:50}}/>
                    }
                </div>
                <h6>{beneficiary.displayName !== "" && showQuestions ? 'Click to see who you got' : ''}</h6>
                <h6>{!showQuestions ? 'Click to your profile' : ''}</h6>
            </div>
            {games && games.length > 1 &&
                <select onChange={handleChange}>
                    {
                        // @ts-ignore }
                    }{games.map((game,i) => <option key={`${i}-${game.gameKey}`} value={game.gameKey}>{game.name}</option>)}
                </select>
            }
            {showQuestions
                ? <Questionnaire />
                : <Beneficiary beneficiary={beneficiary} />
            }
        </div>
    )
}