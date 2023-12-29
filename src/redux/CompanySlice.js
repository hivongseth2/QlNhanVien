import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customApi } from "../API/customApi";

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

export const fetchApiEditCompany = createAsyncThunk(
  "company/update",
  async (values) => {
    try {
      console.log("values", values);
      const res = await customApi(`company/update/${values.id}`, "PUT", values);

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

export const fetchApiAddCompany = createAsyncThunk(
  "company/add",
  async (values) => {
    try {
      console.log(values);

      const res = await customApi("company/add", "POST", values);

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

export const fetchApiUpdatePermiss = createAsyncThunk(
  "company/permiss",
  async (values) => {
    try {
      const res = await customApi(`company/permiss`, "PUT", values);

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
      })

      .addCase(fetchApiAddCompany.fulfilled, (state, action) => {
        state.data = [...state.data, action.payload];
      })

      .addCase(fetchApiEditCompany.fulfilled, (state, action) => {
        const updatedCompany = action.payload;

        const index = state.data.findIndex(
          (company) => company.id === updatedCompany.id
        );

        if (index !== -1) {
          state.data[index] = updatedCompany;
        }
      })
      .addCase(fetchApiUpdatePermiss.fulfilled, (state, action) => {
        const updatePermiss = action.payload;

        const index = state.data.findIndex(
          (company) => company.id === updatePermiss.id
        );

        if (index !== -1) {
          state.data[index] = updatePermiss;
        }
      });
  },
});

export default CompanySlice.reducer;
