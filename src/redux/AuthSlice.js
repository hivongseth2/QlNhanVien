import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { customApi } from "../API/customApi";

const initialState = {
  data: null, // Change data to an object
  isLoading: false,
  error: null, // Add an error field
};

export const fetchApiLogin = createAsyncThunk(
  "auth/login",
  async (values, { rejectWithValue }) => {
    try {
      const res = await customApi("auth/login", "POST", values);
      return res.data;
    } catch (error) {
      // Use rejectWithValue to handle errors
      return rejectWithValue(error.response.data);
    }
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.data = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApiLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchApiLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Access the error message
      });
  },
});

export const { resetAuthState } = AuthSlice.actions;

export default AuthSlice.reducer;
