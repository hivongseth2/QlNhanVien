import React, { useEffect, useState } from "react";
import EmployeeTable from "../../table/EmployeeTable";
import { Button, Flex, Modal } from "antd";
// import EmployeeAddForm from "./EmoloyeeAddForm";
import CompanyTable from "../../table/CompanyTable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserLogin } from "../../redux/AuthSlice";
import CompanyAddForm from "./CompanyAddForm";
export default function CompanyContent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);

  useEffect(() => {
    dispatch(getUserLogin());
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigation = useNavigate();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const managerCompany = () => {
    navigation("managercompany");
  };

  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <div>
      {user?.roleId === 3 && (
        <div>
          <Button
            type="primary"
            onClick={showModal}
            style={{ marginRight: "30px" }}
          >
            Add Company
          </Button>

          <Button
            type="primary"
            style={{ backgroundColor: "ButtonText" }}
            onClick={managerCompany}
          >
            Manager Company
          </Button>
        </div>
      )}

      <CompanyTable />
      <Modal
        title="Add Company"
        visible={isModalOpen} // Corrected prop name
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <CompanyAddForm onCancel={handleCancel} />
      </Modal>
    </div>
  );
}
