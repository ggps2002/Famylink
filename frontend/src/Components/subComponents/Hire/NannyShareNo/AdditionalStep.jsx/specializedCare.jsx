
import { useRef, useState } from "react";
import HireStep4 from "../../step4";
import { Form } from "antd";
import { useNavigate } from "react-router-dom";
import { CloseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { fireToastMessage } from "../../../../../toastContainer";
import { addOrUpdateAdditionalInfo } from "../../../../Redux/formValue";
import { registerThunk } from "../../../../Redux/authSlice";

export default function SpecialCaregiver() {
    const [step, setStep] = useState(1);
    const hireStepFormRef = useRef(null);
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({});
    const v = useSelector((s) => s.additionalSer.value);
    const valuesArray = Object.entries(v); // Get an array of [key, value] pairs

    // Find the index of 'specializedCaregiver'
    const specializedIndex = valuesArray.findIndex(([key]) => key === 'specializedCaregiver');

    // Extract only the true values after 'specializedCaregiver'
    const trueValuesAfterSpecialized = valuesArray
        .slice(specializedIndex + 1) // Get the entries after 'specializedCaregiver'
        .filter(([, value]) => value === true) // Filter only those with a value of true
        .map(([key]) => key); // Extract the keys

    const handleBack = () => {
        if (step > 1) { // Move to the previous step
            setStep(prevStep => prevStep - 1);
        }
    };

    const navigate = useNavigate()
    const handleGoBack = () => {
        navigate('/joinNow'); // Navigate back in history
    };
    const [cleanData, setCleanData] = useState()
    const val = useSelector((S) => S.form)
    const Register = async () => {
        const beforeAddInfo = val.additionalInfo;
        const updatedAddInfo = [...beforeAddInfo];
        updatedAddInfo.push({ key: 'specializedCaregiver', value: ({ ...formData, specialReq: cleanData }) });

        const result = await dispatch(registerThunk({ ...val, additionalInfo: updatedAddInfo, type: "Parents" }));

        if (result.payload.status === 200) {
            fireToastMessage({ success: true, message: "Your account was created successfully" });
            navigate('/login');
            window.location.reload();
        }
        else {
            fireToastMessage({ type: 'error', message: result.payload.message });
        }
    };
    const handleNext = async () => {
        if (step == 1 && hireStepFormRef.current) {
            hireStepFormRef.current
                .validateFields()
                .then((values) => {
                    if (values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        
                        setFormData({ specialCareNeed: values })
                        hireStepFormRef.current.resetFields();
                        setStep(prevStep => prevStep + 1); // Move to the next step
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({ type: 'error', message: 'Select at least one option' });
                    }

                    // setStep((prevStep) => prevStep + 1);
                })
                .catch((errorInfo) => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                });
        }

        else if (step == 2 && hireStepFormRef.current) {
            hireStepFormRef.current
                .validateFields()
                .then((values) => {
                    if (values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        
                        setFormData({ ...formData, specialCareReq: values })
                        hireStepFormRef.current.resetFields();
                        setStep(prevStep => prevStep + 1); // Move to the next step
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({ type: 'error', message: 'Select at least one option' });
                    }

                    // setStep((prevStep) => prevStep + 1);
                })
                .catch((errorInfo) => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                });
        }
        else if (step == 3 && hireStepFormRef.current) {
            hireStepFormRef.current
                .validateFields()
                .then((values) => {
                    if (values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        
                        setFormData({ ...formData, durationOfCare: values })
                        hireStepFormRef.current.resetFields();
                        setStep(prevStep => prevStep + 1); // Move to the next step
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({ type: 'error', message: 'Select at least one option' });
                    }

                    // setStep((prevStep) => prevStep + 1);
                })
                .catch((errorInfo) => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                });
        }
        else if (step == 4 && hireStepFormRef.current) {
            hireStepFormRef.current
                .validateFields()
                .then((values) => {
                    if (values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        
                        setFormData({ ...formData, expAndQualReq: values })
                        hireStepFormRef.current.resetFields();
                        setStep(prevStep => prevStep + 1); // Move to the next step
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({ type: 'error', message: 'Select at least one option' });
                    }

                    // setStep((prevStep) => prevStep + 1);
                })
                .catch((errorInfo) => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                });
        }
        else if (step == 5 && hireStepFormRef.current) {
            hireStepFormRef.current
                .validateFields()
                .then((values) => {
                    if (values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        
                        setFormData({ ...formData, availability: values })
                        hireStepFormRef.current.resetFields();
                        setStep(prevStep => prevStep + 1); // Move to the next step
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({ type: 'error', message: 'Select at least one option' });
                    }

                    // setStep((prevStep) => prevStep + 1);
                })
                .catch((errorInfo) => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                });
        }
        else if (step == 6 && hireStepFormRef.current) {
            hireStepFormRef.current
                .validateFields()
                .then((values) => {
                    if (values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        
                        setFormData({ ...formData, addSkillsAndComp: values })
                        hireStepFormRef.current.resetFields();
                        setStep(prevStep => prevStep + 1); // Move to the next step
                    } else {
                        // Show an error message if no option is selected
                        fireToastMessage({ type: 'error', message: 'Select at least one option' });
                    }

                    // setStep((prevStep) => prevStep + 1);
                })
                .catch((errorInfo) => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                });
        }
        else if (step == 7) {
            hireStepFormRef.current
                .validateFields()
                .then(async (values) => {
                    if (values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        
                        const cleanFormData = (formData) => {
                            // Log the formData to debug its value

                            // If formData is undefined or null, return an empty object
                            if (!formData) {
                                return {};
                            }

                            // Use Object.entries only if formData is a valid object
                            return Object.entries(formData).reduce((acc, [key, value]) => {
                                if (value?.otherPreferences) {
                                    acc[key] = value; // Keep the entire entry if otherPreferences is defined
                                } else {
                                    acc[key] = { option: value.option }; // Only keep the option array if otherPreferences is undefined
                                }
                                return acc;
                            }, {});
                        };

                        // Example usage
                        const cleanedFormData = cleanFormData({ ...formData, perFitAndPre: values });
                        setCleanData(cleanFormData)
                        await dispatch(addOrUpdateAdditionalInfo({ key: 'specializedCaregiver', value: cleanedFormData }));

                    } else {
                        fireToastMessage({ type: 'error', message: 'Select at least one option' });
                    }

                    // setStep((prevStep) => prevStep + 1);
                })
                .catch((errorInfo) => {
                    // Handle validation failure
                    fireToastMessage({ type: "error", message: errorInfo })
                });
            if (trueValuesAfterSpecialized.length > 0) {
                if (v.sportsCoaches) {
                    return navigate('/sportCoach');
                } else if (v.musicInstructor) {
                    return navigate('/music');
                } else if (v.swimInstructor) {
                    return navigate('/swim');
                } else if (v.houseManager) {
                    return navigate('/houseManager');
                }
            }

            else {
                Register()
            }
        }
    }

    const step1Data = [
        {
            name: "Doula"
        },
        {
            name: "Night Nurse"
        },
        {
            name: "Special Needs Care"
        },
        {
            name: "Pediatric Palliative Care"
        },
    ];
    const step2Data = [
        {
            name: "Medical administration (medication management)"
        },
        {
            name: "Medical administration (basic medical monitoring)"
        },
        {
            name: "Developmental exercises (tailored for special needs)"
        },
        {
            name: "Overnight monitoring"
        },
        {
            name: "Support for doulas (labor and postpartum support)"
        },
        {
            name: "Behavioral management (children with behavioral needs)"
        },
    ]
    const step3Data = [
        {
            name: "Short-term (less than 3 months)"
        },
        {
            name: "Long-term (more than 3 months)"
        },
        {
            name: "Temporary (specific dates or times)"
        },
        {
            name: "As-needed"
        },

    ]
    const step4Data = [
        {
            name: "CPR and First Aid Certification"
        },
        {
            name: "Special education training"
        },
        {
            name: "Nursing qualifications (LPN, RN)"
        },
        {
            name: "Doula certification"
        },
        {
            name: "Behavioral therapy training"
        },
    ]
    const step5Data = [
        {
            name: "Weekdays"
        },
        {
            name: "Weekends"
        },
        {
            name: "Overnight"
        },
        {
            name: "24-hour shifts"
        },
        {
            name: "Live-in"
        },
    ]
    const step6Data = [
        {
            name: "Multilingual"
        },
        {
            name: "Comfortable with pets"
        },
        {
            name: "Non-smoker"
        },
        {
            name: "Capable of performing related housekeeping tasks"
        },
        {
            name: "Experienced with dietary restrictions and special diets"
        },
    ]
    const step7Data = [
        {
            name: "Communication style (Direct)"
        },
        {
            name: "Communication style (Empathetic)"
        },
        {
            name: "Cultural compatibility"
        },
        {
            name: "Specific developmental"
        },
        {
            name: "Educational approach knowledge"
        },
    ]

    const renderStepContent = () => {
        switch (step) {
            case 1: return (
                <HireStep4 formRef={hireStepFormRef} head={"Specialized Caregiver"} data={step1Data} checkBox={true} inputName={"Type here..."} textAreaHead={"Other Preferences"} subHead1={"Type of Specialized Care Needed"} />
            )
            case 2: return (
                <HireStep4 formRef={hireStepFormRef} head={"Specialized Caregiver"} data={step2Data} checkBox={true} inputName={"Type here..."} textAreaHead={"Other Preferences"} subHead1={"Specific Care Requirements"} />
            )
            case 3: return (
                <HireStep4 formRef={hireStepFormRef} head={"Specialized Caregiver"} data={step3Data} checkBox={true} inputName={"Type here..."} textAreaHead={"Other Preferences"} subHead1={"Duration of Care"} />
            )
            case 4: return (
                <HireStep4 formRef={hireStepFormRef} head={"Specialized Caregiver"} data={step4Data} checkBox={true} subHead1={"Experience and Qualifications Required"} inputName={"Type here..."} textAreaHead={"Other Preferences"} />
            )
            case 5: return (
                <HireStep4 formRef={hireStepFormRef} head={"Specialized Caregiver"} data={step5Data} checkBox={true} subHead1={"Availability"} inputName={"Type here..."} textAreaHead={"Other Preferences"} />
            )
            case 6: return (
                <HireStep4 formRef={hireStepFormRef} head={"Specialized Caregiver"} data={step6Data} checkBox={true} subHead1={"Additional Skills and Competencies"} inputName={"Type here..."} textAreaHead={"Other Preferences"} />
            )
            case 7: return (
                <HireStep4 formRef={hireStepFormRef} head={"Specialized Caregiver"} data={step7Data} checkBox={true} subHead1={"Personal Fit and Preferences"} inputName={"Type here..."} textAreaHead={"Other Preferences"} />
            )
        }
    }
    return (
        <>
            <div className="padd-res">
                <div className="rounded-3xl py-4 px-4" style={{ background: 'linear-gradient(174.22deg, rgba(158, 220, 225, 0.5) 0%, rgba(218, 244, 239, 0.4) 69.71%, rgba(239, 236, 230, 0.3) 100%)' }}>
                    <div className='flex justify-end'>
                        <button onClick={handleGoBack}>
                            <CloseOutlined style={{ fontSize: "24px" }} />
                        </button>
                    </div>
                    <div className='flex justify-center'>
                        <div>
                            {renderStepContent()}

                            <div className='text-center my-5'>

                                {step > 1 &&
                                    <button
                                        style={{ border: "1px solid #38AEE3" }}
                                        className='py-2 bg-white rounded-full my-0 mx-6 px-10 text-base font-normal mt-2'
                                        onClick={handleBack}
                                    >
                                        Back
                                    </button>
                                }

                                {step < 9 ?

                                    <button
                                        style={{ background: "#85D1F1" }}
                                        className='py-2 rounded-full my-0 mx-auto px-6 text-base font-normal transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-700 '
                                        onClick={handleNext}
                                    >
                                        Continue
                                    </button>
                                    : <button
                                        style={{ background: "#85D1F1" }}
                                        className='py-2 rounded-full my-0 mx-auto px-6 text-base font-normal transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-700 '
                                    // onClick={handleNext}
                                    >
                                        Stop
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}