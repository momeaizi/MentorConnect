'use client'
import { Modal } from 'antd';

export default function MyModal({children, openModal, setOpenModal} : any) {
  return (
      <Modal
        centered
        // closable={false}
        footer={null}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        className="max-w-[415px]"
      >
        {children}
      </Modal>
  );
};