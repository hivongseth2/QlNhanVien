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
    const res = await customApi("employee/add", "POST", values);

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

const fetchApiUpdateEmployee = createAsyncThunk(
  "employee/update",
  async (values) => {
    try {
      console.log("values", values);
      const res = await customApi(
        `employee/update/${values.personId}`,
        "PUT",
        values
      );

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

const fetchApiUpdateRole = createAsyncThunk(
  "account/update",
  async (values) => {
    console.log(values, "========123");
    if (values.roleId === 3) {
      return;
    }
    try {
      const res = await customApi(`account/update`, "PUT", values);

      if (res) {
        console.log("res return bên data", res.data);
      }
      return res.data;
    } catch (error) {
      // toast.error("Khu vực đã tồn tại!");
      console.log({ error });
    }
  }
);

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
      })

      .addCase(fetchApiUpdateEmployee.fulfilled, (state, action) => {
        const updatedEmployee = action.payload;

        const index = state.data.findIndex(
          (employee) => employee.personId === updatedEmployee.personId
        );

        if (index !== -1) {
          state.data[index] = updatedEmployee;
        }
      })
      .addCase(fetchApiUpdateRole.fulfilled, (state, action) => {
        // Log the current state
        console.log("Current State:", JSON.stringify(state, null, 2));

        const updatedEmployee = action.payload;

        const updatedData = state.data.map((employee) => {
          if (employee.account.userId === updatedEmployee.userId) {
            return {
              ...employee,
              account: {
                ...employee.account,
                role: updatedEmployee.role,
              },
            };
          } else {
            return employee;
          }
        });

        // Log the updated state
        console.log("Updated State:", {
          ...state,
          data: updatedData,
        });

        // Return a new state object
        return {
          ...state,
          data: updatedData,
        };
      });
  },
});

export {
  fetchApiAllEmployee,
  fetchApiAddEmployee,
  fetchApiUpdateEmployee,
  fetchApiUpdateRole,
};
export default EmployeeSlice.reducer;
