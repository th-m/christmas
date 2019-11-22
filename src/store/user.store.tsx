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
    isAuthenticated: boolean;
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
    let isAuthenticated = userState && userState.user.uid !== '';
    let value = { userState, dispatchUser, isAuthenticated };


    return (
        <User.Provider value={value}>{props.children}</User.Provider>
    );
}

let UserConsumer = User.Consumer;
function UserProviderHoc(WrappedComponent) {
    return function Wrapper(props) {
        return (
            <UserProvider>
                <WrappedComponent {...props} />
            </UserProvider>
        )
    }

}

export { User, UserProvider, UserConsumer, UserProviderHoc };