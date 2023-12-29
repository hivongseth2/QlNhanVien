import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Card, Space, Typography } from "antd";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons"; // Import the PlusOutlined icon
import AddDepartmentForm from "./AddDepartmentForm";
import { useDispatch } from "react-redux";
import { fetchApiAddDepart } from "../../redux/DepartmentSlice";
const { Text } = Typography;

const DepartmentContent = () => {
  const location = useLocation();
  const navigation = useNavigate();
  const [company, setCompany] = useState(location.state && location.state);
  const [addDepartmentVisible, setAddDepartmentVisible] = useState(false);
  const dispatch = useDispatch();
  const handleAddDepartment = () => {
    setAddDepartmentVisible(true);
  };

  const handleCancelAddDepartment = () => {
    setAddDepartmentVisible(false);
  };

  const handleAddDepartmentSubmit = (values) => {
    dispatch(fetchApiAddDepart(values));
    setAddDepartmentVisible(false);
    window.location.reload();
  };
  useEffect(() => {
    setCompany(location.state && location.state);
  }, [location.state]);

  const handleEdit = (departmentId) => {
    console.log("Edit department:", departmentId);
  };

  const handleDelete = (departmentId) => {
    console.log("Delete department:", departmentId);
  };

  const handleViewSalaries = (departmentId) => {
    navigation("/manager/company/salary", { state: departmentId }); // Use the correct route path

    console.log("View employees of department:", departmentId);
  };

  const handleViewTakeOff = (departmentId) => {
    // Implement the logic for viewing employees of the department
    navigation("/manager/company/takeoff", { state: departmentId }); // Use the correct route path

    console.log("View employees of department:", departmentId);
  };
  return (
    <div>
      <Button
        type="primary"
        onClick={handleAddDepartment}
        style={{ margin: "10px" }}
      >
        <PlusOutlined /> Add Department
      </Button>
      <List
        style={{ marginTop: "10px" }}
        grid={{ column: 3 }}
        dataSource={company.departments || []}
        renderItem={(department, index) => (
          <List.Item>
            <Card
              title={`#: ${index + 1}`}
              extra={
                <Space>
                  {/* <Button
                    type="primary"
                    onClick={() => handleEdit(department.id)}
                  >
                    Edit
                  </Button>
                  <Button danger onClick={() => handleDelete(department.id)}>
                    Delete
                  </Button> */}
                  <Button
                    onClick={() => handleViewSalaries(department.id)}
                    style={{ backgroundColor: "green", color: "white" }}
                  >
                    Salaries
                  </Button>
                  <Button
                    onClick={() => handleViewTakeOff(department.id)}
                    style={{ backgroundColor: "orange", color: "white" }}
                  >
                    Take Off
                  </Button>
                </Space>
              }
            >
              <Text strong>Department ID:</Text> {department.id}
              <br />
              <Text strong>Department Name:</Text> {department.departmentName}
            </Card>
          </List.Item>
        )}
      />
      <AddDepartmentForm
        visible={addDepartmentVisible}
        onCancel={handleCancelAddDepartment}
        onAdd={handleAddDepartmentSubmit}
        companyId={company.id}
      />
    </div>
  );
};

export default DepartmentContent;
