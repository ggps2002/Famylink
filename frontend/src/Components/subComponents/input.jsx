import { Form, Input, Select, Row, Col, Radio } from "antd";
import { toCamelCase } from "./toCamelStr";

const { Option } = Select;
export function InputDa({ name, val, req, type, placeholder, defaultValue }) {
  const rules = [
    {
      required: req ? false : true,
      message: "",
    },
  ];

  // If it's an email field, add email format validation
  if (type === "email") {
    rules.push({
      type: "email",
      message: "",
    });
  }
  return (
    <div>
      <div>
        <p className="mb-2 text-xl capitalize Classico">{name}</p>
        <Form.Item name={val ? val : toCamelCase(name)} rules={rules}>
          <Input
            defaultValue={defaultValue}
            type={type}
            placeholder={placeholder}
            className="py-4 border-none rounded-3xl input-width"
          />
        </Form.Item>
      </div>
    </div>
  );
}

export function InputPassword() {
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-x-6">
        <div>
          <p className="mb-2 text-xl capitalize Classico">Password</p>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "",
              },
              {
                pattern: /^.{8,}$/,
                message: "Password must be at least 8 characters!",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              placeholder="Enter you password"
              className="py-4 border-none rounded-3xl input-width"
            />
          </Form.Item>
        </div>
        <div>
          <p className="mb-2 text-xl capitalize Classico">Confirm Password</p>
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(""));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Enter password again"
              className="py-4 border-none rounded-3xl input-width"
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
}

export function InputDOB() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate dates (1-31)
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  // Generate years (e.g., from 1900 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => currentYear - i);
  return (
    <div>
      <p className="mb-2 text-xl capitalize Classico">Date of Birth</p>
      <Form.Item required>
        <div className="grid lg:grid-cols-3  gap-2">
          <Col>
            <Form.Item
              name="month"
              noStyle
              rules={[{ required: true, message: "" }]}
            >
              <Select className="width-dob" placeholder="Month">
                {months.map((month, index) => (
                  <Option key={index} value={month}>
                    {month}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              name="date"
              noStyle
              rules={[{ required: true, message: "" }]}
            >
              <Select className="width-dob" placeholder="Date">
                {dates.map((date) => (
                  <Option key={date} value={date}>
                    {date}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="year"
              noStyle
              rules={[{ required: true, message: "" }]}
            >
              <Select className="width-dob" placeholder="Year">
                {years.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </div>
      </Form.Item>
    </div>
  );
}

export function InputRadio({ name, val, value, onRadioChange }) {
  // // console.log(name, val, value)
  return (
    <div
      className="bg-white px-4 py-4 rounded-3xl input-width"
      onClick={() => onRadioChange(val)}
    >
      <div className="flex justify-between">
        <p>{name}</p>
        <Radio checked={value === val}></Radio>{" "}
        {/* Radio will check based on whether value matches the passed val */}
      </div>
    </div>
  );
}
export function SelectComponent({
  opt,
  selectedValue,
  onSelectChange,
  placeholder,
}) {
  return (
    <div>
      <p className="mb-2 text-xl capitalize Classico">{placeholder}</p>
      <Select
        className="custom-select h-12" // Apply custom class here
        value={selectedValue}
        placeholder={placeholder}
        onChange={onSelectChange}
        dropdownClassName="custom-dropdown" // Add custom dropdown styles if needed
      >
        {opt.map((opt) => (
          <Option key={opt} value={opt}>
            {opt}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export function InputTextArea({ name, req, placeholder, head, rows, grid }) {
  return (
    <div>
      <p className="mb-2 text-xl Classico input-text line1-20">{head}</p>
      <Form.Item
        name={head ? toCamelCase(head) : toCamelCase(name)}
        rules={[
          {
            required: req ? true : false,
            message: "",
          },
        ]}
      >
        <Input.TextArea
          placeholder={placeholder}
          rows={rows ? rows : 6}
          className={`py-4 border-none rounded-3xl ${
            !grid && "input-width"
          } no-resize`}
        />
      </Form.Item>
    </div>
  );
}
