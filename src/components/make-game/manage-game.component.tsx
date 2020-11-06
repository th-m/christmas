import React, { useState, useEffect } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getGameUsers, updateGameUserInfo } from "../../fire";

interface User {
    displayName: string;
    photoURL: string;
    uid: string;
    has?: string;
    exclude: string[];
}
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
export const ManageGame = ({ game }) => {
    const [copied, setCopied] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([])
    const [logicErr, setLogicErr] = useState(false);

    const handleCopy = () => {
        setCopied(true)
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }
    useEffect(() => {
        if (game.gid !== '') {
            getGameUsers(game.gid, (users) => {
                setUsers(users)
            })
        }
    }, [JSON.stringify(game)])

    if (!game || !game.gameKey) {
        return null
    }

    const handleChange = (user) => (e) => {
        if (!user) {
            return;
        }
        if (!user.exclude) {
            user.exclude = []
        }
        let options = e.target.options;
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                if (user.exclude.includes(options[i].value)) {
                    user.exclude = user.exclude.filter(arrayItem => arrayItem !== options[i].value);

                } else {
                    user.exclude.push(options[i].value);
                }
            }
        }
        if (game.gid) {
            updateGameUserInfo(game.gid, user, (success) => console.log(success))
        }
    }

    const usersIds = users.map(user => user.uid)
    const usersExcludes = Array.from(new Set(users.filter(user => user.exclude).flat()));

    const handleAssignments = () => {
        if (usersExcludes.length === 0) {
            const shuffledArray = shuffle(usersIds);
            const shifted = [...shuffledArray]
            shifted.push(shifted.shift()) // this is the part that does the shifting
            shuffledArray.forEach((uid, index) => {
                let currentUser = users.find(u => u.uid === uid);
                if (currentUser) {
                    currentUser.has = shifted[index];
                    updateGameUserInfo(game.gid, currentUser, (success) => console.log(success))
                }
            })
        } else {
            let selectedList: string[] = [];
            const getRandomUid = () => usersIds[Math.floor(Math.random() * usersIds.length)];
            const invalidSelection = (person, randomUid) => !randomUid || person.exclude.includes(randomUid) || person.uid === randomUid || selectedList.includes(randomUid) ? true : false;
            const secretSantas: any[] = [];
            const usersWithExcludesIds = users.filter(user => user.exclude.filter(x => x !== '').length > 0).map(user => user.uid);
            const sortedIds = Array.from(new Set([...usersWithExcludesIds, ...usersIds]));
            let tickerCheck = true;
            sortedIds.forEach(currentId => {
                let currentUser = users.find(u => u.uid === currentId);
                if (currentUser) {
                    let ticker = 0;
                    let randomSelection;
                    while (invalidSelection(currentUser, randomSelection)) {
                        ticker++;
                        if (ticker > 100) {
                            tickerCheck = false;
                            setLogicErr(true);
                            setTimeout(() => {
                                setLogicErr(false);
                            }, 3000)
                            break;
                        }
                        randomSelection = getRandomUid();
                    }
                    selectedList.push(randomSelection)
                    currentUser.has = randomSelection;
                    secretSantas.push(currentUser)
                }
            })
            if (tickerCheck) {
                secretSantas.forEach((currentUser,) => {
                    if (currentUser) {
                        updateGameUserInfo(game.gid, currentUser, (success) => console.log(success))
                    }
                })
            }
        }

    }
    return (
        <>
            {game && !!game.gameKey && !!game.name &&
                <CopyToClipboard text={`https://santa-nator.com/${game.gameKey}`}
                    onCopy={handleCopy}>
                    <p>
                        {copied
                            ? <><span>copied to clip board</span></>
                            : <>
                                <span>{`https://santa-nator.com/${game.gameKey}`}</span>
                                <br />
                                <span>click to share sign up link with friends and family</span>
                            </>
                        }
                    </p>
                </CopyToClipboard>
            }
            {users.map(user =>
                <div key={`${user.uid}-user-options`}>
                    <div className="manage-option">
                        <img className="avatar" alt={user.displayName} src={`${user.photoURL}/small`} />
                        <span>{user.displayName}</span>
                    </div>
                    <div>
                        <div>
                            <label>exclude</label>
                            <select className="select-exclude" multiple value={user.exclude} onChange={handleChange(user)}>
                                <option value={''}>-</option>
                                {users.map(x => <option key={`${x.uid}-manaage-exclucs`} value={x.uid}>{x.displayName} </option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <div>
                            <label>has</label>
                            <h6>{user.has}</h6>
                        </div>
                    </div>
                </div>
            )}
            {logicErr && <p>Woops, we couldn't sort it out. Maybe try removing some exclude options</p>}
            <button onClick={handleAssignments}>Assign Secret Santas</button>
        </>
    )
}