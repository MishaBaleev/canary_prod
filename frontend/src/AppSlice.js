import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: "app",
    initialState: {
        modal:{
            title: "",
            message: ""
        }
    },
    reducers: {
        updateModal: (state, action) => {
            state.modal.title = action.payload.title 
            state.modal.message = action.payload.message
        }
    }
})
export const {updateModal} = appSlice.actions 
export default appSlice.reducer