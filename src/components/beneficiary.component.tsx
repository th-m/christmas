import React from 'react';
import { Things } from './things.component'
interface Props {
    name: string;
    family: string;
}
export const Beneficiary = ({ name, family }: Props) => {

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