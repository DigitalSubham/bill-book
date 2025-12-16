// store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getToken } from '../../utils/storage';

export const loadToken = createAsyncThunk('auth/loadToken', async () => {
  const token = await getToken();
  return token;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null as string | null,
    loading: true,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.loading = false;
    },
    logout: state => {
      state.token = null;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder.addCase(loadToken.fulfilled, (state, action) => {
      state.token = action.payload;
      state.loading = false;
    });
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
