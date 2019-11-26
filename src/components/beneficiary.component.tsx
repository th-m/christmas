import React from 'react';

export const Beneficiary = ({ beneficiary }: any) => {
    console.log(beneficiary);
    if (!beneficiary || !beneficiary.questionnaire) {
        return null
    }

    return (
        <>

            <h4>You have {beneficiary.displayName}</h4>
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
                    <label>Favorite  &nbsp;
                        <a href="https://www.amazon.com/gp/product/B0719C5P56/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B0719C5P56&linkCode=as2&tag=thmcodes-20&linkId=69e5bdae9f2be364d09118c7b21fb335" target="_blank">
                            gift card
                            </a></label>
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
        </>
    )
}