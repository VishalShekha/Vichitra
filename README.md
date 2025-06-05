# Password Manager

A secure and user-friendly web application for managing passwords, built as a full-stack project using **HTML**, **CSS**, **JavaScript**, **Node.js**, **Express**, **PostgreSQL**, and **Docker**. This project demonstrates a complete workflow for user authentication and password storage, with a focus on security through password hashing and a clean, responsive front-end interface.

## Features

- **User Authentication**: Secure signup and login functionality with password hashing using `bcrypt`.
- **Password Management**: Create, read, update, and delete (CRUD) password entries for various websites.
- **Responsive UI**: Clean and intuitive front-end built with HTML, CSS, and JavaScript for seamless user interaction.
- **Dockerized Database**: PostgreSQL database containerized with Docker for easy setup and deployment.
- **RESTful API**: Backend API built with Express.js to handle user and password data securely.
- **Copy to Clipboard**: Convenient feature to copy passwords directly from the interface.
- **Password Strength Indicator**: Visual feedback on password strength for better security awareness.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Security**: bcrypt for password hashing
- **Version Control**: Git

## Project Structure

- `init.sql`: Initializes the PostgreSQL database with `users` and `passwords` tables.
- `dockerfile`: Configures the PostgreSQL container and loads the database schema.
- `server.js`: Node.js/Express backend with RESTful API endpoints for user authentication and password management.
- `index.html`: Login page for user authentication.
- `signup.html`: Signup page for creating new user accounts.
- `listPassword.html`: Main interface for managing password entries with CRUD operations.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/password-manager.git
   cd password-manager
   ```

2. **Set up the PostgreSQL database with Docker**:

   ```bash
   docker build -t password-manager-db .
   docker run -d -p 5432:5432 --name password-manager-db password-manager-db
   ```

3. **Install backend dependencies**:

   ```bash
   npm install
   ```

4. **Configure environment variables**:
   Update the database connection settings in `server.js` if necessary (e.g., host, port, or password).

5. **Start the server**:

   ```bash
   node server.js
   ```

6. **Access the application**:
   Open `index.html` in a browser or serve it using a local server (e.g., `npx http-server`).

## Usage

1. **Sign Up**: Create a new account via the signup page.
2. **Log In**: Authenticate using your credentials to access the password manager.
3. **Manage Passwords**: Add, edit, or delete password entries for various websites.
4. **Copy Passwords**: Use the copy-to-clipboard feature for quick access to stored passwords.
5. **Logout**: Securely log out to end your session.

## Security Notes

- Passwords are hashed using `bcrypt` before storage in the database.
- Ensure the PostgreSQL database is properly secured in production (e.g., use environment variables for sensitive data).
- The front-end includes basic password strength validation for user feedback.

## Future Improvements

- Add session management or JWT for persistent authentication.
- Implement password encryption for stored credentials.
- Enhance the UI with a modern CSS framework like Tailwind CSS or Bootstrap.
- Add password generation functionality.
- Deploy the application to a cloud platform for accessibility.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure code follows the project's style guidelines and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Built as a learning project to explore full-stack development with Node.js, PostgreSQL, and Docker.
- Special thanks to the open-source community for providing tools and libraries used in this project.

© 2025 Vishal. All Rights Reserved.
