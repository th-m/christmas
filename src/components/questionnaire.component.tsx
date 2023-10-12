import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { upsertQuestoinnaire, getUser } from "../fire";
import { useUser } from "@clerk/clerk-react";
const iv = {
  id: "",
  color: "",
  music: "",
  treat: "",
  giftcard: "",
  author: "",
  perfectday: "",
  worstday: "",
  relax: "",
  dislike: "",
  sport: "",
  clothesizes: "",
  any: "",
};
export const Questionnaire = () => {
  const { register, handleSubmit } = useForm(); // initialise the hook
  const { user } = useUser();
  const [initialValues, setInitialValues] = useState(iv);
  const [showSuccess, setShowSuccess] = useState(false);

  const successMessage = () => () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };
  const onSubmit = (formData) => {
    if (user?.id) {
      upsertQuestoinnaire(user.id, formData, successMessage());
    }
  };
  useEffect(() => {
    if (user?.id) {
      getUser(user?.id, (vals) => {
        if (vals.questionnaire) {
          setInitialValues({ ...vals.questionnaire });
        }
      });
    }
  }, [user?.id]);
  console.log({user})
  return (
    <>
      <form className="questionnaire" onSubmit={handleSubmit(onSubmit)}>
        <div className="question">
          <label>Sizes:(Shirt, Pant, Shoe, other??)</label>
          <textarea
            
            {...register('clothesizes')}
            defaultValue={initialValues.clothesizes}
          />
        </div>
        <div className="question">
          <label>Favorite color</label>
          <textarea
            {...register("color")}
            defaultValue={initialValues.color}
          />
        </div>
        <div className="question">
          <label>Favorite band or music</label>
          <textarea
            {...register("music")}
            defaultValue={initialValues.music}
          />
        </div>
        <div className="question">
          <label>Favorite treat/snack/flavor</label>
          <textarea
            {...register("treat")}
            defaultValue={initialValues.treat}
          />
        </div>
        <div className="question">
          <label>Favorite place to shop</label>
          <textarea
            {...register("giftcard")}
            defaultValue={initialValues.giftcard}
          />
        </div>
        <div className="question">
          <label>Favorite book or author</label>
          <textarea
            {...register("author")}
            defaultValue={initialValues.author}
          />
        </div>
        <div className="question">
          <label>What does your perfect day look like?</label>
          <textarea
            {...register("perfectday")}
            defaultValue={initialValues.perfectday}
          />
        </div>
        <div className="question">
          <label>What does your worst day look like?</label>
          <textarea
            {...register("worstday")}
            defaultValue={initialValues.worstday}
          />
        </div>
        <div className="question">
          <label>How do you relax?</label>
          <textarea
            {...register("relax")}
            defaultValue={initialValues.relax}
          />
        </div>
        <div className="question">
          <label>What do you dislike?</label>
          <textarea
            {...register("dislike")}
            defaultValue={initialValues.dislike}
          />
        </div>
        <div className="question">
          <label>Sport ball game team?</label>
          <textarea
            {...register("sport")}
            defaultValue={initialValues.sport}
          />
        </div>
        <div className="question">
          <label>Anything else?</label>
          <textarea
            {...register("any")}
            defaultValue={initialValues.any}
          />
        </div>
        <div>
          <button type="submit">{showSuccess ? `success` : `save`} </button>
        </div>
      </form>
    </>
  );
};
