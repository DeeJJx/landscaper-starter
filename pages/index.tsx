import { ObjectId, WithId, Document } from "mongodb";
import clientPromise from "../lib/mongodb";
import Head from "next/head";

type UserProps = {
  user: UserDB; // Assuming userObject is the expected type
};

function transformUser(userDoc: WithId<Document> | null): UserDB | null {
  if (userDoc === null) {
    return null;
  }

  // Extract the relevant properties from the user document
  const { name, telephone, address, postcode } = userDoc;

  // Return a new object with the extracted properties
  return {
    name,
    telephone,
    address,
    postcode,
    // Add other properties as needed
  };
}

export default function User({ user }: UserProps) {
  return (
    <div>
      <Head>
        <title>{user.name} Landscaping</title>
      </Head>
      <h1>User Profile</h1>
      {user ? (
        <div>
          <h2>{user.name}</h2>
          <ul>
            <li>{user.telephone}</li>
            <li>{user.address}</li>
            <li>{user.postcode}</li>
          </ul>
          {/* Add other user information as needed */}
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
}

type UserDB = {
  name: string;
  telephone: string;
  address: string;
  postcode: string;
  // Add other properties as needed
};

export async function getStaticProps({}) {
  try {
    const client = await clientPromise;
    const db = client.db("test");

    // Assuming the userId is provided as a query parameter
    // const userId = params.userId;
    const userId = "643e704577ba2c459fdd2a8b";
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid ObjectId");
    }

    const objectId = new ObjectId(userId);

    // Modify the query to find the specific user by their ID
    // ...
    const userDoc: WithId<Document> | null = await db
      .collection("tradesmen")
      .findOne({ _id: objectId });
    // ...

    const user: UserDB | null = transformUser(userDoc);

    console.log(user);

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

// import Head from 'next/head'
// import clientPromise from '../lib/mongodb'
// import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

// type ConnectionStatus = {
//   isConnected: boolean
// }

// export const getServerSideProps: GetServerSideProps<
//   ConnectionStatus
// > = async () => {
//   try {
//     await clientPromise
//     // `await clientPromise` will use the default database passed in the MONGODB_URI
//     // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
//     //
//     // `const client = await clientPromise`
//     // `const db = client.db("myDatabase")`
//     //
//     // Then you can execute queries against your database like so:
//     // db.find({}) or any of the MongoDB Node Driver commands

//     return {
//       props: { isConnected: true },
//     }
//   } catch (e) {
//     console.error(e)
//     return {
//       props: { isConnected: false },
//     }
//   }
// }

// export default function Home({
//   isConnected,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//   return (
//     <div className="container">
//       <Head>
//         <title>Create Next App</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main>
//         <h1 className="title">
//           Welcome to <a href="https://nextjs.org">Next.js with MongoDB!</a>
//         </h1>

//         {isConnected ? (
//           <h2 className="subtitle">You are connected to MongoDB</h2>
//         ) : (
//           <h2 className="subtitle">
//             You are NOT connected to MongoDB. Check the <code>README.md</code>{' '}
//             for instructions.
//           </h2>
//         )}

//         <p className="description">
//           Get started by editing <code>pages/index.js</code>
//         </p>

//         <div className="grid">
//           <a href="https://nextjs.org/docs" className="card">
//             <h3>Documentation &rarr;</h3>
//             <p>Find in-depth information about Next.js features and API.</p>
//           </a>

//           <a href="https://nextjs.org/learn" className="card">
//             <h3>Learn &rarr;</h3>
//             <p>Learn about Next.js in an interactive course with quizzes!</p>
//           </a>

//           <a
//             href="https://github.com/vercel/next.js/tree/canary/examples"
//             className="card"
//           >
//             <h3>Examples &rarr;</h3>
//             <p>Discover and deploy boilerplate example Next.js projects.</p>
//           </a>

//           <a
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="card"
//           >
//             <h3>Deploy &rarr;</h3>
//             <p>
//               Instantly deploy your Next.js site to a public URL with Vercel.
//             </p>
//           </a>
//         </div>
//       </main>

//       <footer>
//         <a
//           href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Powered by{' '}
//           <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
//         </a>
//       </footer>

//       <style jsx>{`
//         .container {
//           min-height: 100vh;
//           padding: 0 0.5rem;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           align-items: center;
//         }

//         main {
//           padding: 5rem 0;
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           align-items: center;
//         }

//         footer {
//           width: 100%;
//           height: 100px;
//           border-top: 1px solid #eaeaea;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }

//         footer img {
//           margin-left: 0.5rem;
//         }

//         footer a {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }

//         a {
//           color: inherit;
//           text-decoration: none;
//         }

//         .title a {
//           color: #0070f3;
//           text-decoration: none;
//         }

//         .title a:hover,
//         .title a:focus,
//         .title a:active {
//           text-decoration: underline;
//         }

//         .title {
//           margin: 0;
//           line-height: 1.15;
//           font-size: 4rem;
//         }

//         .title,
//         .description {
//           text-align: center;
//         }

//         .subtitle {
//           font-size: 2rem;
//         }

//         .description {
//           line-height: 1.5;
//           font-size: 1.5rem;
//         }

//         code {
//           background: #fafafa;
//           border-radius: 5px;
//           padding: 0.75rem;
//           font-size: 1.1rem;
//           font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
//             DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
//         }

//         .grid {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-wrap: wrap;

//           max-width: 800px;
//           margin-top: 3rem;
//         }

//         .card {
//           margin: 1rem;
//           flex-basis: 45%;
//           padding: 1.5rem;
//           text-align: left;
//           color: inherit;
//           text-decoration: none;
//           border: 1px solid #eaeaea;
//           border-radius: 10px;
//           transition: color 0.15s ease, border-color 0.15s ease;
//         }

//         .card:hover,
//         .card:focus,
//         .card:active {
//           color: #0070f3;
//           border-color: #0070f3;
//         }

//         .card h3 {
//           margin: 0 0 1rem 0;
//           font-size: 1.5rem;
//         }

//         .card p {
//           margin: 0;
//           font-size: 1.25rem;
//           line-height: 1.5;
//         }

//         .logo {
//           height: 1em;
//         }

//         @media (max-width: 600px) {
//           .grid {
//             width: 100%;
//             flex-direction: column;
//           }
//         }
//       `}</style>

//       <style jsx global>{`
//         html,
//         body {
//           padding: 0;
//           margin: 0;
//           font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
//             Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
//             sans-serif;
//         }

//         * {
//           box-sizing: border-box;
//         }
//       `}</style>
//     </div>
//   )
// }
