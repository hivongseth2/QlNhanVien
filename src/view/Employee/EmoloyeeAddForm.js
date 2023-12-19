import { Button, Input, Select, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchApiAllCompany } from "../../redux/CompanySlice";
import {
  fetchApiAddEmployee,
  fetchApiUpdateEmployee,
} from "../../redux/EmployeeSlice";

const EmployeeAddForm = ({ editEmployee }) => {
  const companies = useSelector((state) => state.companies.data);
  const [company, setCompany] = useState({});
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({
    fullName: "",
    phone: "",
    email: "",
    department: {},
    address: "",
    salary: "",

    position: "",
    departmentId: "",
    userName: "",
    passWord: "",
  });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    console.log("form value", formValues);
  }, [formValues]);

  useEffect(() => {
    if (editEmployee) {
      console.log("edit", editEmployee);
      const { account, ...tempForm } = editEmployee;
      console.log("temp:", tempForm);
      tempForm.departmentId = editEmployee?.department?.id || "";
      tempForm.userName = editEmployee?.account?.userName;
      tempForm.passWord = editEmployee?.account?.password;
      setFormValues(tempForm);
    }
  }, [editEmployee]);

  useEffect(() => {
    if (editEmployee) {
      companies.forEach((item) => {
        item.departments.forEach((itemDepart) => {
          if (itemDepart?.id === editEmployee?.department?.id) {
            setCompany(item);
          }
        });
      });
    }
  }, [editEmployee]);

  useEffect(() => {
    setDepartments(formValues.company?.departments || company.departments);
  }, [formValues.company, company]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchApiAllCompany());
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      formValues.roleId = 1;
      formValues.departmentId = formValues.department.id;
      const { company, department, ...dataTrans } = formValues;

      if (editEmployee) {
        const resultAction = await dispatch(fetchApiUpdateEmployee(dataTrans));
      } else {
        const resultAction = await dispatch(fetchApiAddEmployee(dataTrans));
      }

      // const newEmployee = resultAction.payload;
      // console.log("Fulfilled payload:", newEmployee);
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
      onFinish={handleSubmit}
      style={{
        maxWidth: 600,
      }}
    >
      <Form.Item label="Full Name">
        <Input
          value={formValues.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Phone">
        <Input
          value={formValues.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Email">
        <Input
          value={formValues.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Address">
        <Input
          value={formValues.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Position">
        <Input
          value={formValues.position}
          onChange={(e) => handleInputChange("position", e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Salary">
        <Input
          value={formValues.salary}
          onChange={(e) => handleInputChange("salary", e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Company">
        <Select
          value={company.companyName}
          onChange={(value, option) => {
            handleInputChange("company", option.data);
            setCompany(option.data);
          }}
        >
          {companies.map((item) => (
            <Select.Option value={item.id} data={item} key={item.id}>
              {item.companyName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {(formValues.company || company) && (
        <Form.Item label="Department">
          <Select
            value={formValues?.department?.departmentName}
            onChange={(value, option) =>
              handleInputChange("department", option.data)
            }
          >
            {departments?.map((item) => (
              <Select.Option value={item.id} data={item} key={item.id}>
                {item.departmentName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      <Form.Item label="User Name">
        <Input
          value={formValues.userName}
          onChange={(e) => handleInputChange("userName", e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Password">
        <Input.Password
          value={formValues.passWord}
          onChange={(e) => handleInputChange("passWord", e.target.value)}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};

export default EmployeeAddForm;
