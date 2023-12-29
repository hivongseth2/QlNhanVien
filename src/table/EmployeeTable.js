import { SearchOutlined } from "@ant-design/icons";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Dropdown, Menu, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchApiAllEmployee,
  fetchApiUpdateRole,
} from "../redux/EmployeeSlice";
import EmployeeAddForm from "../view/Employee/EmoloyeeAddForm";
import { getUserLogin, logoutSlice } from "../redux/AuthSlice";

const EmployeeTable = () => {
  const data = useSelector((state) => state.employee.data);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);

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
    setIsEdit(true);
    setEditEmployee(record);
  };

  useEffect(() => {}, [editEmployee]);
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
        dispatch(getUserLogin());
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

  const updateRole = (record) => {
    let newRoleId = 1;
    if (record.account.role.roleId === 3) {
      newRoleId = 3;
      return;
    }
    if (record.account.role.roleId === 1) {
      newRoleId = 2;
    }
    const form = {
      accountId: record.account.userId,
      roleId: newRoleId,
    };

    dispatch(fetchApiUpdateRole(form))
      .then((result) => {
        // Check if the update was successful
        if (!result.error) {
          toast.success("Role updated successfully");
        } else {
          toast.error("Failed to update role. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error updating role:", error);
        toast.error("An error occurred while updating role.");
      });
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
      width: "5%",
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
      width: "7%",
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
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      sorter: (a, b) => a.salary - b.salary,
      render: (text, record) => (
        <span>
          {Number(text).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "operation",
      key: "personId",
      render: (text, record) => (
        <Space size="middle">
          <Button
            danger
            disabled={user?.roleId !== 3} //
            type="primary"
            onClick={() => updateRole(record)}
            style={{
              color: "#eee",
              width: "120px",
              backgroundColor:
                record.account.role.roleId === 1
                  ? "orange"
                  : record.account.role.roleId === 2
                  ? "#213555"
                  : "green",

              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{`${record.account.role.name}`}</span>
            {record.account.role.roleId === 2 && (
              <span style={{ marginLeft: "20px" }}>↓</span>
            )}
            {record.account.role.roleId === 1 && (
              <span style={{ marginLeft: "20px" }}>↑</span>
            )}
          </Button>

          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          {/* <Button danger type="primary" onClick={() => handleDelete(record)}>
            Delete
          </Button> */}
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table columns={columns} dataSource={data} />
      <Modal
        title="Edit Employee"
        open={isEdit}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <EmployeeAddForm editEmployee={editEmployee} onCancel={handleCancel} />
      </Modal>
    </>
  );
};
export default EmployeeTable;
