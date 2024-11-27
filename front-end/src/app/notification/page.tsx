"use client";
import React, { useState, useEffect } from "react";
import { BellOutlined } from "@ant-design/icons";

function NotificationMobile() {
  return <div></div>;
}

const notifications = [
  { id: 1, message: "You have a new message", time: "2 mins ago" },
  { id: 2, message: "Your order has been shipped", time: "1 hour ago" },
  { id: 3, message: "New comment on your post", time: "3 hours ago" },
];
function Notifications() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition"
          >
            <p className="text-gray-700">{notification.message}</p>
            <span className="text-sm text-gray-500">{notification.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NotificationPage() {
  return (
    <div>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Notifications
        </h1>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white p-3 sm:p-4 rounded-lg shadow-md 
                        hover:bg-gray-50 transition md:flex md:justify-between"
            >
              <div className="flex items-center">
                <BellOutlined className="h-6 w-6 text-blue-500 mr-3" />
                <p className="text-gray-700 md:text-lg">
                  {notification.message}
                </p>
              </div>

              <span className="text-xs sm:text-sm text-gray-500 md:text-right">
                {notification.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
