import React, { createContext, useReducer } from 'react';

// @ts-ignore
let User = createContext();

let initialState = {
    user: null,
};

// @ts-ignore
let reducer = (state, action) => {
    switch (action.type) {
        case "logout":
            return initialState;
        case "login":
            return { user: action.payload };
    }
};

function UserProvider(props) {
    // const [foo, setFoo] = useState('foo');
    let [userState, dispatchUser] = useReducer(reducer, initialState);
    let value = { userState, dispatchUser };


    return (
        <User.Provider value={value}>{props.children}</User.Provider>
    );
}

let UserConsumer = User.Consumer;

export { User, UserProvider, UserConsumer };