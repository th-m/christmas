import React, { useState, useEffect } from "react";
import { User, GameUser, getGameUsers, updateGameUserInfo } from "../../fire";

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const ManageGame = ({ game }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showExcludes, setShowExcludes] = useState<string[]>([])
  const [users, setUsers] = useState<GameUser[]>([]);
  const [logicErr, setLogicErr] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(`https://santa-nator.com/${game.gameKey}`);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  useEffect(() => {
    if (game.gid !== "") {
      getGameUsers(game.gid, (users) => {
        setUsers(users);
      });
    }
  }, [JSON.stringify(game)]);

  if (!game || !game.gameKey) {
    return null;
  }

  const handleChange = (user) => (e) => {
    if (!user) {
      return;
    }
    if (!user?.exclude) {
      user.exclude = [];
    }
    let value = e.currentTarget.value;
    const isSelected = user.exclude.includes(value);
  
    if (isSelected) {
      user.exclude = user.exclude.filter((arrayItem) => arrayItem !== value);
    } else {
      user.exclude.push(value);
    }

    // }
    const newUserIndex = users.findIndex((x) => x.id === user.id);
    users[newUserIndex] = user;
    setUsers([...users]);
    if (game.gid) {
      updateGameUserInfo(game.gameKey, user, (success) => console.log(success));
    }
  };

  const usersIds = users.map((user) => user.id);
  const usersExcludes = Array.from(
    new Set(users.filter((user) => user.exclude).flat())
  );

  const handleAssignments = () => {
    if (usersExcludes.length === 0) {
      const shuffledArray = shuffle(usersIds);
      const shifted = [...shuffledArray];
      shifted.push(shifted.shift()); // this is the part that does the shifting
      shuffledArray.forEach((uid, index) => {
        let currentUser = users.find((u) => u.uid === uid);
        if (currentUser) {
          currentUser.has = shifted[index];
          updateGameUserInfo(game.gameKey, currentUser, (success) =>
            console.log(success)
          );
        }
      });
    } else {
      let selectedList: string[] = [];
      const getRandomUid = () =>
        usersIds[Math.floor(Math.random() * usersIds.length)];
      const invalidSelection = (person, randomUid) =>
        !randomUid ||
        person?.exclude?.includes(randomUid) ||
        person.id === randomUid ||
        selectedList.includes(randomUid)
          ? true
          : false;
      const secretSantas: any[] = [];
      const usersWithExcludesIds = users
        .filter((user) => user?.exclude?.filter((x) => x !== "").length > 0)
        .map((user) => user.id);
      const sortedIds = Array.from(
        new Set([...usersWithExcludesIds, ...usersIds])
      );
      let tickerCheck = true;
      sortedIds.forEach((currentId) => {
        let currentUser = users.find((u) => u.uid === currentId);
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
              }, 3000);
              break;
            }
            randomSelection = getRandomUid();
          }
          selectedList.push(randomSelection);
          currentUser.has = randomSelection;
          secretSantas.push(currentUser);
        }
      });
      if (tickerCheck) {
        secretSantas.forEach((currentUser) => {
          console.log({ currentUser });
          if (currentUser) {
            updateGameUserInfo(game.gameKey, currentUser, (success) =>
              console.log(success)
            );
          }
        });
      }
    }
  };
  //localhost:5173/xw73ac
  const handleShowExclude = (id) => () => {
    let temp = [...showExcludes];
    if(temp.includes(id)){
        temp = temp.filter(item => item !== id)
    }else{
        temp.push(id)
    }
    setShowExcludes(temp)
  }
  http: return (
    <>
      {game && !!game.gameKey && !!game.name && (
        <div onClick={handleCopy}>
          <p>
            {copied ? (
              <>
                <span>copied to clip board</span>
              </>
            ) : (
              <>
                <span>{`https://santa-nator.com/${game.gameKey}`}</span>
                <br />
                <span>click to share sign up link with friends and family</span>
              </>
            )}
          </p>
        </div>
      )}
      {users.map((user) => (
        <div key={`${user.id}-user-options`}>
          <div className="manage-option" style={{display:'flex', flexDirection:'row', justifyContent:'space-between', margin:'1rem auto'}}>
            <img
              className="avatar"
              alt={user.fullName}
              src={`${user.imageUrl}`}
              style={{ width: 50, height: 50 }}
            />
            <span>{user.fullName}</span>
            <label>has</label>
              <h6>{user?.has?.slice(5,13) ?? '__'}</h6>
              <button onClick={handleShowExclude(user.id)} >{showExcludes.includes(user.id) ?"hide excludes":"show exclude"} </button>
          </div>
          {/* <div>
            <div>
              <label>has</label>
              <h6>{user.has}</h6>
            </div>
          </div> */}
            <div style={{marginBottom:'1rem'}}>
             
              {showExcludes.includes(user.id) && 
              <>
              {users.map((x) => (
                  <div key={`${user.id}-${x.id}`}>
                  <input
                  id={`${user.id}-${x.id}`}
                  type="checkbox"
                  onChange={handleChange(user)}
                  value={x.id}
                  disabled={x.id === user.id}
                  checked={
                      (user?.exclude ?? []).includes(x.id) || x.id === user.id
                    }
                    />{" "}
                    <label htmlFor={`${user.id}-${x.id}`}>{x.fullName}</label>{" "}
                    </div>
                    ))}
                    </>
                }
            </div>
        
        </div>
      ))}
      {logicErr && (
        <p>
          Woops, we couldn't sort it out. Maybe try removing some exclude
          options
        </p>
      )}
      <button onClick={handleAssignments}>Assign Secret Santas</button>
    </>
  );
};
