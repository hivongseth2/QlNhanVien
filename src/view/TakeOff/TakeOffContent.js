import React, { useEffect, useState } from "react";
import EmployeeTable from "../../table/EmployeeTable";
import { Button, Flex, Modal } from "antd";
import SalaryTable from "../../table/SalaryTable";
import { useLocation } from "react-router-dom";
// import SalaryAddModal from "./SalaryAddModal";
import TakeOffTable from "../../table/TakeOffTable";
import TakeOffForm from "./TakeOffForm";

export default function TakeOffContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <Button type="primary" onClick={showModal}>
        Add Take Off
      </Button>

      <TakeOffTable />
      <Modal
        title="New Take Off Form"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000} // Adjust the width as per your requirement
      >
        {/* <SalaryAddModal departmentId={departments} /> */}

        <TakeOffForm departmentId={departments} />
      </Modal>
    </div>
  );
}
