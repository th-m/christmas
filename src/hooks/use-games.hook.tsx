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

    useEffect(() => {
        if (gameDetails.gid !== '' && userState.user.uid) {
            getGameUser(gameDetails.gid, userState.user.uid, (data) => {
                setSecrets(data);
            })
        }
    }, [gameDetails.gid, userState.user.uid])


    return { games: gamesArr, selectedGame: gameDetails, setSelectedGame, secrets: { ...secrets, uid: userState.user.uid, id: gameDetails.gid } }
}