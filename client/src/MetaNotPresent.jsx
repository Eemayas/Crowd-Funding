import React, { useState } from 'react';

import { logo, sun } from './assets';
import { navlinks } from './constants';
import { Sidebar, Navbar } from "./components";
const MetaNotPresent = () => {
    const [isActive, setIsActive] = useState('dashboard');
  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
    <div className="sm:flex hidden mr-10 relative">
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">

      <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />

    <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
      <div className="flex flex-col justify-center items-center gap-3">
        {navlinks.map((link) => (
          <Icon 
            key={link.name}
            {...link}
            isActive={isActive}
            handleClick={() => {
            }}
          />
        ))}
      </div>

      <Icon styles="bg-[#1c1c24] shadow-secondary" imgUrl={sun} />
    </div>
  </div>
    </div>

    <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5"> 

      <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">All Campaigns(0)</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
       
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campigns yet
          </p>
       <ErrorPopup error={ "The MetaMask is not install in your browser"}/>
      </div>
    </div>
    </div>
  </div>
  )
}

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
    <div className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name && 'bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
      {!isActive ? (
        <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
      ) : (
        <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
      )}
    </div>
  )
  


  const ErrorPopup = ({ error, onClose }) => {
    return (
      <div className="fixed inset-0  flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
        <div className="relative  bg-[#13131a] border-2 border-red-500 p-4 rounded-md shadow-md z-10">
          <h2 className="font-epilogue font-semibold text-[18px] text-left text-red-500 font-semibold mb-2">MetaMask Error</h2>
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">{error}</p>
          <button
            onClick={window.open("https://metamask.io/download/", "_blank")}
            className="font-epilogue text-[14px] mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
          >
            Install MetaMask
          </button>
        </div>
      </div>
    );
  };

export default MetaNotPresent

