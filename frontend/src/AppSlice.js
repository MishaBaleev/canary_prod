import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: "app",
    initialState: {
        modal:{
            title: "",
            message: ""
        },
        auto_suppress: false,
        suppress_connected: false
    },
    reducers: {
        updateModal: (state, action) => {
            state.modal.title = action.payload.title 
            state.modal.message = action.payload.message
        },
        changeAutoSuppress: (state, action) => {
            state.auto_suppress = action.payload
        },
        changeSupressConnected: (state, action) => {
            state.suppress_connected = action.payload
        }
    }
})
export const {updateModal, changeAutoSuppress, changeSupressConnected} = appSlice.actions 
export default appSlice.reducer