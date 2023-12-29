import { Button, Input, Select, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchApiAllCompany } from "../../redux/CompanySlice";
import {
  fetchApiAddEmployee,
  fetchApiUpdateEmployee,
} from "../../redux/EmployeeSlice";
import { toast } from "react-toastify";

const EmployeeAddForm = ({ editEmployee, onCancel }) => {
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

  const clearForm = () => {
    setFormValues({
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
  };
  const [departments, setDepartments] = useState([]);
  const [formattedSalary, setFormattedSalary] = useState("");
  const handleSalaryChange = (value) => {
    const numericSalary = parseFloat(value.replace(/[^0-9]/g, ""));

    const formattedSalary = numericSalary.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    setFormattedSalary(formattedSalary);

    setFormValues((prevValues) => ({
      ...prevValues,
      salary: numericSalary,
    }));
  };

  useEffect(() => {
    console.log("form value", formValues);
  }, [formValues]);

  // useEffect(() => {
  //   if (editEmployee) {
  //     const { account, ...tempForm } = editEmployee;
  //     tempForm.departmentId = editEmployee?.department?.id || "";
  //     tempForm.userName = editEmployee?.account?.userName;
  //     tempForm.passWord = editEmployee?.account?.password;
  //     setFormValues(tempForm);
  //   }
  // }, [editEmployee]);
  useEffect(() => {
    if (editEmployee) {
      const { account, ...tempForm } = editEmployee;
      tempForm.departmentId = editEmployee?.department?.id || "";
      tempForm.userName = editEmployee?.account?.userName;
      tempForm.passWord = editEmployee?.account?.password;
      setFormValues(tempForm);

      // Cập nhật formattedSalary từ giá trị salary của editEmployee
      const numericSalary = parseFloat(editEmployee.salary);
      const formattedSalary = numericSalary.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
      setFormattedSalary(formattedSalary);
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
        toast.error(`Load data fail!`);
        console.error("Error fetching companies:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^0\d{9}$/;
    return phoneNumberRegex.test(phoneNumber);
  };
  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      // Kiểm tra xem tất cả các trường bắt buộc có giá trị không
      const requiredFields = [
        "fullName",
        "phone",
        "email",
        "address",
        "position",
        "salary",

        "userName",
        "passWord",
      ];
      const missingFields = requiredFields.filter(
        (field) => !formValues[field]
      );

      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields}`);
        return;
      }

      formValues.roleId = 1;
      formValues.departmentId = formValues.department.id;
      const { company, department, ...dataTrans } = formValues;

      let resultAction;

      try {
        if (editEmployee) {
          resultAction = await dispatch(fetchApiUpdateEmployee(dataTrans));
        } else {
          resultAction = await dispatch(fetchApiAddEmployee(dataTrans));
        }
      } catch (e) {
        toast.error("Error, please try again");
        return;
      }

      toast.success(
        editEmployee
          ? "Employee updated successfully!"
          : "Employee added successfully!"
      );
      clearForm();
      onCancel();
    } catch (error) {
      toast.error("Form submission failed. Please try again." + error);
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
          onBlur={(e) => {
            if (!isValidPhoneNumber(e.target.value)) {
              toast.error("Phone is not valid");
            }
          }}
        />
      </Form.Item>

      <Form.Item label="Email">
        <Input
          value={formValues.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          onBlur={(e) => {
            if (!isValidEmail(e.target.value)) {
              toast.error("Email is not valid");
            }
          }}
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
          value={formattedSalary}
          onChange={(e) => handleSalaryChange(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Company">
        <Select
          value={company.companyName}
          onChange={(value, option) => {
            if (!editEmployee) {
              // Check if in edit mode
              handleInputChange("company", option.data);
              setCompany(option.data);
            }
          }}
          disabled={editEmployee} // Disable the Select if in edit mode
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
            disabled={editEmployee} // Disable the Select if in edit mode
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
