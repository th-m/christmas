import React, { useEffect, useState } from 'react';
import * as fire from '../firebase';

interface Props {
    user: string;
    family: string;
    color: string;
    editable: boolean;
}

export const Things = (props: Props) => {
    const [things, setThings] = useState({});
    const { color, user, editable, family } = props;

    const errData = (error) => {
        console.error("errData", error);
    }

    const remove = key => () => {
        if (!user) return false;
        fire.remove(`/families/${family}/${user}/things/${key}`);
    }

    const gotThings = data => {
        if (!data.val()) {
            setThings({});
        } else {
            setThings(data.val());
        }
    }

    useEffect(() => {
        const listener = fire.listen(`/families/${family}/${user}/things`);
        listener.on("value", gotThings, errData);
        return () => listener.off("value", () => console.log('disconnected'))
    }, [])

    return (
        <div className={`things column ${color}`}>
            {Object.keys(things).map(thing => <ul key={thing} >{things[thing]} <span className={(editable ? "editable" : "")} onClick={remove(thing)}>x</span></ul>)}
        </div>
    )
}