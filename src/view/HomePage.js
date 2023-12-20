import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Dropdown, Layout, Menu, Space, theme } from "antd";
import EmployeeTable from "../table/EmployeeTable";
import EmployeeContent from "./Employee/EmployeeContent";
import CompanyContent from "./Company/CompanyContent";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import DepartmentContent from "./Department/DepartmentContent";
import SalaryContent from "./Salary/SalaryContent";
import LoginPage from "./Login/Login";
import TakeOffContent from "./TakeOff/TakeOffContent";
import { useAuth } from "../../src/AuthContext.js/AuthContext";

const { Header, Content, Sider } = Layout;

const items1 = ["Company"].map((key) => ({
  key,
  label: `${key}`,
}));

const items = [
  {
    label: "Log out",
    key: "1",
    icon: <LogoutOutlined />,
    danger: true,
  },
];

const items2 = ["Company", "Employee", "Salary", "On leave"].map(
  (label, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      label: label,
      children: new Array(1).fill(null).map((_, j) => {
        const subKey = index + j + 1;
        return {
          key: subKey,
          label: `${subKey}-${label}`,
        };
      }),
    };
  }
);

const HomePage = () => {
  const { user, logout } = useAuth();
  console.log("oday", user);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <Layout>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            items={items1}
            style={{
              flex: 1,
              minWidth: 0,
            }}
          />

          <Dropdown
            theme="dark"
            menu={{ items }}
            style={{ background: "transparent" }}
            placement="top"
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {user && user.fullName}
                <UserOutlined />
              </Space>
            </a>
          </Dropdown>
        </Header>
        <Layout>
          <Sider>
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{
                height: "100%",
                borderRight: 0,
              }}
            >
              <Menu.Item key="1">
                <Link to="manager/company">Company</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="manager/employee">Employee</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content>
              <Routes>
                <Route path="manager/company" element={<CompanyContent />} />
                <Route path="manager/employee" element={<EmployeeContent />} />
                <Route
                  path="manager/company/Department"
                  element={<DepartmentContent />}
                />
                <Route
                  path="manager/company/salary"
                  element={<SalaryContent />}
                />

                <Route
                  path="manager/company/takeoff"
                  element={<TakeOffContent />}
                />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default HomePage;
