import React, { useEffect, useState } from "react";
import { Select, Space, Descriptions, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiAllCompany } from "../../redux/CompanySlice";

const { Text } = Typography;

const CompanyList = ({ setCompanySelect, companySelect }) => {
  const companies = useSelector((state) => state.companies.data);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchApiAllCompany());
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  const selectedCompany = companies.find(
    (company) => company.id === companySelect?.id
  );
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Select
        placeholder="Select a company"
        style={{ width: 200 }}
        onChange={(value, option) => {
          console.log(option);
          setCompanySelect(option.data);
        }}
      >
        {companies.map((company) => (
          <Select.Option key={company.id} value={company.id} data={company}>
            {company.companyName}
          </Select.Option>
        ))}
      </Select>

      {selectedCompany && (
        <Descriptions
          bordered
          title={
            <span style={{ color: "#1890ff", fontSize: "1.2em" }}>
              Company Information
            </span>
          }
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 3 }}
          style={{
            border: "1px solid #F3F8FF",
            borderRadius: "8px",
            // background: "#f0f8ff",
            padding: "16px",
          }}
        >
          <Descriptions.Item
            label={<strong style={{ color: "#1890ff" }}>Company ID</strong>}
          >
            <span
              style={{ fontWeight: "bold", color: "#0766AD", fontSize: "15px" }}
            >
              {selectedCompany.id}
            </span>
          </Descriptions.Item>
          <Descriptions.Item
            label={<strong style={{ color: "#1890ff" }}>Company Name</strong>}
          >
            <span
              style={{ fontWeight: "bold", color: "#0766AD", fontSize: "15px" }}
            >
              {selectedCompany.companyName}
            </span>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <strong style={{ color: "#1890ff" }}>Company Address</strong>
            }
          >
            <span
              style={{ fontWeight: "bold", color: "#0766AD", fontSize: "15px" }}
            >
              {selectedCompany.companyAddress}
            </span>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Space>
  );
};

export default CompanyList;
