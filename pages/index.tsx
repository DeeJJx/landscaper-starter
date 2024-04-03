'use client'

import { ObjectId, WithId, Document } from "mongodb";
import clientPromise from "../lib/mongodb";
import Head from "next/head";
import Image from 'next/image';
import { useState } from "react";
import  EmblaCarousel  from "../components/EmblaCarousel/EmblaCarousel";
import { EmblaOptionsType } from 'embla-carousel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faLocationDot, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

import gardenWork from '../public/garden-work.jpg'

type UserProps = {
  user: UserDB; // Assuming userObject is the expected type
};

function transformUser(userDoc: WithId<Document> | null): UserDB | null {
  if (userDoc === null) {
    return null;
  }

  // Extract the relevant properties from the user document
  const {
    email,
    name,
    telephone,
    addressOne,
    addressTwo,
    twitter,
    facebook,
    instagram,
    skillsDescription,
    skillsList,
    intro
  } = userDoc;

  // Return a new object with the extracted properties
  return {
    email,
    name,
    telephone,
    addressOne,
    addressTwo,
    twitter,
    facebook,
    instagram,
    skillsDescription,
    skillsList,
    intro
    // Add other properties as needed
  };
}

export default function User({ user }: UserProps) {
  const values = Object.values(user);
  const titleText = `${user.name} Landscaping`;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('Form submitted successfully!');
      } else {
        console.error('Form submission failed.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const OPTIONS: EmblaOptionsType = { loop: true }
  const SLIDES = user.skillsList

  return (
    <>
      <Head>
        <title>{user.name}</title>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
      </Head>
      <div className="landing-container">
        <nav className="header-content">
          <div className="header-left header-content-section">
              Email: {user.email}
          </div>
          <div className="header-centre header-content-section">
              {user.name} Landscaping and Services
          </div>
          <div className="header-right header-content-section">
              Contact: {user.telephone}
          </div>
        </nav>
        <div className="hero">
          <div className="hero-text">
            <h3>Landscape and Gardening Services</h3>
            <p>Welcome to {user.name}, your go-to destination for top-notch landscaping services. With years of experience, we are dedicated to providing high-quality landscaping solutions for residential and commercial clients.
               Our skilled team of gardeners are here to address all your landscaping needs with professionalism and efficiency.</p>
          </div>
          <div className="hero-image"><Image src={gardenWork} alt='garden work'/></div>
        </div>
        <div className="contact-box">
          <div className="location">
            <div className="symbol"><FontAwesomeIcon icon={faLocationDot} /></div>
            <div className="text"><p className="title">Area:</p><p>{user.addressOne} {user.addressTwo}</p></div>
          </div>
          <div className="email">
            <div className="symbol"><FontAwesomeIcon icon={faEnvelope} /></div>
            <div className="text"><p className="title">Email:</p><p>{user.email}</p></div>
          </div>
          <div className="phone">
            <div className="symbol"><FontAwesomeIcon icon={faPhone} /></div>
            <div className="text"><p className="title">Phone:</p><p>{user.telephone}</p></div> {/*import user phone number*/}
          </div>
        </div>
        <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        {user.skillsDescription && 
        <div className="skills-description-container">
          <div className="skills-description-text">
            {user.skillsDescription}
          </div>
        </div>
          }
        <div className="slick-carousel">
        </div>
        <div className="contact-us">
          <div className="contact-form-container">
            <div className="contact-text">
              <h4>Get in touch</h4>
              <p>Ready to schedule a landscaping service or have a question for us? Reach out to our experienced team today. We're here to assist you with all your landscaping needs. 
                Fill out the form, and we'll get back to you as soon as possible.</p>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
        {/* <ul>
          {values.map((value, index) => {
            // Check if the value is not null
            if (value !== null && value !== "") {
              return <li key={index}>{value}</li>;
            }
            return null; // Skip null values
          })}
        </ul> */}
      </div>
    </>
  );
}

type UserDB = {
  email: string;
  name: string;
  telephone: string;
  addressOne: string;
  addressTwo: string;
  twitter: string;
  facebook: string;
  instagram: string;
  skillsDescription: string;
  skillsList: Array<string>;
  intro: string;
  // Add other properties as needed
};

export async function getStaticProps({}) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const userId = `${process.env.uniqueId}`;
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid ObjectId");
    }

    const objectId = new ObjectId(userId);

    // Modify the query to find the specific user by their ID
    // ...
    const userDoc: WithId<Document> | null = await db
      .collection("mainusers")
      .findOne({ _id: objectId });
    // ...

    const user: UserDB | null = transformUser(userDoc);

    return {
      props: { user },
    };
  } catch (e) {
    console.error(e);
    // Return an empty object or null if there's an error
    return {
      props: { user: null },
    };
  }
}
