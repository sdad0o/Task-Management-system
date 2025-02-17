
---

# Task Management System  
A Laravel + React application with Redis integration for real-time task management.

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

## Features  
- Task creation, assignment, and tracking  
- Real-time updates using Redis pub/sub  
- User authentication system  
- RESTful API backend  
- Responsive React frontend  

## Prerequisites  
- PHP >= 8.1  
- Composer  
- Node.js >= 16.x & npm >= 9.x  
- Redis Server >= 6.x  
- MySQL/MariaDB/PostgreSQL  
- Git  

---

## Installation  

### 1. Clone Repository  
```bash
git clone https://github.com/sdad0o/Task-Management-system.git
cd Task-Management-system
```

### 2. Install Dependencies  
**Backend (Laravel):**  
```bash
composer install
```

**Frontend (React):**  
```bash
npm install
```

### 3. Configuration  
1. Copy `.env.example` to `.env`:  
```bash
cp .env.example .env
```

2. Generate application key:  
```bash
php artisan key:generate
```

3. Configure `.env` file:  
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_management
DB_USERNAME=root
DB_PASSWORD=your_db_password

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 4. Database Setup  
1. Create database `task_management`  
2. Run migrations:  
```bash
php artisan migrate
```

3. (Optional) Seed dummy data:  
```bash
php artisan db:seed
```

### 5. Redis Setup  
1. Install Redis server:  
   - **Ubuntu**: `sudo apt install redis-server`  
   - **Mac**: `brew install redis`  
   - **Windows**: Use WSL2 or Redis for Windows  

2. Start Redis:  
```bash
redis-server
```

### 6. Build Frontend  
```bash
npm run dev  # Development build
# OR
npm run build  # Production build
```

---

## Running the Application  

**Start Backend Server:**  
```bash
php artisan serve
```

**Start Frontend Dev Server:**  
```bash
npm run dev
```

Access the application at:  
`http://localhost:8000`

---

## Verify Redis Integration  
Test Redis functionality using Laravel Tinker:  
```bash
php artisan tinker
>>> Cache::put('redis_test', 'Works!', 10);
>>> Cache::get('redis_test');  # Should return "Works!"
```

---

## Troubleshooting  
- **Redis Connection Issues**:  
  - Ensure Redis server is running (`redis-cli ping` should return `PONG`)  
  - Verify `REDIS_*` values in `.env`  

- **Database Errors**:  
  - Confirm database credentials in `.env`  
  - Run `php artisan config:clear`  

- **Frontend Build Failures**:  
  - Delete `node_modules` and rerun `npm install`  
  - Update Node.js/npm to latest LTS versions  

---

