import React from 'react';
import { Things } from './things.component'
export const Beneficiary = (props) => {
    const { name, family } = props;
    return (
        <div>
            <div className='column'>
                <h4>
                    You have {name}, and {name} wants
              </h4>
                <div>
                    <Things color="green" user={name} editable={false} family={family} />
                </div>
            </div>
        </div>
    )
}