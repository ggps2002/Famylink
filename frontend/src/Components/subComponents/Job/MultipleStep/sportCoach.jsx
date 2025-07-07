import { useRef, useState } from "react";
import HireStep4 from "../../Hire/step4";
import { useNavigate } from "react-router-dom";
import { CloseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { fireToastMessage } from "../../../../toastContainer";
import { cleanFormData1 } from "../../toCamelStr";
import { addOrUpdateAdditionalInfo } from "../../../Redux/formValue";
import { registerThunk } from "../../../Redux/authSlice";

export default function SportCoach() {
    const [step, setStep] = useState(1);
    const hireStepFormRef = useRef(null);
    const v = useSelector((s) => s.additionalSer.value);
    const dispatch = useDispatch()
    const [formData, setFormData] = useState()
    const valuesArray = Object.entries(v); // Get an array of [key, value] pairs
    const val = useSelector((s) => s.form)
    const [cleanData, setCleanData] = useState()
    // Find the index of 'specializedCaregiver'
    const specializedIndex = valuesArray.findIndex(([key]) => key === 'sportsCoaches');

    // Extract only the true values after 'specializedCaregiver'
    const trueValuesAfterSpecialized = valuesArray
        .slice(specializedIndex + 1) // Get the entries after 'specializedCaregiver'
        .filter(([, value]) => value === true) // Filter only those with a value of true
        .map(([key]) => key);

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
        updatedAddInfo.push({ key: 'sportCoach', value: ({ ...formData, avail: cleanData })  });
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
    const handleNext = () => {
        if (step == 1) {
            hireStepFormRef.current
                .validateFields()
                .then((values) => {
                    if (values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        
                        let cleanData = cleanFormData1(values)
                        setFormData({ ...formData, sportType: cleanData })
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
                        
                        setFormData({ ...formData, preCoachingTeam: values })
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
                .then(async(values) => {
                    if (values.option?.length > 0) {
                        // If form is valid, submit it and move to the next step
                        
                        setCleanData(values)
                        if (trueValuesAfterSpecialized.length > 0) {
                            dispatch(addOrUpdateAdditionalInfo({ key: 'sportCoach', value: ({ ...formData, avail: cleanData })  }));
                            if (v.musicInstructor) {
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
                        fireToastMessage({ type: 'error', message: 'Select at least one option' });
                    }
                })
                .catch((errorInfo) => {
                   fireToastMessage({ type: "error", message: errorInfo })
                });
        }
    }
    const step1Data = [
        {
            name: "Soccer"
        },
        {
            name: "Basketball"
        },
        {
            name: "Tennis"
        },
        {
            name: "Swimming"
        },
        {
            name: "Golf"
        },
    ];
    const step2Data = [
        {
            name: "Yes"
        },
        {
            name: "No"
        }
    ]
    const step3Data = [
        {
            name: "Teams"
        },
        {
            name: "Individuals"
        },
        {
            name: "Both"
        },
    ]
    const step4Data = [
        {
            name: "Weekdays"
        },
        {
            name: "Weekends"
        },
        {
            name: "Evenings"
        },
        {
            name: "Flexible"
        },
    ]

    const renderStepContent = () => {
        switch (step) {
            case 1: return (
                <HireStep4 formRef={hireStepFormRef} head={"Sports Coach"} data={step1Data} checkBox={true} subHead1={"What sports do you coach, and what is your coaching level?"} inputName={"Type here..."} textAreaHead={"Other Preferences"} />
            )
            case 2: return (
                <HireStep4 formRef={hireStepFormRef} head={"Sports Coach"} data={step2Data} inputName={"Type here..."} textAreaHead={"Please Specify"} subHead1={"Do you have any professional coaching certifications or training?"} />
            )
            case 3: return (
                <HireStep4 formRef={hireStepFormRef} head={"Sports Coach"} data={step3Data} checkBox={true} inputNot={true} subHead1={"Do you prefer coaching teams or individuals?"} />
            )
            case 4: return (
                <HireStep4 formRef={hireStepFormRef} head={"Sports Coach"} data={step4Data} checkBox={true} subHead1={"What days and times are you available to coach?"} inputNot={true} />
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

                                {step <= 9 &&

                                    <button
                                        style={{ background: "#85D1F1" }}
                                        className='py-2 rounded-full my-0 mx-auto px-6 text-base font-normal transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-700 '
                                        onClick={handleNext}
                                    >
                                        Continue
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