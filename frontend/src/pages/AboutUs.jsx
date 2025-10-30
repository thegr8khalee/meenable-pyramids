import React from 'react';
import spiceherbs from '../images/spices-herbs.webp';
// import Hero1 from '../images/Hero1.png';
// import ME from '../images/ME.png';
// import CEO from '../images/CEO.png';

const AboutUs = () => {
  return (
    <div className="">
      <div className="relative">
        <img
          src={
            spiceherbs
          }
          alt=""
          className="object-cover h-40 w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
          <h1 className="absolute bottom-15 left-1/2 -translate-x-1/2 mt-20 w-full mb-2 text-3xl font-bold text-center text-base-100 font-[poppins]">
            About Us
          </h1>
        </div>
      </div>
      <div className="w-full items-center justify-center flex">
        <section className="text-center w-full mt-10 px-4 max-w-5xl">
          <div className="text-3xl font-bold font-[poppins]">
            Meenable Pyramids: Your Culinary Journey Starts Here
          </div>
          {/* <div className="font-[montserrat] pt-4">
            At PheezyHomesInteriors, we believe your home should be a true
            reflection of your style and a sanctuary of comfort. We're dedicated
            to transforming houses into personalized havens through exceptional
            interior design, the sale of premium furniture, and comprehensive
            home finishing solutions. With a keen eye for detail and a
            commitment to quality, we create spaces that are not only beautiful
            but also highly functional and uniquely yours.
          </div> */}
          <div className="text-3xl font-bold font-[poppins] py-4">
            Our Vision
          </div>
          {/* <div className="font-[montserrat]">
            To be the leading name in home transformation, recognized for our
            innovative designs, quality craftsmanship, and unparalleled client
            satisfaction across Nigeria.
          </div> */}
          <div className="text-3xl font-bold font-[poppins] py-4">
            Our Mission
          </div>
          {/* <div className="font-[montserrat]">
            To empower individuals to live in their dream homes by providing
            seamless and integrated services in interior design, furniture
            selection, and home finishing, ensuring every space we touch exudes
            comfort, style, and lasting quality.
          </div> */}
          {/* <div className="text-3xl font-bold font-[poppins] py-4">
            Meet Our Team
          </div>
          <div className="font-[montserrat] flex flex-col items-center sm:flex-row justify-center">
            <div className="m-5 text-start">
              <img src={CEO} className="w-70 h-70 object-cover" alt="CEO" />
              <p>Amina Abdulahi</p>
              <p>CEO & Visionary</p>
              <p>Lead Interior Designer</p>
              <a className="text-info" href="mailto:emfurnitureandinterior@gmail.com">
                Contact
              </a>
            </div>
            <div className="m-5 text-start">
              <img src={ME} className="w-70 h-70 object-cover" alt="Me" />
              <p>Ibrahim Abdulahi</p>
              <p>Head of Business Development</p>
              <p>Head of IT department</p>
              <a className="text-info" href="mailto:kaliibro777@gmail.com">
                Contact
              </a>
            </div>
          </div> */}
          {/* <div className="text-3xl font-bold font-[poppins] py-4">
            Design & Renovation Team
          </div>
          <div className="font-[montserrat]">
            Our creative interior designers and experienced renovation
            specialists collaborate closely with you, from initial concept to
            final execution. They expertly blend global design trends with your
            personal preferences and the local aesthetic, ensuring every detail
            of your home finishing and interior design is perfectly aligned with
            your vision.
          </div> */}
          {/* <div className="text-3xl font-bold font-[poppins] py-4">
            Furniture Curation & Supply Team
          </div>
          <div className="font-[montserrat]">
            We source and curate a wide range of high-quality furniture,
            offering pieces that combine durability, comfort, and exquisite
            design. Our team assists you in selecting the perfect furnishings
            that complement your interior theme and meet your functional needs,
            ensuring a cohesive and stylish living environment.
          </div> */}
          {/* <div className="text-3xl font-bold font-[poppins] py-4">
            Project Management & Installation Team
          </div>
          <div className="font-[montserrat]">
            Our dedicated project managers oversee every aspect of your home
            finishing and furniture installation. They ensure efficient
            coordination, timely delivery, and meticulous execution,
            guaranteeing a smooth and stress-free process from the first
            brushstroke to the final furniture placement.
          </div> */}
          {/* <div className="text-3xl font-bold font-[poppins] py-4">
            Client Experience & Support
          </div>
          <div className="font-[montserrat]">
            From your initial inquiry to post-completion support, our friendly
            and responsive client relations team is committed to providing an
            exceptional experience. We're here to guide you every step of the
            way, ensuring a satisfying and enjoyable journey as we bring your
            dream home to life.
          </div> */}
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
