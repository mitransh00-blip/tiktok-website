# MITRANSH MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud) - Recommended

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/atlas
2. Click "Start Free" button
3. Sign up with Google or email
4. Verify your email

### Step 2: Create Free Cluster
1. After login, click "Create" 
2. Choose "Free" (M0) tier
3. Select "AWS" as cloud provider
4. Choose a region close to you (e.g., eu-west-2 or us-east-1)
5. Click "Create Cluster" (wait 1-3 minutes)

### Step 3: Create Database User
1. Click "Database Access" in left menu
2. Click "Add New Database User"
3. Create username/password (remember these!)
4. Set privilege to "Read and Write to any database"
5. Click "Add User"

### Step 4: Network Access (Important!)
1. Click "Network Access" in left menu
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Database" in left menu
2. Click "Connect" on your cluster
3. Select "Drivers"
4. Copy the connection string
5. Replace `<password>` with your database user password

Example:
```
mongodb+srv://myuser:mypassword@cluster0.xyz123.mongodb.net/mitransh?retryWrites=true&w=majority
```

### Step 6: Update .env File
Edit `Backend/.env`:
```
MONGO_URI=mongodb+srv://your_username:your_password@cluster_name.mongodb.net/mitransh?retryWrites=true&w=majority
```

---

## Option 2: Local MongoDB

### Step 1: Download MongoDB
1. Go to: https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server
3. Install with default settings

### Step 2: Create Data Folder
1. Create folder: `C:\data\db` (Windows)

### Step 3: Run MongoDB
```bash
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

### Step 4: Update .env File
```
MONGO_URI=mongodb://localhost:27017/mitransh
```

---

## Testing Your Setup

After setting up MongoDB:

1. **Start Backend:**
```bash
cd Backend
npm install
npm start
```

You should see: "MITRANSH Server running on port 5000" and "MongoDB connected!"

2. **Start Frontend:**
```bash
cd Frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Troubleshooting

**"MongoNetworkError"**
- Check network access settings (Step 4 above)
- Make sure username/password are correct

**"MongoServerSelectionError"**
- Wait for cluster to finish creating
- Check your connection string format

**"Authentication Failed"**
- Verify username and password in connection string
- Check database user privileges

