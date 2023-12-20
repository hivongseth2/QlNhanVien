import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth, AuthProvider } from "../../AuthContext.js/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiLogin, getUserLogin } from "../../redux/AuthSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigation = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.data);
  useEffect(() => {
    dispatch(getUserLogin());
  }, []);

  const onFinish = (values) => {
    console.log("Received values:", values);
  };
  useEffect(() => {
    if (user) {
      navigation("/manager/company");
    }
  }, [user]);
  const handleLogin = async () => {
    try {
      const data = { userName, password };
      const loggedInUser = await dispatch(fetchApiLogin(data));

      if (!loggedInUser.error) {
        localStorage.setItem("user", JSON.stringify(loggedInUser.payload));
        toast.success("Login successful!"); // Display success toast
      } else {
        toast.error("Login failed. Please check your credentials."); // Display error toast
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. An error occurred."); // Display error toast
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {!user && (
        <Card title="Login" style={{ width: 300 }}>
          <Form
            name="loginForm"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please enter your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                onClick={handleLogin}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default LoginPage;
