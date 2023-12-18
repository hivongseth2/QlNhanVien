import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customApi } from "../API/customApi";

const initialState = {
  data: [],
  isLoading: false,
};

// fetch api all Employee
const fetchApiAllEmployee = createAsyncThunk(
  "employee/fetchApiAllEmployee",
  async () => {
    try {
      const res = await axios.get("http://localhost:8081/employee");
      console.log("res all Area", res.data);
      return res.data;
    } catch (error) {
      console.log({ error });
    }
  }
);

// fetch api add area
const fetchApiAddEmployee = createAsyncThunk("employee/add", async (values) => {
  try {
    console.log("day la", values);
    // const { keyId, tenKhuVuc, vungId } = values;
    const res = await customApi("employee/add", "POST", values);
    // const res = await axios.post("http://localhost:8081/employee/add", values);

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
});

const EmployeeSlice = createSlice({
  name: "employee",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchApiAllEmployee.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchApiAllEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload || [];
      })
      .addCase(fetchApiAllEmployee.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Error fetching employees:", action.error);
      })
      .addCase(fetchApiAddEmployee.fulfilled, (state, action) => {
        // const newEmployee = action.payload;
        state.data = [...state.data, action.payload];
      });
  },
});

export { fetchApiAllEmployee, fetchApiAddEmployee };
export default EmployeeSlice.reducer;
