import { configureStore } from '@reduxjs/toolkit';
import urlReducer from './Reducer';

export default configureStore({
    reducer: {
        url: urlReducer
    }
});



