import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    value: [],
  },

  reducers: {

    addUser: (state, action) => {
      state.value.push(action.payload);
    },
    editUser: (state, action) => {
      const { id, newData } = action.payload;
      const userIndex = state.value.findIndex(user => user.id === id);
      if (userIndex !== -1) {
        state.value[userIndex] = { ...state.value[userIndex], ...newData };
      }
    },
    deleteUser: (state, action) => {
      const idToDelete = action.payload;
      state.value = state.value.filter(user => user.id !== idToDelete);
    },
  },
});

export const { addUser, editUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
