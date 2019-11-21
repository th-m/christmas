import React, { createContext, useReducer } from 'react';

// @ts-ignore
let User = createContext();

interface UserState {
    user: {
        uid: string;
        displayName: string;
        email: string;
        providerId: string;
        photoURL: string;
        phoneNumber: string;
        games?: {
            [key: string]: {
                has: string;
                name: string;
            }
        }
    }
}

type DispatchActions = 'logout' | 'login';

export interface UserInterface {
    userState: UserState;
    dispatchUser: (params: { type: DispatchActions, payload?: any; }) => void;
}

let initialState: UserState = {
    user: {
        uid: '',
        displayName: '',
        email: '',
        providerId: '',
        photoURL: '',
        phoneNumber: '',
    },
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