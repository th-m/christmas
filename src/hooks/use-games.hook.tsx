import { useState, useEffect, useContext } from "react";
import { getGame, getGameUser } from "../fire";
import { UserInterface, User } from "../store/user.store";

export const useGames = (games) => {
    const { userState } = useContext<UserInterface>(User);
    const [gamesArr, setGamesArr] = useState<any[]>([]);
    const [selectedGame, setSelectedGame] = useState<string>('');
    const [gameDetails, setGameDetails] = useState<any>({ gid: '' });
    const [secrets, setSecrets] = useState()
    useEffect(() => {
        if (games) {
            setGamesArr(Object.keys(games).map(g => ({ ...games[g], gameKey: g })))
            setSelectedGame(Object.keys(games)[0])
        }
    }, [JSON.stringify(games)])

    useEffect(() => {
        if (selectedGame !== '') {
            getGame(selectedGame, (gameData) => {
                setGameDetails(gameData)
                if (gameData && gameData.gid && gameData.gid !== '' && userState.user.uid) {
                    getGameUser(gameData.gid, userState.user.uid, (data) => {
                        const gid = gameData && gameData.gid ? gameData.gid : null;
                        const name = gameData && gameData.name ? gameData.name : null;
                        setSecrets({ ...data, uid: userState.user.uid, id: gid, name });
                    })
                }
            })
        }
    }, [selectedGame])



    return { games: gamesArr, selectedGame: gameDetails, setSelectedGame, secrets }
}