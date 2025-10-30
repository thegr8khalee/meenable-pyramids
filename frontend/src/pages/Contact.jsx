// src/pages/Contact.jsx
import React, { useState } from 'react'; // Import useState
import { Loader2 } from 'lucide-react'; // Import Loader2 for loading state
import { toast } from 'react-hot-toast'; // Import toast for notifications
import { axiosInstance } from '../lib/axios.js'; // Your configured Axios instance
import spiceherbs from '../images/spices-herbs.webp'
import { useAuthStore } from '../store/useAuthStore.js';

const Contact = () => {
  const { authUser } = useAuthStore();
  console.log(authUser);
  const [formData, setFormData] = useState({
    name: authUser?.username || '',
    email: authUser?.email || '',
    phoneNumber: authUser?.phoneNumber || '',
    subject: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false); // Loading state for form submission

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const res = await axiosInstance.post('/contact', formData);
      toast.success(res.data.message || 'Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } catch (error) {
      console.error('Error sending contact message:', error);
      toast.error(
        error.response?.data?.message ||
          'Failed to send message. Please try again.'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="">
      <div className="relative">
        <img
          src={
            spiceherbs
          }
          alt="Contact Hero"
          className="object-cover h-40 w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center pt-10 justify-center pb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-base-100 font-[inter]">
            Contact Us
          </h1>
        </div>
      </div>

      <div className="container mx-auto p-4 pt-0 sm:p-6 lg:p-8 my-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form Section */}
          <div className="bg-base-100 px-4 pb-4 rounded-none shadow-xl">
            <h2 className="text-2xl font-semibold font-[inter] mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 rounded-none">
              <div>
                <label htmlFor="name" className="label">
                  <span className="label-text text-base-content">
                    Your Name
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name Surname"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full rounded-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="label">
                  <span className="label-text text-base-content">
                    Your Email
                  </span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="input input-bordered w-full rounded-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="label">
                  <span className="label-text text-base-content">
                    Your Phone Number
                  </span>
                </label>
                <input
                  type="tel"
                  className="input input-bordered w-full rounded-none"
                  required
                  placeholder="Phone"
                  name="phoneNumber"
                  pattern="\d{10,14}"
                  minLength={10}
                  maxLength={14}
                  title="Phone number must be between 10 and 14 digits"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="subject" className="label">
                  <span className="label-text text-base-content">Subject</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g Inquiry about products"
                  className="input input-bordered w-full rounded-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="label">
                  <span className="label-text text-base-content">
                    Your Message
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  className="textarea textarea-bordered h-32 w-full rounded-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn bg-primary text-white w-full rounded-none"
                disabled={isSending}
              >
                {isSending ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Contact Information Section */}
          <div className="bg-base-100 p-6 rounded-none shadow-xl">
            <h2 className="text-2xl font-semibold font-[inter] mb-6">
              Our Contact Details
            </h2>
            <div className="space-y-4 text-base-content">
              <div>
                <h3 className="font-bold text-lg">Email:</h3>
                <p>
                  <a
                    href="mailto:pheezyhomesinteriors@gmial.com"
                    className=" hover:underline"
                  >
                    
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg">Phone:</h3>
                <p>
                  <a
                    href="tel:+2348066258729"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    
                  </a>
                </p>
              </div>
              {/* <div>
                <h3 className="font-bold text-lg">Address:</h3>
                <p>C16 Bamaiyi Road, Kaduna, Nigeria.</p>
              </div> */}
              <div>
                <h3 className="font-bold text-lg">Business Hours:</h3>
                <p>Open 24/7</p>
              </div>
              <div>
                <h3 className="font-bold text-lg">Follow Us:</h3>
                <div className="flex space-x-4 mt-2">
                  <a
                    // href="https://wa.me/2348066258729"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                  >
                    <img
                      src={
                        'https://res.cloudinary.com/dqe64m85c/image/upload/v1753784180/whatsapp_4401461_ahnu6k.png'
                      }
                      alt="WhatsApp"
                      className="size-10"
                    />
                  </a>
                  <a
                    // href="https://www.instagram.com/pheezyhomes_interiors?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <img
                      src={
                        'https://res.cloudinary.com/dqe64m85c/image/upload/v1753784195/ig_pvrgll.png'
                      }
                      alt="Instagram"
                      className="size-10"
                    />
                  </a>
                  {/* <a
                    href="https://www.tiktok.com/@em_furniture_nd_interior?is_from_webapp=1&sender_device=pc"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                  >
                    <img src={tiktok} alt="TikTok" className="size-10" />
                  </a> */}
                  {/* <a
                    href="https://x.com/___Emine_"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                  >
                    <img
                      src={x}
                      alt="X (Twitter)"
                      className="size-10 rounded-full"
                    />
                  </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
