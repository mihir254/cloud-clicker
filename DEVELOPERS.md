# Cloud Clicker Developer Guide

## Table of Contents
- [Requirements](#requirements)
- [Dependencies](#dependencies)
- [Setup Instructions](#setup-instructions)
  - [Clone the Repository](#1-clone-the-repository)
  - [Project Structure](#2-project-structure)
  - [Install Dependencies](#3-install-dependencies)
  - [Configure Environment Variables](#4-configure-environment-variables)
  - [Run the Development Server](#5-run-the-development-server)
- [Database Design](#database-design)
- [CI/CD Pipeline](#cicd-pipeline)

## Requirements

To run the Cloud Clicker application locally, ensure you have the following prerequisites installed on your machine:

- **Node.js**: Version 14 or higher
- **npm**: Version 6 or higher (comes with Node.js)
- **Firebase Account**: Set up a Firebase project with Firestore and Authentication enabled
- **Vercel Account**: For deployment (optional, for those who wish to deploy the application)
- **Git**: Version control system

## Dependencies

The project relies on the following major dependencies:

- **Next.js**: React framework for server-side rendering and static site generation
- **React**: Library for building user interfaces
- **Chakra UI**: Component library for styling
- **Firebase**: Backend-as-a-Service for authentication and database
- **Winston**: Logging library
- **Sentry**: Monitoring and error tracking

## Setup Instructions

Follow these steps to set up and run the application on your local machine:

#### 1. Clone the Repository
```bash
git clone https://github.com/mihir254/cloud-clicker.git
```

#### 2. Project Structure
```bash
cloud-clicker/
├── db                        # Firebase config and connection
│   ├── firebase.ts           # Firebase client-side config
│   └── firebaseAdmin.ts      # Firebase admin-side config
├── public/                   # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── Button.tsx        # Custom button component
│   │   └── LoginForm.tsx     # Login form component
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.ts        # Authentication hook
│   │   └── useFirestore.ts   # Firestore hook
│   ├── pages/                # Next.js pages
│   │   ├── api/              # API routes
│   │   │   └── clicks/       # All routes related to clicks
│   │   │       └── update.ts # Click update API
│   │   ├── dashboard.tsx     # Dashboard page
│   │   └── index.tsx         # Home page
│   └── styles/               # CSS files
├── .env                      # Environment variables
├── next.config.js            # Next.js configuration
├── package.json              # NPM dependencies and scripts
├── README.md                 # Project documentation
├── DEVELOPERS.md             # Project documentation for developers
└── DESIGN.md                 # Project design explanation
```

#### 3. Install Dependencies
```bash
npm install
```

#### 4. Configure Environment Variables
Create a .env.local file in the root directory of the project and add the following environment variables. These variables are required for Firebase and other configurations:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# optional
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```
Replace the placeholder values (your_*) with your actual project configuration values.

#### 5. Run the Development Server
```bash
npm run dev
```
The application will be available at http://localhost:3000.

## Database Design

### Firestore Collections

#### Users Collection
- **Document ID**: User ID (from Firebase Authentication)
- **Fields**:
  - `username`: String
  - `email`: String
  - `clickCount`: Number

#### TotalClicks Collection
- **Document ID**: `counter`
- **Fields**:
  - `total`: Number

#### Clicks Collection
- **Document ID**: Auto-generated
- **Fields**:
  - `userId`: String
  - `timestamp`: Timestamp

### Indexes (optional)

#### Clicks Collection
- `timestamp` (Ascending)
- **Composite Index on** `timestamp` **and** `userId` (Ascending)

## CI/CD Pipeline

To ensure continuous integration and continuous deployment (CI/CD), the Cloud Clicker application uses Vercel for automated deployments.

### Setup CI/CD with Vercel

#### Create a Git Repository:
- Push your changes to a Git repository (e.g., GitHub).

#### Create a Vercel Account:
- Sign up for a Vercel account at [vercel.com](https://vercel.com/).

#### Connect GitHub to Vercel:
- Link your GitHub account to Vercel.
- Import your project repository to Vercel.

#### Configure Environment Variables on Vercel:
- Add all the necessary environment variables in the Vercel project settings. These include the Firebase configuration and any other required variables.

### Vercel Deployment Process

#### Automatic Build and Deployment:
- When you push code to the main branch (or any specified branch), Vercel automatically triggers the following steps:
  - `npm install`: Installs the project dependencies.
  - `npm build`: Builds the project for production.
- After a successful build, Vercel deploys the application to a unique URL.

#### Branch Deployments:
- Each branch in your repository can trigger a separate deployment pipeline.
- This allows you to preview changes for each branch by accessing a unique URL for that branch's deployment.

### Adding Testing to CI/CD Pipeline (Optional)

#### Ensure Reliability:
- You can add automated tests to your CI/CD pipeline to ensure that deployments are reliable and robust.
- This can be done by integrating testing frameworks like Jest, Cypress, or any other testing tools of your choice.
- Configure Vercel to run these tests as part of the build process.
