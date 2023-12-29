import React from "react";
import { Modal, Form, Input, Button } from "antd";

const AddDepartmentForm = ({ visible, onCancel, onAdd, companyId }) => {
  const [form] = Form.useForm();
  console.log(companyId);
  const handleAdd = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onAdd(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title="Add Department"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleAdd}>
          Add
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="addDepartmentForm"
        initialValues={{ companyId: companyId }}
      >
        <Form.Item
          name="departmentName"
          label="Department Name"
          rules={[
            {
              required: true,
              message: "Please enter the department name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="companyId"
          label="Company ID"
          rules={[
            {
              required: true,
              message: "Please enter the company ID!",
            },
          ]}
        >
          <Input disabled value={companyId} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDepartmentForm;
