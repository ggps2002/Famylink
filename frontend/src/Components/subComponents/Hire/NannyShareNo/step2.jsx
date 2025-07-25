import { Form, Checkbox } from "antd";
import { useEffect, useState } from "react";
import { toCamelCase } from "../../toCamelStr";
import { InputTextArea } from "../../input";
import PropTypes from "prop-types";

export default function NannyNoStep2({
  formRef,
  data,
  defaultValue,
  defaultSubValue,
  textAreaHead,
  inputName,
  inputText,
  head,
  subHead,
}) {
  const [form] = Form.useForm();
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const onCheckboxChange = (val) => {
    setSelectedCheckboxes((prev) => {
      const updatedCheckboxes = prev.includes(val)
        ? prev.filter((item) => item !== val) // Deselect if already selected
        : [...prev, val]; // Select the checkbox

      // Update the form value for the checkboxes
      form.setFieldsValue({
        [val]: !prev.includes(val),
      });

      return updatedCheckboxes;
    });
  };

  useEffect(() => {
    // Attach form instance to formRef if provided
    if (formRef) {
      formRef.current = form;
    }
  }, [form, formRef]);
  return (
    <div>
      <p className="text-primary Livvic-Bold text-4xl text-center mb-6 width-form mx-auto">
        {head ? (
          head
        ) : (
          <>
            What type of services are
            <br /> you looking for?
          </>
        )}
      </p>
      {subHead && (
        <p className="text-center font-normal text-xl mb-6">{subHead}</p>
      )}
      <div className="flex justify-center">
        <Form form={form} name="validateOnly" autoComplete="off">
          <div className="grid grid-cols-1 gap-x-6 flex-wrap lg:grid-cols-2 justify-center mx-auto">
            <Form.Item
              index={0}
              name={"nanny"}
              key={0}
              initialValue={true}
              valuePropName="checked"
              className="shadow-soft rounded-[10px]"
            >
              <div
                className="flex gap-4 px-4 py-2 items-start"
              >
                {/* Custom Radio Button */}
                <label className="flex items-center  cursor-not-allowed gap-2 mt-1">
                  <input
                    type="radio"
                    disabled
                    checked={true}
                    onChange={() => onCheckboxChange(toCamelCase(defaultValue))}
                    className="sr-only  cursor-not-allowed"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-4 transition-colors duration-200 ${
                      defaultValue === "Nanny"
                        ? "border-[#AEC4FF]"
                        : "border-[#EEEEEE]"
                    }`}
                  />
                </label>

                {/* Text Box */}
                <div className="bg-white rounded-3xl py-1">
                  <p className="Livvic-SemiBold text-lg text-primary leading-tight">
                    {defaultValue}
                  </p>
                  <p className="Livvic-Medium text-sm">{defaultSubValue}</p>
                </div>
              </div>
            </Form.Item>
            {data.map((v, i) => (
              <Form.Item
                index={i}
                name={toCamelCase(v.name)}
                key={i}
                initialValue={false}
                valuePropName="checked"
                className="shadow-soft rounded-[10px]"
              >
                {/* <div className="flex gap-2">
                  <div>
                    <Checkbox
                      checked={selectedCheckboxes.includes(toCamelCase(v.name))}
                      onChange={() => onCheckboxChange(toCamelCase(v.name))}
                    />
                  </div>

                  <div className="input-width bg-white rounded-3xl py-4 px-4">
                    <div className="">
                      <p className="Classico capitalize text-xl">{v.name}</p>
                      <p className="text-black">{v.subHead}</p>
                    </div>
                  </div>
                </div> */}
                <div className="flex gap-4 px-4 py-2 items-start">
                  {/* Custom Radio Button */}
                  <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={selectedCheckboxes.includes(toCamelCase(v.name))}
                      onChange={() => onCheckboxChange(toCamelCase(v.name))}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-4 transition-colors duration-200 ${
                        selectedCheckboxes.includes(toCamelCase(v.name))
                          ? "border-[#AEC4FF]"
                          : "border-[#EEEEEE]"
                      }`}
                    />
                  </label>

                  {/* Text Box */}
                  <div className="bg-white rounded-3xl py-1">
                    <p className="Livvic-SemiBold text-lg text-primary leading-tight">
                      {v.name}
                    </p>
                    <p className="Livvic-Medium text-sm">{v.subHead}</p>
                  </div>
                </div>
              </Form.Item>
            ))}
          </div>
          {inputText && (
            <InputTextArea
              grid={true}
              head={textAreaHead}
              name={inputName ? toCamelCase(inputName) : "Specify"}
              placeholder={inputName ? inputName : "Specify"}
            />
          )}
        </Form>
      </div>
    </div>
  );
}

NannyNoStep2.propTypes = {
  formRef: PropTypes.object,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      subHead: PropTypes.string,
    })
  ).isRequired,
  defaultValue: PropTypes.string,
  defaultSubValue: PropTypes.string,
  textAreaHead: PropTypes.string,
  inputName: PropTypes.string,
  inputText: PropTypes.string,
  head: PropTypes.string,
  subHead: PropTypes.string,
};
