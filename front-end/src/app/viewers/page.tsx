'use client';
import React from 'react';
import { Avatar, List } from 'antd';


const data = [
  {
    title: 'Ahmed Hmaidi 1',
  },
  {
    title: 'Ahmed Hmaidi 2',
  },
  {
    title: 'Ahmed Hmaidi 3',
  },
  {
    title: 'Ahmed Hmaidi 4',
  },
  {
    title: 'Ahmed Hmaidi 2',
  },
  {
    title: 'Ahmed Hmaidi 3',
  },
  {
    title: 'Ahmed Hmaidi 4',
  },
  {
    title: 'Ahmed Hmaidi 2',
  },
  {
    title: 'Ahmed Hmaidi 3',
  },
  {
    title: 'Ahmed Hmaidi 4',
  },
  {
    title: 'Ahmed Hmaidi 2',
  },
  {
    title: 'Ahmed Hmaidi 3',
  },
  {
    title: 'Ahmed Hmaidi 4',
  },
  {
    title: 'Ahmed Hmaidi 2',
  },
  {
    title: 'Ahmed Hmaidi 3',
  },
  {
    title: 'Ahmed Hmaidi 4',
  },
  {
    title: 'Ahmed Hmaidi 2',
  },
  {
    title: 'Ahmed Hmaidi 3',
  },
  {
    title: 'Ahmed Hmaidi 4',
  },
  {
    title: 'Ahmed Hmaidi 2',
  },
  {
    title: 'Ahmed Hmaidi 3',
  },
  {
    title: 'Ahmed Hmaidi 4',
  },
  {
    title: 'Ahmed Hmaidi 2',
  },
  {
    title: 'Ahmed Hmaidi 3',
  },
  {
    title: 'Ahmed Hmaidi 4',
  },
  {
    title: 'Ahmed Hmaidi 2',
  },
  {
    title: 'Ahmed Hmaidi 3',
  },
  {
    title: 'Ahmed Hmaidi 4',
  },
  {
    title: 'Ahmed Hmaidi 2',
  },
  {
    title: 'Ahmed Hmaidi 3',
  },
  {
    title: 'Ahmed Hmaidi 4',
  },
  {
    title: 'Ahmed Hmaidi 2',
  },
  {
    title: 'Ahmed Hmaidi 3',
  },
  {
    title: 'Ahmed Hmaidi 4',
  },
  {
    title: 'Ahmed Hmaidi 2',
  },
  {
    title: 'Ahmed Hmaidi 3',
  },
  {
    title: 'Ahmed Hmaidi 4',
  },
  {
    title: 'Ahmed Hmaidi 2',
  },
  {
    title: 'Ahmed Hmaidi 3',
  },
  {
    title: 'Ahmed Hmaidi 4',
  },
  {
    title: 'Ahmed Hmaidi 2',
  },
  {
    title: 'Ahmed Hmaidi 3',
  },
  {
    title: 'Ahmed Hmaidi 4',
  },
];


export default function ViewersPage() {
  return (
      <List
        pagination={{ position:'bottom', align:'center' }}
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
              title={<div><a href="https://ant.design">{item.title}</a><div>viewed your profile</div></div>}
              description="November 7, 2024, 2:30 PM"
            />
          </List.Item>
        )}
      />
  );
};
