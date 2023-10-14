import React from "react";
import { qs } from "./questionnaire.component";

interface AP {
  name: string;
  value: any;
}
const A = ({ name, value }: AP) => {
  const q = qs.find((q) => q.name === name);
  if (!q || !value) {
    return null;
  }
  return (
    <div className="question answer">
      <label>{q.label}</label>
      <p> {value} </p>
    </div>
  );
};

export const Beneficiary = ({ beneficiary }: any) => {
  const qs = beneficiary?.questionnaire ?? {};

  return (
    <>
      <h4>You have {beneficiary.fullName}</h4>
      <div className="questionnaire">
        {Object.entries(qs).map(([k, v], i) => {
          return <A key={``} name={k} value={v} />;
        })}
      </div>
    </>
  );
};
