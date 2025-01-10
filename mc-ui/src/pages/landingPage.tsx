import { useState, ReactNode } from 'react';
import MyModal from '../components/MyModal';
import Button from '../components/Button';
import Login from '../components/Login'
import CreateAccount from '../components/CreateAccount'
import { FireFilled } from '@ant-design/icons';


export default function LandingPage() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalChildren, setModalChildren] = useState<ReactNode>(null);


  const handleClickLogin = () => {
    setOpenModal(true);
    setModalChildren(<Login closeModal={() => setOpenModal(false)} />);
  }

  const handleClickCreateAccount = () => {
    setOpenModal(true);
    setModalChildren(<CreateAccount closeModal={() => { setOpenModal(false); }} />);
  }


  return (
    <>
      <MyModal openModal={openModal} setOpenModal={setOpenModal}>
        {modalChildren}
      </MyModal>
      <div
        className="bg-[url('./src/assets/images/11.png')] h-screen bg-cover bg-center grid grid-cols-1 grid-rows-[72px_1fr] gap-0"
      >
        <div className="flex flex-row justify-between	items-center	px-8">


          <div className="flex justify-center items-center mb-4">
            <FireFilled style={{ color: "#eb2f96" }} className="logo-navbar-fire-icon mr-2" />
            <h1 className="text-4xl font-bold text-white">
              <span className="italic text-3xl font-extrabold font-sans ">
                Matcha
              </span>
            </h1>
          </div>


          <Button
            text="Login"
            className="log_in_button cursor-pointer	flex justify-center items-center text-xl box-border bg-white text-black rounded-3xl w-32 h-11 px-5 py-2 font-mono"
            onclick={handleClickLogin}
          />

        </div>
        <div className="flex flex-col justify-center	items-center gap-3.5">
          <p
            className="text-5xl font-extrabold	 mb-4"
            style={{
              fontFamily: '"Proxima Nova", "Helvetica Neue", Arial, Helvetica, sans-serif',
              fontSize: '6vw',
              fontWeight: '800',
            }}
          >
            No boss here, change it
          </p>
          <p className="text-xl text-gray-300">
            He who has no skill should return to his mother teaching
          </p>
          <Button
            text="Create account"
            className="px-5 log_in_button cursor-pointer	 flex justify-center gap-0 items-center text-xl box-border bg-white text-white rounded-3xl w-48/1 h-12 px-3 py-6 font-mono bg-gradient-to-r from-pink-500 to-red-500"
            onclick={handleClickCreateAccount}
          />
        </div>
      </div>
    </>
  );
}