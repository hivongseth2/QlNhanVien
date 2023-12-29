import React from "react";
import { Tabs } from "antd";
import SalaryContent from "./SalaryContent";
import Salary2Content from "./Salary2Content";

const SalaryTabs = () => (
  <Tabs
    defaultActiveKey="1"
    items={[
      {
        label: "Salary Time",
        key: "1",
        children: <SalaryContent />,
      },
      {
        label: "Salary Product",
        key: "2",
        children: <Salary2Content />,
      },
      //   {
      //     label: "Tab 3",
      //     key: "3",
      //     children: "Tab 3",
      //   },
    ]}
  />
);
export default SalaryTabs;
