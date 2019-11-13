import React, { Component, useState } from 'react';
import './App.css';
import * as fire from './firebase';
import { Beneficiary } from './components/beneficiary.component';
import { WishList } from './components/wishlist.component';

const App = () => {
  const [user, setUser] = useState("");
  const [thing, setThing] = useState("");
  const [beneficiary, setBeneficiary] = useState(null);
  const [things, setThings] = useState({});

  const gotThings = data => {
    if (!data.val()) {
      setThings({});
    } else {
      setThings(data.val());
    }
  }

  const errData = (error) => {
    console.error("errData", error);
  }

  const getInfo = () => {
    fire.listen(`/families/valadez/${user}/things`).on("value", gotThings, errData);

    fire.get(`/families/valadez/${user}/has`).then(x => {
      setBeneficiary(x)
    })
  }

  const addThing = () => {
    fire.push(`/families/valadez/${user}/things`, thing);
    setThing("")
  }

  return (
    <div className="App">
      <h3>
        Secret Santanator Game 3000-v0.2
      </h3>

      {
        user && beneficiary
          ? <div className='split'>
            <Beneficiary name={beneficiary} />
            <WishList {...{ setThing, addThing, thing, things, user }} />
          </div>
          : <div className='row start'>
            <input placeholder="Enter your name" onChange={(e) => setUser(e.target.value)} />
            <button onClick={getInfo}> See beneficiary! </button>
          </div>

      }

    </div>
  );
}

export default App;



