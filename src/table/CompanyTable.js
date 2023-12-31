import { SearchOutlined } from "@ant-design/icons";
import { DownOutlined, UserOutlined } from "@ant-design/icons";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Dropdown, Menu, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchApiAllCompany } from "../redux/CompanySlice";
import { useNavigate } from "react-router-dom";
import { getUserLogin, logoutSlice } from "../redux/AuthSlice";
import CompanyAddForm from "../view/Company/CompanyAddForm";

// import EmployeeAddForm from "../view/Employee/EmoloyeeAddForm";

const CompanyTable = () => {
  const navigation = useNavigate();
  const data = useSelector((state) => state.companies.data);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);

  const [isEdit, setIsEdit] = useState(false);
  const [editEmployee, setEditEmployee] = useState({});
  const [hasPerCompany, setHasPerCompany] = useState([]);

  const [editCompany, setEditCompany] = useState({});

  //handle

  const handleOk = () => {
    setIsEdit(false);
  };
  const handleCancel = () => {
    setIsEdit(false);
  };
  const handleEdit = (record) => {
    setIsEdit(true);
    console.log("company:", record);
    // setEditEmployee(record);
    setEditCompany(record);
  };

  useEffect(() => {}, [editEmployee]);
  const handleDelete = (record) => {
    navigation("department", { state: record });
  };
  const uniqueTypes = Array.from(new Set(data.map((item) => item?.type)));
  const filterPermiss = () => {
    if (data && user) {
      const hasPermissionCompanies = data.filter((company) =>
        company.listPerson.some((person) => person.personId === user.personId)
      );
      setHasPerCompany(hasPermissionCompanies);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchApiAllCompany());
        dispatch(getUserLogin);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchData().then(() => {
      filterPermiss();
    });
  }, [dispatch, user]);

  useEffect(() => {
    console.log(hasPerCompany.toString() + "======123213======");
  }, [hasPerCompany]);

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
      dataIndex: "id",
      key: "id",
      width: "10%",
    },

    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      width: "15%",
      ...getColumnSearchProps("companyName"),
    },
    {
      title: "Address",
      dataIndex: "companyAddress",
      key: "companyAddress",
      width: "15%",
      ...getColumnSearchProps("companyAddress"),
    },

    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "15%",
      filters: uniqueTypes.map((type) => ({
        text: type,
        value: type,
      })),
      onFilter: (value, record) => record.type.indexOf(value) === 0,
    },

    {
      title: "Acreage",
      dataIndex: "acreage",
      key: "acreage",
      ...getColumnSearchProps("acreage"),
    },
    {
      title: "Build Year",
      dataIndex: "buildYear",
      key: "buildYear",
      ...getColumnSearchProps("buildYear"),
    },
    {
      title: "Year Operation",
      dataIndex: "yearOperation",
      key: "yearOperation",
      ...getColumnSearchProps("yearOperation"),
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
          <Button
            style={{ backgroundColor: "green" }}
            type="primary"
            onClick={() => handleDelete(record)}
          >
            Department
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={user?.roleId === 3 ? data : hasPerCompany}
      />
      <Modal
        title="Edit Employee"
        open={isEdit}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {/* <EmployeeAddForm editEmployee={editEmployee} /> */}

        <CompanyAddForm onCancel={handleCancel} editCompany={editCompany} />
      </Modal>
    </>
  );
};
export default CompanyTable;
