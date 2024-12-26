import React, { useState, useEffect } from 'react'
import { Card, Select, Slider, Button, Tag, List, Radio } from 'antd'
import { HeartIcon, MapPinIcon, StarIcon, ArrowUpIcon, ArrowDownIcon, XIcon, Calendar } from 'lucide-react'
import { Img } from 'react-image';

const { Option } = Select

interface Profile {
    id: number
    firstName: string
    lastName: string
    age: number
    fameRating: number
    location: string
    interests: string[]
    image: string
    gender: 'male' | 'female' | 'other'
}

interface User {
    id: number
    firstName: string
    lastName: string
    age: number
    location: string
    interests: string[]
    gender: 'male' | 'female' | 'other'
}

const currentUser: User = {
    id: 0,
    firstName: "Mohamed Taha",
    lastName: "Meaizi",
    age: 30,
    location: "New York",
    interests: ["travel", "music", "cooking"],
    gender: "male"
}

const dummyProfiles: Profile[] = [
    { id: 1, firstName: "AliceAliceAliceAliceAliceAliceAlice", lastName: "Alice", age: 28, fameRating: 75, location: "New York", interests: ["travel", "music", "cooking", "sports", "movies", "hiking"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 2, firstName: "Bob", lastName: "Bob", age: 32, fameRating: 60, location: "Los Angeles", interests: ["sports", "movies", "hiking"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 3, firstName: "Charlie", lastName: "Charlie", age: 25, fameRating: 80, location: "Chicago", interests: ["art", "photography", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 4, firstName: "Diana", lastName: "Diana", age: 30, fameRating: 70, location: "Miami", interests: ["dancing", "beach", "reading"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 5, firstName: "Ethan", lastName: "Ethan", age: 35, fameRating: 65, location: "Seattle", interests: ["technology", "coffee", "running"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 6, firstName: "Fiona", lastName: "Fiona", age: 27, fameRating: 85, location: "Boston", interests: ["fashion", "travel", "food"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 7, firstName: "George", lastName: "George", age: 29, fameRating: 72, location: "San Francisco", interests: ["tech", "surfing", "vegan"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 8, firstName: "Hannah", lastName: "Hannah", age: 31, fameRating: 68, location: "Austin", interests: ["music", "coding", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 9, firstName: "Ian", lastName: "Ian", age: 33, fameRating: 77, location: "Denver", interests: ["skiing", "photography", "beer"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 10, firstName: "Julia", lastName: "Julia", age: 26, fameRating: 82, location: "Portland", interests: ["hiking", "art", "coffee"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 11, firstName: "Alice", lastName: "Alice", age: 28, fameRating: 75, location: "New York", interests: ["travel", "music", "cooking"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 12, firstName: "Bob", lastName: "Bob", age: 32, fameRating: 60, location: "Los Angeles", interests: ["sports", "movies", "hiking"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 13, firstName: "Charlie", lastName: "Charlie", age: 25, fameRating: 80, location: "Chicago", interests: ["art", "photography", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 14, firstName: "Diana", lastName: "Diana", age: 30, fameRating: 70, location: "Miami", interests: ["dancing", "beach", "reading"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 15, firstName: "Ethan", lastName: "Ethan", age: 35, fameRating: 65, location: "Seattle", interests: ["technology", "coffee", "running"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 16, firstName: "Fiona", lastName: "Fiona", age: 27, fameRating: 85, location: "Boston", interests: ["fashion", "travel", "food"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 17, firstName: "George", lastName: "George", age: 29, fameRating: 72, location: "San Francisco", interests: ["tech", "surfing", "vegan"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 18, firstName: "Hannah", lastName: "Hannah", age: 31, fameRating: 68, location: "Austin", interests: ["music", "coding", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 19, firstName: "Ian", lastName: "Ian", age: 33, fameRating: 77, location: "Denver", interests: ["skiing", "photography", "beer"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 20, firstName: "Julia", lastName: "Julia", age: 26, fameRating: 82, location: "Portland", interests: ["hiking", "art", "coffee"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 21, firstName: "Alice", lastName: "Alice", age: 28, fameRating: 75, location: "New York", interests: ["travel", "music", "cooking"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 22, firstName: "Bob", lastName: "Bob", age: 32, fameRating: 60, location: "Los Angeles", interests: ["sports", "movies", "hiking"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 23, firstName: "Charlie", lastName: "Charlie", age: 25, fameRating: 80, location: "Chicago", interests: ["art", "photography", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 24, firstName: "Diana", lastName: "Diana", age: 30, fameRating: 70, location: "Miami", interests: ["dancing", "beach", "reading"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 25, firstName: "Ethan", lastName: "Ethan", age: 35, fameRating: 65, location: "Seattle", interests: ["technology", "coffee", "running"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 26, firstName: "Fiona", lastName: "Fiona", age: 27, fameRating: 85, location: "Boston", interests: ["fashion", "travel", "food"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 27, firstName: "George", lastName: "George", age: 29, fameRating: 72, location: "San Francisco", interests: ["tech", "surfing", "vegan"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 28, firstName: "Hannah", lastName: "Hannah", age: 31, fameRating: 68, location: "Austin", interests: ["music", "coding", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 29, firstName: "Ian", lastName: "Ian", age: 33, fameRating: 77, location: "Denver", interests: ["skiing", "photography", "beer"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 30, firstName: "Julia", lastName: "Julia", age: 26, fameRating: 82, location: "Portland", interests: ["hiking", "art", "coffee"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 31, firstName: "Alice", lastName: "Alice", age: 28, fameRating: 75, location: "New York", interests: ["travel", "music", "cooking"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 32, firstName: "Bob", lastName: "Bob", age: 32, fameRating: 60, location: "Los Angeles", interests: ["sports", "movies", "hiking"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 33, firstName: "Charlie", lastName: "Charlie", age: 25, fameRating: 80, location: "Chicago", interests: ["art", "photography", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 34, firstName: "Diana", lastName: "Diana", age: 30, fameRating: 70, location: "Miami", interests: ["dancing", "beach", "reading"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 35, firstName: "Ethan", lastName: "Ethan", age: 35, fameRating: 65, location: "Seattle", interests: ["technology", "coffee", "running"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 36, firstName: "Fiona", lastName: "Fiona", age: 27, fameRating: 85, location: "Boston", interests: ["fashion", "travel", "food"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 37, firstName: "George", lastName: "George", age: 29, fameRating: 72, location: "San Francisco", interests: ["tech", "surfing", "vegan"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 38, firstName: "Hannah", lastName: "Hannah", age: 31, fameRating: 68, location: "Austin", interests: ["music", "coding", "yoga"], image: "https://thispersondoesnotexist.com/", gender: "female" },
    { id: 39, firstName: "Ian", lastName: "Ian", age: 33, fameRating: 77, location: "Denver", interests: ["skiing", "photography", "beer"], image: "https://thispersondoesnotexist.com/", gender: "male" },
    { id: 40, firstName: "Julia", lastName: "Julia", age: 26, fameRating: 82, location: "Portland", interests: ["hiking", "art", "coffee"], image: "https://thispersondoesnotexist.com/", gender: "female" },
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
        return user.gender !== profile.gender;
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
                                        alt={`${profile.firstName} ${profile.lastName}`}
                                        className="rounded-t-lg"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        loader={<div>Loading...</div>}
                                    />
                                </div>
                            }
                            className="bg-background border-border shadow-lg transition-all duration-300 hover:shadow-xl"
            >
                            <h3 className="text-xl font-semibold mb-2 text-primary w-full truncate">{profile.firstName} {profile.lastName}</h3>

                            <div className="flex items-center mb-2 text-secondary">
                                <MapPinIcon className="w-4 h-4 mr-1" />
                                <span>{profile.location}</span>
                            </div>
                            <div className="flex items-center mb-2 text-secondary">
                                <StarIcon className="w-4 h-4 mr-1" />
                                <span>Fame: {profile.fameRating}</span>
                            </div>
                            <div className="flex items-center mb-2 text-secondary">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>Age: {profile.age}</span>
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
        </div >
    )
}

export default ProfileList

