import React from 'react';
import * as fire from '../firebase';

export const Things = props => {
    const editable = props.editable ? "editable" : "";
    const remove = key => () => {
        if (!props.user) return false;
        fire.remove(`/families/valadez/${props.user}/things/${key}`);
    }
    return (
        <div className={`things column ${props.color}`}>
            {Object.keys(props.things).map(thing => <ul key={thing} >{props.things[thing]} <span className={editable} onClick={remove(thing)}>x</span></ul>)}
        </div>
    )
}