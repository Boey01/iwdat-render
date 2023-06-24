import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL
    } from './types';
import axios from 'axios';

export const load_user = () => async dispatch => {
    if (localStorage.getItem('access')){

        const config = {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        try{
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/auth/users/me/`,  config);
            dispatch({
                type: USER_LOADED_SUCCESS,
                payload: response.data
            });
    
        } catch (err) {
            console.log(err)
            dispatch({
                type: USER_LOADED_FAIL
            });
        }
    }else{
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
}

export const redux_login = (email, password) => async dispatch => {
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({email,password});

    try{
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/auth/jwt/create/`, body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: response.data
        });
        dispatch(load_user());
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        });
    }
}