import React, { useContext, useState, useEffect } from "react";
import { getCreatorsGames } from '../../fire';
import { AddNewGame } from './add-new-game.component';
import { ManageGame } from './manage-game.component';
import { useUser } from "@clerk/clerk-react";

interface GameInfo {
    gid: string,
    creatorId: string,
    gameKey: string,
    name: string,
    budget: string,
    notes: string
}
export const MakeGame = () => {
    // const { state: { user, isAuthenticated } } = useContext(User);
    const {user} = useUser()
    const [games, setGames] = useState<GameInfo[]>([]);
    const [selectedGameId, setSelectedGameId] = useState<string>('');

    useEffect(()=>{
        const game = games[games.length - 1];
        if(game?.gid){
            setSelectedGameId(game.gid)
        }
    },[games.length])

    useEffect(() => {
        if (user?.id) {
            getCreatorsGames(user.id, (games) => {
                setGames(games)
            })

        }
    }, [user?.id, games.length])

    if (!user?.id) {
        return null
    }

    return (
        <>
            <select value={selectedGameId} onChange={(event) => setSelectedGameId(event.target.value)}>
                <option value="newGame"> New Group</option>
                {games.map(game => <option key={game.gid} value={game.gid}>{game.name}</option>)}
            </select>

            {(selectedGameId === '' || selectedGameId === 'newGame') && <AddNewGame setGames={setGames} games={games} />}
            {(selectedGameId !== '' && selectedGameId !== 'newGame' && selectedGameId) && <ManageGame game={games.find(game => game.gid == selectedGameId)} />}
        </>

    )
}
