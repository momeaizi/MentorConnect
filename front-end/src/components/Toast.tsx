'use client'
import { Button, Divider, notification, Space } from 'antd';
import type { NotificationArgsProps } from 'antd';

interface ButtonProps {
    text: string;
    className?: string;
    onclick?: () => void;
}

type ToastType = 'success' | 'info' | 'warning' | 'error';

type NotifType = 'notification' | "message";

const notificationMap = {
    notification: {
        message: "You've a new Notification!",
        description: ", Someone appreciates your profile—check it out!"
    },
    message: {
        message: "You've a new Message!",
        description: ", send a new message"
    },
  };

export default function Toast({toastType, notifType} : {toastType:ToastType, notifType:NotifType }) {

    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (toastType: ToastType) => {
      api[toastType]({
        message: notificationMap[notifType]?.message,
        // description: notificationMap[notifType]?.description,
      });
    };
    
    openNotificationWithIcon(toastType);
    
    return (
      <>
        {contextHolder}
      </>
    );
  }
  