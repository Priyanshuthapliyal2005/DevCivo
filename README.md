# MindGuard

An AI-powered mental health support platform that provides real-time emotion analysis, voice interactions, and personalized therapeutic interventions.


## Architecture 

![image](https://github.com/user-attachments/assets/320fe666-0077-4c9a-b181-9a308103298f)


## Project Structure

```
mindguard/
├── frontend/               # Next.js Web Interface
│   ├── app/               # Next.js 13 App Router
│   ├── components/        # Reusable UI components
│   ├── services/          # API integration
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript definitions
│
├── backend/               # Express.js Server
│   ├── app/              # Application core
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── services/        # Business logic
│
└── agent/                # Python AI Service
    ├── agent/           # AI core modules
    ├── data/            # Training/analysis data
    └── user_data/       # User-specific data
```

## Tech Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Backend**: Express.js, MongoDB, WebSocket
- **AI Agent**: Python, Transformers, LangChain

## Setup

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Agent
```bash
cd agent
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python download_models.py
python main.py
```

## Features

- Real-time emotion analysis
- Voice-based mental health assessment
- CBT & Music therapy integration
- Crisis detection & support
- WebSocket-based voice processing
- Secure data management

## API Routes

### Authentication
```
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### Health Tracking
```
POST /health-tracking
GET  /health-tracking/:userId
```

### Voice Processing
```
POST /voice/tts
POST /voice/stt/start
WS   /stt/stream
```

## Environment Configuration

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=mindguard_jwt_secret_2024
PORT=5000
```

## Development

Start each service in a separate terminal:

```bash
# Frontend (http://localhost:3000)
cd frontend && npm run dev

# Backend (http://localhost:5000)
cd backend && npm run dev

# Agent
cd agent
source venv/bin/activate  # Windows: venv\Scripts\activate
python main.py
```

## Security

- JWT authentication
- Secure WebSocket connections
- Encrypted data storage
- API rate limiting
- CORS protection

## License

MIT 
