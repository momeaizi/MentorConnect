"use client";
import React, {useEffect, useState} from "react";
import {
  DatePicker, Form, Input,
  Radio, Upload, Skeleton
  ,notification, Modal
} from "antd";
import { PlusOutlined,CloudUploadOutlined,
    CloseCircleOutlined
 } from '@ant-design/icons';
import Button from "@/components/Button";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { RangePicker } = DatePicker;

const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
};

function EditeProfile() {
    const [form] = Form.useForm();
    const [gender, setGender] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectAvatar, setSelectAvatar] = useState<boolean>(true);
    const [preview, setPreview] = useState<boolean>(false);

    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setGender(e.target.checked); 
    //   setPreferredGender(!e.target.checked); 
    };
    
    return (
        <div className="w-full flex flex-col gap-4 ">
            <h1 className="font-bold text-2xl "> Edit Profile:</h1>
            <Form
            form={form}
            variant={"filled"}
            initialValues={{ variant: "filled" }}
            className="w-full"
            >
                <div className="flex justify-center">
                    <div
                        className="photo-modal-profile"
                    >
                        {loading && <Skeleton.Avatar active={true} size={118} shape={'circle'} />}
                    
                        {(preview) ?
                            <img src={preview} alt="Selected Avatar" /> :
                            <img
                                style={{ display: loading ? 'none' : 'block' }}
                                alt="User Avatar"
                            />
                        }
                        {   (loading)?'': (!selectAvatar) ?
                            <CloudUploadOutlined className="upload-icon" />
                            :<CloseCircleOutlined className="upload-icon" />
                        }
                    </div>
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                </div>

                <p className="font-bold text-l pl-3">First Name:</p>
                <Form.Item
                    className="w-full"
                    name="Input"
                    rules={[{ required: true, message: "Please input!" }]}
                >
                    <Input  placeholder="Enter your first name"/>
                </Form.Item>

                <p className="font-bold text-l pl-3">Last Name:</p>
                <Form.Item
                    name="Input"
                    rules={[{ required: true, message: "Please input!" }]}
                >
                    <Input placeholder="Enter your last name" />
                </Form.Item>

                <p className="font-bold text-l pl-3">Email:</p>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>
                <div className='flex justify-between gap-4'> 
                    <div className="w-full">
                        <p className="font-bold text-l pl-3">Username:</p>
                        <Form.Item
                            name="Input"
                            rules={[{ required: true, message: "Please input!" }]}
                            >
                            <Input placeholder="Enter your username" />
                        </Form.Item>
                    </div>      

                    <div className=" w-full">
                        <p className="font-bold text-l pl-3">Birth Date:</p>
                        <Form.Item
                            className="w-full"
                            name="DatePicker"
                            rules={[{ required: true, message: "Please input!" }]}
                        >
                            <DatePicker style={{ width: '100%' }}/>
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
                    />
                </Form.Item>

                {/* Gender Selection */}
                <p className="font-bold text-l pl-3">Gender:</p>
                <Form.Item
                    name="gender"
                    rules={[{ required: true, message: 'Please select your gender!' }]}
                >
                    <Radio.Group onChange={handleGenderChange} defaultValue={gender}>
                    <Radio value={true}>Male</Radio>
                    <Radio value={false}>Female</Radio>
                    </Radio.Group>
                </Form.Item>

                {/* Preferred Gender Selection (Disabled) */}
                <p className="font-bold text-l pl-3">Preferred Gender:</p>
                <Form.Item name="preferredGender">
                    <Radio.Group defaultValue={!gender} value={!gender} disabled>
                    <Radio value={true}>Male</Radio>
                    <Radio value={false}>Female</Radio>
                    </Radio.Group>
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button text="Save Changes" className="w-fit font-bold text-sl p-[8px_20px] rounded-2xl bg-gradient-to-r from-pink-500 to-red-500">
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
                    <Button text="Save Changes" className="w-fit font-bold text-sl p-[8px_20px] rounded-2xl bg-gradient-to-r from-pink-500 to-red-500">
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

export default function ProfilePage() {

  return (
    <div className="w-screen h-full bg-[#232735] flex justify-center p-2 pt-5 overflow-scroll">
        <div className="w-full sm:w-[640px]">
            <EditeProfile />
            <UploadPictures />
            <ChangePassword />
            <Map />
        </div>
    </div>
  );
}
