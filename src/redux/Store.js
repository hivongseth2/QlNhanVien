import { configureStore } from "@reduxjs/toolkit";
import EmployeeSlice from "./EmployeeSlice";
import CompanySlice from "./CompanySlice";

export const store = configureStore({
  reducer: {
    employee: EmployeeSlice,
    companies: CompanySlice,
  },
});
