import React from 'react';
import { useContext } from "react";
import { UserInterface, User } from "../../store/user.store";
import { Questionnaire } from './questionnaire.component';

export const AboutMe = () => {
    const { userState } = useContext<UserInterface>(User);
    return (
        <div>

            <div className="avatar_container">
                <img className="avatar" alt={userState.user.displayName} src={`${userState.user.photoURL}/medium`} />
            </div>
            <Questionnaire />
        </div>
    )
}