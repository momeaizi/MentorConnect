'use client'
import { Modal } from 'antd';
import { ReactNode } from 'react';

interface MyModalProps {
  children: ReactNode;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

export default function MyModal({ children, openModal, setOpenModal }: MyModalProps) {
  return (
    <Modal
      centered
      footer={null}
      open={openModal}
      onCancel={() => setOpenModal(false)}
      className="max-w-[415px]"
    >
      {children}
    </Modal>
  );
};
