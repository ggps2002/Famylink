import { Form, Checkbox } from 'antd';
import { useEffect, useState } from 'react';
import { toCamelCase } from '../../toCamelStr';
import { InputTextArea } from '../../input';

export default function NannyNoStep2({ formRef, data, defaultValue, defaultSubValue, textAreaHead, inputName, inputText, head, subHead }) {
    const [form] = Form.useForm();
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

    const onCheckboxChange = (val) => {
        setSelectedCheckboxes((prev) => {
            const updatedCheckboxes = prev.includes(val)
                ? prev.filter(item => item !== val) // Deselect if already selected
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
            <p className='font-normal Classico px-3 offer-font text-center mb-6 width-form'>{head ? head : "What type of services are you looking for?"}</p>
            {subHead && <p className='text-center font-normal text-xl mb-6'>{subHead}</p>}
            <div className="flex justify-center">
                <Form form={form} name="validateOnly" autoComplete="off">
                    <div className="grid grid-cols-1 gap-x-6 flex-wrap lg:grid-cols-2 justify-center mx-auto">
                        <Form.Item index={0} name={'nanny'} key={0} initialValue={true} valuePropName="checked">
                            <div className='flex gap-2'>
                                <div>
                                    <Checkbox
                                        disabled
                                        checked={true}
                                        onChange={() => onCheckboxChange(toCamelCase(defaultValue))}
                                    />
                                </div>

                                <div className='input-width bg-white rounded-3xl py-4 px-4'>
                                    <div className=''>
                                        <p className='Classico capitalize text-xl'>{defaultValue}</p>
                                        <p className='text-black'>{defaultSubValue}</p>
                                    </div>
                                </div>
                            </div>
                        </Form.Item>
                        {

                            data.map((v, i) => (
                                <Form.Item index={i} name={toCamelCase(v.name)} key={i} initialValue={false} valuePropName="checked">
                                    <div className='flex gap-2'>
                                        <div>
                                            <Checkbox
                                                checked={selectedCheckboxes.includes(toCamelCase(v.name))}
                                                onChange={() => onCheckboxChange(toCamelCase(v.name))}
                                            />
                                        </div>

                                        <div className='input-width bg-white rounded-3xl py-4 px-4'>
                                            <div className=''>
                                                <p className='Classico capitalize text-xl'>{v.name}</p>
                                                <p className='text-black'>{v.subHead}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Form.Item>
                            ))
                        }

                    </div>
                    {
                        inputText &&
                        <InputTextArea grid={true} head={textAreaHead} name={inputName ? toCamelCase(inputName) : 'Specify'} placeholder={inputName ? (inputName) : 'Specify'} />
                    }
                </Form>
            </div>
        </div>
    )
}