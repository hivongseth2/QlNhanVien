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
import {
  fetchApiTakeOffDepart,
  fetchApiUpdateState,
} from "../redux/TakeOffSlice";
import { useLocation } from "react-router-dom";
import ActionButton from "../Component/ActionButton";
import TakeOffModal from "../view/TakeOff/TakeOffModal";

// import EmployeeAddForm from "../view/Employee/EmoloyeeAddForm";

const TakeOffTable = () => {
  const navigation = useNavigate();
  const data = useSelector((state) => state.takeoffs.data);
  const dispatch = useDispatch();
  const location = useLocation();
  const [departments, setDepartments] = useState(
    location.state && location.state
  );
  const [selectedData, setSelectedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Update the state when the location changes
    setDepartments(location.state && location.state);
  }, [location.state]);
  //handle

  const handleOpenModal = (data) => {
    setSelectedData(data);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    // setSelectedData(null);
    setModalVisible(false);
  };

  const handleStatusChange = (record, status) => {
    console.log(`Record ID nere: ${record.id}, Status: ${status}`);
    // Implement your logic here, such as making an API call to update the status
    const dataUpdate = {
      id: record.id,
      state: status,
    };

    dispatch(fetchApiUpdateState(dataUpdate));
  };
  const handleEdit = (record) => {
    // setIsEdit(true);
    // setEditEmployee(record);
    console.log(record);
  };

  useEffect(() => {
    console.log(data);
  }, []);
  useEffect(() => {
    console.log("datatakeoff123:", data);
  }, []);

  const handleDelete = (record) => {
    console.log("Delete:", record.departments);
  };
  //   const uniqueTypes = Array.from(new Set(data.map((item) => item?.type)));

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchApiTakeOffDepart(departments));
      } catch (error) {
        console.error("Error fetching takeoff:", error);
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

  const handleView = (record) => {
    console.log(record);
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
      title: "Department",
      dataIndex: "employee",
      width: "10%",
      key: "employee.department.departmentName",
      //   ...getColumnSearchProps("department.departmentName"),

      render: (employee) => employee && employee.department?.departmentName,
    },

    {
      title: "Submit",
      dataIndex: "dateSubmit",
      width: "10%",
      key: "dateSubmit",
      ...getColumnSearchProps("dateSubmit"),
      render: (dateSubmit) => moment(dateSubmit).format("DD/MM/YYYY"),
    },
    {
      title: "Date Take Off",
      dataIndex: "dateTakeOff",
      width: "10%",
      key: "dateTakeOff",
      ...getColumnSearchProps("dateTakeOff"),
      render: (dateTakeOff) => moment(dateTakeOff).format("DD/MM/YYYY"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      //   ...getColumnSearchProps("date"),
    },

    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },

    {
      title: "View",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleOpenModal(record)}>
            View
          </Button>
        </Space>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Space size="middle">
          <ActionButton
            record={record}
            handleEdit={handleEdit}
            handleStatusChange={handleStatusChange}
            state={record.state}
          />
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table columns={columns} dataSource={data} />
      {modalVisible && (
        <Modal title="Take Off" open={modalVisible} onCancel={handleCloseModal}>
          <TakeOffModal
            visible={modalVisible}
            onCancel={handleCloseModal}
            data={selectedData}
            handleStatusChange={handleStatusChange}
          />
        </Modal>
      )}
    </>
  );
};
export default TakeOffTable;
