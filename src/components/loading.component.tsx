import React, { useState, useEffect } from 'react';
import loadingGif from '../assets/santa.gif';
const loadingMessages = [
    "checking list",
    "feeding reindeer",
    "consulting miss claus",
    "eating cookie",
    "inspecting toys",
    "meeting with workshop elves",
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
    return (
        <div className="loading">
            <img src={loadingGif} alt="santa gif" />
            <p className={Math.floor(Math.random() * 2) === 0 ? 'red' : 'green'}>{message}</p>
        </div>
    )
}