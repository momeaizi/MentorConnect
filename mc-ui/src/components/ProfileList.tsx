import React, { useState, useEffect } from 'react'
import { Card, Select, Slider, Button, Tag, List, Radio, notification, Skeleton } from 'antd'
import { HeartIcon, MapPinIcon, StarIcon, ArrowUpIcon, ArrowDownIcon, Calendar, FlagIcon } from 'lucide-react'
import { Img } from 'react-image';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { isAxiosError } from '../types/api';
import { CloseCircleFilled } from '@ant-design/icons';
import NoProfiles from './NoProfiles';


const { Option } = Select

interface Profile {
    id: number;
    username: string;
    distance: number;
    firstName: string;
    lastName: string;
    age: number;
    fameRating: number;
    interests: string[];
    commonInterestsCount: number;
    image: string;
    gender: string;
    isFlagged: boolean;
    likeStatus: string;
    isRemoving: boolean;
}



const ProfileList: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);

    const [allInterests, setAllInterests] = useState<string[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    // sliders states
    const [minAge, setMinAge] = useState<number>(18);
    const [maxAge, setMaxAge] = useState<number>(100);
    const [ageRange, setAgeRange] = useState<[number, number]>([minAge, maxAge]);
    const [minDistance, setMinDistance] = useState<number>(0);
    const [maxDistance, setMaxDistance] = useState<number>(500);
    const [distanceRange, setDistanceRange] = useState<[number, number]>([minDistance, maxDistance]);
    const [maxFameRating, setMaxFameRating] = useState<number>(100);
    const [fameRange, setFameRange] = useState<[number, number]>([0, maxFameRating]);

    // sort states
    const [sortCriteria, setSortCriteria] = useState<string>('distance');
    const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');


    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const navigate = useNavigate();
    const [notifApi, contextHolder] = notification.useNotification();

    const openNotification = (message: string, icons: any) => {
        notifApi.open({
            message: message,
            icon: icons
        });
    };




    useEffect(() => {
        fetchProfiles();
    }, [])



    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const res = await api.get('/profiles/suggestions');
            const fetchedProfiles = res.data?.map((item: any) => ({
                id: item.id,
                firstName: item.first_name,
                lastName: item.last_name,
                age: Math.floor(item.age),
                fameRating: item.fame_rating,
                interests: item.interests?.filter((interest: string | null) => (interest)),
                image: (item.image) ? `http://localhost:7777/api/profiles/get_image/${item.image}` : null,
                gender: item.gender,
                distance: Math.floor(item.distance),
                username: item.username,
                commonInterestsCount: item.common_interests_count,
                isFlagged: item.is_flagged,
                likeStatus: item.like_status,
                isRemoving: false,
            }));
            setProfiles(fetchedProfiles);
            setFilteredProfiles(fetchedProfiles);

            const maxFameRatingVal = Math.max(...fetchedProfiles.map((profile: Profile) => profile.fameRating));

            setMaxFameRating(maxFameRatingVal);


            if (fetchedProfiles.length > 0) {
                const ages = fetchedProfiles.map((profile: Profile) => profile.age);
                const minAge = Math.min(...ages);
                const maxAge = Math.max(...ages);
                setMinAge(minAge);
                setMaxAge(maxAge);
                setAgeRange([minAge, maxAge]);


                const distances = fetchedProfiles.map((profile: Profile) => profile.distance);
                const minDistance = Math.min(...distances);
                const maxDistance = Math.max(...distances);
                setMinDistance(minDistance);
                setMaxDistance(maxDistance);
                setDistanceRange([minDistance, maxDistance]);

            }

            setAllInterests(Array.from(new Set(fetchedProfiles.flatMap((profile: Profile) => profile.interests))));

            return fetchedProfiles;
        } catch (error) {
            if (isAxiosError(error)) {
                openNotification(error.response?.data?.message || 'An error occurred.', <CloseCircleFilled style={{ color: '#ff4d4f' }} />);
            } else {
                openNotification('An unexpected error occurred. Please try again.', <CloseCircleFilled style={{ color: '#ff4d4f' }} />);
            }
            return [];
        } finally {
            setLoading(false);
        }
    }


    const applyFilters = () => {

        let filtered = profiles.filter((profile: Profile) =>
            profile.age >= ageRange[0] && profile.age <= ageRange[1] &&
            profile.distance >= distanceRange[0] && profile.distance <= distanceRange[1] &&
            profile.fameRating >= fameRange[0] && profile.fameRating <= fameRange[1] &&
            (selectedInterests.length === 0 || selectedInterests.some((interest: string) => profile.interests.includes(interest)))
        )

        setFilteredProfiles(filtered);
    }

    const resetFilters = () => {
        setAgeRange([minAge, maxAge]);
        setFameRange([0, maxFameRating]);
        setDistanceRange([minDistance, maxDistance]);
        setSelectedInterests([]);
        applyFilters();
        handleSort('distance');
    }

    const handleSort = (value: string) => {
        setSortCriteria(value);
        setFilteredProfiles((prevProfiles: Profile[]) => {
            const sorted = [...prevProfiles].sort((a, b) => {
                if (value === 'age') return b.age - a.age;
                if (value === 'fameRating') return a.fameRating - b.fameRating;
                if (value === 'distance') return b.distance - a.distance;
                if (value === 'commonTags') return a.commonInterestsCount - b.commonInterestsCount;
                return 0;
            });
            return sortOrder === 'ascend' ? sorted : sorted.reverse();
        });
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder: string) => prevOrder === 'ascend' ? 'descend' : 'ascend')
        setFilteredProfiles((prevProfiles: Profile[]) => [...prevProfiles].reverse())
    }

    const handleLike = async (e: React.MouseEvent<HTMLElement>, profileId: number) => {
        e.stopPropagation();
        try {
            await api.post(`/profiles/${profileId}/like`);
            setFilteredProfiles((prevProfiles: Profile[]) =>
                prevProfiles.map(profile =>
                    profile.id === profileId ? { ...profile, isRemoving: true } : profile
                )
            );
            setProfiles((prevProfiles: Profile[]) => prevProfiles.filter(profile => profile.id !== profileId));

            setTimeout(() => {
                setFilteredProfiles((prevProfiles: Profile[]) => prevProfiles.filter(profile => profile.id !== profileId));
            }, 500);
        } catch (error) {
            console.error("Error liking profile:", error);
        }
    };


    return (
        <>
            {contextHolder}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                    <Card className="sticky top-4 bg-background border-border shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-primary">Filters</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-2 text-primary">Age</h3>
                                <Slider
                                    range
                                    min={minAge}
                                    max={maxAge}
                                    value={ageRange}
                                    onChange={(value: number[]) => setAgeRange(value as [number, number])}
                                    className="text-primary"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-2 text-primary">Distance</h3>
                                <Slider
                                    range
                                    min={minDistance}
                                    max={maxDistance}
                                    value={distanceRange}
                                    onChange={(value: number[]) => setDistanceRange(value as [number, number])}
                                    className="text-primary"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-2 text-primary">Fame Rating</h3>
                                <Slider
                                    range
                                    min={0}
                                    max={maxFameRating}
                                    value={fameRange}
                                    onChange={(value: number[]) => setFameRange(value as [number, number])}
                                    className="text-primary"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-2 text-primary">Interests</h3>
                                <Select
                                    mode="multiple"
                                    placeholder="Select interests"
                                    style={{ width: '100%' }}
                                    value={selectedInterests}
                                    onChange={setSelectedInterests}
                                >
                                    {allInterests.map(interest => (
                                        <Option key={interest} value={interest}>{interest}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button className="bg-gradient-to-r from-pink-500 to-red-500 "
                                    onClick={applyFilters}
                                    type="primary"
                                    disabled={loading}
                                    block
                                >
                                    Apply Filters
                                </Button>
                                <Button onClick={resetFilters} block>
                                    Reset
                                </Button>
                            </div>
                            {loading && <div className="mt-4 text-center">Loading profiles...</div>}
                        </div>
                    </Card>

                </div>
                <div className="lg:w-3/4">
                    <div className="flex justify-end items-center mb-4">
                        <Radio.Group value={sortCriteria} onChange={(e) => handleSort(e.target.value)}>
                            <Radio.Button value="age">Age</Radio.Button>
                            <Radio.Button value="distance">Distance</Radio.Button>
                            <Radio.Button value="fameRating">Fame Rating</Radio.Button>
                            <Radio.Button value="commonTags">Common Tags</Radio.Button>
                        </Radio.Group>
                        <Button onClick={toggleSortOrder} className="ml-2">
                            {sortOrder === 'ascend' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                        </Button>
                    </div>
                    {
                        (filteredProfiles.length === 0 && loading === false) ?
                            <NoProfiles onRefresh={fetchProfiles} />
                            :
                            <List
                                grid={{
                                    gutter: 16,
                                    xs: 1,
                                    sm: 2,
                                    md: 2,
                                    lg: 3,
                                    xl: 3,
                                    xxl: 4,
                                }}
                                dataSource={filteredProfiles}
                                loading={loading}
                                renderItem={(profile: Profile) => (
                                    <List.Item>
                                        <Card
                                            hoverable
                                            cover={
                                                <div className="relative h-48">
                                                    <Img
                                                        src={profile.image}
                                                        alt={`${profile.firstName} ${profile.lastName}`}
                                                        className="rounded-t-lg"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        loader={<Skeleton.Image
                                                            active
                                                            className="rounded-t-lg !h-full !w-full"
                                                            style={{ position: 'absolute', top: 0, left: 0 }}
                                                        />}
                                                    />
                                                    {profile.isFlagged && (
                                                        <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1" title="This account has been flagged as potentially fake">
                                                            <FlagIcon className="w-5 h-5 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                            onClick={() => { navigate(`/profiles/${profile.username}`) }}
                                            className={`bg-background border-border shadow-lg transition-all duration-500 hover:shadow-xl ${profile.isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                                        >
                                            <h3 className="text-xl font-semibold mb-2 text-primary w-full truncate">{profile.firstName} {profile.lastName}</h3>

                                            <div className="flex items-center mb-2 text-secondary">
                                                <MapPinIcon className="w-4 h-4 mr-1" />
                                                <span>{profile.distance} Km</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-secondary">
                                                <StarIcon className="w-4 h-4 mr-1" />
                                                <span>Fame: {profile.fameRating}</span>
                                            </div>
                                            <div className="flex items-center mb-2 text-secondary">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                <span>Age: {profile.age}</span>
                                            </div>
                                            <div className="flex gap-1 mt-2 overflow-y-auto max-h-20">
                                                {profile.interests.map(interest => (
                                                    <Tag key={interest} color="blue" className="text-xs">
                                                        {interest}
                                                    </Tag>
                                                ))}
                                            </div>
                                            <Button
                                                type="primary"
                                                icon={<HeartIcon className="w-4 h-4" />}
                                                className="w-full mt-4 bg-gradient-to-r from-pink-500 to-red-500 "
                                                onClick={(e: React.MouseEvent<HTMLElement>) => handleLike(e, profile.id)}
                                                disabled={profile.likeStatus === 'mutual' || profile.likeStatus === 'one-way'}
                                            >
                                                {profile.likeStatus === 'liked-by' ? 'Like Back' : 'Like'}
                                            </Button>
                                        </Card>
                                    </List.Item>
                                )}
                            />
                    }
                </div>
            </div >
        </>
    )
}

export default ProfileList

