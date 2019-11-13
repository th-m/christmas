import React from 'react';
import { Things } from './things.component'

export const WishList = (props) => {
    const { setThing, addThing, thing, things, user } = props;
    return (
        <div>
            <div className='column'>
                <div className='row'>
                    <input placeholder="Type a things" onChange={(e) => setThing(e.target.value)} value={thing} />
                    <button onClick={addThing}> I want this thing! </button>
                </div>
                <Things things={things} color="red" editable={true} user={user} />
            </div>
        </div>
    )
}

