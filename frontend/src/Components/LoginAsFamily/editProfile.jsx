import { useCallback, useEffect, useState } from "react";
import cameraIcons from "../../assets/images/cameraIcon.png";
import { Form, Input, Checkbox, Select, Button, TimePicker, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { editUserThunk, refreshTokenThunk } from "../Redux/authSlice";
import { fireToastMessage } from "../../toastContainer";
import Avatar from "react-avatar";
import moment from "moment";
import Autocomplete from "react-google-autocomplete";
import { api } from "../../Config/api";
import { formatSentence, toCamelCase } from "../subComponents/toCamelStr";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { TextArea } = Input;
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [selectedChildren, setSelectedChildren] = useState(
    user?.noOfChildren?.length
  );
  const [childrenAges, setChildrenAges] = useState(() => {
    const info = user?.noOfChildren?.info || {};
    const len = user?.noOfChildren?.length || 0;
    return Array.from({ length: len }, (_, i) => info[`Child${i + 1}`] || "");
  });

  const handleChildrenChange = (value) => {
    setSelectedChildren(value);
    // Adjust the age array size based on the selected number of children
    setChildrenAges((prevAges) => {
      const updatedAges = [...prevAges];
      if (value > updatedAges.length) {
        return [...updatedAges, ...Array(value - updatedAges.length).fill("")];
      } else {
        return updatedAges.slice(0, value);
      }
    });
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

  const options5 = [
    "Nanny",
    "Private Educator",
    "Swim Instructor",
    "Specialized Caregiver",
    "Sports Coaches",
    "Music Instructor",
    "House Manager",
  ];
  const formattedServiceLabels =
    user?.services?.map((s) => formatSentence(s)) || [];
  const dispatch = useDispatch();
  useEffect(() => {
    const newValues = {};
    childrenAges.forEach((age, index) => {
      newValues[`Child${index + 1}`] = age;
    });
    form.setFieldsValue(newValues);
  }, [selectedChildren]);
  // Transform the input object
  const onFinish = async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();

      // 🌍 Geocode location
      try {
        const da = await api.get(`/location?address=${location}`);
        if (da?.status === 200) {
          const result = da?.data?.results[0];
          const cor = result?.geometry.location;
          const location1 = {
            type: "Point",
            coordinates: [cor?.lng, cor?.lat],
            format_location: result?.formatted_address,
          };
          formData.append("location", JSON.stringify(location1));

          const zipComponent = result?.address_components?.find((comp) =>
            comp.types.includes("postal_code")
          );
          const zipCodeFromApi = zipComponent?.long_name;

          if (!zipCodeFromApi) {
            return fireToastMessage({
              message:
                "Zip code is not available for the selected location. Please try another location.",
              type: "error",
            });
          }

          setZipCode(zipCodeFromApi);
          if (!values.zipCode && zipCodeFromApi) {
            values.zipCode = zipCodeFromApi;
          }
        }
      } catch (err) {
        return fireToastMessage({
          message: "Please fill proper zip code",
          type: "error",
        });
      }

      // ✅ Append fields
      if (values.fullName) formData.append("name", values.fullName);
      if (values.age) formData.append("age", values.age);
      if (values.description) formData.append("aboutMe", values.description);
      if (values.gender) formData.append("gender", values.gender);
      if (file) formData.append("imageUrl", file);
      if (zipCode) formData.append("zipCode", zipCode);

      // 👶 Append children info
      const childrenInfo = {};
      for (let i = 1; i <= selectedChildren; i++) {
        const ageKey = `Child${i}`;
        if (values[ageKey]) {
          childrenInfo[ageKey] = values[ageKey];
        }
      }

      const noOfChildren = {
        length: Object.keys(childrenInfo).length,
        info: childrenInfo,
      };
      formData.append("noOfChildren", JSON.stringify(noOfChildren));

      // 🧹 Append services
      if (values.services?.length > 0) {
        const camelCaseServices = values.services.map((s) =>
          typeof s === "string" ? toCamelCase(s) : s
        );
        formData.append("services", JSON.stringify(camelCaseServices));
      }

      // 🚀 Dispatch update
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
      // 🔁 Always stop the loading spinner
      setLoading(false);
    }
  };

    const handleZipValidation = async (zip) => {
      if (!zip) return;
  
      setLoading(true);
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
        if (!res.ok) throw new Error("Invalid ZIP");
  
        const data = await res.json();
        const finalZip = data["post code"];
        if (finalZip) {
          setZipCode(finalZip);
          form.setFieldsValue({
            zipCode: finalZip,
          });
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

  useEffect(() => {
    setLocation(user?.location?.format_location || "");
    setZipCode(user?.zipCode || "");
  }, [user]);
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
                name={
                  user?.name
                    ?.split(" ") // Split by space
                    .slice(0, 2) // Take first 1–2 words
                    .join(" ") // Re-join them
                }
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
                      className="border- border-2 py-2 rounded-3xl"
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
                  <h4 className="mb-2 text-xl capitalize Classico">Zip Code</h4>
                  <Form.Item
                    name="zipCode"
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
                        className="p-4 border-none rounded-3xl input-width"
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
              </div>
              <div className="">
                <div>
                  <p className="mt-8 mb-2 font-semibold text-lg capitalize">
                    No. of Child
                  </p>
                  <Form.Item
                    style={{ margin: 0, padding: 0 }}
                    name="totalChild"
                    initialValue={selectedChildren}
                  >
                    <Select
                      defaultValue={selectedChildren}
                      onChange={handleChildrenChange}
                      className="custom-select1 "
                      style={{ width: "200px", borderRadius: "50px" }}
                    >
                      {[1, 2, 3, 4].map((num) => (
                        <Select.Option key={num} value={num}>
                          {num}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <div className="flex flex-wrap gap-x-4 mt-4">
                    {childrenAges.map((age, index) => (
                      <Form.Item
                        key={index}
                        style={{ marginBottom: "16px" }}
                        name={`Child${index + 1}`}
                        initialValue={age}
                      >
                        <p>{`Age of Child ${index + 1}`}</p>
                        <Input
                          type="number"
                          value={age}
                          onChange={(e) => {
                            const updated = [...childrenAges];
                            updated[index] = e.target.value;
                            setChildrenAges(updated);

                            form.setFieldsValue({
                              [`Child${index + 1}`]: e.target.value,
                            });
                          }}
                          placeholder={`Age of Child ${index + 1}`}
                          style={{ borderColor: "#D6DDEB" }}
                          className="border-2 py-2 rounded-3xl w-52"
                        />
                      </Form.Item>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <p className="mt-5 mb-2 font-bold text-2xl capitalize">
                  Description
                </p>
                <Form.Item
                  name="description"
                  initialValue={user?.aboutMe}
                  style={{ margin: 0, padding: 0 }}
                >
                  <TextArea
                    rows={4}
                    defaultValue={user?.aboutMe}
                    placeholder="Write a short description"
                    className="border-2 rounded-xl p-4 !resize-none"
                    style={{ borderColor: "#D6DDEB" }}
                  />
                </Form.Item>
              </div>

              <div>
                <p className="mt-5 mb-2 font-bold text-2xl capitalize">
                  Services for
                </p>
                <Form.Item
                  style={{ margin: 0, padding: 0 }}
                  name="services"
                  initialValue={formattedServiceLabels} // Default checked values for form submission
                >
                  <Checkbox.Group
                    options={options5}
                    defaultValue={formattedServiceLabels} // Set default checked values
                    className="rounded-3xl custom-checkbox-group"
                    style={{ borderColor: "#D6DDEB", margin: 0, padding: 0 }}
                  />
                </Form.Item>
              </div>

              <div className="flex justify-center mt-5">
                <Form.Item className="m-0 p-0">
                  <Button
                    style={{ color: "#38AEE3", border: "1px solid #38AEE3" }}
                    className="bg-[#FFFFFF] rounded-3xl"
                    onClick={() => navigate(-1)}
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
