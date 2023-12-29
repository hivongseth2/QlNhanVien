import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customApi } from "../API/customApi";

const initialState = {
  data: [],
  isLoading: false,
};

// fetch api all company
export const fetchApiDepart = createAsyncThunk(
  "salary/getSalaryByDepart",
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

export const fetchApiAddDepart = createAsyncThunk(
  "department/add",
  async (values) => {
    try {
      const res = await customApi("department/add", "POST", values);

      if (res.data.statusCode === 200 || res.data.statusCode === 201) {
        console.log("res", res);
      }
      console.log("res", res);
      return res.data;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const departmentSlice = createSlice({
  name: "department",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchApiDepart.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchApiDepart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload || [];
      })
      .addCase(fetchApiDepart.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Error fetching companys:", action.error);
      })
      .addCase(fetchApiAddDepart.fulfilled, (state, action) => {
        // const newEmployee = action.payload;
        state.data = [...state.data, action.payload];
      });
  },
});

export default departmentSlice.reducer;
