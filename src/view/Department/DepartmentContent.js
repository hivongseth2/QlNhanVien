import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Card, Space, Typography } from "antd";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;

const DepartmentContent = () => {
  const location = useLocation();
  const navigation = useNavigate();
  const [departments, setDepartments] = useState(
    location.state && location.state
  );

  useEffect(() => {
    // Update the state when the location changes
    setDepartments(location.state && location.state);
  }, [location.state]);

  const handleEdit = (departmentId) => {
    // Implement the logic for editing the department
    console.log("Edit department:", departmentId);
  };

  const handleDelete = (departmentId) => {
    // Implement the logic for deleting the department
    console.log("Delete department:", departmentId);
  };

  const handleViewEmployees = (departmentId) => {
    // Implement the logic for viewing employees of the department
    navigation("/salary", { state: departmentId }); // Use the correct route path

    console.log("View employees of department:", departmentId);
  };

  return (
    <List
      grid={{ gutter: 16, column: 3 }}
      dataSource={departments || []}
      renderItem={(department, index) => (
        <List.Item>
          <Card
            title={`#: ${index + 1}`}
            extra={
              <Space>
                <Button
                  type="primary"
                  onClick={() => handleEdit(department.id)}
                >
                  Edit
                </Button>
                <Button danger onClick={() => handleDelete(department.id)}>
                  Delete
                </Button>
                <Button onClick={() => handleViewEmployees(department.id)}>
                  View Employees
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
  );
};

export default DepartmentContent;
