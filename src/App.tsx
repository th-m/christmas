import React, { useState, useEffect } from 'react';
import './App.css';
import * as fire from './firebase';
import { Beneficiary } from './components/beneficiary.component';
import { WishList } from './components/wishlist.component';

const App = () => {
  const [user, setUser] = useState("");
  const [family, setFamily] = useState("");
  const [beneficiary, setBeneficiary] = useState(null);

  const getInfo = () => {
    fire.get(`/families/${family}/${user}/has`).then(x => {
      setBeneficiary(x)
    })
  }

  useEffect(() => {
    getInfo()
  }, [family, user])

  return (
    <div className="App">
      <h3>
        Secret Santanator Game 3000-v0.2
      </h3>

      {
        user && beneficiary
          ? <div className='split'>
            <Beneficiary name={beneficiary} family={family} />
            <div>

              <WishList user={user} family={family} />
            </div>
          </div>
          : <div className='row start'>
            <select onChange={(e) => setFamily(e.target.value)} value={family}>
              <option value="valadez">Valadez</option>
              <option value="behunin">Behunin</option>
            </select>
            <input placeholder="Enter your name" onChange={(e) => setUser(e.target.value)} />
            <button onClick={getInfo}> See beneficiary! </button>
          </div>

      }

    </div>
  );
}

export default App;



