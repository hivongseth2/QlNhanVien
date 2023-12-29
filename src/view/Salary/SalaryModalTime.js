import {
  Button,
  Input,
  Select,
  Form,
  Space,
  Table,
  DatePicker,
  Modal,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { DownOutlined, UserOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchApiAllCompany } from "../../redux/CompanySlice";
import Highlighter from "react-highlight-words";
import { CaretRightOutlined, CaretDownOutlined } from "@ant-design/icons";

import {
  fetchApiAddEmployee,
  fetchApiUpdateEmployee,
} from "../../redux/EmployeeSlice";
import { customApi } from "../../API/customApi";
import axios from "axios";
import { fetchApiAddSalary } from "../../redux/SalarySlice";
import { toast } from "react-toastify";
const SalaryModalTime = ({
  visible,
  handleCancel,
  selectedRow,
  departmentId,
}) => {
  const [days, setDays] = useState(0);
  const [allow, setAllow] = useState(0);
  const [total, setTotal] = useState(0);
  const [tempSalary, setTempSalary] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateChange = (date, dateString) => {
    setSelectedDate(date.$d.toISOString());
  };
  const dispatch = useDispatch();

  const handleDaysChange = (e) => {
    setDays(e.target.value);
  };

  useEffect(() => {
    setAllow(0);
    setDays(0);
    setTempSalary(0);
    setTotal(0);
  }, [selectedRow]);
  const handleAllowChange = (e) => {
    setAllow(e.target.value);
  };

  useEffect(() => {
    if (days >= 0) {
      let newSalary = parseFloat(selectedRow?.salary) + parseFloat(allow);

      const totalTemp = (newSalary / 26) * parseInt(days);

      setTotal(totalTemp.toFixed(2));
    }
  }, [days, allow]);

  const handleAddSalary = async () => {
    try {
      const form = {
        employeeId: selectedRow.personId,
        departmentId: departmentId,
        date: selectedDate,
        sum: Number(total),
        allow: Number(allow),
      };

      const resultAction = await dispatch(fetchApiAddSalary(form));

      if (!resultAction.error) {
        toast.success("Salary added successfully!");

        setTempSalary(0);
        setTotal(0);
        setDays(0);
        setAllow(0);
      } else {
        toast.error("Failed to add salary. Please try again.");
      }
    } catch (error) {
      console.error("Error during salary addition:", error);
    }
  };

  return (
    <Modal
      footer={null}
      title="Add Salary"
      visible={visible}
      onCancel={handleCancel}
    >
      <DatePicker
        picker="month"
        style={{ marginBottom: "8px" }}
        format="MM-YYYY"
        placeholder="Select Month"
        onChange={handleDateChange}
      />
      <div>
        <div style={{ marginBottom: "8px" }}>
          <label>Days work</label>
          <Input placeholder="Days" value={days} onChange={handleDaysChange} />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>Allow</label>
          <Input
            style={{ margin: "8px 0px" }}
            placeholder="Allow"
            value={allow}
            onChange={handleAllowChange}
          />
        </div>
      </div>

      <p>{`Total = (salary + allow) / 26 * days = (${allow}) / 26 * ${days} = ${total}`}</p>

      <Button onClick={handleAddSalary}>Confirm</Button>
    </Modal>
  );
};

export default SalaryModalTime;
