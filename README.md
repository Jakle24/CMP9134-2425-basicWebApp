# Running the Application with Docker

This project is fully containerized and can be run using Docker Compose. The setup uses specific versions and configurations as defined in the provided Dockerfiles and compose file.

## Project-specific Docker Details

- **Backend**
  - Python 3.10 (slim image)
  - All Python dependencies are installed in a virtual environment inside the container
  - Exposes port **5000** internally (not mapped to host by default)

- **Frontend**
  - Node.js version **22.13.1** (slim image)
  - Uses Vite for building and serving the React app
  - Exposes port **4173** inside the container, mapped to **localhost:5173** on your machine

- **Networking**
  - Both services are connected via a custom Docker network (`appnet`)

- **No required environment variables** are set by default, but you can add a `.env` file in each service directory if needed (see commented `env_file` lines in `docker-compose.override.yml`).

## How to Build and Run with Docker Compose

1. **Ensure Docker is running** on your system.
2. In the project root directory, run:

   ```bash
   docker compose up --build
   ```
   This will build both the backend and frontend images and start the containers.

3. **Access the application:**
   - Frontend: [http://localhost:5173/](http://localhost:5173/)
   - Backend API: Accessible from within the Docker network at port 5000 (not exposed to host by default)

4. **Stopping the application:**
   Press `Ctrl+C` in the terminal, then run:
   ```bash
   docker compose down
   ```

## Notes
- If you need to customize environment variables, create a `.env` file in either the `backend` or `frontend` directory and uncomment the `env_file` line in `docker-compose.override.yml`.
- The backend and frontend containers run as non-root users for improved security.
- The frontend is served using Vite's preview server in production mode.

---

*The above instructions are specific to this project's Docker setup. For manual installation or development in VSCode Dev Containers, see the sections above.*
