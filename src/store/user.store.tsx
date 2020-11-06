import React, { createContext, useReducer, Dispatch } from 'react';

export interface UserInterface {
    isAuthenticated: boolean;
    user: UserState;
}
const initialState: UserInterface = {
    user: {
        uid: "",
        displayName: "",
        email: "",
        providerId: "",
        photoURL: "",
        phoneNumber: ""
    },
    isAuthenticated: false,
};


export interface UserState {
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

interface LOGOUT {
    type: "logout";
}
interface LOGIN {
    type: "login";
    payload: UserState
}
type Actions = LOGIN | LOGOUT

interface ContextInterface {
    state: UserInterface,
    dispatch: Dispatch<Actions>;
}
const User = createContext<ContextInterface>({
    state: { ...initialState },
    dispatch: () => { return }
});

const reducer = (state: UserInterface, action: Actions) => {
    switch (action.type) {
        case "logout":
            return { ...initialState };
        case "login":
            return { ...state, user: action.payload, isAuthenticated: action?.payload?.uid !== "" };
        default:
            return state;
    }
};

function UserProvider(props) {
    let [state, dispatch] = useReducer(reducer, initialState);
    let value = { state, dispatch };


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