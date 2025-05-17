# GhostPay-Lite Frontend

This is the frontend application for GhostPay-Lite, a lightweight, microservice-based payment token API that issues single-use virtual cards and processes charges.

## Features

- **Modern UI** - Built with React, TypeScript, and Tailwind CSS
- **Interactive Card Animation** - Visual representation of virtual cards with flip animation
- **API Documentation** - Comprehensive documentation of available API endpoints
- **API Explorer** - Test API endpoints directly from the browser
- **Authentication** - Login and registration functionality

## Tech Stack

- **React** - UI library
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **Vite** - Build tool and development server

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/ghostpay-lite.git
cd ghostpay-lite/frontend
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to http://localhost:5173

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/                 # Source files
│   ├── assets/          # Assets (images, fonts, etc.)
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Root component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Backend Integration

By default, the frontend is configured to proxy API requests to a backend running at `http://localhost:3000`. You can change this in the `vite.config.ts` file.

## Building for Production

To build the app for production, run:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the ISC License.
