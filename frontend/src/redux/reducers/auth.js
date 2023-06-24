import {
LOGIN_SUCCESS,
LOGIN_FAIL,
USER_LOADED_SUCCESSS,
USER_LOADED_FAIL
} from '../types'

const initialState = {
    access : localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null
};

export default function at(state = initialState, action){
    const {type, payload} = action;

    switch(type){
        case LOGIN_SUCCESS:
            localStorage.setItem('access', payload.access)
            return{
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh
            }

        case USER_LOADED_SUCCESSS:
            return{
                ...state,
                user:payload
            }
            
            case USER_LOADED_FAIL:
                return{
                    ...state,
                    user: null
                }  

        case LOGIN_FAIL:
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
            return{
               ...state,
               access: null,
               refresh: null,
               isAuthenticated: false,
               user: null
            }
            default:
                return state
    }
}