import { useCallback, useEffect, useState } from "react";
import cameraIcons from "../../assets/images/cameraIcon.png";
import { Form, Input, Checkbox, Select, Button, TimePicker, Spin } from "antd";
import pro from "../../assets/images/s1.png";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "react-avatar";
import moment from "moment";
import { fireToastMessage } from "../../toastContainer";
import { editUserThunk } from "../Redux/authSlice";
import Autocomplete from "react-google-autocomplete";
import { api } from "../../Config/api";

export default function EditProfileNanny() {
  const { TextArea } = Input;
  const { user, isLoading } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [form] = Form.useForm();
  const options = ["english", "bilingual", "spanish", "french", "mandarin"];
  const languageSkills = user?.additionalInfo?.find(
    (info) => info.key === "language"
  )?.value;

  const defaultCheckedValues = languageSkills?.option;

  useEffect(() => {
    if (defaultCheckedValues) {
      form.setFieldsValue({ language: defaultCheckedValues });
    }
  }, [defaultCheckedValues, form]);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const getCurrentLocation = async () => {
      if (!location) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
                import.meta.env.VITE_GOOGLE_KEY
              }`
            );
            const data = await response.json();

            if (data.status === "OK") {
              const address = data.results[0].formatted_address;
              const components = data.results[0].address_components;

              const zipObj = components.find((comp) =>
                comp.types.includes("postal_code")
              );
              const zip = zipObj ? zipObj.long_name : "";

              if (!zip) {
                fireToastMessage({
                  message:
                    "Zip code is not available for the selected location. Please try another location.",
                  type: "error",
                });
                return;
              }

              setLocation(address);
              setZipCode(zip);

              form.setFieldsValue({
                location: address,
                zipCode: zip,
              });

              const { lat, lng } = data.results[0].geometry.location;
              setCoordinates({
                lat,
                lng,
                formatted: address,
              });
            }
          } catch (error) {
            fireToastMessage({
              message: "Failed to fetch location details.",
              type: "error",
            });
          }
        });
      }
    };

    getCurrentLocation();
  }, []);

  const specificDaysAndTime = user?.additionalInfo?.find(
    (info) => info.key === "specificDaysAndTime"
  )?.value;

  // Handle individual day checkbox change

  const handleCheckboxChange = useCallback((day) => {
    setDaysState((prevState) => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        checked: !prevState[day].checked,
      },
    }));
  }, []);

  // Initialize state with `specificDaysAndTime` or empty times as `null`
  const [daysState, setDaysState] = useState(() => {
    return daysOfWeek.reduce((acc, day) => {
      const specificDay = specificDaysAndTime?.[day];
      acc[day] = {
        checked: !!specificDay,
        start: specificDay?.start || null, // Null if no start time exists
        end: specificDay?.end || null, // Null if no end time exists
      };
      return acc;
    }, {});
  });

  const handleTimeChange = (day, field, time) => {
    setDaysState((prevState) => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        [field]: time ? time.toISOString() : null, // Set to ISO string or null
      },
    }));
  };

  const [image, setImage] = useState(user.imageUrl); // Default image
  const [file, setFile] = useState(null);
  // Function to handle image change
  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImage(imageUrl); // Preview the image
      setFile(selectedFile); // Store the file for upload
    }
  };

  const options2 = [
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Occasional", label: "Occasional" },
    { value: "Weekends only", label: "Weekends only" },
    { value: "Nights only", label: "Nights only" },
    { value: "Flexible", label: "Flexible" },
  ]; // Example age options

  const defaultCheckedValues2 = user?.additionalInfo.find(
    (info) => info.key === "avaiForWorking"
  )?.value.option;

  const options3 = [
    { value: "Immediate", label: "Immediate" },
    { value: "Start within 1 month", label: "Start within 1 month" },
    { value: "Flexible start date", label: "Flexible start date" },
  ]; // Example age options

  const defaultCheckedValues3 = user?.additionalInfo.find(
    (info) => info.key === "availability"
  )?.value.option;

  const options4 = [
    { value: "Less than 1 year", label: "Less than 1 year" },
    { value: "1-3 years", label: "1-3 years" },
    { value: "3-5 years", label: "3-5 years" },
    { value: "Over 5 years", label: "Over 5 years" },
  ]; // Example age options

  const defaultCheckedValues4 = user?.additionalInfo.find(
    (info) => info.key === "experience"
  )?.value.option;

  const options5 = [
    "Newborns (0-12 months)",
    "Toddlers (1-3 years)",
    "Preschoolers (3-5 years)",
    "School-age (5-12 years)",
    "Teenagers (12+ years)",
  ];

  const options6 = [
    "Full-Time Hours?",
    "Meal Prep?",
    "Light Housekeeping?",
    "Special needs experience?",
    "Have a car?",
    "Driver's License?",
    "Speak English Fluently?",
    "Speak Spanish Fluently?",
    "Care for a 0-11 years old?",
    "Care for a 1-3 years old?",
    "Care for 4-9 years old?",
    "Care for 10+ years old?",
    "First Aid Certified?",
    "CPR Certified?",
  ];

  const defaultCheckedValues5 = user?.additionalInfo?.find(
    (info) => info.key === "ageGroupsExp"
  )?.value?.option;
  const defaultCheckedValues6 = user?.additionalInfo?.find(
    (info) => info.key === "additionalDetails"
  )?.value?.option;
  const transformObject = (obj) => {
    const additionalInfo = [];
    const keysSet = new Set(); // To track added keys

    // Add existing array properties to additionalInfo
    for (const key in obj) {
      const value = obj[key];

      // Check if the value is an array and has more than 0 elements
      if (Array.isArray(value) && value.length > 0) {
        // Check if any element in the array is defined
        if (value.some((item) => item !== undefined) && !keysSet.has(key)) {
          additionalInfo.push({
            key: key,
            value: {
              option: value,
            },
          });
          keysSet.add(key); // Add key to the set
        }
      }
    }

    // Add additional properties that are not arrays and not undefined
    const additionalProperties = [
      "language",
      "avaiForWorking",
      "availability",
      "experience",
      "ageGroupsExp",
      "additionalDetails",
    ];

    additionalProperties.forEach((prop) => {
      if (obj[prop] !== undefined && obj[prop] !== null) {
        // Check if the property is defined and not null
        // If it's an array, check if it has defined values
        if (
          Array.isArray(obj[prop]) &&
          obj[prop].some((item) => item !== undefined) &&
          !keysSet.has(prop)
        ) {
          additionalInfo.push({
            key: prop,
            value: {
              option: obj[prop],
            },
          });
          keysSet.add(prop); // Add key to the set
        } else if (typeof obj[prop] === "string" && !keysSet.has(prop)) {
          // If it's a string, add it directly
          additionalInfo.push({
            key: prop,
            value: {
              option: obj[prop],
            },
          });
          keysSet.add(prop); // Add key to the set
        }
      }
    });

    // Add languageSkills under specificReqForCaregiver

    return { additionalInfo };
  };

  const handleZipValidation = async (zip) => {
    if (!zip || zip === zipCode) return; // Don't revalidate if unchanged

    setLoading(true);
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) throw new Error("Invalid ZIP");

      const data = await res.json();
      const finalZip = data["post code"];
      if (finalZip) {
        setZipCode(finalZip);
        form.setFieldsValue({ zipCode: finalZip });
      } else {
        throw new Error("Invalid structure");
      }
    } catch (err) {
      setZipCode("");
      form.setFieldsValue({ zipCode: "" });
      fireToastMessage({
        type: "error",
        message: "Invalid ZIP code. Please enter a valid U.S. ZIP.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const transformedObject = transformObject(values);
      const salaryExpObject = {
        key: "salaryExp",
        value: {
          firstChild: values.firstChild,
          secChild: values.secChild,
          thirdChild: values.thirdChild,
          fourthChild: values.fourthChild,
          fiveOrMoreChild: values.fiveOrMoreChild,
        },
      };

      const salaryRange = {
        key: "salaryRange",
        value: {
          min: Number(values.firstChild),
          max: Number(values.fiveOrMoreChild),
        },
      };

      const checkedDays = Object.entries(daysState)
        .filter(([day, data]) => data.checked)
        .reduce((acc, [day, data]) => {
          acc[day] = {
            ...data,
            start: moment(data.start).toISOString(),
            end: moment(data.end).toISOString(),
          };
          return acc;
        }, {});

      const selectedDays = Object.entries(checkedDays);
      if (selectedDays.length === 0) {
        return fireToastMessage({
          type: "error",
          message: "At least one day must be selected.",
        });
      }

      const invalidDays = selectedDays
        .filter(([day, { start, end }]) => {
          const parsedStart = moment(start);
          const parsedEnd = moment(end);
          return (
            !parsedStart.isValid() ||
            !parsedEnd.isValid() ||
            parsedStart.isSame(parsedEnd) ||
            parsedEnd.isBefore(parsedStart)
          );
        })
        .map(([day]) => day);

      if (invalidDays.length > 0) {
        return fireToastMessage({
          type: "error",
          message: `The following selected days have invalid start or end times: ${invalidDays.join(
            ", "
          )}`,
        });
      }

      const specificDaysAndTime = {
        key: "specificDaysAndTime",
        value: checkedDays,
      };

      let addData = transformedObject;
      addData?.additionalInfo.push(
        salaryExpObject,
        specificDaysAndTime,
        salaryRange
      );
      if (values.jobDescription) {
        addData.additionalInfo.push({
          key: "jobDescription",
          value: values.jobDescription,
        });
      }

      const formData = new FormData();

      // ✅ Rely on state values set in onPlaceSelected
      if (!zipCode) {
        return fireToastMessage({
          type: "error",
          message: "Zip code is missing. Please enter a Zip Code.",
        });
      }

      if (coordinates) {
        const location1 = {
          type: "Point",
          coordinates: [coordinates.lng, coordinates.lat],
          format_location: coordinates.formatted,
        };

        formData.append("location", JSON.stringify(location1));
      }
      formData.append("zipCode", zipCode);

      if (values.fullName) formData.append("name", values.fullName);
      if (values.age) formData.append("age", values.age);
      if (values.gender) formData.append("gender", values.gender);
      if (addData)
        formData.append(
          "additionalInfo",
          JSON.stringify(addData.additionalInfo)
        );
      if (file) formData.append("imageUrl", file);

      const { status, user } = await dispatch(editUserThunk(formData)).unwrap();
      if (status === 200) {
        fireToastMessage({
          success: true,
          message: "User updated successfully",
        });
        setLocation(user?.location?.format_location || "");
        setZipCode(user?.zipCode || "");
      } else {
        return fireToastMessage({
          success: false,
          message: "Failed to update user.",
        });
      }
    } catch (error) {
      return fireToastMessage({
        success: false,
        message: "Failed to update user.",
      });
    } finally {
      setLoading(false);
    }
  };

  const salaryExp = user?.additionalInfo?.find(
    (info) => info.key === "salaryExp"
  )?.value;
  useEffect(() => {
    setLocation(user?.location?.format_location || "");
    setZipCode(user?.zipCode || "");
  }, [user]);

  useEffect(() => {
    if (zipCode) {
      form.setFieldsValue({ zipCode });
    }
  }, [zipCode, form]);
  return (
    <div className="padding-navbar1 Quicksand">
      <div className="shadow border-[1px] border-[#D6DDEB] bg-white my-10 rounded-xl">
        <p className="font-bold lg:text-3xl text-2xl edit-padding">
          Edit Profile
        </p>
        <div className="pb-10 padding-sub">
          <div className="relative w-24">
            {/* Profile Picture */}
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="rounded-full w-24 h-24 object-cover"
              />
            ) : (
              <Avatar
                className="rounded-full text-black"
                size="96"
                color={"#38AEE3"}
                name={user.name
                  ?.split(" ") // Split by space
                  .slice(0, 2) // Take first 1–2 words
                  .join(" ")}
              />
            )}

            <label className="right-0 bottom-0 absolute flex justify-center items-center bg-gray-200 rounded-full w-8 h-8 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <img src={cameraIcons} alt="cameraIcons" />
            </label>
          </div>
          <p className="my-5 font-bold text-2xl">My Information</p>
          <div>
            <Form
              onFinish={onFinish}
              autoComplete="off"
              form={form}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // stops Enter from triggering submit
                }
              }}
            >
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="mb-2 font-semibold text-lg capitalize">
                    Full Name
                  </p>
                  <Form.Item
                    style={{ margin: 0, padding: 0 }}
                    name="fullName"
                    initialValue={user?.name}
                  >
                    <Input
                      type="text"
                      style={{ borderColor: "#D6DDEB" }}
                      defaultValue={user?.name}
                      className="border-2 py-2 rounded-3xl"
                    />
                  </Form.Item>
                </div>

                {/* <div>
                  <p className="mb-2 font-semibold text-lg capitalize">
                    Zip Code
                  </p>
                  <Form.Item
                    style={{ margin: 0, padding: 0 }}
                    name="zipCode"

                    initialValue={zipCode}
                  >
                    <Input
                      type="text"
                      style={{ borderColor: "#D6DDEB" }}
                      defaultValue={zipCode}
                      className="border- border-2 py-2 rounded-3xl"
                    />
                  </Form.Item>
                </div> */}
                <div>
                  <p className="mb-2 font-semibold text-lg capitalize">
                    Address
                  </p>
                  <Form.Item
                    name="location"
                    rules={[{ required: true, message: "Address is required" }]}
                  >
                    <Spin spinning={loading} size="small">
                      <Autocomplete
                      className="input-width"
                        apiKey={import.meta.env.VITE_GOOGLE_KEY}
                        style={{
                          width: "100%",
                          borderRadius: "1.5rem",
                          padding: "0.75rem",
                          border: "1px solid #D6DDEB",
                        }}
                        value={location || ""}
                        onPlaceSelected={(place) => {
                          const address = place.formatted_address;
                          const components = place?.address_components || [];

                          const zipObj = components.find((comp) =>
                            comp.types.includes("postal_code")
                          );
                          const zip = zipObj ? zipObj.long_name : "";

                          if (!zip) {
                            fireToastMessage({
                              message:
                                "Zip code is not available for the selected location. Please try another location.",
                              type: "error",
                            });
                            setLocation("");
                            setZipCode("");
                            form.setFieldsValue({ location: "", zipCode: "" });
                            return;
                          }

                          const lat = place?.geometry?.location?.lat();
                          const lng = place?.geometry?.location?.lng();

                          if (lat && lng) {
                            setCoordinates({
                              lat,
                              lng,
                              formatted: address,
                            });
                          }

                          setLocation(address);
                          setZipCode(zip);

                          form.setFieldsValue({
                            location: address,
                            zipCode: zip,
                          });

                          setLoading(false);
                        }}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          setLoading(e.target.value.length > 0);
                        }}
                        onBlur={() => setLoading(false)}
                        options={{
                          types: ["address"],
                          componentRestrictions: { country: "us" },
                        }}
                      />
                    </Spin>
                  </Form.Item>
                </div>

                <div>
                  <h4 className="mb-2 text-xl capitalize Classico">Zip Code</h4>
                  <Form.Item
                    name="zipCode"
                    value={zipCode}
                    rules={[
                      { required: true, message: "ZIP code is required" },
                    ]}
                  >
                    <Spin spinning={loading} size="small">
                      <Input
                        name="zipCode"
                        placeholder="Enter ZIP code"
                        value={zipCode}
                        onChange={(e) => {
                          const zip = e.target.value;
                          setZipCode(zip);
                          form.setFieldsValue({ zipCode: zip });
                        }}
                        onBlur={(e) =>
                          handleZipValidation(e.target.value.trim())
                        }
                        className="border rounded-3xl"
                        maxLength={10}
                      />
                    </Spin>
                  </Form.Item>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-lg capitalize">
                    Gender
                  </p>
                  <Form.Item
                    initialValue={user?.gender}
                    style={{ margin: 0, padding: 0, width: 200 }}
                    name="gender"
                  >
                    <Select
                      style={{
                        borderColor: "#D6DDEB",
                        borderRadius: "100px", // Adjust height
                      }}
                      className="custom-select1 rounded-full w-full"
                      placeholder="Select Gender"
                      defaultValue={user?.gender}
                    >
                      <Select.Option value="Male">Male</Select.Option>
                      <Select.Option value="Female">Female</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-lg capitalize">Age</p>
                  <Form.Item
                    style={{ margin: 0, padding: 0 }}
                    name="age"
                    initialValue={user?.age}
                  >
                    <Input
                      type="number"
                      style={{ borderColor: "#D6DDEB" }}
                      defaultValue={user?.age}
                      className="border- border-2 py-2 rounded-3xl"
                    />
                  </Form.Item>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-lg capitalize">
                    Language
                  </p>
                  <Form.Item
                    style={{ margin: 0, padding: 0 }}
                    name="language"
                    initialValue={defaultCheckedValues} // Default checked values for form submission
                  >
                    <Checkbox.Group
                      options={options}
                      defaultValue={defaultCheckedValues} // Set default checked values
                      className="py-2 rounded-3xl"
                      style={{ borderColor: "#D6DDEB" }}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="">
                <div>
                  <p className="my-5 font-bold text-2xl capitalize">
                    Weekly Schedule
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {daysOfWeek.map((day) => (
                    <div className="flex mb-4" key={day}>
                      <div>
                        <Checkbox
                          checked={daysState[day]?.checked || false}
                          onChange={() => handleCheckboxChange(day)}
                          className="mr-4"
                        >
                          <span className="font-semibold text-lg">{day}</span>
                        </Checkbox>

                        <div className="flex items-center gap-4 mt-2">
                          <TimePicker
                            value={
                              daysState[day].start
                                ? moment(daysState[day].start)
                                : null
                            } // Use moment only if start time exists
                            placeholder="Start"
                            onChange={(time) =>
                              handleTimeChange(day, "start", time)
                            }
                            disabled={!daysState[day].checked}
                            format="h:mm A"
                            className="rounded-lg date-picker1"
                          />
                          <span className="font-medium text-base">to</span>
                          <TimePicker
                            value={
                              daysState[day].end
                                ? moment(daysState[day].end)
                                : null
                            } // Use moment only if end time exists
                            placeholder="End"
                            onChange={(time) =>
                              handleTimeChange(day, "end", time)
                            }
                            disabled={!daysState[day].checked}
                            format="h:mm A"
                            className="rounded-lg date-picker1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="my-5 font-bold text-2xl capitalize">Services</p>
                <div className="flex flex-wrap gap-4">
                  {[
                    "firstChild",
                    "secChild",
                    "thirdChild",
                    "fourthChild",
                    "fiveOrMoreChild",
                  ].map((v, i) => (
                    <div key={v}>
                      <p className="mb-2 font-bold text-lg capitalize Quicksand">
                        {i + 1 === 5
                          ? `${i + 1} Child or more`
                          : `${i + 1} Child`}
                      </p>
                      <Form.Item
                        style={{ margin: 0, padding: 0 }}
                        name={v}
                        initialValue={salaryExp?.[v] || ""} // Safely access property or fallback to an empty string
                      >
                        <Input
                          type="number"
                          style={{ borderColor: "#D6DDEB" }}
                          defaultValue={salaryExp?.[v] || ""} // Safely access property or fallback to an empty string
                          className="border-2 py-2 rounded-3xl"
                        />
                      </Form.Item>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="my-5 font-bold text-2xl capitalize">
                  Resume Details
                </p>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="mb-2 font-semibold text-lg capitalize">
                      Availability
                    </p>
                    <Form.Item
                      style={{ margin: 0, padding: 0 }}
                      name="avaiForWorking"
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                      initialValue={defaultCheckedValues2} // Default selected values for form submission
                    >
                      <Select
                        placeholder="availability"
                        defaultValue={defaultCheckedValues2} // Set default selected values
                        options={options2} // Dropdown options
                        className="rounded-3xl w-48 dropdown-width"
                        style={{ borderColor: "#D6DDEB", borderRadius: "50px" }} // Full width for the dropdown
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold text-lg capitalize">
                      Start
                    </p>
                    <Form.Item
                      style={{ margin: 0, padding: 0 }}
                      name="availability"
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                      initialValue={defaultCheckedValues3} // Default selected values for form submission
                    >
                      <Select
                        placeholder="Start"
                        defaultValue={defaultCheckedValues3} // Set default selected values
                        options={options3} // Dropdown options
                        className="rounded-3xl dropdown-width"
                        style={{ borderColor: "#D6DDEB", borderRadius: "50px" }} // Full width for the dropdown
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold text-lg capitalize">
                      Work Experience
                    </p>
                    <Form.Item
                      style={{ margin: 0, padding: 0 }}
                      name="experience"
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                      initialValue={defaultCheckedValues4} // Default selected values for form submission
                    >
                      <Select
                        placeholder="experience"
                        defaultValue={defaultCheckedValues4} // Set default selected values
                        options={options4} // Dropdown options
                        className="rounded-3xl dropdown-width"
                        style={{ borderColor: "#D6DDEB", borderRadius: "50px" }} // Full width for the dropdown
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div>
                <p className="my-5 font-bold text-2xl capitalize">
                  Age group experince
                </p>
                <Form.Item
                  style={{ margin: 0, padding: 0 }}
                  name="ageGroupsExp"
                  rules={[
                    {
                      required: false,
                      message: "",
                    },
                  ]}
                  initialValue={defaultCheckedValues5} // Default checked values for form submission
                >
                  <Checkbox.Group
                    options={options5}
                    defaultValue={defaultCheckedValues5} // Set default checked values
                    className="rounded-3xl custom-checkbox-group" // Add a custom class
                    style={{ borderColor: "#D6DDEB", margin: 0, padding: 0 }}
                  />
                </Form.Item>
              </div>

              <div>
                <p className="mt-5 mb-3 font-bold text-2xl capitalize">
                  Description
                </p>
                <Form.Item
                  style={{ margin: 0, padding: 0 }}
                  name="jobDescription"
                  initialValue={
                    user?.additionalInfo.find(
                      (info) => info.key === "jobDescription"
                    )?.value
                  }
                  rules={[
                    {
                      required: false,
                      message: "",
                    },
                  ]}
                >
                  <p className="font-semibold text-lg">About me</p>
                  <TextArea
                    placeholder="Enter detail"
                    defaultValue={
                      user?.additionalInfo.find(
                        (info) => info.key === "jobDescription"
                      )?.value
                    }
                    rows={6} // Specify the number of rows (height) for the textarea
                    className="py-2 rounded-3xl"
                    style={{
                      borderColor: "#D6DDEB",
                      width: "100%",
                      resize: "none",
                    }} // Full width for the textarea
                  />
                </Form.Item>
              </div>

              <div>
                <p className="my-5 font-bold text-2xl capitalize">
                  Additional Details
                </p>
                <Form.Item
                  style={{ margin: 0, padding: 0 }}
                  name="additionalDetails"
                  initialValue={defaultCheckedValues6} // Default checked values for form submission
                >
                  <Checkbox.Group
                    options={options6}
                    defaultValue={defaultCheckedValues6} // Set default checked values
                    className="rounded-3xl custom-checkbox-group" // Add a custom class
                    style={{ borderColor: "#D6DDEB", margin: 0, padding: 0 }}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-center mt-10">
                <Form.Item className="m-0 p-0">
                  <Button
                    style={{ color: "#38AEE3", border: "1px solid #38AEE3" }}
                    className="bg-[#FFFFFF] rounded-3xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    loading={loading}
                    htmlType="submit"
                    className="bg-[#38AEE3] ml-4 px-6 rounded-3xl text-white"
                  >
                    Save
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
