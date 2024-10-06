# ProMage Backend Application

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16.x or above)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/mbsj145/promage-backend.git
   cd promage-backend
   ```

2. Install dependencies:

  ```
   npm install
  ```

3. Create and configure environment files. Copy the sample environment file and modify it according to your setup.

  ```
   nano .env.development
   ```

4. Build and start the Docker containers:

   ```
   npm run docker:dev
   ```

5. The backend API should now be running at `http://localhost:4000`.

### Running without Docker

If you prefer to run the project directly on your machine:

1. Install the necessary Node.js packages:

   ```
   npm install
   ```

2. Start the development server:

   ```
   npm run dev
   ```

## Architecture

The application is structured as a Node.js backend using TypeScript, with the following main components:

- **API Layer**: Handles incoming HTTP requests for managing projects and tasks via CRUD operations.
  - Routes are defined in the `routes` directory.
- **Event-driven System**: A service that publishes and logs project-related events such as project creation, task deletion, and project updates.
  - Events are handled through webhooks, enabling external systems to subscribe and receive notifications.
- **Database Layer**: Interacts with the database to store and retrieve project, task, and manager details.
  - Models and database logic are located in the `api` directory.
- **Logging Service**: A standalone service that logs events to a database or a file system for auditing and tracking purposes.
  - This service can be customized further based on your needs.

### Key Technologies Used:
- **Node.js**: Backend runtime
- **TypeScript**: Provides type safety and improved code maintainability
- **Docker**: For containerized development and deployment
- **Event-driven Architecture**: For handling real-time project and task updates

## Environment Variables

The application requires the following environment variables. Modify the `.env.development` file as needed:

- `PORT`: Port number to run the application (default is 4000)
- `NODE_ENV`: development(default development)

Ensure the `.env.development` file is correctly configured before running the application.

## Running Tests

We use [Jest](https://jestjs.io/) for testing.

To run tests:

```
npm run test
```
