import React from 'react';
import { Things } from './things.component'

export const Beneficiary = ({ beneficiary }: any) => {
    console.log(beneficiary);
    if (!beneficiary || !beneficiary.questionnaire) {
        return null
    }

    return (
        <div className="questionnaire">
            <div className="question answer">
                <label>Favorite color:</label>
                <p>  {beneficiary.questionnaire.color || ''} </p>
            </div>
            <div className="question answer">
                <label>Favorite band or music:</label>
                <p>  {beneficiary.questionnaire.music || ''} </p>
            </div>
            <div className="question answer">
                <label>Favorite treat/snack/flavor:</label>
                <p>  {beneficiary.questionnaire.treat || ''} </p>
            </div>
            <div className="question answer">
                <label>Favorite gift card:</label>
                <p>  {beneficiary.questionnaire.giftcard || ''} </p>
            </div>
            <div className="question answer">
                <label>Favorite book or author:</label>
                <p>  {beneficiary.questionnaire.author || ''} </p>
            </div>
            <div className="question answer">
                <label>What does your perfect day look like?:</label>
                <p>  {beneficiary.questionnaire.perfectday || ''} </p>
            </div>
            <div className="question answer">
                <label>What does your worst day look like?:</label>
                <p>  {beneficiary.questionnaire.worstday || ''} </p>
            </div>
            <div className="question answer">
                <label>How do you relax?:</label>
                <p>  {beneficiary.questionnaire.relax || ''} </p>
            </div>
            <div className="question answer">
                <label>What do you dislike?:</label>
                <p>  {beneficiary.questionnaire.dislike || ''} </p>
            </div>
            <div className="question answer">
                <label>Sport ball game team?:</label>
                <p>  {beneficiary.questionnaire.sport || ''} </p>
            </div>
            <div className="question answer">
                <label>Anything else?:</label>
                <p>  {beneficiary.questionnaire.any || ''} </p>
            </div>

        </div>

    )
}