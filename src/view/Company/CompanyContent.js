import React, { useState } from "react";
import EmployeeTable from "../../table/EmployeeTable";
import { Button, Flex, Modal } from "antd";
// import EmployeeAddForm from "./EmoloyeeAddForm";
import CompanyTable from "../../table/CompanyTable";

export default function CompanyContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      <Button type="primary" onClick={showModal}>
        Add Company
      </Button>

      <CompanyTable />

      {/* <Modal
        title="Add Employee"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <EmployeeAddForm />
      </Modal> */}
    </div>
  );
}
