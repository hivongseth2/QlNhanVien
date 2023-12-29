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

import { customApi } from "../../API/customApi";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchApiAddSalaryProduct } from "../../redux/SalaryProductSlice";
const SalaryProductModal = ({
  visible,
  handleCancel,
  selectedRow,
  departmentId,
}) => {
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [tempSalary, setTempSalary] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateChange = (date, dateString) => {
    setSelectedDate(date.$d.toISOString());
  };
  const dispatch = useDispatch();

  const handleNumberPChange = (e) => {
    setNumberOfProducts(e.target.value);
  };

  useEffect(() => {
    setNumberOfProducts(0);
    setUnitPrice(0);

    setTotal(0);
  }, [selectedRow]);
  const UnitPriceChange = (e) => {
    setUnitPrice(e.target.value);
  };

  useEffect(() => {
    if (unitPrice >= 0) {
      const totalTemp = unitPrice * numberOfProducts;

      setTotal(totalTemp.toFixed(2));
    }
  }, [unitPrice, numberOfProducts]);

  const handleAddSalary = async () => {
    try {
      const form = {
        employeeId: selectedRow.personId,
        departmentId: departmentId,
        date: selectedDate,
        sum: Number(total),
        unitPrice: Number(unitPrice),
        numberOfProducts: Number(numberOfProducts),
      };

      const resultAction = await dispatch(fetchApiAddSalaryProduct(form));

      if (!resultAction.error) {
        toast.success("Salary added successfully!");

        setNumberOfProducts(0);
        setUnitPrice(0);

        setTotal(0);
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
          <label>Unit Price</label>
          <Input
            placeholder="unitPrice"
            value={unitPrice}
            onChange={UnitPriceChange}
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>Allow</label>
          <Input
            style={{ margin: "8px 0px" }}
            placeholder="numberOfProducts"
            value={numberOfProducts}
            onChange={handleNumberPChange}
          />
        </div>
      </div>

      <p>{`Total = (unitPrice * number Of Products) = ${unitPrice}  * ${numberOfProducts} = ${total}`}</p>

      <Button onClick={handleAddSalary}>Confirm</Button>
    </Modal>
  );
};

export default SalaryProductModal;
