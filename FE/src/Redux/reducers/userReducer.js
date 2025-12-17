import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user_id: null,
    username: '',
    full_name: '',
    email: '',
    phone: '',
    avatar_url: '',
    status: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const payload = action.payload || {}
            return {
                user_id: payload.id ?? payload.user_id ?? null,
                username: payload.username ?? '',
                full_name: payload.full_name ?? '',
                email: payload.email ?? '',
                phone: payload.phone ?? '',
                status: payload.status ?? '',
                avatar_url: payload.avatar_url ?? ''
            }
        },
        removeUser: state => {
            state.user_id = null
            state.username = ''
            state.full_name = ''
            state.email = ''
            state.phone = ''
            state.avatar_url = ''
            state.status = null
        },
    },
})

export const { updateUser, removeUser } = userSlice.actions

export default userSlice.reducer
