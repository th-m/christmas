import React, { useContext, useEffect, useState } from "react";
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
export interface Questionnaire {
  author: string;
  color: string;
  dislike: string;
  giftcard: string;
  id: string;
  music: string;
  perfectday: string;
  relax: string;
  treat: string;
  worstday: string;
}
export const qs = [
  { name: "address", label: "Mailing Address in case shipping." },
  
  { name: "clothesizes", label: "Sizes:(Shirt, Pant, Shoe, other?)" },

  { name: "relax", label: "How do you relax" },
  
  { name: "hobbies", label: "List some hobbies and interests" },
  { name: "media", label: "Which do you prefer, books, movies, music, games?" },
  { name: "collections", label: "Do you collect anything?" },
  { name: "color", label: "Favorite color" },

  
  { name: "food", label: "Favorite food or restaurant" },
  { name: "treat", label: "Favorite treat/snack/flavor" },
  { name: "giftcard", label: "Favorite place to shop" },
  { name: "help", label: "Is there anything you need help with?" },
  { name: "dislike", label: "What do you dislike" },

  { name: "sport", label: "Favorite sport and team?" },
  { name: "favorite", label: "Who is your favorite authors, musicians, or artists?"},
  
  { name: "perfectday", label: "What does your perfect day look like?" },
  { name: "worstday", label: "What does your worst day look like?" },
  
  { name: "any", label: "Anything else?" },
] as const;

const Q = ({
  name,
  df,
  label,
}: {
  name: string;
  df: string;
  label: string;
}) => {
  return (
    <div className="question">
      <label htmlFor={name}>{label}</label>
      <textarea id={name} name={name} defaultValue={df}></textarea>
    </div>
  );
};
export const Questionnaire = () => {
  const { user } = useUser();
  const [initialValues, setInitialValues] = useState(iv);
  const [showSuccess, setShowSuccess] = useState(false);

  const successMessage =  () => {
    setShowSuccess(true);
    if (user?.id) {
      getUser(user?.id, (vals) => {
        if (vals.questionnaire) {
          setInitialValues({ ...vals.questionnaire });
        }
      });
    }
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const myFormData = new FormData(e.currentTarget);
    const formDataObj = {} as unknown as Questionnaire;
    myFormData.forEach((value, key) => (formDataObj[key] = value));

    if (user?.id) {
      upsertQuestoinnaire(user.id, formDataObj, successMessage());
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
  return (
    <>
      <form className="questionnaire" onSubmit={handleSubmit}>
        {qs.map((q,i) => <Q key={`q-${i}-${q.name}`} {...q} df={initialValues[q.name]} />)}
        <div>
          <button type="submit">{showSuccess ? `success` : `save`} </button>
        </div>
      </form>
    </>
  );
};
