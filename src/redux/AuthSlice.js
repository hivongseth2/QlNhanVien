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

export const logoutSlice = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("user");
      return null;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getUserLogin = createAsyncThunk("auth/getUserLogin", async () => {
  try {
    const user = await new Promise((resolve) => {
      const storedUser = localStorage.getItem("user");
      resolve(storedUser ? JSON.parse(storedUser) : null);
    });

    return user;
  } catch (error) {
    throw error;
  }
});
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
        localStorage.setItem("user", JSON.stringify(action.payload));
        state.error = null;
      })
      .addCase(fetchApiLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Access the error message
      })
      .addCase(getUserLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getUserLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(logoutSlice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload; // You can update the state with any data returned from the logout
        state.error = null;
      })
      .addCase(logoutSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAuthState } = AuthSlice.actions;

export default AuthSlice.reducer;
