import React, { useState, useEffect } from 'react'
import { Card, Select, Slider, Button, Tag, List, Radio } from 'antd'
import { HeartIcon, MapPinIcon, StarIcon, ArrowUpIcon, ArrowDownIcon, XIcon } from 'lucide-react'
import { Img } from 'react-image';

const { Option } = Select

interface Profile {
    id: number
    name: string
    age: number
    fameRating: number
    location: string
    interests: string[]
    image: string
    gender: 'male' | 'female' | 'other'
    orientation: 'straight' | 'gay' | 'bisexual'
}

interface User {
    id: number
    name: string
    age: number
    location: string
    interests: string[]
    gender: 'male' | 'female' | 'other'
    orientation: 'straight' | 'gay' | 'bisexual'
}

const currentUser: User = {
    id: 0,
    name: "Current User",
    age: 30,
    location: "New York",
    interests: ["travel", "music", "cooking"],
    gender: "male",
    orientation: "straight"
}

const dummyProfiles: Profile[] = [
    { id: 1, name: "Alice", age: 28, fameRating: 75, location: "New York", interests: ["travel", "music", "cooking", "sports", "movies", "hiking"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 2, name: "Bob", age: 32, fameRating: 60, location: "Los Angeles", interests: ["sports", "movies", "hiking"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 3, name: "Charlie", age: 25, fameRating: 80, location: "Chicago", interests: ["art", "photography", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 4, name: "Diana", age: 30, fameRating: 70, location: "Miami", interests: ["dancing", "beach", "reading"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 5, name: "Ethan", age: 35, fameRating: 65, location: "Seattle", interests: ["technology", "coffee", "running"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 6, name: "Fiona", age: 27, fameRating: 85, location: "Boston", interests: ["fashion", "travel", "food"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 7, name: "George", age: 29, fameRating: 72, location: "San Francisco", interests: ["tech", "surfing", "vegan"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 8, name: "Hannah", age: 31, fameRating: 68, location: "Austin", interests: ["music", "coding", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 9, name: "Ian", age: 33, fameRating: 77, location: "Denver", interests: ["skiing", "photography", "beer"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 10, name: "Julia", age: 26, fameRating: 82, location: "Portland", interests: ["hiking", "art", "coffee"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 11, name: "Alice", age: 28, fameRating: 75, location: "New York", interests: ["travel", "music", "cooking"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 12, name: "Bob", age: 32, fameRating: 60, location: "Los Angeles", interests: ["sports", "movies", "hiking"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 13, name: "Charlie", age: 25, fameRating: 80, location: "Chicago", interests: ["art", "photography", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 14, name: "Diana", age: 30, fameRating: 70, location: "Miami", interests: ["dancing", "beach", "reading"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 15, name: "Ethan", age: 35, fameRating: 65, location: "Seattle", interests: ["technology", "coffee", "running"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 16, name: "Fiona", age: 27, fameRating: 85, location: "Boston", interests: ["fashion", "travel", "food"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 17, name: "George", age: 29, fameRating: 72, location: "San Francisco", interests: ["tech", "surfing", "vegan"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 18, name: "Hannah", age: 31, fameRating: 68, location: "Austin", interests: ["music", "coding", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 19, name: "Ian", age: 33, fameRating: 77, location: "Denver", interests: ["skiing", "photography", "beer"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 20, name: "Julia", age: 26, fameRating: 82, location: "Portland", interests: ["hiking", "art", "coffee"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 21, name: "Alice", age: 28, fameRating: 75, location: "New York", interests: ["travel", "music", "cooking"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 22, name: "Bob", age: 32, fameRating: 60, location: "Los Angeles", interests: ["sports", "movies", "hiking"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 23, name: "Charlie", age: 25, fameRating: 80, location: "Chicago", interests: ["art", "photography", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 24, name: "Diana", age: 30, fameRating: 70, location: "Miami", interests: ["dancing", "beach", "reading"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 25, name: "Ethan", age: 35, fameRating: 65, location: "Seattle", interests: ["technology", "coffee", "running"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 26, name: "Fiona", age: 27, fameRating: 85, location: "Boston", interests: ["fashion", "travel", "food"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 27, name: "George", age: 29, fameRating: 72, location: "San Francisco", interests: ["tech", "surfing", "vegan"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 28, name: "Hannah", age: 31, fameRating: 68, location: "Austin", interests: ["music", "coding", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 29, name: "Ian", age: 33, fameRating: 77, location: "Denver", interests: ["skiing", "photography", "beer"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 30, name: "Julia", age: 26, fameRating: 82, location: "Portland", interests: ["hiking", "art", "coffee"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 31, name: "Alice", age: 28, fameRating: 75, location: "New York", interests: ["travel", "music", "cooking"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 32, name: "Bob", age: 32, fameRating: 60, location: "Los Angeles", interests: ["sports", "movies", "hiking"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 33, name: "Charlie", age: 25, fameRating: 80, location: "Chicago", interests: ["art", "photography", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 34, name: "Diana", age: 30, fameRating: 70, location: "Miami", interests: ["dancing", "beach", "reading"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 35, name: "Ethan", age: 35, fameRating: 65, location: "Seattle", interests: ["technology", "coffee", "running"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 36, name: "Fiona", age: 27, fameRating: 85, location: "Boston", interests: ["fashion", "travel", "food"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 37, name: "George", age: 29, fameRating: 72, location: "San Francisco", interests: ["tech", "surfing", "vegan"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 38, name: "Hannah", age: 31, fameRating: 68, location: "Austin", interests: ["music", "coding", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
    { id: 39, name: "Ian", age: 33, fameRating: 77, location: "Denver", interests: ["skiing", "photography", "beer"], image: "https://thispersondoesnotexist.com/", gender: "male", orientation: "straight" },
    { id: 40, name: "Julia", age: 26, fameRating: 82, location: "Portland", interests: ["hiking", "art", "coffee"], image: "https://thispersondoesnotexist.com/", gender: "female", orientation: "straight" },
]

const allInterests = Array.from(new Set(dummyProfiles.flatMap(profile => profile.interests)))
const allLocations = Array.from(new Set(dummyProfiles.map(profile => profile.location)))

const ProfileList: React.FC = () => {
    const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([])
    const [ageRange, setAgeRange] = useState<[number, number]>([18, 50])
    const [fameRange, setFameRange] = useState<[number, number]>([0, 100])
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend')
    const [likedProfiles, setLikedProfiles] = useState<number[]>([])
    const [sortCriteria, setSortCriteria] = useState<string>('fameRating');

    useEffect(() => {
        applyFilters();
        handleSort(sortCriteria);
    }, [])

    const applyFilters = () => {
        let filtered = dummyProfiles.filter(profile =>
            profile.age >= ageRange[0] && profile.age <= ageRange[1] &&
            profile.fameRating >= fameRange[0] && profile.fameRating <= fameRange[1] &&
            (selectedLocation ? profile.location === selectedLocation : true) &&
            (selectedInterests.length === 0 || selectedInterests.some(interest => profile.interests.includes(interest))) &&
            isCompatible(profile, currentUser)
        )

        filtered.sort((a, b) => {
            if (a.location === currentUser.location && b.location !== currentUser.location) return -1
            if (b.location === currentUser.location && a.location !== currentUser.location) return 1

            const aCommonTags = a.interests.filter(interest => currentUser.interests.includes(interest)).length
            const bCommonTags = b.interests.filter(interest => currentUser.interests.includes(interest)).length
            if (aCommonTags !== bCommonTags) return bCommonTags - aCommonTags

            return b.fameRating - a.fameRating
        })

        setFilteredProfiles(filtered)
    }

    const isCompatible = (profile: Profile, user: User) => {
        if (user.orientation === 'straight') {
            return user.gender !== profile.gender
        }
        return true
    }

    const resetFilters = () => {
        setAgeRange([18, 50])
        setFameRange([0, 100])
        setSelectedLocation(null)
        setSelectedInterests([])
        setSortOrder('descend')
        setLikedProfiles([])
        setSortCriteria('fameRating');
        applyFilters()
        handleSort('fameRating');
    }

    const handleSort = (value: string) => {
        setSortCriteria(value);
        setFilteredProfiles(prevProfiles => {
            const sorted = [...prevProfiles].sort((a, b) => {
                if (value === 'age') return a.age - b.age;
                if (value === 'fameRating') return b.fameRating - a.fameRating;
                if (value === 'location') return a.location.localeCompare(b.location);
                if (value === 'commonTags') {
                    const aCommonTags = a.interests.filter(interest => currentUser.interests.includes(interest)).length;
                    const bCommonTags = b.interests.filter(interest => currentUser.interests.includes(interest)).length;
                    return bCommonTags - aCommonTags;
                }
                return 0;
            });
            return sortOrder === 'ascend' ? sorted : sorted.reverse();
        });
    };

    const toggleSortOrder = () => {
        setSortOrder(prevOrder => prevOrder === 'ascend' ? 'descend' : 'ascend')
        setFilteredProfiles(prevProfiles => [...prevProfiles].reverse())
    }

    const handleLike = (profileId: number) => {
        setLikedProfiles(prev => [...prev, profileId])
    }

    const handleUnlike = (profileId: number) => {
        setLikedProfiles(prev => prev.filter(id => id !== profileId))
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4">
                <Card className="sticky top-4 bg-background border-border shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Filters</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-2 text-primary">Age Range</h3>
                            <Slider
                                range
                                min={18}
                                max={80}
                                value={ageRange}
                                onChange={(value: number[]) => setAgeRange(value as [number, number])}
                                className="text-primary"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-2 text-primary">Fame Rating</h3>
                            <Slider
                                range
                                min={0}
                                max={100}
                                value={fameRange}
                                onChange={(value: number[]) => setFameRange(value as [number, number])}
                                className="text-primary"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-2 text-primary">Location</h3>
                            <Select
                                placeholder="Select location"
                                style={{ width: '100%' }}
                                value={selectedLocation}
                                onChange={setSelectedLocation}
                                allowClear
                            >
                                {allLocations.map(location => (
                                    <Option key={location} value={location}>{location}</Option>
                                ))}
                            </Select>
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
                            <Button className="bg-gradient-to-r from-pink-500 to-red-500 shadow-none"
                                onClick={applyFilters}
                                type="primary"
                                block>
                                Apply Filters
                            </Button>
                            <Button onClick={resetFilters} block>
                                Reset
                            </Button>
                        </div>
                    </div>
                </Card>

            </div>
            <div className="lg:w-3/4">
                <div className="flex justify-end items-center mb-4">
                    <Radio.Group value={sortCriteria} onChange={(e) => handleSort(e.target.value)}>
                        <Radio.Button value="age">Age</Radio.Button>
                        <Radio.Button value="location">Location</Radio.Button>
                        <Radio.Button value="fameRating">Fame Rating</Radio.Button>
                        <Radio.Button value="commonTags">Common Tags</Radio.Button>
                    </Radio.Group>
                    <Button onClick={toggleSortOrder} className="ml-2">
                        {sortOrder === 'ascend' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                    </Button>
                </div>
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
                    renderItem={profile => (
                        <List.Item>
                            <Card
                                hoverable
                                cover={
                                    <div className="relative h-48">
                                        <Img
                                            src={profile.image}
                                            alt={profile.name}
                                            className="rounded-t-lg"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            loader={<div>Loading...</div>}
                                        />
                                    </div>
                                }
                                className="bg-background border-border shadow-lg transition-all duration-300 hover:shadow-xl"
                            >
                                <h3 className="text-xl font-semibold mb-2 text-primary">{profile.name}, {profile.age}</h3>
                                <div className="flex items-center mb-2 text-secondary">
                                    <MapPinIcon className="w-4 h-4 mr-1" />
                                    <span>{profile.location}</span>
                                </div>
                                <div className="flex items-center mb-2 text-secondary">
                                    <StarIcon className="w-4 h-4 mr-1" />
                                    <span>Fame: {profile.fameRating}</span>
                                </div>
                                <div className="mb-2 text-secondary">
                                    <span>{profile.gender}, {profile.orientation}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {profile.interests.map(interest => (
                                        <Tag key={interest} color="blue" className="text-xs">
                                            {interest}
                                        </Tag>
                                    ))}
                                </div>
                                <Button
                                    type="primary"
                                    icon={<HeartIcon className="w-4 h-4" />}
                                    className="w-full mt-4 bg-gradient-to-r from-pink-500 to-red-500 shadow-none"
                                    onClick={() => handleLike(profile.id)}
                                    disabled={likedProfiles.includes(profile.id)}
                                >
                                    Like
                                </Button>
                                <Button
                                    type="default"
                                    icon={<XIcon className="w-4 h-4" />}
                                    className="w-full mt-2"
                                    onClick={() => handleUnlike(profile.id)}
                                >
                                    Unlike
                                </Button>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    )
}

export default ProfileList

