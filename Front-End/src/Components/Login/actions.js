import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   email: '',
// };

const emailSlice = createSlice({
  name: 'email',
  initialState:{value:[]},
  reducers: {
    getEmail: (state, action) => {
      state.value.push(action.payload); 
    },
  },
});

export const { getEmail } = emailSlice.actions;
export default emailSlice.reducer;
