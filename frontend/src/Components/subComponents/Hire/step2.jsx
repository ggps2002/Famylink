
import { SelectComponent, InputDa } from "../input"
import { Form } from 'antd';

export default function HireStep2({ opt, selectedValue, handleSelectChange, formRef }) {

    const [form] = Form.useForm();

    const onFinish = (value) => {
        (value);
    };

    // Attach form instance to formRef
    if (formRef) {
        formRef.current = form;
    }
    return (
        <div>
            <p className='font-normal Classico px-3 offer-font text-center mb-5 width-form'>How many children do you have?</p>
            <div className="flex justify-center mb-10">
                <SelectComponent opt={opt} selectedValue={selectedValue}
                    onSelectChange={handleSelectChange} placeholder={'Number of Children'} />
            </div>
            <div className='flex justify-center mt-10'>
                <Form form={form} name="validateOnly" autoComplete="off" onFinish={onFinish}>
                    {
                        selectedValue > 1 ?
                            <div className="grid grid-cols-1 gap-x-6 flex-wrap md:grid-cols-1 lg:grid-cols-2 justify-center mx-auto">
                                {selectedValue && [...Array(Number(selectedValue))].map((i, index) => (
                                    <InputDa placeholder={'Type age'} name={`${index + 1} Child`} val={`Child${index + 1}`} type={'number'} />
                                ))}
                            </div>
                            : <div className="flex justify-center mx-auto">
                                {selectedValue && [...Array(Number(selectedValue))].map((i, index) => (
                                    <InputDa placeholder={'Type age'} name={`${index + 1} Child`} val={`Child${index + 1}`} type={'number'} />
                                ))}
                            </div>
                    }
                </Form>

            </div>
        </div>
    )
}