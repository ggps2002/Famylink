
import { useRef, useState } from "react";
import HireStep4 from "../../Hire/step4";
import { useNavigate } from "react-router-dom";
import { CloseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { fireToastMessage } from "../../../../toastContainer";
import { cleanFormData1 } from "../../toCamelStr";
import { addOrUpdateAdditionalInfo } from "../../../Redux/formValue";
import { registerThunk } from "../../../Redux/authSlice";

export default function SpecialCaregiver() {
    const [step, setStep] = useState(1);
    const hireStepFormRef = useRef(null);
    const [cleanData, setCleanData] = useState()
    const [formData, setFormData] = useState()
    const v = useSelector((s) => s.additionalSer.value);
    const valuesArray = Object.entries(v); // Get an array of [key, value] pairs
    const val = useSelector((s) => s.form)
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
    const Register = async () => {
        const beforeAddInfo = val.additionalInfo;
        const updatedAddInfo = [...beforeAddInfo];
        updatedAddInfo.push({ key: 'specializedCaregiver', value: ({ ...formData, avaOverNightAndLiveIn: cleanData }) });
        const result = await dispatch(registerThunk({ ...val, additionalInfo: updatedAddInfo, type: "Nanny" }));

        if (result.payload.status === 200) {
            fireToastMessage({ success: true, message: "Your account was created successfully" });
            navigate('/login');
            window.location.reload();
        }
        else {
            fireToastMessage({ type: 'error', message: result.payload.message });
        }
    };
    const dispatch = useDispatch()
    const handleNext = () => {
        if (step == 1) {
            hireStepFormRef.current
                .validateFields()
                .then((values) => {
                    if (values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        
                        let cleanData = cleanFormData1(values)
                        setFormData({ ...formData, specializedCare: cleanData })
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
        else if (step == 2) {
            hireStepFormRef.current
                .validateFields()
                .then((values) => {
                    if (values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        
                        let cleanData = cleanFormData1(values, 'pleaseSpecify')
                        setFormData({ ...formData, cert: cleanData })
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
        else if (step == 3) {
            hireStepFormRef.current
                .validateFields()
                .then((values) => {
                    if (values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        
                        setFormData({ ...formData, expManagNeed: values })
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
        if (step == 4) {
            hireStepFormRef.current
                .validateFields()
                .then(async (values) => {
                    if (values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        
                        setCleanData(values)
                        hireStepFormRef.current.resetFields();
                        if (trueValuesAfterSpecialized.length > 0) {
                            dispatch(addOrUpdateAdditionalInfo({ key: 'specializedCaregiver', value: ({ ...formData, avaOverNightAndLiveIn: cleanData }) }));
                            if (v.sportsCoaches) {
                                return navigate('/sportCoachJob');
                            } else if (v.musicInstructor) {
                                return navigate('/musicJob');
                            } else if (v.swimInstructor) {
                                return navigate('/swimJob');
                            } else if (v.houseManager) {
                                return navigate('/houseManagerJob');
                            }
                        }
                        else {
                            Register()
                        }
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
            name: "Elder Care"
        },
    ];
    const step2Data = [
        {
            name: "Yes"
        },
        {
            name: "No"
        },
    ]
    const step3Data = [
        {
            name: "Yes"
        },
        {
            name: "No"
        },
    ]
    const step4Data = [
        {
            name: "Overnight Only"
        },
        {
            name: "Live-in Only"
        },
        {
            name: "Both"
        },
        {
            name: "Neither"
        },
    ]

    const renderStepContent = () => {
        switch (step) {
            case 1: return (
                <HireStep4 formRef={hireStepFormRef} head={"Specialized Caregiver"} data={step1Data} checkBox={true} inputName={"Type here..."} textAreaHead={"Other Preferences"} subHead1={"What type of specialized care are you trained to provide?"} />
            )
            case 2: return (
                <HireStep4 formRef={hireStepFormRef} head={"Specialized Caregiver"} data={step2Data} inputName={"Type here..."} textAreaHead={"Please Specify"} subHead1={"Do you hold any certifications relevant to your specialized care services?"} />
            )
            case 3: return (
                <HireStep4 formRef={hireStepFormRef} head={"Specialized Caregiver"} data={step3Data} inputNot={true} subHead1={"Do you have experience managing medical needs or medications?"} />
            )
            case 4: return (
                <HireStep4 formRef={hireStepFormRef} head={"Specialized Caregiver"} data={step4Data} checkBox={true} subHead1={"Are you available for overnight care or live-in arrangements?"} inputNot={true} />
            )
        }
    }
    return (
        <>
            <div className="padd-res">
                <div className="rounded-3xl py-4 px-4" style={{ background: 'linear-gradient(174.22deg, #FFCADA 0%, rgba(246, 238, 233, 0.4) 69.71%, #FFF1F5 100%)' }}>
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