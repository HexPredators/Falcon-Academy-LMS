echo "🚀 FALCON ACADEMY DLMS - INFINITYFREE DEPLOYMENT"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' 

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check required tools
check_requirements() {
    print_status "Checking system requirements..."
    
    if command -v node &> /dev/null; then
        print_success "Node.js found: $(node --version)"
    else
        print_error "Node.js is required but not installed"
        exit 1
    fi
    
    if command -v npm &> /dev/null; then
        print_success "npm found: $(npm --version)"
    else
        print_error "npm is required but not installed"
        exit 1
    fi
    
    if command -v mysql &> /dev/null; then
        print_success "MySQL client found"
    else
        print_warning "MySQL client not found - database setup will need to be manual"
    fi
}

# Create directory structure
create_structure() {
    print_status "Creating deployment directory structure..."
    
    mkdir -p falcon-academy-deploy
    cd falcon-academy-deploy
    
    mkdir -p {backend,frontend,database,config,logs,uploads}
    mkdir -p backend/{config,controllers,middleware,routes,utils,models,uploads}
    mkdir -p frontend/{src,public,build}
    mkdir -p uploads/{assignments,submissions,books,temp}
    
    print_success "Directory structure created"
}

# Copy and paste backend files
setup_backend() {
    print_status "Setting up backend application..."
    
    # Copy backend files
    cp -r ../backend/* ./backend/
    
    # Create production environment file for backend
    cat > ./backend/.env << EOL
# Falcon Academy DLMS - Production Environment
# ===========================================

# Database Configuration (InfinityFree MySQL)
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_$(openssl rand -hex 32)
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://falconacademy-lms.wuaze.com

# Email Service (SMTP)
EMAIL_USER=noreplay.falconacademylms@gmail.com
EMAIL_PASSWORD=Don't Forget this you stupid!
EMAIL_FROM=Falcon Academy <noreplay.falconacademylms@gmail.com>

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=I don't have, remember later Spectra!!
CLOUDINARY_API_KEY=later i will find it
CLOUDINARY_API_SECRET=Same as above 

# AI Services
OPENAI_API_KEY=later i will add it

# Security Settings
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=1000

# Feature Flags
ENABLE_AI_ASSISTANT=true
ENABLE_PARENT_LINKING=true
ENABLE_EMAIL_VERIFICATION=true
ENABLE_REAL_TIME=true

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
EOL

    # Create backend package.json
    cat > ./backend/package.json << EOL
{
  "name": "falcon-academy-backend",
  "version": "2.0.0",
  "description": "Falcon Academy DLMS Backend - Real-time Edition",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "production": "NODE_ENV=production node server.js",
    "setup-db": "node scripts/setup-database.js",
    "migrate": "node scripts/run-migrations.js",
    "seed": "node scripts/seed-sample-data.js",
    "backup": "node scripts/backup-database.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "mysql2": "^3.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5",
    "nodemailer": "^6.9.4",
    "cloudinary": "^1.40.0",
    "openai": "^4.0.0",
    "express-rate-limit": "^6.8.1",
    "helmet": "^7.0.0",
    "compression": "^1.7.4",
    "moment": "^2.29.4",
    "joi": "^17.9.2",
    "express-validator": "^7.0.1",
    "crypto": "^1.0.1",
    "winston": "^3.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=7.0.0"
  }
}
EOL

    print_success "Backend setup completed"
}

# Setup frontend for production
setup_frontend() {
    print_status "Setting up frontend application..."
    
    # Copy frontend files
    cp -r ../frontend/* ./frontend/
    
    # Create production environment file for frontend
    cat > ./frontend/.env.production << EOL
# Falcon Academy Frontend - Production
VITE_API_URL=https://your-domain.epizy.com/api
VITE_APP_NAME=Falcon Academy DLMS
VITE_APP_VERSION=2.0.0
VITE_ENABLE_REAL_TIME=true
VITE_SOCKET_URL=https://your-domain.epizy.com
EOL

    # Create frontend package.json
    cat > ./frontend/package.json << EOL
{
  "name": "falcon-academy-frontend",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "echo 'Build completed. Upload build folder to InfinityFree'"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "axios": "^1.5.0",
    "socket.io-client": "^4.7.2",
    "lucide-react": "^0.288.0",
    "recharts": "^2.8.0",
    "react-query": "^3.39.3",
    "react-hook-form": "^7.45.4",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0",
    "react-toastify": "^9.1.3",
    "framer-motion": "^10.16.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.0",
    "vite": "^4.4.5"
  }
}
EOL

    print_success "Frontend setup completed"
}

# Database setup
setup_database() {
    print_status "Preparing database setup..."
    
    cp ../database/complete_schema.sql ./database/
    cp ../database/sample_data.sql ./database/
    
    # Create database setup script
    cat > ./database/setup.sh << 'EOL'
#!/bin/bash
echo "🗄️  Falcon Academy DLMS Database Setup"
echo "====================================="

read -p "Enter MySQL host: " DB_HOST
read -p "Enter MySQL username: " DB_USER
read -p "Enter MySQL password: " -s DB_PASS
echo
read -p "Enter database name: " DB_NAME

echo "Creating database and tables..."
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME < complete_schema.sql

if [ $? -eq 0 ]; then
    echo "Database schema created successfully by the one and only Spectra!"
    
    read -p "Do you want to load sample data? (y/n): " LOAD_SAMPLE
    if [ "$LOAD_SAMPLE" = "y" ]; then
        mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME < sample_data.sql
        echo "Sample data loaded successfully by the one and only Spectra!"
    fi
else
    echo "Database setup failed!"
    exit 1
fi
EOL

    chmod +x ./database/setup.sh
    print_success "Database setup prepared"
}

# Create deployment instructions
create_deployment_guide() {
    print_status "Creating deployment guide..."
    
    cat > DEPLOYMENT_GUIDE.md << 'EOL'
# 🚀 Falcon Academy DLMS - InfinityFree Deployment Guide

## Prerequisites

1. **InfinityFree Account** with MySQL database
2. **Cloudinary Account** for file storage
3. **Gmail Account** for email service
4. **Domain** 

## Step 1: Database Setup

1. Login to InfinityFree control panel
2. Create MySQL database
3. Run database setup:
```bash
cd database
./setup.sh