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

const SalaryAddModal = ({ departmentId }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [days, setDays] = useState(0);
  const [allow, setAllow] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [total, setTotal] = useState(0);
  const [tempSalary, setTempSalary] = useState(0);
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
    console.log(date, dateString); // You can use dateString in your logic

    // console.log("datee", date.$d.toISOString());
    setSelectedDate(date.$d.toISOString());
  };

  const handleRowClick = (record) => {
    setSelectedRow(selectedRow === record ? null : record);
    // console.log(selectedRow, "select");
    setTempSalary(record.salary);
    console.log("red", record);
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
    console.log(allow, days, selectedDate, total);

    // try {
    //   const res = await customApi("employee/add", "POST", values);

    //   if (res.data.statusCode === 200 || res.data.statusCode === 201) {
    //     // toast.success("Thêm khu vực thành công.");
    //     console.log("res", res);
    //   }
    //   console.log("res", res);
    //   return res.data;
    // } catch (error) {
    //   // toast.error("Khu vực đã tồn tại!");
    //   console.log({ error });
    // }

    setTempSalary(0);
    setTotal(0);
    setDays(0);
    setAllow(0);
  };

  useEffect(() => {
    if (allow && days > 0) {
      let newSalary = parseFloat(tempSalary) + parseFloat(allow);

      const totalTemp = (newSalary / 26) * parseInt(days);
      setTotal(totalTemp.toFixed(2));
    }
  }, [days, allow]);

  const handleSubmit = async () => {
    // try {
    //   formValues.roleId = 1;
    //   formValues.departmentId = formValues.department.id;
    //   const { company, department, ...dataTrans } = formValues;
    //   if (editEmployee) {
    //     const resultAction = await dispatch(fetchApiUpdateEmployee(dataTrans));
    //   } else {
    //     const resultAction = await dispatch(fetchApiAddEmployee(dataTrans));
    //   }
    //   // const newEmployee = resultAction.payload;
    //   // console.log("Fulfilled payload:", newEmployee);
    // } catch (e) {
    //   console.log(e);
    // }

    console.log(allow, days, allow, total);
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
              console.log(record);
              handleRowClick(record);
            }}
            icon={expanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
          />
        ),
      }}
      onRow={(record) => ({
        onClick: () => handleRowClick(record),
      })}
      rowKey={(record) => record.personId} // Assuming that 'id' is the unique key for each record
    />
  );
};

export default SalaryAddModal;
