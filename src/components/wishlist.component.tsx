import React, { useState } from 'react';
import { Things } from './things.component'
import * as fire from '../firebase';

export const WishList = ({ user, family }) => {
    const [thing, setThing] = useState("");
    const addThing = () => {
        fire.push(`/families/${family}/${user}/things`, thing);
        setThing("")
    }

    return (
        <div>
            <div className='column'>
                <div className='row'>
                    <input placeholder="Type a things" onChange={(e) => setThing(e.target.value)} value={thing} />
                    <button onClick={addThing}> I want this thing! </button>
                </div>
                <Things color="red" editable={true} user={user} family={family} />
            </div>
        </div>
    )
}

