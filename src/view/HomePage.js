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

  const [showEmployeeTable, setShowEmployeeTable] = useState(false);
  const handleMenuClick = (key) => {
    if (key.startsWith(2)) {
      setShowEmployeeTable(true);
    } else {
      setShowEmployeeTable(false);
    }
  };

  return (
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
          defaultSelectedKeys={["2"]}
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
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            items={items2}
            onClick={({ key }) => handleMenuClick(key)}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>HomePage</Breadcrumb.Item>
          </Breadcrumb>
          <Content>{showEmployeeTable && <EmployeeContent />}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default HomePage;
