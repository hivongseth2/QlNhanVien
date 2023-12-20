import { Button, Input, Select, Form, Space, Table, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
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

const SalaryAddModal = ({ departmentId }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [days, setDays] = useState(0);
  const [allow, setAllow] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [total, setTotal] = useState(0);
  const [tempSalary, setTempSalary] = useState(0);

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
  const handleDateChange = (date, dateString) => {
    setSelectedDate(date.$d.toISOString());
  };

  const handleRowClick = (record) => {
    setSelectedRow(selectedRow === record ? null : record);
    setTempSalary(record.salary);
    setTotal(0);
    setDays(0);
    setAllow(0);
  };
  const handleExpandIconClick = (record) => {
    setSelectedRow(selectedRow === record ? null : record);
    setTempSalary(record.salary);
    setTotal(0);
    setDays(0);
    setAllow(0);
  };
  const handleDaysChange = (e) => {
    setDays(e.target.value);
  };

  const handleAllowChange = (e) => {
    setAllow(e.target.value);
  };

  const handleAddSalary = async () => {
    try {
      const form = {
        employeeId: selectedRow.personId,
        departmentId: departmentId,
        date: selectedDate,
        sum: Number(total),
        allow: Number(allow),
      };

      const resultAction = await dispatch(fetchApiAddSalary(form));

      if (!resultAction.error) {
        toast.success("Salary added successfully!");

        setTempSalary(0);
        setTotal(0);
        setDays(0);
        setAllow(0);
      } else {
        toast.error("Failed to add salary. Please try again.");
      }
    } catch (error) {
      console.error("Error during salary addition:", error);
    }
  };

  useEffect(() => {
    if (days >= 0) {
      let newSalary = parseFloat(tempSalary) + parseFloat(allow);

      const totalTemp = (newSalary / 26) * parseInt(days);
      setTotal(totalTemp.toFixed(2));
    }
  }, [days, allow]);

  const handleSubmit = async () => {};

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
      key: "account.role.roleName",
      render: (account) => account && account.role.roleName,
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
  ];
  const expandedRowRender = (record) => {
    return (
      selectedRow === record && (
        <div style={{ marginTop: "16px" }}>
          <DatePicker
            picker="month"
            style={{ marginBottom: "8px" }}
            format="MM-YYYY"
            placeholder="Select Month"
            onChange={handleDateChange}
          />
          <Input placeholder="Days" value={days} onChange={handleDaysChange} />
          <Input
            style={{ margin: "8px 0px" }}
            placeholder="Allow"
            value={allow}
            onChange={handleAllowChange}
          />

          <p>{`Total = (salary + allow) / 26 * days = (${
            selectedRow && selectedRow.salary ? selectedRow.salary : "salary"
          } + ${allow}) / 26 * ${days} = ${total}
          `}</p>

          <Button type="primary" onClick={handleAddSalary}>
            Confirm
          </Button>
        </div>
      )
    );
  };

  return (
    <Table
      columns={columns}
      dataSource={employees}
      pagination={{ pageSize: 10 }}
      expandable={{
        expandedRowRender,
        onExpand: (_, record) => handleRowClick(record),
        expandIcon: ({ expanded, onExpand, record }) => (
          <Button
            type="text"
            onClick={(e) => {
              onExpand(record, e);
              e.stopPropagation();
              handleRowClick(record);
            }}
            icon={expanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
          />
        ),
      }}
      onRow={(record) => ({
        onClick: () => handleRowClick(record),
      })}
      rowKey={(record) => record.personId}
    />
  );
};

export default SalaryAddModal;
