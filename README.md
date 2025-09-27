# ERP System

This is a comprehensive ERP (Enterprise Resource Planning) System built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**. It provides a modern, modular, and extensible platform for managing various business operations such as inventory, sales, finance, and user access. The project follows best practices in frontend architecture, styling, and type safety.

![Next.js](https://img.shields.io/badge/Framework-Next.js-000?logo=next.js)
![React](https://img.shields.io/badge/Library-React-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)

<img src="https://github.com/PoeMadara/nextjs-erp-system/blob/master/extra/ERP_System_video.gif" width="600" height="400" alt="demo">

> You can try the demo if you visit this link: https://goo.su/bZttdv

## Autors

- **Carlos Vergara Gámez**  
  [LinkedIn](https://www.linkedin.com/in/carlosvergaragamez/) | [GitHub](https://github.com/PoeMadara)

- **Lavinia Cristiana Bacaru**  
  [LinkedIn](https://www.linkedin.com/in/lavinia-bacaru-devsecops/) | [GitHub](https://github.com/codewithlavi)

## Project Overview

The ERP System includes modules for managing:

*   **Dashboard:** An overview of key metrics and activities.
*   **Customers (Clientes):** Managing customer information and history.
*   **Suppliers (Proveedores):** Managing supplier details and relationships.
*   **Employees (Empleados):** Managing employee profiles, roles, and permissions.
*   **Products (Productos):** Cataloging products, managing inventory, and pricing.
*   **Invoices (Facturas):** Creating and managing sales and purchase invoices.
*   **Warehouse (Almacén):** Managing stock locations and inventory.
*   **System Notifications:** Configuring and sending system-wide notifications.
*   **User Profile & Settings:** Allowing users to manage their profile and application settings.

The application supports multi-language (English and Spanish) and features a role-based access control system.

## Technologies Used

### Frontend:
![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232a?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-%23171717?logo=radixui&logoColor=white&label=shadcn%2Fui)
![Lucide](https://img.shields.io/badge/Lucide%20React-000000?logo=lucide&logoColor=white&label=Icons)
![Zod](https://img.shields.io/badge/Zod-%23e6ccff?logo=typescript&logoColor=black)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?logo=reacthookform&logoColor=white)
![date-fns](https://img.shields.io/badge/date--fns-007ACC?logo=javascript&logoColor=white)

### Hosted:
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)

### Backend (Simulated):
![Mock Data](https://img.shields.io/badge/Backend-Mock%20Data-informational)

This project currently uses in-memory mock data stored in `src/lib/mockData.ts` to simulate database interactions. This should be replaced with a real database for production use.

### GenAI: 
![Genkit](https://img.shields.io/badge/Genkit-FFB300?logo=google&logoColor=black)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white)

### Linting & Formatting: 
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=000)


## Key Features

*   **Modular Design:** Separate modules for different ERP functionalities.
*   **CRUD Operations:** Create, Read, Update, and Delete functionality for core entities.
*   **Authentication:** User registration and login system.
*   **Role-Based Access Control (RBAC):** Different user roles (Admin, Moderator, User) with varying permissions.
*   **Internationalization (i18n):** Support for English and Spanish languages.
*   **Responsive Design:** UI adapts to different screen sizes.
*   **Client-Side & Server-Side Logic:** Leveraging Next.js App Router for optimal performance.
*   **Team Activity Logging:** Tracks significant user actions within the system.
*   **System Notifications:** Allows admins/moderators to send notifications to users.

## Project Structure

```
.
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, API routes)
│   │   ├── (auth)/         # Auth-related pages (login, register) - conceptual grouping
│   │   ├── dashboard/      # Dashboard and its sub-sections
│   │   ├── api/            # API routes (if any)
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   ├── components/
│   │   ├── crud/           # Forms and components for CRUD operations
│   │   ├── dashboard/      # Dashboard specific components
│   │   ├── icons/          # Custom SVG icons
│   │   ├── layout/         # Layout components (Sidebar, UserNav)
│   │   ├── shared/         # Shared components (PageHeader, Pagination)
│   │   └── ui/             # shadcn/ui components
│   ├── contexts/           # React contexts (AuthContext, LanguageContext)
│   ├── hooks/              # Custom React hooks (useAuth, useTranslation)
│   ├── lib/                # Utility functions, mock data, etc.
│   ├── locales/            # Translation files (en.json, es.json)
│   └── types/              # TypeScript type definitions
├── .env.example            # Example environment variables
├── .gitignore              # Files and folders to ignore in Git
├── components.json         # shadcn/ui configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/PoeMadara/nextjs-erp-system
    cd https://github.com/PoeMadara/nextjs-erp-system
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    *   Copy the `.env.example` file to a new file named `.env.local`:
        ```bash
        cp .env.example .env.local
        ```
    *   Open `.env.local` and configure the necessary variables (e.g., database connection details if you are setting up a real database). For now, the mock data will work without these.

### Running the Development Server

1.  **Start the Next.js development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will typically start the application on `http://localhost:3000` (or `http://localhost:9002` as per your `package.json`).

2.  **(Optional) Start Genkit development server (if using GenAI features):**
    Open a new terminal and run:
    ```bash
    npm run genkit:dev
    ```

## Usage Guide

1.  **Registration:**
    *   Navigate to the `/register` page.
    *   Fill in your name, email, password, and preferred language.
    *   The first user to register will automatically be assigned the 'admin' role. Subsequent users will be 'user' by default.

2.  **Login:**
    *   Navigate to the `/login` page.
    *   Enter your registered email and password.

3.  **Dashboard:**
    *   After logging in, you will be redirected to the dashboard.
    *   The dashboard provides an overview of key metrics, recent activities, and quick links.

4.  **Navigation:**
    *   Use the sidebar to navigate between different modules (Customers, Products, Invoices, etc.).

5.  **CRUD Operations:**
    *   Most modules will have a list view with options to:
        *   **Create:** Add new entries (e.g., new customer, new product).
        *   **Read/View:** See details of existing entries.
        *   **Update:** Edit existing entries.
        *   **Delete:** Remove entries (often with a confirmation dialog).
    *   Use the search bars and filters to find specific records.
    *   Pagination is implemented for lists that can grow large.

6.  **User Profile and Settings:**
    *   Access your profile and settings from the user avatar dropdown in the header.
    *   **Profile Page:** View your details, and edit your bio.
    *   **Settings Page:** Change your email, password, and notification preferences.

7.  **System Notifications (Admin/Moderator):**
    *   Admins and Moderators can access the "System Notifications" section from the sidebar.
    *   Here, they can create, view, edit, and delete notification configurations.
    *   Notifications can be targeted to specific user roles (admin, moderator, user, all) and can be sent once or on a recurring basis.
    *   Users will receive these notifications via (simulated) email if their email notification setting is enabled in their profile settings.

## Connecting to a Real Database

The current application uses mock data. To connect to a real database:

1.  **Choose and set up your database:** (e.g., PostgreSQL, MySQL, MongoDB).
2.  **Install the necessary database client library for Node.js:**
    *   For PostgreSQL: `npm install pg`
    *   For MySQL: `npm install mysql2`
    *   For MongoDB: `npm install mongodb`
3.  **Update `.env.local`** with your database connection credentials.
4.  **Modify `src/lib/mockData.ts` (or create new service files):**
    *   Replace the functions that interact with the mock arrays (e.g., `getClientes`, `addCliente`) with functions that perform actual database queries using your chosen client library or an ORM (like Prisma or TypeORM).
    *   You will need to write SQL queries or use ORM methods to interact with your database tables/collections.
    *   Ensure your database schema matches the `src/types/index.ts` interfaces.

## Deployment

### Vercel (Recommended)

1.  Push your project to a GitHub, GitLab, or Bitbucket repository.
2.  Sign up or log in to [Vercel](https://vercel.com/).
3.  Import your project from your Git provider.
4.  Configure environment variables in the Vercel project settings (especially for database connections and any API keys).
5.  Vercel will automatically build and deploy your application.

### Firebase Hosting

1.  Install Firebase CLI: `npm install -g firebase-tools`
2.  Login to Firebase: `firebase login`
3.  Initialize Firebase in your project: `firebase init hosting`
    *   Select your Firebase project.
    *   Configure as a single-page app (SPA): No (for Next.js with server-side rendering).
    *   Set your public directory to `.next` (or follow Next.js specific Firebase deployment guides).
4.  For dynamic Next.js features, you might need to set up Firebase Functions. Refer to the official [Firebase documentation for deploying Next.js apps](https://firebase.google.com/docs/hosting/frameworks/nextjs).
5.  Deploy: `firebase deploy`


> ## License
This project is licensed under the Apache 2.0 License - see the [LICENSE](https://github.com/PoeMadara/nextjs-erp-system/blob/master/LICENSE) file for details.



