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
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import DepartmentContent from "./Department/DepartmentContent";
import SalaryContent from "./Salary/SalaryContent";
import LoginPage from "./Login/Login";
import TakeOffContent from "./TakeOff/TakeOffContent";
import { useDispatch, useSelector } from "react-redux";
import { getUserLogin, logoutSlice } from "../redux/AuthSlice";
import NotFound from "./NotFound/NotFound";
import { toast } from "react-toastify";
import ManagerCompany from "./Company/ManagerCompany";
import SalaryTabs from "./Salary/SalaryTabs";

const { Header, Content, Sider } = Layout;

const items1 = ["Company"].map((key) => ({
  key,
  label: `${key}`,
}));

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
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const user = useSelector((state) => state.user.data);

  useEffect(() => {
    dispatch(getUserLogin());
  }, []);

  useEffect(() => {
    if (user === null) {
      navigation("/login");
    }
  }, [user]);

  const items = [
    {
      label: "Log out",
      key: "1",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: async () => {
        try {
          await dispatch(logoutSlice());
          await dispatch(getUserLogin());
          toast.success("Logout successful");
        } catch (error) {
          console.error("Error during logout:", error);
          toast.error("Logout failed. Please try again.");
        }
      },
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div style={{ minHeight: "100vh" }}>
      <Layout theme="dark">
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
                {user && (
                  <>
                    {user.roleId === 2 ? (
                      <>
                        Manager | {user.fullName}
                        <UserOutlined />
                      </>
                    ) : user.roleId === 3 ? (
                      <>
                        Admin | {user.fullName}
                        <UserOutlined />
                      </>
                    ) : (
                      // Handle other roles if needed
                      <>
                        Other Role | {user.fullName}
                        <UserOutlined />
                      </>
                    )}
                  </>
                )}
              </Space>
            </a>
          </Dropdown>
        </Header>
        <Layout theme="dark" style={{ minHeight: "100%" }}>
          <Sider theme="dark">
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{
                height: "100%",
                borderRight: 0,
              }}
            >
              <Menu.Item key="1">
                <Link to="company">Company</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="employee">Employee</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ minHeight: "89.3vh", height: "92.8vh" }}>
            <Content style={{ margin: "10px 0 0 30px", maxHeight: "87vh" }}>
              <Routes>
                <Route path="company" element={<CompanyContent />} />
                <Route path="employee" element={<EmployeeContent />} exact />
                <Route
                  path="company/Department"
                  element={<DepartmentContent />}
                  exact
                />
                <Route path="company/salary" element={<SalaryTabs />} exact />

                <Route
                  path="company/managercompany"
                  element={<ManagerCompany />}
                  exact
                />

                <Route
                  path="company/takeoff"
                  element={<TakeOffContent />}
                  exact
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default HomePage;
