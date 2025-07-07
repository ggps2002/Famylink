import { useState, useRef } from "react";
import CustomStepper from "../../../postSteps";
import HireStep4 from "../../subComponents/Hire/step4"; // Import your form component
import { fireToastMessage } from "../../../toastContainer";
import { cleanFormData1 } from "../../subComponents/toCamelStr";
import { Form, Input } from "antd";
import HireStep3 from "../../subComponents/Hire/step3";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import HireStep2 from "../../subComponents/Hire/step2";
import { parseHourlyRate, step2Data, step3Data, step4Data, step5Data, step6Data, step7Data, step8Data, step9Data, step10Data, step11Data, step12Data, step13Data } from "../../../Config/helpFunction";
import { useDispatch } from "react-redux";
import { postNannyShare } from "../../Redux/nannyShareSlice";

export const PostANannyShare = () => {
    const stepRef = useRef(null);
    const dispatch = useDispatch()
    const [selectedValue, setSelectedValue] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm()
    const totalStep = 15
    const [currentStep, setCurrentStep] = useState(0);
    const [formValues, setFormValues] = useState({});
    const [textAreaValue, setTextAreaValue] = useState(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    )

    const daysOfWeek = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ]

    // Initialize the state in the parent component
    const [daysState, setDaysState] = useState(
        daysOfWeek.reduce((acc, day) => {
            acc[day] = { checked: false, start: null, end: null }
            return acc
        }, {})
    )

    // This function will update the state when passed down to HireStep3
    const updateDaysState = updatedDaysState => {
        setDaysState(updatedDaysState)
    }

    const jobFormRef = useRef(null);

    const handleChange = e => {
        setTextAreaValue(e.target.value)
    }

    const HandleNext = async () => {
        if (currentStep == 0) {
            jobFormRef.current
                .validateFields()
                .then(values => {
                    const hasValues = Object.keys(values || {}).length > 0;
                    if (hasValues) {
                        setFormValues({
                            ...formValues, noOfChildren: {
                                length: Object.keys(values).length,
                                info: values
                            }
                        })
                        stepRef.current?.next()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    } else {
                        fireToastMessage({ type: 'error', message: 'Select number of children' });
                    }
                })
                .catch(() => {
                    // Intentionally left blank
                });
        }
        else if (currentStep == 1) {
            const selectedDays = Object.entries(daysState).filter(
                ([day, { checked }]) => checked
            )

            if (selectedDays.length === 0) {
                fireToastMessage({
                    type: 'error',
                    message: 'At least one day must be selected.'
                })
                return
            }

            let allValid = true // Flag to check if all selected days have valid start and end times
            let invalidDays = []

            // Loop through selected days to ensure each has a valid start and end time
            selectedDays.forEach(([day, { start, end }]) => {
                if (!start || !end) {
                    allValid = false
                    invalidDays.push(day) // Collect days with missing start or end times
                } else if (start.isSame(end)) {
                    allValid = false
                    invalidDays.push(day) // Collect days where start and end are the same
                } else if (end.isBefore(start)) {
                    // Error if end time is before start time
                    allValid = false
                    invalidDays.push(day) // Collect days where end is before start
                }
            })

            if (!allValid) {
                fireToastMessage({
                    type: 'error',
                    message: `The following selected days have invalid start or end times: ${invalidDays.join(
                        ', '
                    )}`
                })
                return
            }
            const checkedDays = Object.entries(daysState)
                .filter(([day, data]) => data.checked) // Keep only those with checked: true
                .reduce((acc, [day, data]) => {
                    // Convert start and end times to string (ISO format or any preferred format)
                    const start = data.start.toISOString() // Assuming start is a date object
                    const end = data.end.toISOString() // Assuming end is a date object

                    acc[day] = {
                        ...data,
                        start, // Replace the start time with a string
                        end // Replace the end time with a string
                    }
                    return acc
                }, {})

            if (selectedDays.length != 0) {
                setFormValues({ ...formValues, specificDays: checkedDays })
            }
            stepRef.current?.next()
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
        else if (currentStep == 2) {
            jobFormRef.current
                .validateFields()
                .then(values => {
                    if (values.option) {
                        const cleanData = cleanFormData1(values)
                        let updatedValues = {
                            ...formValues,
                            schedule: cleanData.option,
                            ...(cleanData.specify && { scheduleSpecify: cleanData.specify })
                        };
                        setFormValues(updatedValues);
                        // console.log(formValues)
                        jobFormRef.current.resetFields()
                        stepRef.current?.next()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({
                            type: 'error',
                            message: 'Select at least one option'
                        })
                    }
                })
                .catch(errorInfo => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                })
        }
        else if (currentStep == 3) {
            jobFormRef.current
                .validateFields()
                .then(values => {
                    if (values.option) {
                        const cleanData = cleanFormData1(values)
                        let updatedValues = {
                            ...formValues,
                            style: cleanData.option,
                            ...(cleanData.specify && { styleSpecify: cleanData.specify })
                        };
                        setFormValues(updatedValues);
                        jobFormRef.current.resetFields()
                        stepRef.current?.next()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({
                            type: 'error',
                            message: 'Select at least one option'
                        })
                    }
                })
                .catch(errorInfo => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                })
        }
        else if (currentStep == 4) {
            jobFormRef.current
                .validateFields()
                .then(values => {
                    // Check if the preferredLocation (or whatever your field is) has been set
                    if (Array.isArray(values.option) && values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step

                        let updatedValues = {
                            ...formValues,
                            responsibility: values.option,
                            ...(values.specify && { responsibilitySpecify: values.specify })
                        }// Merge with previous values
                        setFormValues(updatedValues);
                        jobFormRef.current.resetFields()
                        stepRef.current?.next()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({
                            type: 'error',
                            message: 'Select at least one option'
                        })
                    }
                })
                .catch(errorInfo => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                })
        }

        else if (currentStep == 5) {
            jobFormRef.current
                .validateFields()
                .then(values => {
                    if (values.option) {
                        // If form is valid, submit it and move to the next step

                        const cleanData = cleanFormData1(values);

                        let updatedValues = {
                            ...formValues,
                            hourlyRate: parseHourlyRate(cleanData.option),
                            ...(cleanData.specify && { hourlyRateSpecify: cleanData.specify }) // Correct conditional property assignment
                        };
                        // Merge with previous values
                        setFormValues(updatedValues);
                        stepRef.current?.next()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({
                            type: 'error',
                            message: 'Select at least one option'
                        })
                    }
                })
                .catch(errorInfo => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                })
        }
        else if (currentStep == 6) {
            jobFormRef.current
                .validateFields()
                .then(values => {
                    if (values.option) {

                        const cleanData = cleanFormData1(values)
                        let updatedValues = {
                            ...formValues,
                            pets: cleanData.option,
                            ...(cleanData.specify && { petsSpecify: cleanData.specify })
                        }; // Merge with previous values
                        setFormValues(updatedValues);
                        jobFormRef.current.resetFields()
                        stepRef.current?.next()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({
                            type: 'error',
                            message: 'Select at least one option'
                        })
                    }
                })
                .catch(errorInfo => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                })
        }

        else if (currentStep == 7) {
            jobFormRef.current
                .validateFields()
                .then(values => {
                    if (values.option) {

                        const cleanData = cleanFormData1(values)
                        let updatedValues = {
                            ...formValues,
                            communicate: cleanData.option,
                            ...(cleanData.specify && { communicateSpecify: cleanData.specify })
                        }; // Merge with previous values
                        setFormValues(updatedValues);
                        jobFormRef.current.resetFields()
                        stepRef.current?.next()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({
                            type: 'error',
                            message: 'Select at least one option'
                        })
                    }
                })
                .catch(errorInfo => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                })
        }

        else if (currentStep == 8) {
            jobFormRef.current
                .validateFields()
                .then(values => {
                    if (values.option) {

                        const cleanData = cleanFormData1(values)
                        let updatedValues = {
                            ...formValues,
                            backupCare: cleanData.option,
                            ...(cleanData.specify && { backupCareSpecify: cleanData.specify })
                        }; // Merge with previous values
                        setFormValues(updatedValues);
                        jobFormRef.current.resetFields()
                        stepRef.current?.next()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({
                            type: 'error',
                            message: 'Select at least one option'
                        })
                    }
                })
                .catch(errorInfo => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                })
        }

        else if (currentStep == 9) {
            jobFormRef.current
                .validateFields()
                .then(values => {
                    if (values.option) {

                        const cleanData = cleanFormData1(values)
                        let updatedValues = {
                            ...formValues,
                            involve: cleanData.option,
                            ...(cleanData.specify && { involveSpecify: cleanData.specify })
                        }; // Merge with previous values
                        setFormValues(updatedValues);
                        jobFormRef.current.resetFields()
                        stepRef.current?.next()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({
                            type: 'error',
                            message: 'Select at least one option'
                        })
                    }
                })
                .catch(errorInfo => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                })
        }
        else if (currentStep == 10) {
            jobFormRef.current
                .validateFields()
                .then(values => {
                    // Check if the preferredLocation (or whatever your field is) has been set
                    if (Array.isArray(values.option) && values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        let updatedValues = {
                            ...formValues,
                            activity: values.option,
                            ...(values.specify && { activitySpecify: values.specify })
                        }// Merge with previous values
                        setFormValues(updatedValues);
                        jobFormRef.current.resetFields()
                        stepRef.current?.next()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({
                            type: 'error',
                            message: 'Select at least one option'
                        })
                    }
                })
                .catch(errorInfo => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                })
        }

        else if (currentStep == 11) {
            jobFormRef.current
                .validateFields()
                .then(values => {
                    // Check if the preferredLocation (or whatever your field is) has been set
                    if (Array.isArray(values.option) && values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        let updatedValues = {
                            ...formValues,
                            guideline: values.option,
                            ...(values.specify && { guidelineSpecify: values.specify })
                        }// Merge with previous values
                        setFormValues(updatedValues);
                        jobFormRef.current.resetFields()
                        stepRef.current?.next()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({
                            type: 'error',
                            message: 'Select at least one option'
                        })
                    }
                })
                .catch(errorInfo => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                })
        }

        else if (currentStep == 12) {
            jobFormRef.current
                .validateFields()
                .then(values => {
                    // Check if the preferredLocation (or whatever your field is) has been set
                    // console.log(values)
                    if (Array.isArray(values.option) && values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        let updatedValues = {
                            ...formValues,
                            healthConsideration: values.option,
                            ...(values.specify && { healthConsiderationSpecify: values.specify })
                        }// Merge with previous values
                        setFormValues(updatedValues);
                        jobFormRef.current.resetFields()
                        stepRef.current?.next()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({
                            type: 'error',
                            message: 'Select at least one option'
                        })
                    }
                })
                .catch(errorInfo => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                })
        }

        else if (currentStep == 13) {
            jobFormRef.current
                .validateFields()
                .then(values => {
                    if (values.option) {

                        const cleanData = cleanFormData1(values)
                        let updatedValues = {
                            ...formValues,
                            scheduleAndArrangement: cleanData.option,
                            ...(cleanData.specify && { scheduleAndArrangementSpecify: cleanData.specify })
                        }; // Merge with previous values
                        setFormValues(updatedValues);
                        jobFormRef.current.resetFields()
                        stepRef.current?.next()
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({
                            type: 'error',
                            message: 'Select at least one option'
                        })
                    }
                })
                .catch(errorInfo => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                })
        }
        else if (currentStep == 14) {
            setIsLoading(true)
            if (textAreaValue.length > 0) {
                setFormValues({
                    ...formValues,
                    jobDescription: textAreaValue
                });
                try {
                    const { data } = await dispatch(postNannyShare({
                        ...formValues,
                        jobDescription: textAreaValue
                    })).unwrap()
                    fireToastMessage({
                        success: true,
                        message: data.message
                    })
                    setIsLoading(false)
                    navigate('/family/nannyShare')
                } catch (err) {
                    setIsLoading(false)
                    fireToastMessage({ type: 'error', message: err.message })
                }
                window.scrollTo({ top: 0, behavior: "smooth" })
            } else {
                fireToastMessage({
                    type: 'error',
                    message: 'Please write the job description'
                })
            }
        }
    }
    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return (
                <HireStep2
                    opt={Array.from({ length: 4 }, (_, i) => i + 1)}
                    formRef={jobFormRef}
                    selectedValue={selectedValue}
                    handleSelectChange={setSelectedValue}
                />
            );
            case 1: return (
                <HireStep3
                    daysState={daysState}
                    setDaysState={updateDaysState}
                    head={
                        'What is your desired schedule for nanny care?'
                    }
                />
            );

            case 2: return (
                <HireStep4
                    formRef={jobFormRef || {}}
                    inputName={'Specify'}
                    head={'How flexible are you with scheduling and arrangements?'}
                    data={step2Data}
                />
            );

            case 3: return (
                <HireStep4
                    formRef={jobFormRef || {}}
                    inputName={'Specify'}
                    head={'Do you have a specific parenting style or philosophy?'}
                    data={step3Data}
                />
            );
            case 4: return (
                <HireStep4
                    checkBox={true}
                    formRef={jobFormRef || {}}
                    inputName={'Specify'}
                    head={'What responsibilities would you like the nanny to handle?'}
                    data={step4Data}
                />
            );
            case 5:
                return (
                    <HireStep4
                        formRef={jobFormRef || {}}
                        head={'What is your hourly budget for a nanny share?'}
                        subHead2={'This is the total hourly rate for the nanny. If split between two families, you will each pay half of the selected amount.'}
                        data={step5Data}
                    />
                );
            case 6: return (
                <HireStep4
                    formRef={jobFormRef || {}}
                    inputName={'Specify'}
                    head={'Do you have pets? If so, what kind?'}
                    data={step6Data}
                />
            );

            case 7: return (
                <HireStep4
                    formRef={jobFormRef || {}}
                    inputName={'Specify'}
                    head={'How do you prefer to communicate and coordinate with another family?'}
                    data={step7Data}
                />
            );
            case 8: return (
                <HireStep4
                    formRef={jobFormRef || {}}
                    inputName={'Specify'}
                    head={"Do you have any backup care options in case the nanny is unavailable?"}
                    data={step8Data}
                />
            );
            case 9: return (
                <HireStep4
                    formRef={jobFormRef || {}}
                    inputName={'Specify'}
                    head={"How involved do you want to be in daily activities and decision-making?"}
                    data={step9Data}
                />
            );
            case 10: return (
                <HireStep4
                    checkBox={true}
                    formRef={jobFormRef || {}}
                    inputName={'Specify'}
                    head={"What is your daily routine and any specific activities you want to include?"}
                    data={step10Data}
                />
            );
            case 11: return (
                <HireStep4
                    checkBox={true}
                    formRef={jobFormRef || {}}
                    inputName={'Specify'}
                    head={"Do you have specific house rules or guidelines?"}
                    data={step11Data}
                />
            );
            case 12: return (
                <HireStep4
                    checkBox={true}
                    formRef={jobFormRef || {}}
                    inputName={'Specify'}
                    head={"Are there any allergies or health considerations the nanny should be aware of?"}
                    data={step12Data}
                />
            );
            case 13: return (
                <HireStep4
                    formRef={jobFormRef || {}}
                    inputName={'Specify'}
                    head={"How flexible are you with scheduling and arrangements?"}
                    data={step13Data}
                />
            );
            case 14:
                return (
                    <div>
                        <p className='font-normal Classico px-3 offer-font text-center width-form'>
                            Write a Nanny Share Description
                        </p>
                        <Form
                            className='flex justify-center'
                            form={form}
                            name='validateOnly'
                            autoComplete='off'
                        >
                            <div>
                                <p className='mt-10 mb-1 text-xl Classico'>
                                    Job Description
                                </p>
                                <Form.Item
                                    name='jobDescription'
                                    rules={[
                                        {
                                            required: true,
                                            message: ''
                                        }
                                    ]}
                                >
                                    <Input.TextArea
                                        defaultValue={textAreaValue}
                                        value={textAreaValue} // Controlled value
                                        onChange={handleChange} // Handle input changes
                                        placeholder={'Write job description..'}
                                        className='py-4 border-none !min-h-56 rounded-3xl input-width no-resize'
                                    />
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                )
        }
    }
    return (
        <div className="lg:px-5 Quicksand">

            <p className="lg:text-3xl text-2xl font-bold edit-padding Classico">
                Post a Nanny Share
            </p>

            {/* Stepper Component */}
            <div className="lg:px-10 px-2">
                <CustomStepper
                    stepCount={totalStep}
                    currentStep={currentStep}
                    onChange={setCurrentStep}
                    ref={stepRef}
                />
            </div>

            <div className="lg:mx-10 mx-2 my-10 px-4 lg:rounded-[3rem] rounded-3xl bg-gradient-to-b from-[#9EDCE180] via-[#DAF4EF66] to-[#EFECE64D]">
                <div className="pt-8 pb-4">
                    <div className="flex justify-end lg:mr-6">
                        <button onClick={() => navigate(-1)}>
                            <X className="text-2xl" />
                        </button>
                    </div>
                    <div className="flex flex-col items-center">
                        {renderStepContent()}

                        <div className="flex gap-2">
                            {
                                currentStep > 0 &&
                                <button
                                    className="mx-auto text-[#38AEE3] bg-white border border-[#38AEE3] lg:w-48 w-24 lg:py-2 py-1 rounded-full font-normal text-base transition hover:opacity-60 duration-700 delay-150 ease-in-out"
                                    onClick={() => {
                                        if (currentStep > 0) {
                                            stepRef.current?.prev();
                                        }
                                    }}
                                >
                                    Back
                                </button>
                            }

                            <button
                                className="mx-auto bg-[#38AEE3] text-white lg:w-48 w-24 lg:py-2 py-1 border-none rounded-full font-normal text-base transition hover:-translate-y-1 duration-700 delay-150 ease-in-out hover:scale-110 disabled:opacity-70 disabled:cursor-not-allowed"
                                onClick={HandleNext}
                                disabled={isLoading} // Disable while loading
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8h4z" />
                                        </svg>
                                        Post a Job
                                    </span>
                                ) : (
                                    (totalStep - 1) === currentStep ? 'Post a Job' : 'Continue'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
