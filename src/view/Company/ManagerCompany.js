// ManagerCompany.js
import React, { useEffect, useState } from "react";
import { Button, Space, Switch } from "antd";
import TableTransfer from "./TableTransfer";
import CompanyList from "./CompanyList";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiAllEmployee } from "../../redux/EmployeeSlice";
import { fetchApiUpdatePermiss } from "../../redux/CompanySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const leftTableColumns = [
  {
    dataIndex: "personId",
    title: "personId",
  },
  {
    dataIndex: "fullName",
    title: "fullname",
  },
  {
    dataIndex: "email",
    title: "email",
  },
  {
    dataIndex: "phone",
    title: "phone",
  },
];

const rightTableColumns = [
  {
    dataIndex: "personId",
    key: "personId",
    title: "personId",
  },
  {
    dataIndex: "fullName",
    key: "fullName",
    title: "fullname",
  },
  {
    dataIndex: "email",
    title: "email",
    key: "email",
  },
  {
    dataIndex: "phone",
    title: "phone",
    key: "phone",
  },
];

const ManagerCompany = () => {
  const [targetKeys, setTargetKeys] = useState([]);
  const [showSearch, setShowSearch] = useState(true);
  const [companySelect, setCompanySelect] = useState(null);

  const employees = useSelector((state) => state.employee.data);
  const dispatch = useDispatch();

  const employeesDataSource = employees
    .filter((employee) => employee.account.role.roleId === 2)
    .map((employee) => ({
      key: employee.personId,
      personId: employee.personId,
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
    }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchApiAllEmployee());
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (companySelect) {
      const personIdsInCompany = companySelect.listPerson.map(
        (employee) => employee.personId
      );
      setTargetKeys(personIdsInCompany);
    } else {
      setTargetKeys([]);
    }
  }, [companySelect]);

  const conFirmPermission = async () => {
    console.log("target", companySelect, "on this side:", targetKeys);

    if (companySelect == null) {
      toast.error("please, select company");
      return;
    }
    const data = {
      idCompany: companySelect?.id,
      listIdEmp: targetKeys,
    };

    try {
      const res = await dispatch(fetchApiUpdatePermiss(data));
      if (!res.error) {
        toast.success("Permission updated successfully!");
      } else {
        toast.error("Failed to update permission. Please try again!");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later!");
      return;
      console.error("Error updating permission:", error);
    }
  };

  const onChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const triggerShowSearch = (checked) => {
    setShowSearch(checked);
  };

  return (
    <>
      <CompanyList
        setCompanySelect={setCompanySelect}
        companySelect={companySelect}
      />
      <TableTransfer
        style={{ marginTop: "2em" }}
        dataSource={employeesDataSource}
        targetKeys={targetKeys}
        showSearch={showSearch}
        onChange={onChange}
        leftColumns={leftTableColumns}
        rightColumns={rightTableColumns}
      />
      <Space
        style={{
          marginTop: 16,
        }}
      >
        <Button
          type="primary"
          style={{ backgroundColor: "green" }}
          onClick={conFirmPermission}
        >
          Confirm
        </Button>
      </Space>
    </>
  );
};

export default ManagerCompany;
