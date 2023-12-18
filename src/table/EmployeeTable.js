import { SearchOutlined } from "@ant-design/icons";
import { DownOutlined, UserOutlined } from "@ant-design/icons";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Dropdown, Menu, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchApiAllEmployee } from "../redux/EmployeeSlice";
import EmployeeAddForm from "../view/Employee/EmoloyeeAddForm";

const EmployeeTable = () => {
  const data = useSelector((state) => state.employee.data);
  const dispatch = useDispatch();

  const [isEdit, setIsEdit] = useState(false);
  const [editEmployee, setEditEmployee] = useState({});
  //handle

  const handleOk = () => {
    setIsEdit(false);
  };
  const handleCancel = () => {
    setIsEdit(false);
  };
  const handleEdit = (record) => {
    console.log("Edit:", record);
    // Implement the logic for editing

    setIsEdit(true);
    setEditEmployee(record);
  };

  const handleDelete = (record) => {
    console.log("Delete:", record);
    // Implement the logic for deleting
  };
  const uniquePositions = Array.from(
    new Set(data.map((item) => item?.position))
  );

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
      dataIndex: "personId",
      key: "personId",
      width: "10%",
    },

    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      width: "15%",
      ...getColumnSearchProps("fullName"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: "15%",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "15%",
      ...getColumnSearchProps("email"),
    },
    {
      title: "position",
      dataIndex: "position",
      key: "position",
      width: "15%",
      filters: uniquePositions.map((position) => ({
        text: position,
        value: position,
      })),
      onFilter: (value, record) => record.position.indexOf(value) === 0,
    },

    {
      title: "Department",
      dataIndex: "department",
      key: "department.departmentName",
      ...getColumnSearchProps("department.departmentName"),
      render: (department) => department && department.departmentName,
      sorter: (a, b) =>
        a.department?.departmentName.localeCompare(
          b.department?.departmentName
        ),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      dataIndex: "operation",
      key: "personId",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button danger type="primary" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table columns={columns} dataSource={data} />;
      <Modal
        title="Edit Employee"
        editEmployee={editEmployee}
        open={isEdit}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <EmployeeAddForm />
      </Modal>
    </>
  );
};
export default EmployeeTable;
