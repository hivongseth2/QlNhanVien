import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: [],
  isLoading: false,
};

// fetch api all company
export const fetchApiAllCompany = createAsyncThunk(
  "company/fetchApiAllCompany",
  async () => {
    try {
      const res = await axios.get("http://localhost:8081/company");
      console.log("res all company", res.data);
      return res.data;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const CompanySlice = createSlice({
  name: "companies",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchApiAllCompany.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchApiAllCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload || [];
      })
      .addCase(fetchApiAllCompany.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Error fetching companys:", action.error);
      });
  },
});

export default CompanySlice.reducer;
