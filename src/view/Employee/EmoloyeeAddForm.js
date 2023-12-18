import { Button, Input, Select, Form, Radio } from "antd";
import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { fetchApiAllCompany } from "../../redux/CompanySlice";

import { fetchApiAddEmployee } from "../../redux/EmployeeSlice";
import { customApi } from "../../API/customApi";

const EmployeeAddForm = ({ editEmployee }) => {
  const companies = useSelector((state) => state.companies.data);
  const dispatch = useDispatch();

  const [componentSize, setComponentSize] = useState("default");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");

  const [departments, setDepartmens] = useState([]);

  useEffect(() => {
    // Update state variables with editEmployee data
    if (editEmployee) {
      setFullName(editEmployee.fullName || "");
      setPhone(editEmployee.phone || "");
      setEmail(editEmployee.email || "");
      setAddress(editEmployee.address || "");
      setPosition(editEmployee.position || "");
      setCompany(editEmployee.company || "");
      setDepartmentId(editEmployee.departmentId || "");
      setUserName(editEmployee.userName || "");
      setPassWord(editEmployee.passWord || "");
      // Assuming editEmployee.departments is an array
      // setDepartmentId(editEmployee.departments.departmentName || []);
    }

    console.log("edit", editEmployee);
  }, []);
  useEffect(() => {
    setDepartmens(company.departments);
    console.log(company.departments);
  }, [company]);

  // fetall

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchApiAllCompany());
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchData();
    console.log("companies", companies);
  }, [dispatch]);

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const handleSubmit = async (values) => {
    // Handle form submission here
    values = { ...values, status: 1, roleId: 1 };

    try {
      const resultAction = await dispatch(fetchApiAddEmployee(values));
      const newEmployee = resultAction.payload;
      console.log("Fulfilled payload:", newEmployee);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Form
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 14,
      }}
      layout="horizontal"
      initialValues={{
        size: componentSize,
      }}
      onValuesChange={onFormLayoutChange}
      size={componentSize}
      onFinish={handleSubmit}
      style={{
        maxWidth: 600,
      }}
    >
      {/* <Form.Item label="Form Size" name="size">
        <Radio.Group>
          <Radio.Button value="small">Small</Radio.Button>
          <Radio.Button value="default">Default</Radio.Button>
          <Radio.Button value="large">Large</Radio.Button>
        </Radio.Group>
      </Form.Item> */}

      <Form.Item label="Full Name" name="fullName" initialValue={fullName}>
        <Input onChange={(e) => setFullName(e.target.value)} />
      </Form.Item>

      <Form.Item label="Phone" name="phone" initialValue={phone}>
        <Input onChange={(e) => setPhone(e.target.value)} />
      </Form.Item>

      <Form.Item label="Email" name="email" initialValue={email}>
        <Input onChange={(e) => setEmail(e.target.value)} />
      </Form.Item>

      <Form.Item label="Address" name="address" initialValue={address}>
        <Input onChange={(e) => setAddress(e.target.value)} />
      </Form.Item>

      <Form.Item label="Position" name="position" initialValue={position}>
        <Input onChange={(e) => setPosition(e.target.value)} />
      </Form.Item>

      <Form.Item label="Company" name="company" initialValue={company}>
        <Select
          onChange={(value, option) => {
            setCompany(option.data);
            console.log(option.data);
          }}
        >
          {companies.map((item) => {
            return (
              <Select.Option value={item.id} data={item} key={item.id}>
                {item.companyName}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item
        label="Department"
        name="departmentId"
        initialValue={departmentId}
      >
        <Select onChange={(value) => setDepartmentId(value)}>
          {departments?.map((item) => {
            return (
              <Select.Option value={item.id} data={item} key={item.id}>
                {item.departmentName}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="User Name" name="userName" initialValue={userName}>
        <Input onChange={(e) => setUserName(e.target.value)} />
      </Form.Item>

      <Form.Item label="Password" name="passWord" initialValue={passWord}>
        <Input onChange={(e) => setPassWord(e.target.value)} />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};

export default EmployeeAddForm;
