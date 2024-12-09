"use client";
import React, {useEffect, useState} from "react";
import {
  DatePicker, Form, Input,
  Radio, Upload, Skeleton
  ,notification
} from "antd";
import { PlusOutlined,CloudUploadOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import Button from "@/components/Button";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/app/globals.css';


const normFile = (e: any) => {
    if (Array.isArray(e))
      return e;
    return e?.fileList;
};

const handleImageClick = () => {
    const fileInput = document.getElementById('avatarInput');
    if (fileInput) {
      fileInput.click();
    }
};


interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    bio: string;
  }
  
  export async function postData(data: ProfileData) {
    try {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++")
        const response = await axios.patch('http://localhost:5000/api/profiles/', { 
            "first_name": data?.firstName,
            "last_name": data?.lastName,
            "email": data?.email,
            "username": data?.username,
            "bio": data?.bio })
            console.log("++++++++++++++++++++", response,"++++++++++++++++++++++++++++")

    //   const response = await fetch('http://localhost:5000/api/profiles/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       first_name: data.firstName,
    //       last_name: data.lastName,
    //       email: data.email,
    //       username: data.username,
    //       bio: data.bio
    //     }),
    //   });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }
  
function EditProfile({profileData}:any) {
    const [form] = Form.useForm();
    const [gender, setGender] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectAvatar, setSelectAvatar] = useState<boolean>(true);
    const [preview, setPreview] = useState<string | null>(null);
    const [formValid, setFormValid] = useState<boolean>(false);

    // New state variables for form fields
    const [firstName, setFirstName] = useState<string>(profileData?.first_name);
    const [lastName, setLastName] = useState<string>(profileData?.last_name);
    const [email, setEmail] = useState<string>(profileData?.email);
    const [username, setUsername] = useState<string>("");
    const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
    const [bio, setBio] = useState<string>(profileData?.bio);




    
    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGender(e.target.value);
    };
    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleBirthDateChange = (date: any) => {
        setBirthDate(date);
    };

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(e.target.value);
    };
    


    const handleAvatarChange = async (e) => {
        setLoading(true);
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreview(event?.target?.result);
          setLoading(false)
          setSelectAvatar(false);
        };
        reader.readAsDataURL(file);
        //Further actions with the file can be added here.
    };

    useEffect(() => {
        form.setFieldsValue({ "preferredGender": !gender });
    }, [gender, form]);

    useEffect(() => {
        form.setFieldsValue({ "username": username });
        setUsername(profileData?.username);
    }, [username, form]);

    useEffect(() => {

        if (profileData?.username) {
            form.setFieldsValue({ "username": profileData?.username });
            setUsername(profileData?.username);
        }

        if (profileData?.birth_date) {
            form.setFieldsValue({ "username": profileData?.birth_date });
            setBirthDate(profileData?.birth_date);
        }

        if (profileData?.first_name) {
            setFirstName(profileData?.first_name);
            form.setFieldsValue({ "firstName": profileData?.first_name });
        }

        if (profileData?.last_name) {
            setLastName(profileData?.last_name);
            form.setFieldsValue({ "lastName": profileData?.last_name });
        }

        if (profileData?.bio) {
            setBio(profileData?.bio);
            form.setFieldsValue({ "bio": profileData?.bio });
        }

        if (profileData?.email) {
            setEmail(profileData?.email);
            form.setFieldsValue({ "email": profileData?.email });
        }

        if (profileData?.gender) {
            setGender(profileData?.gender);
            form.setFieldsValue({ "gender": profileData?.gender });
        }
    }, [profileData]);

    useEffect(() => {
        // Check if all required fields are filled
        const isValid = 
            !!firstName &&
            !!lastName &&
            !!email &&
            !!username &&
            !!birthDate &&
            !!bio &&
            bio.length >= 10 &&
            bio.length <= 250 &&
            !selectAvatar;
        console.log('SelectAvatar:---->', (firstName && true), (lastName && true), (email && true), (username && true), (birthDate && true), (bio && true), (selectAvatar && true))
        setFormValid(isValid);
    }, [firstName, lastName, email, username, birthDate, bio]);

    const handleSubmit =  () => {
        
        try {
          const result = postData({
            firstName,
            lastName,
            email,
            username,
            bio
          });
          console.log('Form submitted successfully:', result);
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      };


    return (
        <div className="w-full flex flex-col gap-4">
            <h1 className="font-bold text-2xl"> Edit Profile:</h1>
            <Form
                form={form}
                variant="filled"
                initialValues={{ variant: "filled" }}
                className="w-full"
                // onFinish={handleSubmit}
            >
                <div className="flex justify-center">
                    <div className="photo-modal-profile" onClick={handleImageClick}>
                        {loading && <Skeleton.Avatar active={true} size={118} shape={'circle'} />}
                        {preview ? (
                        <img src={preview} alt="Selected Avatar" />
                        ) : (
                        <img
                            style={{ display: loading ? 'none' : 'block' }}
                            alt="User Avatar"
                        />
                        )}
                        {!loading && (
                        selectAvatar ? (
                            <CloudUploadOutlined className="upload-icon" />
                        ) : (
                            <CloseCircleOutlined className="upload-icon" onClick={(e) => {
                            e.stopPropagation();
                            setSelectAvatar(true);
                            setPreview(null);
                            }} />
                        )
                        )}
                        <input
                            id="avatarInput"
                            type="file"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </div>
                </div>

                <p className="font-bold text-l pl-3">First Name:</p>
                <Form.Item
                    name="firstName"
                    rules={[{ required: true, message: "Please input your first name!" }]}
                >
                    <Input 
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </Form.Item>

                <p className="font-bold text-l pl-3">Last Name:</p>
                <Form.Item
                    name="lastName"
                    rules={[{ required: true, message: "Please input your last name!" }]}
                >
                    <Input 
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e:any) => setLastName(e.target.value)}
                    />
                </Form.Item>

                <p className="font-bold text-l pl-3">Email:</p>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                >
                    <Input 
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Item>

                <div className='flex justify-between gap-4'> 
                    <div className="w-full">
                        <p className="font-bold text-l pl-3">Username:</p>
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: "Please input your username!" }]}
                        >
                            <Input 
                                onChange={handleUsernameChange}
                                placeholder="Enter your username"
                                value={username}
                                // onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Item>
                    </div>      

                    <div className="w-full">
                        <p className="font-bold text-l pl-3">Birth Date:</p>
                        <Form.Item
                            name="birthDate"
                            rules={[{ required: true, message: "Please input your birth date!" }]}
                        >
                            <DatePicker 
                                style={{ width: '100%' }}
                                value={birthDate}
                                onChange={(date) => setBirthDate(date)}
                            />
                        </Form.Item>
                    </div>
                </div>
                
                <p className="font-bold text-l pl-3">Bio:</p>
                <Form.Item
                    name="bio"
                    rules={[
                        { required: true, message: 'Please input your bio!' },
                        { min: 10, message: 'Bio must be at least 10 characters long!' },
                        { max: 250, message: 'Bio cannot exceed 250 characters!' },
                    ]}
                >
                    <Input.TextArea
                        placeholder="Write a short bio... (max 250 characters)"
                        rows={4}
                        maxLength={250}
                        showCount
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </Form.Item>

                <p className="font-bold text-l pl-3">Gender:</p>
                <Form.Item
                    initialValue={gender}
                    name="gender"
                    rules={[{ required: true, message: 'Please select your gender!' }]}
                >
                    <Radio.Group onChange={handleGenderChange} value={gender}>
                        <Radio value={true}>Male</Radio>
                        <Radio value={false}>Female</Radio>
                    </Radio.Group>
                </Form.Item>

                <p className="font-bold text-l pl-3">Preferred Gender:</p>
                <Form.Item name="preferredGender" initialValue={!gender}>
                    <Radio.Group disabled>
                        <Radio value={true}>Male</Radio>
                        <Radio value={false}>Female</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item>
                    <Button
                        text="Save Changes"
                        className="w-fit font-bold text-sl p-[8px_20px] rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 cursor-pointer"
                        disabled={!formValid}
                        onclick={handleSubmit}
                    >
                    </Button>
                </Form.Item>

            </Form>
        </div>
    );
}


function UploadPictures() {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);

    const handleChange = ({ fileList }: any) => setFileList(fileList);
  
    const beforeUpload = (file: any) => {
      if (fileList.length >= 5)
        return false;
      return true;
    };

    return (
        <div className="w-full flex flex-col gap-4 ">
            <h1 className="font-bold text-2xl "> Pictures:</h1>
            <Form
                form={form}
                variant={"filled"}
                initialValues={{ variant: "filled" }}
                className="w-full"
            >

                <Form.Item valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload
                        action="/upload.do"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                        beforeUpload={beforeUpload}
                        onPreview={(file) => {
                        // handle preview of the image if necessary
                        }}
                        onRemove={(file) => {
                        // This ensures the state is updated when a file is removed
                        setFileList((prevFileList) => prevFileList.filter((f) => f.uid !== file.uid));
                        }}
                    >
                        <button style={{ border: 0, background: 'none' }} type="button">
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button
                        text="Save Changes" className="w-fit font-bold text-sl p-[8px_20px] rounded-2xl bg-gradient-to-r from-pink-500 to-red-500">
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

function ChangePassword() {
    const [form] = Form.useForm();
    
    return (
        <div className="w-full flex flex-col gap-4 ">
            <h1 className="font-bold text-2xl "> Change Password:</h1>
            <Form
                form={form}
                variant={"filled"}
                initialValues={{ variant: "filled" }}
                className="w-full"
            >

                <p className="font-bold text-l pl-3">Password:</p>
                <Form.Item name="actual-password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>

                <p className="font-bold text-l pl-3">New Password:</p>
                <Form.Item name="password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>

                {/* Field */}

                <p className="font-bold text-l pl-3">Confirm Password:</p>
                <Form.Item
                    name="password2"
                    dependencies={['password']}
                    rules={[
                    {
                        required: true,
                    },
                    ({ getFieldValue }:any) => ({
                        validator(_, value:any) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('The new password that you entered do not match!'));
                        },
                    }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                
                {/* Submit Button */}
                <Form.Item>
                    <Button text="Save Changes" className="w-fit font-bold text-sl p-[8px_20px] rounded-2xl bg-gradient-to-r from-pink-500 to-red-500">
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const LeafletMap = () => {
  const [position, setPosition] = useState([32.253672, -8.982608]);
  const [userPosition, setUserPosition] = useState(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserPosition([latitude, longitude]);
          setPosition([latitude, longitude]);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setIsPermissionDenied(true);
            // notification.warning({
            //   message: 'Location Permission Denied',
            //   description: 'Please click on the map to set your location manually.',
            // });
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      console.error('Geolocation not supported');
    }
  }, []);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        if (isPermissionDenied) {
          const { lat, lng } = e.latlng;
          setUserPosition([lat, lng]);
          setPosition([lat, lng]);
          notification.success({
            message: 'Location Set',
            description: `You clicked at Latitude: ${lat}, Longitude: ${lng}.`,
          });
        }
      },
    });

    return userPosition ? (
      <Marker position={userPosition}>
        <Popup>
          {isPermissionDenied
            ? 'Manually selected location.'
            : 'Your current location.'}
        </Popup>
      </Marker>
    ) : null;
  };

  return (
    <div className="w-full h-96">
      <MapContainer center={position} zoom={13} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};


function Map() {
    return (
        <div className="w-full flex flex-col gap-4 ">
            <h1 className="font-bold text-2xl "> User Location Map:</h1>
            <LeafletMap />
            <Button text="Save Changes" className="w-fit font-bold text-sl p-[8px_20px] rounded-2xl bg-gradient-to-r from-pink-500 to-red-500">
            </Button>
        </div>
    )
}

function fetchData() {
    return  axios.get('http://localhost:5000/api/profiles/')
        .then((response: any) => {
          return response.data;
        })
        .catch((error: any) => {
            console.log('Error fetching data:', error);
            throw error;
        });
}
  
export default function ProfilePage() {
    const [profileData, setProfileData] = useState(null)

    useEffect(() => {
        const getProfile = async () => {
          try {
            const profile = await fetchData();
            console.log(profile?.data);
            setProfileData(profile?.data);
          } catch (error) {
            console.error('Failed to fetch the profile:', error);
          }
        };
    
        getProfile();
      }, []);
      

  return (
    <div className="w-screen h-full bg-[#232735] flex justify-center p-2 pt-5 overflow-scroll">
        <div className="w-full sm:w-[640px]">
            <EditProfile profileData={profileData} />
            <UploadPictures />
            <ChangePassword />
            <Map />
        </div>
    </div>
  );
}
