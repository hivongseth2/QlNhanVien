import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customApi } from "../API/customApi";

const initialState = {
  data: [],
  isLoading: false,
};

// fetch api all company

export const fetchApiSalaryProductDepart = createAsyncThunk(
  "salaryProduct/getSalaryByDepart",
  async (values) => {
    try {
      const res = await axios.get(
        `http://localhost:8081/salaryProduct/getByDepart?departId=${values}`
      );
      console.log("res all company", res.data);
      return res.data;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const fetchApiAddSalaryProduct = createAsyncThunk(
  "salaryProduct/add",
  async (values) => {
    try {
      const res = await customApi("salaryProduct/add", "POST", values);

      if (res.data.statusCode === 200 || res.data.statusCode === 201) {
        // toast.success("Thêm khu vực thành công.");
        console.log("res", res);
      }
      console.log("res", res);
      return res.data;
    } catch (error) {
      // toast.error("Khu vực đã tồn tại!");
      console.log({ error });
    }
  }
);

export const SalarySlice = createSlice({
  name: "salary",
  initialState,

  extraReducers: (builder) => {
    builder

      .addCase(fetchApiSalaryProductDepart.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchApiSalaryProductDepart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload || [];
      })
      .addCase(fetchApiSalaryProductDepart.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Error fetching companys:", action.error);
      })
      .addCase(fetchApiAddSalaryProduct.fulfilled, (state, action) => {
        // const newEmployee = action.payload;
        state.data = [...state.data, action.payload];
      });
  },
});

export default SalarySlice.reducer;
