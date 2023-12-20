import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customApi } from "../API/customApi";

const initialState = {
  data: [],
  isLoading: false,
};

export const fetchApiTakeOffDepart = createAsyncThunk(
  "takeoff/getTakeOffByDepart",
  async (values) => {
    try {
      const res = await axios.get(
        `http://localhost:8081/takeoff/getByDepart?departId=${values}`
      );
      console.log("res take off", res.data);
      return res.data;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const fetchApiUpdateState = createAsyncThunk(
  "takeoff/update",
  async (values) => {
    console.log(values.status);
    try {
      const res = await customApi(`takeoff/update`, "PUT", values);

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

export const fetchApiAddTakeOff = createAsyncThunk(
  "takeoff/add",
  async (values) => {
    try {
      const res = await customApi("takeoff/add", "POST", values);

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

export const TakeOffSlice = createSlice({
  name: "takeoff",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchApiTakeOffDepart.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchApiTakeOffDepart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload || [];
      })
      .addCase(fetchApiTakeOffDepart.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Error fetching takeoffs:", action.error);
      })

      .addCase(fetchApiAddTakeOff.fulfilled, (state, action) => {
        // const newEmployee = action.payload;
        state.data = [...state.data, action.payload];
      })

      .addCase(fetchApiUpdateState.fulfilled, (state, action) => {
        console.log("payload take", action);
        const takeOffUpdate = action.payload;

        const index = state.data.findIndex(
          (takeoff) => takeoff.id === takeOffUpdate.id
        );

        if (index !== -1) {
          state.data[index] = takeOffUpdate;
        }
      });
  },
});

export default TakeOffSlice.reducer;
