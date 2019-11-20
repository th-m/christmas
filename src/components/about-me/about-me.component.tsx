import React, { useState, useEffect } from 'react';
import { useContext } from "react";
import { UserInterface, User } from "../../store/user.store";
import { Questionnaire } from './questionnaire.component';
import { getUser } from '../../fire';

const initialBeneficiary = {
    displayName: '',
    photoURL: ''
}
export const AboutMe = () => {
    const { userState } = useContext<UserInterface>(User);
    const [showQuestions, setShowQuestions] = useState(true);
    const [benficiary, setBenficiary] = useState(initialBeneficiary);
    const [family, setFamily] = useState<string>('');
    useEffect(() => {
        if (family !== '' && userState.user.family) {
            getUser(userState.user.family[family].has, setBenficiary)
        } else if (userState.user.family) {
            setFamily(Object.keys(userState.user.family)[0])
        }
    }, [userState.user.uid, family, userState.user.family])
    const handleChange = (event) => {
        setFamily(event.target.value);
    }
    return (
        <div>
            <div className="avatar_container">
                {showQuestions
                    ? <img className="avatar" onClick={() => setShowQuestions(false)} alt={userState.user.displayName} src={`${userState.user.photoURL}/medium`} />
                    : <img className="avatar" onClick={() => setShowQuestions(true)} alt={benficiary.displayName} src={`${benficiary.photoURL}/medium`} />
                }
            </div>
            {userState.user.family &&
                <select onChange={handleChange} value={family}>
                    {
                        // @ts-ignore }
                    }{Object.keys(userState.user.family).map(fam => <option key={fam} value={fam}>{fam}</option>)}
                </select>
            }
            {showQuestions
                ? <Questionnaire />
                : <h2>you have this person {JSON.stringify(benficiary)}</h2>
            }
        </div>
    )
}