import React, {useEffect, useState, useRef} from "react";
import {
  DatePicker, Form, Input,
  Radio, Upload, Skeleton
  ,notification, Select
} from "antd";
import { PlusOutlined,CheckCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import Button from "../components/Button";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../assets/styles/globals.css';
import api from "../services/api";
import { useAuth } from "../providers/AuthProvider";

const { Option } = Select

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
    gender: boolean;
    birthDate: any;
    latitude:number;
    longitude:number;
    selectedInterests:number[];
}
  
export async function postData(data: ProfileData, openNotification:any, setUpdateLoading:any) {
    try {
        const response = await api.patch('profiles/', {
            "first_name": data?.firstName,
            "last_name": data?.lastName,
            "email": data?.email,
            "username": data?.username,
            "bio": data?.bio,
            "gender": data?.gender,
            "birth_date": data?.birthDate,
            "latitude": data?.latitude,
            "longitude": data?.longitude,
            'interests':data?.selectedInterests
        })



        return await response.data.access_token;
    } catch (error) {
        setUpdateLoading(false)

        openNotification('Error posting data', <InfoCircleOutlined style={{ color: 'red' }}/>)

        console.error('Error posting data:', error);
        throw error;
    }
}

export async function postImage(formData: any) {
    try {
        const response = await api.post('profiles/picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log("----> ", response)
    } catch (error) {
        console.error("----> ", error)
    }
}

export async function postImages(formData: any, openNotification:any) {
    try {
        const response = await api.post('profiles/pictures', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        openNotification("Upload successful", <CheckCircleOutlined style={{ color: 'green' }}/>)

        return response;
    } catch (error) {
        openNotification("Upload failed", <InfoCircleOutlined style={{ color: 'red' }}/>)
        console.error("----> ", error)
    }
}
export async function getImage(fileName:string, setSelectAvatar:any ,setLoading:any) {
    api.get(`profiles/get_image/${fileName}`, { responseType: 'blob' })
    .then((response:any) => {
        const fileUrl = URL.createObjectURL(response.data);
        setSelectAvatar(fileUrl)
        setLoading(false);
    })
    .catch((error:any) => {
        console.error('Error fetching profile data:', error);
    });
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const LeafletMap = ({userPosition, setUserPosition, position, setPosition}:any) => {
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
            if (!position && !userPosition) {
                setUserPosition(  [32.253672, -8.982608]);
                setPosition(  [32.253672, -8.982608]);
            }
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
      click(e:any) {
        if (isPermissionDenied) {
          const { lat, lng } = e.latlng;
          setUserPosition([lat, lng]);
          setPosition([lat, lng]);
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
      {userPosition && position && <MapContainer center={position} zoom={13} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='mskerba'
        />
        <LocationMarker />
      </MapContainer>}
    </div>
  );
};


function Map({userPosition, setUserPosition, position, setPosition}:any) {
    return (
        <div className="w-full flex flex-col gap-4 ">
            <h1 className="font-bold text-2xl "> User Location Map:</h1>
            <LeafletMap userPosition={userPosition} setUserPosition={setUserPosition} position={position} setPosition={setPosition}/>
        </div>
    )
}

const fetchProfiles = async () => {
    try {
        const res = await api.get('/interests/');
        return res.data;
    } catch (error) {
        return [];
    }
}

function EditProfile({profileData}:any) {
    const [form] = Form.useForm();
    const [gender, setGender] = useState<boolean>(profileData?.gender);
    const [loading, setLoading] = useState<boolean>(true);
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const [selectAvatar, setSelectAvatar] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [api, contextHolder] = notification.useNotification();
    const [file, setFile] = useState<any>(null);
    const fileInputRef = useRef<any>(null);
    const {login} = useAuth();

    // New state variables for form fields
    const [firstName, setFirstName] = useState<string>(profileData?.first_name);
    const [lastName, setLastName] = useState<string>(profileData?.last_name);
    const [email, setEmail] = useState<string>(profileData?.email);
    const [username, setUsername] = useState<string>(profileData?.username);
    const [birthDate, setBirthDate] = useState();
    const [bio, setBio] = useState<string>(profileData?.bio);
    const [allInterests, setAllInterests] = useState<string[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [defaultInterests, setDefaultInterests] = useState<string[] | null>(null);


    useEffect(() => {
        const loadData = async () => {
            const fetchInterests = await fetchProfiles();
            setAllInterests(fetchInterests);
        }
        loadData();
    }, [])


    // User position
    const defaultPosition: [number, number] | null = null;
    const lat = Number(profileData?.latitude);
    const defPosition: [number, number] | []|null = lat
        ? [Number(profileData.latitude), Number(profileData.longitude)]
        : defaultPosition; 
    const [userPosition, setUserPosition] = useState<[number, number]|null>(defPosition);
    const [position, setPosition] = useState<[number, number]|null>(defPosition);
    
    const openNotification = (message:string, icon:any) => {
        api.open({
          message: message,
          icon: icon,
        });
    };
    
    useEffect(()=>{
        console.log(userPosition);
    },[userPosition]);

    const handleGenderChange = (e: React.ChangeEvent) => {
        const newGender: boolean = (e.target.value == true) ?true:false;
        setGender(newGender);
    };

    async function handleSubmitProfile(e:any) {
        const file = e.target.files[0];
        setFile(file)

        setLoading(false)
        setPreview(URL.createObjectURL(file));

    };


    useEffect(() => {
        form.setFieldsValue({ "preferredGender": !gender });
    }, [gender, form]);

    useEffect(() => {
        form.setFieldsValue({ "username": username });
    }, [username, form]);

    useEffect(() => {
        if (profileData?.interests) {
            setDefaultInterests(profileData?.interests.filter((interest: string | null) => (interest)));
            setSelectedInterests(profileData?.interests.filter((interest: string | null) => (interest)));
        } else 
            setDefaultInterests([])

        if (profileData?.file_name) {
            getImage(profileData?.file_name, setSelectAvatar, setLoading);
        }

        if (profileData?.username) {
            form.setFieldsValue({ "username": profileData?.username });
            setUsername(profileData?.username);
        }
        
        if (profileData?.birth_date) {
            form.setFieldsValue({ "birthDate": dayjs(profileData.birth_date) });
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

        if (profileData) {
            setGender(profileData?.gender);
            form.setFieldsValue({ "gender": profileData?.gender });
        }
    }, [profileData]);

    const handleChangeDate = (date: any) => {
        const dateOnly = date?.$d.toISOString().split('T')[0];
        setBirthDate(dateOnly)
    }

    const handleSubmit = async () => {
        try {
            let latitude:any = 0;
            let longitude:any = 0;
            if (userPosition) {
                latitude = userPosition[0];
                longitude = userPosition[1];
            }

            const isValid = !!firstName &&
            !!lastName &&
            !!email &&
            !!username &&
            !!birthDate &&
            !!bio &&
            bio.length >= 10 &&
            bio.length <= 250 &&
            (preview || selectAvatar) &&
            latitude && 
            longitude &&
            selectedInterests.length;
 
            if (isValid) { 
                setUpdateLoading(true)
                const access_token = await postData({
                    firstName,
                    lastName,
                    email,
                    username,
                    bio,
                    gender,
                    birthDate,
                    latitude,
                    longitude,
                    selectedInterests
                }, openNotification, setUpdateLoading);
                if (file != null) {
                    const data = new FormData();
                    data.append('profile', file);
                    await postImage(data);
                }
                if (access_token)
                    login(access_token)
                setUpdateLoading(false)
                openNotification("The profile is updated", <CheckCircleOutlined style={{ color: 'green' }}/>)
            }
            else 
                openNotification("All fields is requiered", <InfoCircleOutlined style={{ color: 'red' }}/>)
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      };

    return (
        <div className="w-full flex flex-col gap-4">
            {contextHolder}
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
                        ) : (selectAvatar)?(
                        <img
                            style={{ display: loading ? 'none' : 'block' }}
                            alt="User Avatar"
                            src={selectAvatar}
                        />
                        ):''}
                        <input
                            id="avatarInput"
                            ref={fileInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleSubmitProfile}
                        />
                    </div>
                </div>

                <p className="font-bold text-l pl-3">First Name:</p>
                <Form.Item
                    name="firstName"
                    rules={[{ required: true, message: "Please input your first name!" }]}
                >
                    <Input
                        className='h-[40px]'
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
                        className='h-[40px]' 
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
                        className='h-[40px]'
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
                                className='h-[40px]'
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                // onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Item>
                    </div>      

                        <div className="w-full">
                        <p className="font-bold text-l pl-3">Birth Date:</p>
                        { profileData &&
                        <Form.Item
                            name="birthDate"
                            rules={[{ required: true, message: "Please input your birth date!" }]}
                            // initialValue={dayjs(birthDate)}
                        >
                            <DatePicker
                                className='h-[40px]'
                                style={{ width: '100%' }}
                                value={birthDate ? dayjs(birthDate) : null}
                                onChange={(date)=>{handleChangeDate(date)}}
                            />
                        </Form.Item>}
                    </div>
                </div>
                <Form.Item 
                    name="interests"
                >
                    {defaultInterests&& <Select
                        mode="multiple"
                        placeholder="Select interests"
                        style={{ width: '100%' }}
                        value={selectedInterests}
                        defaultValue={defaultInterests}
                        onChange={setSelectedInterests}
                    >
                        {allInterests.map(interest => (
                            <Option key={interest.id} value={interest.id}>{interest.interest}</Option>
                        ))}
                    </Select> }
                </Form.Item>
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
                    <Map userPosition={userPosition} setUserPosition={setUserPosition} position={position} setPosition={setPosition}/>
                </Form.Item>
                
                <Form.Item>
                    <Button
                        text="Save Changes"
                        className="w-fit font-bold text-sl p-[8px_20px] rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 cursor-pointer"
                        disabled={updateLoading}
                        onclick={handleSubmit}
                    >
                    </Button>
                </Form.Item>

            </Form>
        </div>
    );
}


function UploadPictures({profileData}:any) {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [api, contextHolder] = notification.useNotification();

    const handleChange = ({ fileList }: any) => setFileList(fileList);
  
    const beforeUpload = () => {
        if (fileList.length >= 5)
            return false;
        return true;
    };

    const openNotification = (message:string, icon:any) => {
        api.open({
          message: message,
          icon: icon,
        });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        fileList.forEach((file, index) => {
            formData.append(`picture${index + 1}`, file.originFileObj);
        });

        setUpdateLoading(true)
        try {
            const response:any = await postImages(formData, openNotification)
            if (response) {
                if (response?.ok) {
                    const result = await response.json();
                    console.log('Upload successful:', result);
                    
                    openNotification("Upload successful", <CheckCircleOutlined style={{ color: 'green' }}/>)
                    
                setFileList([]);
                } else {
                    console.error('Upload failed:', await response.text());
                }
            }
        } catch (error) {
            console.error('Error during upload:', error);
        }
        setUpdateLoading(false)
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const preloadImages = async (imageNames: string[]) => {
        const files =  imageNames.map(async (fileName) => {
            try {
                setLoading(true);
                const url = `http://localhost:5000/api/profiles/get_image/${fileName}`;
                return {
                    uid: fileName,
                    name: 'default.png',
                    status: 'done',
                    url: url,
                };
            } catch (error) {
                console.error(`Error loading image ${fileName}:`, error);
                return null;
            }
        });
        const loadedImages = (await Promise.all(files)).filter(Boolean);
        setFileList([...loadedImages]);
    };

    useEffect(()=>{
        form.setFieldsValue({ "pictures": fileList });
        
    },[fileList])
    
    useEffect(()=>{
        if (profileData?.images_name && loading)
            preloadImages(profileData.images_name);
        setLoading(false)
    },[profileData])

    return (
        <div className="w-full flex flex-col gap-4">
            {contextHolder}
            <h1 className="font-bold text-2xl"> Pictures:</h1>
            <Form
                form={form}
                variant="filled"
                initialValues={{ variant: "filled" }}
                className="w-full"
                onFinish={handleSubmit}
            >
                {!loading&&<Form.Item 
                    name="pictures"
                    valuePropName="fileList" 
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: 'Please upload at least one image!' }]}
                >
                    <Upload
                        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                        beforeUpload={beforeUpload}
                        maxCount={5}
                        accept="image/*"
                        showUploadList={{
                            showPreviewIcon: false,
                            showRemoveIcon: true,
                        }}
                        onRemove={(file) => {
                            setFileList((prevFileList) => prevFileList.filter((f) => f.uid !== file.uid));
                        }}
                    >
                        {fileList.length < 5 && (
                            <button style={{ border: 0, background: 'none' }} type="button">
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </button>
                        )}
                    </Upload>
                </Form.Item>}

                <Form.Item>
                    <Button

                        disabled={updateLoading}
                        onclick={handleSubmit}
                        text="Save Changes" className="w-fit font-bold text-sl p-[8px_20px] rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 cursor-pointer">
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

async function updatePassword(data: any) {
    try {
        await api.patch('auth/update-password', {
            password: data?.password,
            new_password: data?.new_password,
        });
        return 200;
    } catch (error: any) {
        return 400;
    }
}

function ChangePassword() {
    const [form] = Form.useForm();
    const [password, setPassword] = useState<string>();
    const [newPassword, setNewPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (message:string, icon:any) => {
        api.open({
          message: message,
          icon: icon,
        });
    };

    const handleSubmit = async() => {
        if (password && newPassword && confirmPassword) {
            if (newPassword === confirmPassword) {
                const code = await updatePassword({"password": password, "new_password": newPassword});

                if (code == 400)
                    openNotification("Password is wrong", <InfoCircleOutlined style={{ color: 'red' }}/>)
                else {

                    setPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    form.setFieldsValue({ "password": '' });
                    form.setFieldsValue({ "new-password": '' });
                    form.setFieldsValue({ "conf-password": '' });
                    openNotification("The password is updated", <CheckCircleOutlined style={{ color: 'green' }}/>)
                }
            }
            else
                openNotification("Passwords do NOT match", <InfoCircleOutlined style={{ color: 'red' }}/>)
        }
        else
            openNotification("All fields is requiered", <InfoCircleOutlined style={{ color: 'red' }}/>)

    }
    
    return (
        <div className="w-full flex flex-col gap-4 ">

            {contextHolder}
            <h1 className="font-bold text-2xl "> Change Password:</h1>
            <Form
                form={form}
                variant={"filled"}
                initialValues={{ variant: "filled" }}
                className="w-full"
            >

                <p className="font-bold text-l pl-3">Password:</p>
                <Form.Item name="password" rules={[{ required: true }]}>
                    <Input.Password 
                        className='h-[40px]'
                        value={password}
                        onChange={(e:any) => setPassword(e.target.value)}
                    />
                </Form.Item>

                <p className="font-bold text-l pl-3">New Password:</p>
                <Form.Item name="new-password" rules={[{ required: true }]}>
                    <Input.Password
                        className='h-[40px]'
                        value={newPassword}
                        onChange={(e:any) => setNewPassword(e.target.value)}
                    />
                </Form.Item>

                {/* Field */}

                <p className="font-bold text-l pl-3">Confirm Password:</p>
                <Form.Item
                    name="conf-password"
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
                    <Input.Password
                        className='h-[40px]'
                        value={confirmPassword}
                        onChange={(e:any) => setConfirmPassword(e.target.value)}
                        />
                </Form.Item>
                
                {/* Submit Button */}
                <Form.Item>
                    <Button
                        onclick={handleSubmit}
                        text="Save Changes"
                        className="w-fit font-bold text-sl p-[8px_20px] rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 cursor-pointer"
                    >
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}


function fetchData() {
    return  api.get('profiles/')
        .then((response: any) => {
          return response.data;
        })
        .catch((error: any) => {
            console.log('Error fetching data:', error);
            throw error;
        });
}
  
export default function ProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        const getProfile = async () => {
          try {
            const profile = await fetchData();
            setProfileData(profile?.data);
          } catch (error) {
            console.error('Failed to fetch the profile:', error);
          }
          setLoading(false);
        };
    
        getProfile();
      }, []);
      

  return (
    <div className="w-screen h-full bg-[#232735] flex justify-center p-2 pt-5 overflow-y-scroll overflow-x-hidden">
        {!loading && <div className="w-screen sm:w-[640px]">
            <EditProfile profileData={profileData} />
            <UploadPictures profileData={profileData} />
            <ChangePassword />
        </div>}
    </div>
  );
}