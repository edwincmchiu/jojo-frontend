# Jojo Frontend

The Jojo Frontend is a web application built using [Vite](https://vitejs.dev/) and [React](https://reactjs.org/). It serves as the user interface for the Jojo project.

It assumes the backend services are running on `localhost:3010`.

## Getting Started

Follow these instructions to set up, run, and build the project.

### Installation

To install the project dependencies, navigate to the project root and run:
```bash
npm ci
```

### Development

To start the development server with hot-module replacement, run:
```bash
pnpm run dev
```
This will typically start the application on `http://localhost:5173`.

### Build and Deployment

To create a production-ready build of the application, run:
```bash
npm run build
```
This command bundles the application for production to the `dist` directory.

You can preview the production build locally using:
```bash
npm run preview
```
For deployment, the contents of the `dist` directory should be served by a web server.
