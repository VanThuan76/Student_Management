import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type APPSTATE = {
    user: any,
    isAuth: boolean,
}

const initialState: APPSTATE = {
    user: undefined,
    isAuth: false,
}
export const appSlice = createSlice({
    name: 'appSlice',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<any>) => {
            state.user = action.payload
            state.isAuth = true
        },
        logout: (state) => {
            state.user = undefined
            state.isAuth = false
        },
    }
}
)
// Action creators are generated for each case reducer function
export const { login, logout } = appSlice.actions
export default appSlice.reducer
