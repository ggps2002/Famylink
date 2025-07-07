
import { Form } from 'antd'
import { InputDa } from '../input';
import { useEffect } from 'react';
export default function Step5({ formRef }) {

    const [form] = Form.useForm();
    useEffect(() => {
        if (formRef) {
            formRef.current = form;
        }
    }, [formRef, form]);
    return (
        <div className='flex justify-center my-10'>
            <Form form={form} name="validateOnly" autoComplete="off">
                <InputDa type={'number'} name={'1 Child'} val={'firstChild'} placeholder={'$20.00'} />
                <InputDa type={'number'} name={'2 Child'} val={'secChild'} placeholder={'$30.00'} />
                <InputDa type={'number'} name={'3 Child'} val={'thirdChild'} placeholder={'$40.00'} />
                <InputDa type={'number'} name={'4 Child'} val={'fourthChild'} placeholder={'$50.00'} />
                <InputDa type={'number'} name={'5 Child or more'} val={'fiveOrMoreChild'} placeholder={'$60.00'} />
            </Form>
        </div>
    )

}