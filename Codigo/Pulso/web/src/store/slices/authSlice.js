import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    isAuthenticated: false,
    sessionChecked: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = Boolean(action.payload)
            state.sessionChecked = true
        },
        clearUser: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.sessionChecked = true
        },
        setSessionChecked: (state) => {
            state.sessionChecked = true
        },
    },
})

export const { setUser, clearUser, setSessionChecked } = authSlice.actions
export default authSlice.reducer
