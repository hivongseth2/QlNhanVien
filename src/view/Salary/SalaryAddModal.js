import { Button, Input, Select, Form, Space, Table, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { DownOutlined, UserOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchApiAllCompany } from "../../redux/CompanySlice";
import Highlighter from "react-highlight-words";
import { CaretRightOutlined, CaretDownOutlined } from "@ant-design/icons";

import {
  fetchApiAddEmployee,
  fetchApiUpdateEmployee,
} from "../../redux/EmployeeSlice";
import { customApi } from "../../API/customApi";
import axios from "axios";
import { fetchApiAddSalary } from "../../redux/SalarySlice";
import { toast } from "react-toastify";
import SalaryModalTime from "./SalaryModalTime";
import SalaryProductModal from "./SalaryProductModal";
const SalaryAddModal = ({ type, departmentId }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tempSalary, setTempSalary] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tempData = await customApi(
          `employee/getByDepartment?id=${departmentId}`,
          "GET"
        );
        setEmployees(tempData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [departmentId]);

  const handleRowClick = (record) => {
    setSelectedRow(selectedRow === record ? null : record);
  };

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

  const handleExpandIconClick = (record) => {
    setSelectedRow(record);

    setModalVisible(true);
  };

  const handleModalOk = () => {
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
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
      dataIndex: "personId",
      key: "personId",
      width: "5%",
    },

    {
      title: "Employee Name",
      dataIndex: "fullName",
      width: "20%",
      key: "fullName",

      ...getColumnSearchProps("fullName"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      width: "15%",
      key: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Salary",
      dataIndex: "salary",
      width: "15%",
      key: "salary",
      ...getColumnSearchProps("salary"),
    },

    {
      title: "Role",
      dataIndex: "account",
      width: "15%",
      key: "account.role.name",
      render: (account) => account && account.role.name,
      // ...getColumnSearchProps("employee.salary"),
    },

    {
      title: "Department",
      dataIndex: "department",
      width: "15%",
      key: "department.departmentName",
      render: (department) => department && department.departmentName,
      // ...getColumnSearchProps("employee.salary"),
    },

    {
      title: "Add",
      dataIndex: "",
      key: "",
      width: "5%",

      render: (person) => (
        <Button
          type="text"
          onClick={() => {
            console.log("!2312312", person);
            handleExpandIconClick(person);
          }}
          icon={<PlusOutlined />}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={employees}
        pagination={{ pageSize: 10 }}
        // onRow={(record) => ({
        //   onClick: () => handleRowClick(record),
        // })}
        rowKey={(record) => record.personId}
      />

      {type == 1 ? (
        <SalaryModalTime
          visible={modalVisible}
          // handleOk={handleAddSalary}

          departmentId={departmentId}
          selectedRow={selectedRow}
          handleCancel={handleModalCancel}
        />
      ) : (
        <SalaryProductModal
          visible={modalVisible}
          // handleOk={handleAddSalary}

          departmentId={departmentId}
          selectedRow={selectedRow}
          handleCancel={handleModalCancel}
        />
      )}
    </>
  );
};

export default SalaryAddModal;
