import React from 'react';
// import spiceherbs from '../images/spices-herbs.webp';
// import Hero1 from '../images/Hero1.png';
// import ME from '../images/ME.png';
// import CEO from '../images/CEO.png';

const Terms = () => {
  return (
    <div className="">
      <div className="relative">
        <img
          src='https://res.cloudinary.com/dn2tbatgr/image/upload/v1761828422/spices-herbs_a3v9xo.webp'
          alt=""
          className="object-cover h-40 w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
          <h1 className="absolute bottom-15 left-1/2 -translate-x-1/2 mt-20 w-full mb-2 text-3xl font-bold text-center text-base-100 font-[poppins]">
            Terms and Conditions Meenable Pyramids
          </h1>
          <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-base-100 font-[montserrat] w-full text-center">
            Effective Date: July 22, 2025
          </p>
        </div>
      </div>
      <div className="w-full justify-center flex p-4">
        
      </div>
    </div>
  );
};

export default Terms;
