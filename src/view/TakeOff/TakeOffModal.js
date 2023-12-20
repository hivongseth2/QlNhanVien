import React from "react";
import { Modal, Descriptions, Button, Space } from "antd";
import ActionButton from "../../Component/ActionButton"; // Import your ActionButton component here
import moment from "moment";

const formatDateString = (dateString) => {
  return moment(dateString).format("DD/MM/YYYY");
};

const TakeOffModal = ({ visible, onCancel, data, handleStatusChange }) => {
  const handleActionButtonClick = () => {
    // Implement your custom action here
    console.log("Action button clicked!");
  };

  return (
    <Modal
      visible={visible}
      title="Take Off Information"
      onCancel={onCancel}
      footer={null}
      width={800} // Adjust the width as needed
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Date Submitted">
          {formatDateString(data.dateSubmit)}
        </Descriptions.Item>
        <Descriptions.Item label="Date Take Off">
          {formatDateString(data.dateTakeOff)}
        </Descriptions.Item>
        <Descriptions.Item label="Role Name">
          {data.employee.account.role.roleName}
        </Descriptions.Item>
        <Descriptions.Item label="Department Name">
          {data.employee.department.departmentName}
        </Descriptions.Item>
        <Descriptions.Item label="Full Name">
          {data.employee.fullName}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {data.employee.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Reason">{data.reason}</Descriptions.Item>
        <Descriptions.Item label="Quantity">{data.quantity}</Descriptions.Item>
        <Descriptions.Item label="State">{data.state}</Descriptions.Item>
        <Descriptions.Item label="Actions">
          <Space size="middle">
            <ActionButton
              record={data}
              handleEdit={(record) => console.log("Edit", record)}
              handleStatusChange={handleStatusChange}
              state={data.state}
            />
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default TakeOffModal;
