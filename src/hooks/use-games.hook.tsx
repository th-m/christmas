import { useState, useEffect } from "react";
import { getGame, getGameUser, getUser } from "../fire";
import { useUser } from "@clerk/clerk-react";

export const useGames = () => {
    const {user} = useUser();
    const [gamesArr, setGamesArr] = useState<any[]>([]);
    const [selectedGame, setSelectedGame] = useState<string>('');
    const [gameDetails, setGameDetails] = useState<any>({ gid: '' });
    const [secrets, setSecrets] = useState<any>()
    useEffect(() => {
        if(user?.id){

            getUser(user.id, (_user => {
                console.log(_user.games)
                if (_user.games) {
                    
                    setGamesArr(Object.keys(_user.games))
                    setSelectedGame(Object.keys(_user.games)[0])
                }
            })
            )
        }
    }, [user?.id])

    useEffect(() => {
        if (selectedGame !== '') {
            getGame(selectedGame, (gameData) => {
                setGameDetails(gameData)
                if (gameData && gameData.gid && gameData.gid !== '' && user?.id) {
                    getGameUser(gameData.gid, user?.id, (data) => {
                        const gid = gameData && gameData.gid ? gameData.gid : null;
                        const name = gameData && gameData.name ? gameData.name : null;
                        setSecrets({ ...data, uid: user?.id, id: gid, name });
                    })
                }
            })
        }
    }, [selectedGame])



    return { games: gamesArr, selectedGame: gameDetails, setSelectedGame, secrets }
}