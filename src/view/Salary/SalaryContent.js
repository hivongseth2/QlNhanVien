import React, { useEffect, useState } from "react";
import EmployeeTable from "../../table/EmployeeTable";
import { Button, Flex, Modal } from "antd";
import SalaryTable from "../../table/SalaryTable";
import { useLocation } from "react-router-dom";
import SalaryAddModal from "./SalaryAddModal";

export default function SalaryContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const type = 1;
  const location = useLocation();
  const [departments, setDepartments] = useState(
    location.state && location.state
  );
  useEffect(() => {
    // Update the state when the location changes
    setDepartments(location.state && location.state);
  }, [location.state]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <div style={{ marginTop: 16 }}>
        <h2>SALARY TIME</h2>
      </div>
      <Button type="primary" onClick={showModal}>
        Add salary
      </Button>

      {/* <EmployeeTable /> */}
      <SalaryTable />
      <Modal
        title="Add Salary Time"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000} // Adjust the width as per your requirement
        footer={null}
      >
        <SalaryAddModal type={type} departmentId={departments} />
      </Modal>
    </div>
  );
}
