import { SearchOutlined } from "@ant-design/icons";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Dropdown, Menu, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchApiAllCompany } from "../redux/CompanySlice";
import { useNavigate } from "react-router-dom";
import { fetchApiSalaryDepart } from "../redux/SalarySlice";
import { useLocation } from "react-router-dom";

// import EmployeeAddForm from "../view/Employee/EmoloyeeAddForm";

const SalaryTable = () => {
  const navigation = useNavigate();
  const data = useSelector((state) => state.salaries.data);
  const dispatch = useDispatch();
  const location = useLocation();
  const [departments, setDepartments] = useState(
    location.state && location.state
  );

  const [isEdit, setIsEdit] = useState(false);
  const [editEmployee, setEditEmployee] = useState({});

  useEffect(() => {
    // Update the state when the location changes
    setDepartments(location.state && location.state);
  }, [location.state]);
  //handle

  const handleOk = () => {
    setIsEdit(false);
  };
  const handleCancel = () => {
    setIsEdit(false);
  };
  const handleEdit = (record) => {
    // setIsEdit(true);
    // setEditEmployee(record);
    console.log(record);
  };

  useEffect(() => {
    console.log("dataSalary123:", data);
  }, []);

  useEffect(() => {}, [editEmployee]);
  const handleDelete = (record) => {
    console.log("Delete:", record.departments);
  };
  //   const uniqueTypes = Array.from(new Set(data.map((item) => item?.type)));

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchApiSalaryDepart(departments));
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  const clearFilters = () => {
    setFilteredInfo({});
  };
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "#",
      dataIndex: "idSalary",
      key: "idSalary",
      width: "5%",
    },

    {
      title: "Employee Name",
      dataIndex: "employee",
      width: "15%",
      key: "employee.fullName",
      ...getColumnSearchProps("employee.fullName"),

      render: (employee) => employee && employee.fullName,
    },
    {
      title: "Phone",
      dataIndex: "employee",
      width: "10%",
      key: "employee.phone",
      ...getColumnSearchProps("employee.phone"),

      render: (employee) => employee && employee.phone,
    },
    {
      title: "Salary",
      dataIndex: "employee",
      width: "10%",
      key: "employee.salary",
      ...getColumnSearchProps("employee.salary"),

      render: (employee) => employee && employee.salary,
    },

    {
      title: "Role",
      dataIndex: "employee",
      width: "10%",
      key: "employee.account.role.roleName",
      render: (employee) => employee && employee.account.role.roleName,
      // ...getColumnSearchProps("employee.salary"),
    },
    {
      title: "Department",
      dataIndex: "employee",
      width: "10%",
      key: "employee.department.departmentName",
      render: (employee) => employee && employee.department.departmentName,
      // ...getColumnSearchProps("employee.salary"),
    },
    {
      title: "Month",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("MM/YYYY"),

      //   ...getColumnSearchProps("date"),
    },

    {
      title: "Allow",
      dataIndex: "allow",
      key: "allow",
      ...getColumnSearchProps("allow"),
    },
    {
      title: "Sum",
      dataIndex: "sum",
      key: "sum",
      ...getColumnSearchProps("sum"),
      render: (text) => (
        <span>
          {parseFloat(text).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </span>
      ),
    },

    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button danger type="primary" onClick={() => handleDelete(record)}>
            Department
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table columns={columns} dataSource={data} />;
      {/* <Modal
        title="Edit Employee"
        open={isEdit}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <EmployeeAddForm editEmployee={editEmployee} />
      </Modal> */}
    </>
  );
};
export default SalaryTable;
