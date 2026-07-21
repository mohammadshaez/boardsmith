# Boardsmith

A production-ready dashboard builder built with **React**, **Node.js**, **Express**, and **MySQL**, deployed on **AWS EC2** using **Nginx**, **PM2**, and **GitHub Actions** for automated CI/CD.

---

## 🚀 Live Demo

**Application:** http://13.54.117.190

---

## ✨ Features

- 📊 Create and manage dashboards
- 🧩 Widget-based dashboard builder
- 📁 AWS S3 for image uploads
- 💾 MySQL database integration
- 🔗 RESTful API
- 📱 Responsive user interface
- ⚡ Optimized production build using Vite
- 🔄 Automated deployment with GitHub Actions
- 🚀 Production deployment on AWS EC2

---

## 🛠 Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- MySQL

### DevOps & Infrastructure

- AWS EC2 (Ubuntu)
- Nginx
- PM2
- GitHub Actions
- SSH

---

## 🏗 Architecture

```text
                   Internet
                       │
                       ▼
                Elastic IP / Domain
                       │
                       ▼
                  Nginx (Port 80)
                 /               \
                /                 \
               ▼                   ▼
    React Static Files       Node.js API
    /var/www/boardsmith     localhost:3000
                                    │
                                    ▼
                                 MySQL
```

---

## 📂 Project Structure

```
boardsmith
│
├── api
│   ├── routes
│   ├── controllers
│   ├── middleware
│   ├── uploads
│   ├── server.js
│   └── package.json
│
├── client
│   ├── src
│   ├── public
│   ├── dist
│   └── package.json
│
└── .github
    └── workflows
        └── deploy.yml
```

---

## ⚙️ Local Development

### Clone the repository

```bash
git clone <repository-url>
cd boardsmith
```

### Backend

```bash
cd api
npm install
npm start
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=3000

DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=dashboard_app

JWT_SECRET=your_secret

FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Deployment

The application is deployed on **AWS EC2** using:

- Ubuntu
- Nginx
- PM2
- GitHub Actions
- Elastic IP
- MySQL

### Deployment Workflow

Every push to the `master` branch automatically:

1. Connects to the EC2 instance via SSH
2. Pulls the latest source code
3. Installs backend dependencies
4. Installs frontend dependencies
5. Builds the React application
6. Copies the production build to `/var/www/boardsmith`
7. Restarts the backend using PM2

---

## 🔄 CI/CD Pipeline

GitHub Actions automates deployment.

```
Developer
    │
git push
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
SSH
    ▼
AWS EC2
    │
git pull
npm install
npm run build
pm2 restart
    │
    ▼
Live Application
```

---

## 🌐 Nginx Reverse Proxy

Nginx serves the React application and forwards API requests to the Express backend.

```
Browser
   │
   ▼
Nginx
   ├── / → React
   └── /api → Express
```

Benefits:

- Reverse proxy
- Static file serving
- SPA routing
- Better performance
- Security
- Upload size management

---

## 📦 PM2

PM2 is used to:

- Keep the backend running
- Automatically restart on crashes
- Manage Node.js processes
- View application logs

Useful commands:

```bash
pm2 list

pm2 logs

pm2 restart boardsmith-api

pm2 save
```

---

## 🧠 Challenges Solved

During deployment, the following production issues were resolved:

- SSH private key permission errors
- EC2 Security Group configuration
- MySQL authentication
- Environment variable management
- Reverse proxy configuration
- Nginx 500 Internal Server Error
- Static asset serving
- React SPA routing
- CORS configuration
- File upload limits (413 Request Entity Too Large)
- PM2 process management
- GitHub Actions deployment
- Elastic IP migration

---

## 🚧 Future Improvements

- HTTPS using Let's Encrypt
- Custom domain
- AWS Route 53
- Docker
- Docker Compose
- AWS RDS
- Redis
- CloudFront CDN
- Terraform
- Monitoring with CloudWatch

---

## 📚 What I Learned

This project provided hands-on experience with:

- Full Stack Development
- Linux Server Administration
- AWS EC2
- Elastic IP
- Nginx
- Reverse Proxy
- PM2
- GitHub Actions
- CI/CD
- SSH Authentication
- Environment Management
- MySQL
- Production Deployment
- CORS
- Debugging Production Issues
- File Upload Handling
- Deployment Automation

---

## Repository structure

- `api/` — Express backend API
- `client/` — React frontend built with Vite

## Features

- Dashboard creation and editing
- Image uploads via `/api/upload`
- Dashboard persistence in MySQL
- File retrieval via `/api/files/:id`

## Local development

### Backend

1. Install dependencies:
   ```bash
   cd api
   npm install
   ```
2. Create `api/.env` with your database and AWS settings if needed.
3. Start the backend:
   ```bash
   node server.js
   ```
4. Verify:
   - `http://localhost:3000/health`

### Frontend

1. Install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Start the frontend:
   ```bash
   npm run dev
   ```
3. Open:
   - `http://localhost:5173`

## Deployment notes

- The backend is deployed to EC2 and uses nginx as a reverse proxy.

## Project files

- `api/server.js` — Express app entrypoint
- `api/middleware/upload.js` — multer upload configuration
- `api/routes/fileRoutes.js` — upload route
- `client/src/` — frontend source code

## Useful commands

- `npm install` — install dependencies in a package folder
- `npm run dev` — start Vite development server in `client`
- `node server.js` — run the backend server in `api`

## 📄 License

This project is for learning and portfolio purposes.
