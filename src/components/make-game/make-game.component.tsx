import React, { useContext, useState, useEffect } from "react";
import { User, UserInterface } from '../../store/user.store'
import { getCreatorsGames } from '../../fire';
import { AddNewGame } from './add-new-game.component';
import { ManageGame } from './manage-game.component';

interface GameInfo {
    gid: string,
    creatorId: string,
    gameKey: string,
    name: string,
    budget: string,
    notes: string
}
export const MakeGame = () => {
    const { userState, isAuthenticated } = useContext<UserInterface>(User);
    const [games, setGames] = useState<GameInfo[]>([]);
    const [selectedGameId, setSelectedGameId] = useState<string>('');

    useEffect(() => {
        if (isAuthenticated) {
            getCreatorsGames(userState.user.uid, (games) => {
                setGames(games)
            })

        }
    }, [userState.user.uid])

    if (!isAuthenticated) {
        return null
    }

    return (
        <>
            <select value={selectedGameId} onChange={(event) => setSelectedGameId(event.target.value)}>
                <option value="newGame"> new game</option>
                {games.map(game => <option key={game.gid} value={game.gid}>{game.name}</option>)}
            </select>

            {(selectedGameId === '' || selectedGameId === 'newGame') && <AddNewGame />}
            {(selectedGameId !== '' && selectedGameId !== 'newGame' && selectedGameId) && <ManageGame game={games.find(game => game.gid == selectedGameId)} />}
        </>

    )
}
