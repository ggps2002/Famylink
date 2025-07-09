import { Checkbox, Form } from "antd";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { InputRadio, InputTextArea } from "../input";
import { toCamelCase } from "../toCamelStr";

export default function HireStep4({
  formRef,
  head,
  textAreaHead,
  subHead,
  data,
  checkBox,
  inputName,
  defaultVal,
  inputNot,
  subHead1,
  subHead2,
}) {
  const [value, setValue] = useState(defaultVal ? toCamelCase(defaultVal) : "");
  const [form] = Form.useForm();
  const allValues = data.map((v) => (v.val ? v.val : toCamelCase(v.name))); // Precompute all checkbox values

  const [selectedValues, setSelectedValues] = useState([]); // Store checkbox values for tracking length

  const onRadioChange = (radioValue) => {
    setValue(radioValue);
    form.setFieldsValue({
      option: radioValue,
    });
  };

  // Sync form ref if passed
  useEffect(() => {
    if (formRef) {
      formRef.current = form;
    }
  }, [formRef, form]);

  // Handle changes in Checkbox.Group and update state accordingly
  const onCheckboxGroupChange = (checkedValues) => {
    form.setFieldsValue({
      option: checkedValues,
    });
    setSelectedValues(checkedValues); // Update selected values in state
  };

  // Handle Select All / Deselect All
  const handleSelectAllChange = () => {
    const currentValues = form.getFieldValue("option") || [];
    let updatedValues = [];

    if (currentValues.length === allValues.length) {
      // If all options are selected, clear them
      updatedValues = [];
    } else {
      // Select all options
      updatedValues = allValues;
    }

    form.setFieldsValue({
      option: updatedValues,
    });
    setSelectedValues(updatedValues); // Update selected values in state
  };
  return (
    <div>
      <p className="font-normal Classico px-3 offer-font text-center width-form">
        {head}
      </p>
      {subHead && <p className="text-center text-2xl mt-4 ">{subHead}</p>}
      {subHead2 && <p className="text-center my-5 text-wrap">{subHead2}</p>}
      <div
        className={`flex items-center flex-col justify-center ${
          !subHead2 ? "my-10" : "mb-10"
        }`}
      >
        <div>
          <p
            className={`Classico text-xl !text-wrap mb-2  ${
              data.length > 3 ? "" : "input-text"
            }`}
          >
            {subHead1}
          </p>
          <Form form={form} name="validateOnly" autoComplete="off">
            {checkBox ? (
              <div className="flex flex-col justify-center items-center">
                <Form.Item name="option">
                  <Checkbox.Group
                    value={form.getFieldValue("option") || []}
                    onChange={onCheckboxGroupChange}
                    className="flex flex-col"
                  >
                    <div
                      className={`${
                        data.length > 3 &&
                        "grid grid-cols-1 lg:grid-cols-2 gap-4"
                      }`}
                    >
                      {data.map((v, i) => (
                        <div key={i}>
                          <div className="input-width bg-white rounded-3xl py-4 px-4 mb-4">
                            <div className="flex justify-between">
                              <span>{v.name}</span>
                              <Checkbox
                                value={v.val ? v.val : toCamelCase(v.name)}
                              />
                            </div>
                          </div>
                          {v.textArea && (
                            <InputTextArea
                              head={v.textArea}
                              name={v.val}
                              placeholder={"Type here.."}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </Checkbox.Group>
                </Form.Item>
              </div>
            ) : (
              <div
                className={`${
                  data.length > 3 && "grid grid-cols-1 lg:grid-cols-2 gap-x-2"
                }`}
              >
                {data.map((v, i) => (
                  <Form.Item name="option" key={i}>
                    <InputRadio
                      name={v.name}
                      value={value}
                      onRadioChange={onRadioChange}
                      val={v.val ? v.val : v.name}
                    />
                  </Form.Item>
                ))}
              </div>
            )}

            {checkBox && (
              <p
                style={{ marginTop: "-20px" }}
                className="text-end cursor-pointer mb-2"
                onClick={handleSelectAllChange}
              >
                {selectedValues.length === allValues.length
                  ? "Deselect All"
                  : "Select all that apply"}
              </p>
            )}

            {!inputNot && (
              <InputTextArea
                head={textAreaHead}
                grid={data.length > 3 && true}
                name={inputName ? toCamelCase(inputName) : "Specify"}
                placeholder={inputName ? inputName : "Specify"}
              />
            )}
            <div style={{ marginTop: "-40px" }}></div>
          </Form>
        </div>
      </div>
    </div>
  );
}

HireStep4.propTypes = {
  formRef: PropTypes.object,
  head: PropTypes.string,
  textAreaHead: PropTypes.string,
  subHead: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      val: PropTypes.string,
      textArea: PropTypes.string,
    })
  ).isRequired,
  checkBox: PropTypes.bool,
  inputName: PropTypes.string,
  defaultVal: PropTypes.string,
  inputNot: PropTypes.bool,
  subHead1: PropTypes.string,
  subHead2: PropTypes.string,
};
