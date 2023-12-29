import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker } from "antd";
import { useDispatch } from "react-redux";
import {
  fetchApiAddCompany,
  fetchApiEditCompany,
} from "../../redux/CompanySlice";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const CompanyAddForm = ({ onCancel, editCompany }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (editCompany) {
      // If editCompany is provided, set form values to the existing company data
      form.setFieldsValue(editCompany);
    }
  }, [editCompany, form]);

  const onFinish = async (values) => {
    const companyId = editCompany ? editCompany.id : uuidv4();
    const buildYear = Number(values.buildYear);
    const yearOperation = Number(values.yearOperation);

    try {
      if (editCompany) {
        // If editing, dispatch the edit action
        await dispatch(
          fetchApiEditCompany({
            ...values,
            id: companyId,
            buildYear,
            yearOperation,
          })
        );
        form.resetFields();

        toast.success("Company edited successfully");
        onCancel();
        return;
      } else {
        // If adding, dispatch the add action
        await dispatch(
          fetchApiAddCompany({
            ...values,
            id: companyId,
            buildYear,
            yearOperation,
          })
        );
        form.resetFields();

        toast.success("Company added successfully");
      }
      onCancel();
    } catch (error) {
      toast.error("Error adding/editing company. Please try again.");
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: "300px" }}
    >
      <Form.Item
        label="Company Name"
        name="companyName"
        rules={[{ required: true, message: "Please enter company name" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Company Address"
        name="companyAddress"
        rules={[{ required: true, message: "Please enter company address" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Type"
        name="type"
        rules={[{ required: true, message: "Please enter company type" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Acreage"
        name="acreage"
        rules={[{ required: true, message: "Please enter acreage" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Build Year"
        name="buildYear"
        rules={[{ required: true, message: "Please select build year" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Year Operation"
        name="yearOperation"
        rules={[{ required: true, message: "Please select year operation" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {editCompany ? "Edit Company" : "Add Company"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CompanyAddForm;
