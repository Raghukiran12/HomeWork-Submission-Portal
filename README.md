# Homework Submission Portal

React (Vite) frontend + Express/MongoDB backend.

## 1. Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

API: http://localhost:5001 
## 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

`frontend/.env` must contain:

```
VITE_API_URL=http://localhost:5001/api
```

`backend/.env` must contain `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` and `PORT=5001`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | raghukiran188@gmail.com | raGhu@1227 |
| Teacher | ramith@teacher.com | password123 |
| Admin | admin@homework.com | password123 |
