import { Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserLogin, logoutSlice } from "../redux/AuthSlice";

const ActionButton = ({ record, handleEdit, handleStatusChange, state }) => {
  const [status, setStatus] = useState(state);
  const data = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  useEffect(() => {
    // Update the status state when the state prop changes
    setStatus(state);
  }, [state]); // Add state as a dependency to useEffect
  useEffect(() => {
    dispatch(getUserLogin());
  }, []);

  const getColor = () => {
    switch (status) {
      case "accept":
        return "green"; // Change to the desired color for accept
      case "reject":
        return "red"; // Change to the desired color for reject
      case "pending":
        return "orange"; // Change to the desired color for pending
      default:
        return "defaultColor"; // Set a default color if necessary
    }
  };

  useEffect(() => {
    console.log(data, "action button");
  }, [data]);

  const menu = (
    <Menu
      disabled={data?.roleId !== 3} //
      onClick={({ key }) => {
        setStatus(key);
        handleStatusChange(record, key);
      }}
    >
      <Menu.Item key="accept" style={{ color: "green" }}>
        Accept
      </Menu.Item>
      <Menu.Item key="pending" style={{ color: "orange" }}>
        Pending
      </Menu.Item>
      <Menu.Item key="reject" style={{ color: "red" }}>
        Reject
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button
        type="primary"
        shape="round"
        icon={<DownOutlined />}
        style={{ backgroundColor: getColor() }}
      >
        {status}
      </Button>
    </Dropdown>
  );
};

export default ActionButton;
