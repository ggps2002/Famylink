import { useRef, useState } from "react";
import HireStep4 from "../../Hire/step4";
import { Form } from "antd";
import { useNavigate } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fireToastMessage } from "../../../../toastContainer";
import { addOrUpdateAdditionalInfo } from "../../../Redux/formValue";
import { cleanFormData1 } from "../../toCamelStr";
import { registerThunk } from "../../../Redux/authSlice";

export default function Tutor() {
  const [step, setStep] = useState(1);
  const hireStepFormRef = useRef(null);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cleanData, setCleanData] = useState();
  const v = useSelector((s) => s.additionalSer.value);
  const val = useSelector((s) => s.form);
  // Count the number of true values
  
  let trueCount = Object.entries(v).reduce((count, [key, value]) => {
    if (key !== "nanny" && key !== "babysitter" && value === true) {
      return count + 1;
    }
    return count;
  }, 0);
  const handleBack = () => {
    if (step > 1) {
      // Move to the previous step
      setStep((prevStep) => prevStep - 1);
    }
  };

  const Register = async () => {
    const beforeAddInfo = val.additionalInfo;
    const updatedAddInfo = [...beforeAddInfo];
    updatedAddInfo.push({
      key: "tutorPrivateEducator",
      value: { ...formData, remOrPerson: cleanData },
    });
    const result = await dispatch(
      registerThunk({ ...val, additionalInfo: updatedAddInfo, type: "Nanny" })
    );

    if (result.payload.status === 200) {
      fireToastMessage({
        success: true,
        message: "Your account was created successfully",
      });
      navigate("/login");
      window.location.reload();
    } else {
      fireToastMessage({ type: "error", message: result.payload.message });
    }
  };
  const handleNext = () => {
    if (step == 1) {
      hireStepFormRef.current
        .validateFields()
        .then((values) => {
          if (values.option?.length > 0) {
            // If form is valid, submit it and move to the next step

            let cleanData = cleanFormData1(values);
            cleanData = cleanFormData1(cleanData, "pleaseSpecifyLanguage");
            setFormData({ ...formData, qualSubject: cleanData });
            hireStepFormRef.current.resetFields();
            setStep((prevStep) => prevStep + 1); // Move to the next step
          } else {
            // Show an error message if no option is selected
            fireToastMessage({
              type: "error",
              message: "Select at least one option",
            });
          }

          // setStep((prevStep) => prevStep + 1);
        })
        .catch((errorInfo) => {
          // Handle validation failure
          fireToastMessage({ type: "error", message: errorInfo });
        });
    }
    if (step == 2) {
      hireStepFormRef.current
        .validateFields()
        .then((values) => {
          if (values.option?.length > 0) {
            // If form is valid, submit it and move to the next step

            setFormData({ ...formData, eduLevel: values });
            hireStepFormRef.current.resetFields();
            setStep((prevStep) => prevStep + 1); // Move to the next step
          } else {
            // Show an error message if no option is selected
            fireToastMessage({
              type: "error",
              message: "Select at least one option",
            });
          }

          // setStep((prevStep) => prevStep + 1);
        })
        .catch((errorInfo) => {
          // Handle validation failure
          fireToastMessage({ type: "error", message: errorInfo });
        });
    }
    if (step == 3) {
      hireStepFormRef.current
        .validateFields()
        .then((values) => {
          if (values.option?.length > 0) {
            // If form is valid, submit it and move to the next step

            setFormData({ ...formData, teachStyle: values });
            hireStepFormRef.current.resetFields();
            setStep((prevStep) => prevStep + 1); // Move to the next step
          } else {
            // Show an error message if no option is selected
            fireToastMessage({
              type: "error",
              message: "Select at least one option",
            });
          }

          // setStep((prevStep) => prevStep + 1);
        })
        .catch((errorInfo) => {
          // Handle validation failure
          fireToastMessage({ type: "error", message: errorInfo });
        });
    }
    if (step == 4) {
      hireStepFormRef.current
        .validateFields()
        .then((values) => {
          if (values.option?.length > 0) {
            // If form is valid, submit it and move to the next step

            setFormData({ ...formData, ava: values });
            hireStepFormRef.current.resetFields();
            setStep((prevStep) => prevStep + 1); // Move to the next step
          } else {
            // Show an error message if no option is selected
            fireToastMessage({
              type: "error",
              message: "Select at least one option",
            });
          }

          // setStep((prevStep) => prevStep + 1);
        })
        .catch((errorInfo) => {
          // Handle validation failure
          fireToastMessage({ type: "error", message: errorInfo });
        });
    }
    if (step == 5) {
      hireStepFormRef.current
        .validateFields()
        .then(async (values) => {
          if (values.option?.length > 0) {
            // If form is valid, submit it and move to the next step

            setCleanData(values);

            if (trueCount > 1) {
              dispatch(
                addOrUpdateAdditionalInfo({
                  key: "tutorPrivateEducator",
                  value: { ...formData, remOrPerson: cleanData },
                })
              );
              if (v.specializedCaregiver) {
                return navigate("/specialCaregiverJob");
              } else if (v.sportsCoaches) {
                return navigate("/sportCoachJob");
              } else if (v.musicInstructor) {
                return navigate("/musicJob");
              } else if (v.swimInstructor) {
                return navigate("/swimJob");
              } else if (v.houseManager) {
                return navigate("/houseManagerJob");
              }
            } else {
              Register();
            }
          } else {
            // Show an error message if no option is selected
            fireToastMessage({
              type: "error",
              message: "Select at least one option",
            });
          }
        })
        .catch((errorInfo) => {
          // Handle validation failure
          fireToastMessage({ type: "error", message: errorInfo });
        });
    }
  };
  const step1Data = [
    {
      name: "Mathematics",
    },
    {
      name: "Science",
    },
    {
      name: "English",
    },
    {
      name: "History",
    },
    {
      name: "Language",
      textArea: "Please Specify Language",
      val: "languageSpecify",
    },
    {
      name: "Computer Science",
    },
  ];
  const step2Data = [
    {
      name: "Elementary",
    },
    {
      name: "Middle School",
    },
    {
      name: "High School",
    },
    {
      name: "College",
    },
  ];
  const step3Data = [
    {
      name: "Lecture-based",
    },
    {
      name: "Interactive",
    },
    {
      name: "One-on-one",
    },
    {
      name: "Group Tutoring",
    },
    {
      name: "Blended Learning",
    },
  ];
  const step4Data = [
    {
      name: "Weekdays",
    },
    {
      name: "Weekends",
    },
    {
      name: "Evenings",
    },
    {
      name: "Flexible",
    },
  ];
  const step5Data = [
    {
      name: "Remote Only",
    },
    {
      name: "In-Person Only",
    },
    {
      name: "Both",
    },
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <HireStep4
            formRef={hireStepFormRef}
            head={"Private Educator/Tutor"}
            data={step1Data}
            checkBox={true}
            subHead1={"What subjects are you qualified to teach?"}
            inputName={"Pleace specify..."}
            textAreaHead={"Other Preferences"}
          />
        );
      case 2:
        return (
          <HireStep4
            formRef={hireStepFormRef}
            head={"Private Educator/Tutor"}
            data={step2Data}
            checkBox={true}
            inputNot={true}
            subHead1={
              "At what educational levels do you have experience teaching?"
            }
          />
        );
      case 3:
        return (
          <HireStep4
            formRef={hireStepFormRef}
            head={"Private Educator/Tutor"}
            data={step3Data}
            checkBox={true}
            subHead1={"What is your teaching style?"}
            inputNot={true}
          />
        );
      case 4:
        return (
          <HireStep4
            formRef={hireStepFormRef}
            head={"Private Educator/Tutor"}
            data={step4Data}
            checkBox={true}
            subHead1={"What is your availability for tutoring sessions?"}
            inputNot={true}
          />
        );
      case 5:
        return (
          <HireStep4
            formRef={hireStepFormRef}
            head={"Private Educator/Tutor"}
            data={step5Data}
            checkBox={true}
            subHead1={
              "Are you able to offer remote learning sessions, or do you only teach in person?"
            }
            inputNot={true}
          />
        );
    }
  };
  const handleGoBack = () => {
    navigate("/joinNow"); // Navigate back in history
  };
  return (
    <>
      <div className="padd-res">
        <div
          className="py-4 px-4"
        >
          <div className="flex justify-end">
            <button onClick={handleGoBack}>
              <CloseOutlined style={{ fontSize: "24px" }} />
            </button>
          </div>
          <div className="flex justify-center">
            <div>
              {renderStepContent()}

              <div className="text-center my-5">
                {step > 1 && (
                  <button
                    style={{ border: "1px solid #38AEE3" }}
                    className="py-2 bg-white rounded-full my-0 mx-6 px-10 text-base font-normal mt-2"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                )}
                {step < 10 && (
                  <button
                    style={{ background: "#85D1F1" }}
                    className="py-2 rounded-full my-0 mx-auto px-6 text-base font-normal transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-700 "
                    onClick={handleNext}
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
