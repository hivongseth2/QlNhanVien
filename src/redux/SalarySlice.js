import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: [],
  isLoading: false,
};

// fetch api all company
export const fetchApiSalaryDepart = createAsyncThunk(
  "company/fetchApiAllCompany",
  async (values) => {
    try {
      const res = await axios.get(
        `http://localhost:8081/salary/getByDepart?departId=${values}`
      );
      console.log("res all company", res.data);
      return res.data;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const SalarySlice = createSlice({
  name: "salary",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchApiSalaryDepart.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchApiSalaryDepart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload || [];
      })
      .addCase(fetchApiSalaryDepart.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Error fetching companys:", action.error);
      });
  },
});

export default SalarySlice.reducer;
