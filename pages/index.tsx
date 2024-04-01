import { ObjectId, WithId, Document } from "mongodb";
import clientPromise from "../lib/mongodb";
import Head from "next/head";
import { useState } from "react";
import SlickCarousel from "../components/SlickCarousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
  return (
    <>
      <Head>
        <title>{user.name} Landscaping</title>
      </Head>
      <div className="landing-container">
        <h1>{user.name} Landscaping and Services</h1>
        <ul>
          {values.map((value, index) => {
            // Check if the value is not null
            if (value !== null && value !== "") {
              return <li key={index}>{value}</li>;
            }
            return null; // Skip null values
          })}
        </ul>
        <div className="slick-carousel">
          <SlickCarousel />
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
