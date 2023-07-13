import { createSlice } from '@reduxjs/toolkit';

const Data = createSlice({
    name: 'data',
    initialState: {
        data: [],
    }
    ,
    reducers: {
        updateVal(state, actions) {

            state.data = actions.payload
        }
    }
});

export const { updateVal } = Data.actions;

export default Data.reducer;