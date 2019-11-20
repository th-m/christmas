import React, { useContext, useEffect, useState } from 'react';
import useForm from 'react-hook-form';
import { upsertQuestoinnaire, getQuestions } from '../../fire';
import { UserInterface, User } from '../../store/user.store';
const iv = {
    id: '',
    color: '',
    music: '',
    treat: '',
    giftcard: '',
    author: '',
    perfectday: '',
    worstday: '',
    relax: '',
    dislike: '',
    sport: '',
    any: ''
}
export const Questionnaire = () => {
    const { register, handleSubmit, errors } = useForm(); // initialise the hook
    const { userState } = useContext<UserInterface>(User);
    const [initialValues, setInitialValues] = useState(iv);

    const successMessage = (m) => (success) => console.log(m, { success })
    const onSubmit = (formData) => {
        upsertQuestoinnaire(userState.user.uid, formData, successMessage('updated questions'));
    }
    useEffect(() => {
        const vals = getQuestions(userState.user.uid, (vals) => {
            if (vals.questionnaire) {
                setInitialValues({ ...vals.questionnaire })
                console.log(vals.questionnaire)
            }
        });
        // setInitialValues({...vals.questionnaire})
    }, [userState.user.uid])
    console.log({ initialValues })
    return (
        <form className="questionnaire" onSubmit={handleSubmit(onSubmit)}>
            <div className="question">
                <label>Favorite color</label>
                <input type="text" ref={register} name="color" defaultValue={initialValues.color} />
            </div>
            <div className="question">
                <label>Favorite band or music</label>
                <input type="text" ref={register} name="music" defaultValue={initialValues.music} />
            </div>
            <div className="question">
                <label>Favorite treat/snack/flavor</label>
                <input type="text" ref={register} name="treat" defaultValue={initialValues.treat} />
            </div>
            <div className="question">
                <label>Favorite gift card</label>
                <input type="text" ref={register} name="giftcard" defaultValue={initialValues.giftcard} />
            </div>
            <div className="question">
                <label>Favorite book or author</label>
                <input type="text" ref={register} name="author" defaultValue={initialValues.author} />
            </div>
            <div className="question">
                <label>What does your perfect day look like?</label>
                <input type="text" ref={register} name="perfectday" defaultValue={initialValues.perfectday} />
            </div>
            <div className="question">
                <label>What does your worst day look like?</label>
                <input type="text" ref={register} name="worstday" defaultValue={initialValues.worstday} />
            </div>
            <div className="question">
                <label>How do you relax?</label>
                <input type="text" ref={register} name="relax" defaultValue={initialValues.relax} />
            </div>
            <div className="question">
                <label>What do you dislike?</label>
                <input type="text" ref={register} name="dislike" defaultValue={initialValues.dislike} />
            </div>
            <div className="question">
                <label>Sport ball game team?</label>
                <input type="text" ref={register} name="sport" defaultValue={initialValues.sport} />
            </div>
            <div className="question">
                <label>Anything else?</label>
                <input type="text" ref={register} name="any" defaultValue={initialValues.any} />
            </div>
            <div>
                <input type="submit" />
            </div>
        </form>
    )
}
