import React, { useState, useEffect } from 'react';
import loadingGif from '../assets/santa.gif';
const loadingMessages = [
    "sorting goodies from badies",
    "reconciling naughty list",
    "monitoring child surveillance cams",
    "feeding reindeer",
    "consulting miss claus",
    "eating cookie",
    "RnD elves presenting 2020 toys",
    "running QA with workshop elves",
    "practicing jolly laughter",
    "prepping coal",
    "drinking milk",

]
export const Loading = () => {
    const [message, setMessage] = useState(loadingMessages[0])
    useEffect(() => {
        const interval = setInterval(() => {
            const ms = loadingMessages[
                Math.floor(Math.random() * loadingMessages.length)
            ]
            setMessage(ms)
        }, 2000)
        return () => {
            clearInterval(interval)
        }
    }, [])
    const r = Math.floor(Math.random() * 2) === 0;
    console.log(r)
    return (
        <div className="loading">
            <img src={loadingGif} alt="santa gif" />
            <p className={r ? 'red' : 'green'}>{message}</p>
        </div>
    )
}