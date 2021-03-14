import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { User } from '@tps/data.types'
import axios from 'axios'
import { LoadingStatus } from '@tps/util.types'


interface State {
    authenticated: boolean
    loadingStatus: LoadingStatus
    user?: User
}

interface Action {
    type: string
    payload?: any
}

const StateContext = createContext<State>({
    authenticated: false,
    loadingStatus: LoadingStatus.NEVER,
    user: null
})

const DispatchContext = createContext(null)

const reducer = (state: State, { type, payload }: Action) => {
    switch (type) {
        case 'AUTH::LOADING':
            return {
                ...state,
                loadingStatus: LoadingStatus.LOADING
            }
        case 'AUTH::LOGIN_SUCCESS':
            return {
                ...state,
                authenticated: true,
                loadingStatus: LoadingStatus.LOADED,
                user: payload
            }
        case 'AUTH::LOGIN_FAILURE':
            return {
                ...state,
                loadingStatus: LoadingStatus.ERROR
            }
        case 'AUTH::LOGOUT':
            return {
                ...state,
                authenticated: false,
                loadingStatus: LoadingStatus.LOADED,
                user: null
            }
        default:
            throw new Error(`Unknown action type: ${type}`)
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, {
        user: null,
        loadingStatus: LoadingStatus.NEVER,
        authenticated: false
    })

    useEffect(() => {
        const loadUser = async () => {
            try {
                dispatch({ type: 'AUTH::LOADING' })
                const res = await axios.get('/auth/me')

                if (res.data.code === 200) {
                    dispatch({ type: 'AUTH::LOGIN_SUCCESS', payload: res.data.data})
                }
            } catch(e) {
                dispatch({ type: 'AUTH::LOGIN_FAILURE' })
                console.log(e)
            }
        }

        loadUser()
    }, [])

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export const useAuthState = () => useContext(StateContext)
export const useAuthDispatch = () => useContext(DispatchContext)