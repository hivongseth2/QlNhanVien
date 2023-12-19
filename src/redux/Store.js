import { configureStore } from "@reduxjs/toolkit";
import EmployeeSlice from "./EmployeeSlice";
import CompanySlice from "./CompanySlice";
import SalarySlice from "./SalarySlice";

export const store = configureStore({
  reducer: {
    employee: EmployeeSlice,
    companies: CompanySlice,
    salaries: SalarySlice,
  },
});
