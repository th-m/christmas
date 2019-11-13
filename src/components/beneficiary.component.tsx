import React from 'react';
import { useEffect, useState } from 'react';
import * as fire from '../firebase';
import { Things } from './things.component'
export const Beneficiary = (props) => {
    const { name } = props;
    const [things, setThings] = useState({});

    const gotThings = data => {
        if (!data.val()) {
            setThings({});
        } else {
            setThings(data.val());
        }

    }

    const errData = (error) => {
        console.log("errData", error);
    }

    useEffect(() => {
        fire.listen(`/families/valadez/${name}/things`).on("value", gotThings, errData);

    })

    return (
        <div>
            <div className='column'>
                <h4>
                    You have {name}, and {name} wants
              </h4>
                <div>
                    <Things things={things} color="green" editable={false} />
                </div>
            </div>
        </div>
    )
}