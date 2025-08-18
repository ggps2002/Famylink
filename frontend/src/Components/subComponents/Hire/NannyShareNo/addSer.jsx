import { Form, Checkbox } from 'antd';
import { useState, useEffect } from 'react';
import { toCamelCase } from '../../toCamelStr';
import { useSelector } from 'react-redux';

export default function AddSer({ formRef }) {
    const [form] = Form.useForm();
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const { value } = useSelector((s)=> s.additionalSer)
    const data = [
        { name: "Nanny" },
        { name: "Private Educator" },
        { name: "Specialized Caregiver" },
        { name: "Sports Coaches" },
        { name: "Music Instructor" },
        { name: "Swim Instructor" },
        { name: "House Manager" },
    ];
    const updatedData = data.map((item) => {
        const key = item.name
            .replace(/\s+/g, '') // Remove spaces
            .replace(/^[A-Z]/, (c) => c.toLowerCase()); // Convert the first character to lowercase
    
        return { ...item, value: value[key] || false };
    });
    
    // Filter to get only those with `value: false`
    const falseEntities = updatedData.filter(item => item.value === false);
    
    // Handle checkbox change event
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
            <p className='font-normal Livvic px-3 offer-font text-center mb-10 width-form'>
                Do you need any additional services?
            </p>
            <div className="flex justify-center">
                <Form form={form} name="validateOnly" autoComplete="off">
                    <div className="flex gap-x-20 flex-wrap justify-center">
                        {falseEntities.slice(0, 3).map((v, i) => (
                            <Form.Item 
                                key={i} 
                                name={toCamelCase(v.name)} 
                                valuePropName="checked" // Use "checked" to ensure boolean values
                                initialValue={false} // Ensure default value is false
                            >
                                <div className='flex items-center justify-center gap-2'>
                                    <Checkbox
                                        checked={selectedCheckboxes.includes(toCamelCase(v.name))}
                                        onChange={() => onCheckboxChange(toCamelCase(v.name))}
                                    />
                                    <p className='capitalize'>{v.name}</p>
                                </div>
                            </Form.Item>
                        ))}
                    </div>
                    <div className="flex gap-x-20 flex-wrap justify-center">
                        {falseEntities.slice(3, 8).map((v, i) => (
                            <Form.Item 
                                key={i + 3} 
                                name={toCamelCase(v.name)} 
                                valuePropName="checked" 
                                initialValue={false} // Ensure default value is false
                            >
                                <div className='flex items-center justify-center gap-2'>
                                    <Checkbox
                                        checked={selectedCheckboxes.includes(toCamelCase(v.name))}
                                        onChange={() => onCheckboxChange(toCamelCase(v.name))}
                                    />
                                    <p className='capitalize'>{v.name}</p>
                                </div>
                            </Form.Item>
                        ))}
                    </div>
                </Form>
            </div>
        </div>
    );
}
