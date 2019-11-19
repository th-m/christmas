import React, { useState, useEffect, useContext } from 'react';
import './App.css';

import { Beneficiary } from './components/beneficiary.component';
import { WishList } from './components/wishlist.component';
import { UserProvider, User } from './store/user.store'
import { fbSignUp } from './fire';
import { useAuth } from './hooks/auth.hook';
const App = () => {
  const [user, setUser] = useState("");
  const [family, setFamily] = useState("behunin");
  const [beneficiary, setBeneficiary] = useState('');
  const { userState } = useContext(User);
  useAuth();
  // const getInfo = () => {
  //   fire.get(`/families/${family.toLowerCase()}/${user.toLowerCase()}/has`).then(x => {
  //     setBeneficiary(x)
  //   })
  // }

  useEffect(() => {
    // getInfo()
    console.log('hi');
  }, [family, user])

  return (
    <div className="App">
      <h3>
        Secret Santanator Game 3000-v0.2
      </h3>
      {userState.user
        ? <img alt={userState.user.displayName} src={`${userState.user.photoURL}/medium`} style={{ margin: 10 }} />
        : <button onClick={fbSignUp}> Sign In</button>
      }
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
              <option value="behunin">Behunin</option>
              <option value="valadez">Valadez</option>
            </select>
            <input placeholder="Enter your name" onChange={(e) => setUser(e.target.value)} />
          </div>

      }

    </div>
  );
}

const WrappedApp = () => (
  <UserProvider>
    <App />
  </UserProvider>
)

export default WrappedApp;



