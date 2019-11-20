import React, { createContext, useReducer } from 'react';

// @ts-ignore

let User = createContext();
// QuestionnaireInterface

interface UserState {
    user: {
        uid: string;
        displayName: string;
        email: string;
        providerId: string;
        photoURL: string;
        phoneNumber: string;
        family?: {
            [key: string]: {
                has: string;
            }
        }
    }
}

type DispatchActions = 'logout' | 'login';

export interface UserInterface {
    userState: UserState;
    dispatchUser: (params: { type: DispatchActions, payload?: any; }) => void;
}

// const test = {
//     displayName: "Thomas Valadez",
//     email: "thomvaladez@gmail.com",
//     phoneNumber: '',
//     photoURL: "https://avatars.io/facebook/2793638373991728",
//     providerId: "facebook",
//     uid: "PKIpniPK6jQEwhrPZ5ueONbsZz72",
// }
let initialState: UserState = {
    user: {
        uid: '',
        displayName: '',
        email: '',
        providerId: '',
        photoURL: '',
        phoneNumber: '',
        // ...test,
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