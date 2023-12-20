import { configureStore } from "@reduxjs/toolkit";
import EmployeeSlice from "./EmployeeSlice";
import CompanySlice from "./CompanySlice";
import SalarySlice from "./SalarySlice";
import TakeOffSlice from "./TakeOffSlice";
import AuthSlice from "./AuthSlice";

export const store = configureStore({
  reducer: {
    employee: EmployeeSlice,
    companies: CompanySlice,
    salaries: SalarySlice,
    takeoffs: TakeOffSlice,
    user: AuthSlice,
  },
});
