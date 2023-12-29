import React, { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, Button } from "antd";
import { customApi } from "../../API/customApi";
import { fetchApiAddTakeOff } from "../../redux/TakeOffSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const { Item } = Form;
const { Option } = Select;

const TakeOffForm = ({ departmentId }) => {
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [days, setDays] = useState(1);
  const [fromDate, setFromDate] = useState(null);
  const [reason, setReason] = useState("");
  const [person, setPerson] = useState({});
  const dispatch = useDispatch();

  const onFinish = (values) => {
    console.log("Received values:", values);
    // Perform any further processing with the form values
  };

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    setPosition(person?.position);
  }, [person]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tempData = await customApi(
          `employee/getByDepartment?id=${departmentId}`,
          "GET"
        );
        setEmployees(tempData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [departmentId]);
  const submitForm = async () => {
    try {
      const data = {
        personId: person.personId,
        quantity: days,
        takeOffDate: fromDate.$d.toISOString(),
        reason: reason,
        state: "pending",
        departmentId: departmentId,
        submitDate: new Date().toISOString(),
      };

      const resultAction = await dispatch(fetchApiAddTakeOff(data));

      if (!resultAction.error) {
        toast.success("Take-off request submitted successfully!");
      } else {
        toast.error("Failed to submit take-off request. Please try again.");
      }
    } catch (error) {
      console.error("Error during take-off submission:", error);
    }
  };

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      onFinish={onFinish}
      initialValues={{
        days: 1,
      }}
    >
      <Item
        label="Full Name"
        name="name"
        rules={[{ required: true, message: "Please enter your full name!" }]}
      >
        <Select
          placeholder="Select employee"
          onChange={(value, option) => {
            setPerson(option.data);
          }}
        >
          {employees &&
            employees.map((item, index) => {
              return (
                <Option key={item.personId} value={item.personId} data={item}>
                  {item.fullName}
                </Option>
              );
            })}
        </Select>
      </Item>
      <Item label="Position" name="position">
        {/* <Input
          placeholder="Enter position"
          onChange={(e) => setPosition(e.target.value)}
        /> */}

        {position}
      </Item>
      <Item label="Number of Days Off" name="days">
        <Input
          type="number"
          placeholder="Enter number of days"
          onChange={(e) => setDays(Number(e.target.value))}
        />
      </Item>
      <Item label="Start Date" name="fromDate">
        <DatePicker
          style={{ width: "100%" }}
          placeholder="Select start date"
          onChange={(date) => setFromDate(date)}
        />
      </Item>
      <Item label="Reason for Leave" name="reason">
        <Input.TextArea
          rows={4}
          placeholder="Enter reason for leave"
          onChange={(e) => setReason(e.target.value)}
        />
      </Item>
      <Item wrapperCol={{ offset: 6, span: 12 }}>
        <Button
          onClick={() => {
            submitForm();
          }}
        >
          Submit Leave Request
        </Button>
      </Item>
    </Form>
  );
};

export default TakeOffForm;
