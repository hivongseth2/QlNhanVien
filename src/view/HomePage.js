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
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Router>
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
                Nguyen Thanh Luan <UserOutlined />
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
                <Link to="/company">Company</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/employee">Employee</Link>
              </Menu.Item>
              {/* Add more Menu.Items for other content */}
            </Menu>
          </Sider>
          <Layout>
            <Content>
              <Routes>
                <Route path="/company" element={<CompanyContent />} />
                <Route path="/employee" element={<EmployeeContent />} />
                <Route path="/Department" element={<DepartmentContent />} />
                <Route path="/salary" element={<SalaryContent />} />

                {/* Add more routes for other content */}
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
};

export default HomePage;
