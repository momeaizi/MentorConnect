'use client'

import React, { useState } from 'react'
import { Row, Col, Card, Input, Select, Slider, Button, Tag } from 'antd'
import Image from 'next/image'

const { Search } = Input
const { Option } = Select

interface Profile {
  id: number
  name: string
  age: number
  fameRating: number
  location: string
  interests: string[]
  image: string
}

const dummyProfiles: Profile[] = [
  { id: 1, name: "Alice", age: 28, fameRating: 75, location: "New York", interests: ["travel", "music", "cooking"], image: "/11.png" },
  { id: 2, name: "Bob", age: 32, fameRating: 60, location: "Los Angeles", interests: ["sports", "movies", "hiking"], image: "/dark_background.jpg" },
  { id: 3, name: "Charlie", age: 25, fameRating: 80, location: "Chicago", interests: ["art", "photography", "yoga"], image: "/11.png" },
  { id: 4, name: "Diana", age: 30, fameRating: 70, location: "Miami", interests: ["dancing", "beach", "reading"], image: "/11.png" },
  { id: 5, name: "Ethan", age: 35, fameRating: 65, location: "Seattle", interests: ["technology", "coffee", "running"], image: "/dark_background.jpg" },
  { id: 6, name: "Fiona", age: 27, fameRating: 85, location: "Boston", interests: ["fashion", "travel", "food"], image: "/11.png" },
]

const allInterests = Array.from(new Set(dummyProfiles.flatMap(profile => profile.interests)))

const ProfileList: React.FC = () => {
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>(dummyProfiles)
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 50])
  const [fameRange, setFameRange] = useState<[number, number]>([0, 100])
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const applyFilters = () => {
    let filtered = dummyProfiles.filter(profile => 
      profile.age >= ageRange[0] && profile.age <= ageRange[1] &&
      profile.fameRating >= fameRange[0] && profile.fameRating <= fameRange[1] &&
      (selectedLocation ? profile.location === selectedLocation : true) &&
      (selectedInterests.length === 0 || selectedInterests.some(interest => profile.interests.includes(interest)))
    )
    setFilteredProfiles(filtered)
  }

  const resetFilters = () => {
    setAgeRange([18, 50])
    setFameRange([0, 100])
    setSelectedLocation(null)
    setSelectedInterests([])
    setFilteredProfiles(dummyProfiles)
  }

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={6}>
        <Card title="Filters" className="mb-4">
          <div className="mb-4">
            <p className="mb-2">Age Range</p>
            <Slider
              range
              min={18}
              max={80}
              value={ageRange}
              onChange={(value: [number, number]) => setAgeRange(value)}
            />
          </div>
          <div className="mb-4">
            <p className="mb-2">Fame Rating</p>
            <Slider
              range
              min={0}
              max={100}
              value={fameRange}
              onChange={(value: [number, number]) => setFameRange(value)}
            />
          </div>
          <Select
            placeholder="Select location"
            style={{ width: '100%' }}
            value={selectedLocation}
            onChange={setSelectedLocation}
            className="mb-4"
            allowClear
          >
            {Array.from(new Set(dummyProfiles.map(profile => profile.location))).map(location => (
              <Option key={location} value={location}>{location}</Option>
            ))}
          </Select>
          <Select
            mode="multiple"
            placeholder="Select interests"
            style={{ width: '100%' }}
            value={selectedInterests}
            onChange={setSelectedInterests}
            className="mb-4"
          >
            {allInterests.map(interest => (
              <Option key={interest} value={interest}>{interest}</Option>
            ))}
          </Select>
          <Button onClick={applyFilters} type="primary" block className="mb-2">Apply Filters</Button>
          <Button onClick={resetFilters} block>Reset Filters</Button>
        </Card>
      </Col>
      <Col xs={24} md={18}>
        <Row gutter={[16, 16]}>
          {filteredProfiles.map(profile => (
            <Col xs={24} sm={12} md={8} key={profile.id}>
              <Card
                hoverable
                cover={<Image src={profile.image} alt={profile.name} width={300} height={200} className="object-cover" />}
              >
                <Card.Meta
                  title={`${profile.name}, ${profile.age}`}
                  description={
                    <>
                      <p>Location: {profile.location}</p>
                      <p>Fame Rating: {profile.fameRating}</p>
                      <div>
                        Interests: {profile.interests.map(interest => (
                          <Tag key={interest} color="blue">{interest}</Tag>
                        ))}
                      </div>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  )
}

export default ProfileList

