import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { InputDa, SelectComponent } from '../input';

const FamilyExperienceForm = ({ formRef }) => {
    const [form] = Form.useForm();
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedValue1, setSelectedValue1] = useState(null);
    const [selectedValue2, setSelectedValue2] = useState(null);
    const [selectedValue3, setSelectedValue3] = useState(null);


    const [selected, setSelected] = useState([]);
    const [selected1, setSelected1] = useState([]);
    const options = [
        { label: 'Newborn (0-6 months)', value: 'newborn' },
        { label: 'Infants (6-12 months)', value: 'infants' },
        { label: 'Toddlers (1-3 years)', value: 'toddlers' },
        { label: 'Preschoolers (3-5 years)', value: 'preschoolers' },
        { label: 'School-age (6-12 years)', value: 'school-age' },
        { label: 'Teens (12+ years)', value: 'teens' },
    ];

    const options1 = [
        { label: 'Childcare', value: 'childcare' },
        { label: 'Meal preparation', value: 'mealPreparation' },
        { label: 'Educational activities', value: 'educationalActivities' },
        { label: 'Transportation to school', value: 'transportationToSchool' },
        { label: 'Light housekeeping', value: 'lightHousekeeping' },
        { label: 'Homework assistance', value: 'homeworkAssistance' },
        { label: "Managing children's schedules", value: 'managingChildrenSchedules' },
    ];

    const handleSelect = (value) => {
        if (selected.includes(value)) {
            setSelected((prevSelected) => prevSelected.filter((item) => item !== value));
        } else {
            setSelected((prevSelected) => [...prevSelected, value]);
        }
    };

    useEffect(() => {
        if (form) {
            form.setFieldsValue({
                ageGroupsOfChildren: selected,
                keyResponsibilities: selected1
            });
        }
    }, [selected, selected1, form]);

    const handleSelect1 = (value) => {
        if (selected1.includes(value)) {
            setSelected1(selected1.filter((item) => item !== value));
        } else {
            setSelected1([...selected1, value]);
        }
    };

    const handleSelectAll = () => {
        if (selected.length === options.length) {
            // Unselect all if all are already selected
            setSelected([]);
        } else {
            // Select all
            setSelected(options.map((option) => option.value));
        }
    };

    const handleSelectAll1 = () => {
        if (selected1.length === options1.length) {
            // Unselect all if all are already selected
            setSelected1([]);
        } else {
            // Select all
            setSelected1(options1.map((option) => option.value));
        }
    };
    const opt = ['Full-time Nanny', 'Part-time Nanny', 'Occasional Babysitting', 'Live-in Nanny', 'Date Nights']
    const opt1 = ['Less than 6 months', '6 months to 1 year', '1 to 2 years', 'More than 2 years']
    const opt2 = ['1 child', '2 children', '3 children', '4 or more children']

    useEffect(() => {
        if (formRef) {
            formRef.current = form;
        }
    }, [formRef, form]);
    return (
        <div>
            <p className='font-normal Classico px-3 mt-5 mb-10 offer-font text-center leading-6'>
                Experience Entry for Nanny and Babysitter
            </p>
            <div>

            </div>
            <Form className='flex justify-center' layout="vertical" form={form}>
                <div>
                    <div className='flex flex-wrap justify-center gap-x-12 margin-2 '>
                        <InputDa name={'Family Identifier/Nickname (Optional)'} placeholder={'Enter family name'} />
                        <Form.Item name='typeOfCareProvided' rules={[{ required: true, message: '' }]}>
                            <SelectComponent opt={opt} onSelectChange={(value) => {
                                setSelectedValue(value); // Update local state
                                form.setFieldsValue({ typeOfCareProvided: value }); // Sync with form
                            }} selectedValue={selectedValue} placeholder={'Type of Care Provided'} />
                        </Form.Item>

                    </div>
                    <div className='flex flex-wrap justify-center gap-x-12 gap-y-6'>
                        <Form.Item name='durationOfEmployment' rules={[{ required: true, message: '' }]}>
                            <SelectComponent opt={opt1} onSelectChange={(value) => {
                                setSelectedValue1(value); // Update local state
                                form.setFieldsValue({ durationOfEmployment: value }); // Sync with form
                            }} selectedValue={selectedValue1} placeholder={'Duration of Employment'} />
                        </Form.Item>
                        <Form.Item name='numberOfChildren' rules={[{ required: true, message: '' }]}>
                            <SelectComponent opt={opt2} onSelectChange={(value) => {
                                setSelectedValue2(value); // Update local state
                                form.setFieldsValue({ numberOfChildren: value }); // Sync with form
                            }} selectedValue={selectedValue2} placeholder={'Number of Children'} />
                        </Form.Item>
                    </div>
                    <div>
                        <p className="Classico text-xl mt-6 capitalize">Age Group(s) of Children</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
                            {options.map((option) => (
                                <Form.Item
                                    key={option.value}
                                    style={{ padding: 0, margin: 0 }}
                                    name={'ageGroupsOfChildren'}
                                >
                                    <div
                                        className={`cursor-pointer p-4 rounded-3xl border-2 ${selected.includes(option.value)
                                            ? 'bg-white border-blue-400'
                                            : 'bg-white border-white'
                                            } hover:bg-white-500 transition-colors`}
                                        onClick={() => handleSelect(option.value)}
                                    >
                                        {option.label}
                                    </div>
                                </Form.Item>
                            ))}

                            {/* "Specify" input in the second row */}
                            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                                <Form.Item
                                    style={{ padding: 0, margin: 0 }}
                                    name={'ageGroupsOfChildrenSpecify'}
                                    rules={[{ required: false, message: '' }]}
                                >
                                    <Input
                                        type="text"
                                        placeholder="Specify"
                                        className="w-full py-4 rounded-3xl border-none"
                                    />
                                </Form.Item>
                            </div>
                        </div>



                        <p className=" text-gray-500 text-end cursor-pointer" onClick={handleSelectAll}>
                            {selected.length === options.length
                                ? 'Deselect All'
                                : 'Select all that apply'}
                        </p>
                    </div>

                    <div>
                        <p className="Classico text-xl capitalize">Key Responsibilities</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
                            {options1.map((option, index) => (
                                <Form.Item
                                    key={option.value}
                                    style={{ padding: 0, margin: 0 }}
                                    name={'keyResponsibilities'}
                                >
                                    <div
                                        key={option.value}
                                        className={`cursor-pointer p-4 rounded-3xl border-2 ${selected1.includes(option.value)
                                            ? 'bg-white border-blue-400'
                                            : 'bg-white border-white'
                                            } hover:bg-white-500 transition-colors`}
                                        onClick={() => handleSelect1(option.value)}
                                    >
                                        {option.label}
                                    </div>
                                </Form.Item>
                            ))}
                            <Form.Item
                                style={{ padding: 0, margin: 0 }}
                                name={'keyResponsibilitiesSpecify'}
                                rules={[
                                    {
                                        required: false,
                                        message: '',
                                    },
                                ]}
                                className="col-span-2 sm:col-span-2 lg:col-span-1"
                            >
                                <Input
                                    type="text"
                                    placeholder="Specify"
                                    className="py-4 rounded-3xl border-none"
                                />
                            </Form.Item>
                        </div>
                        <p className=" text-gray-500 text-end cursor-pointer" onClick={handleSelectAll1}>
                            {selected1.length === options1.length
                                ? 'Deselect All'
                                : 'Select all that apply'}
                        </p>
                    </div>
                    <div className='flex flex-wrap justify-center gap-x-12 margin-2 '>
                        <InputDa name={'Location of Work'} placeholder={'Type Location'} />
                        <InputDa name={'Reason for Leaving (Optional)'} req={true} placeholder={'Write Reason for Leaving'} />
                    </div>
                    <div >
                        <Form.Item name='referencesAvailable' rules={[{ required: true, message: '' }]}>
                            <SelectComponent opt={['Yes', 'No']} onSelectChange={(value) => {
                                setSelectedValue3(value); // Update local state
                                form.setFieldsValue({ referencesAvailable: value }); // Sync with form
                            }} selectedValue={selectedValue3} placeholder={'References Available'} />
                        </Form.Item>
                    </div>
                </div>

            </Form >
        </div >

    );
};

export default FamilyExperienceForm;
