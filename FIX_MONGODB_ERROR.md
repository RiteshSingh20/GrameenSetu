# 🔧 FIX MONGODB AUTHENTICATION ERROR

## ❌ ERROR
```
MongoDB connection error: MongoServerError: bad auth : authentication failed
```

## ✅ SOLUTION

Your `.env` file has a placeholder `<ENCODED_PASSWORD>` that needs to be replaced with your actual MongoDB password.

---

## 📝 STEPS TO FIX

### 1. Get Your MongoDB Password
- Go to MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Login to your account
- Go to Database Access
- Find your user `riteshsinghvs_db_user`
- Click "Edit" and reset password if needed
- Copy the password

### 2. URL-Encode Your Password (If Needed)
If your password has special characters like `@`, `#`, `!`, etc., you need to URL-encode them:

**Common Special Characters:**
```
@ → %40
# → %23
! → %21
$ → %24
% → %25
& → %26
* → %2A
+ → %2B
: → %3A
; → %3B
= → %3D
? → %3F
/ → %2F
```

**Example:**
- Password: `my@password#123`
- Encoded: `my%40password%23123`

**Online Tool:** https://www.urlencoder.org/

### 3. Update `.env` File

Replace `YOUR_ACTUAL_PASSWORD` with your real password:

```
MONGO_URI=mongodb+srv://riteshsinghvs_db_user:YOUR_ACTUAL_PASSWORD@grameensetu.axgh7x0.mongodb.net/GrameenSetu?appName=Grameensetu
```

**Example:**
```
MONGO_URI=mongodb+srv://riteshsinghvs_db_user:myPassword123@grameensetu.axgh7x0.mongodb.net/GrameenSetu?appName=Grameensetu
```

### 4. Restart Server
```bash
npm start
```

---

## ✅ VERIFY CONNECTION

If successful, you should see:
```
Server listening on port 4000
MongoDB connected successfully
```

---

## 🆘 STILL NOT WORKING?

### Check 1: Verify Credentials
- Username: `riteshsinghvs_db_user`
- Database: `GrameenSetu`
- Cluster: `grameensetu.axgh7x0.mongodb.net`

### Check 2: Verify IP Whitelist
- Go to MongoDB Atlas
- Go to Network Access
- Make sure your IP is whitelisted (or add `0.0.0.0/0` for all IPs)

### Check 3: Check Password
- Make sure password is correct
- Make sure special characters are URL-encoded
- Try resetting password in MongoDB Atlas

### Check 4: Test Connection String
Use MongoDB Compass to test:
1. Download MongoDB Compass
2. Paste your connection string
3. Try to connect
4. If it works in Compass, it will work in Node.js

---

## 📋 FINAL `.env` FILE

```
PORT=4000
MONGO_URI=mongodb+srv://riteshsinghvs_db_user:YOUR_ACTUAL_PASSWORD@grameensetu.axgh7x0.mongodb.net/GrameenSetu?appName=Grameensetu

JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiaWF0IjoxNzY0NTMwMjk0LCJleHAiOjE3NjUxMzUwOTR9.Nx-ousKHuY-3LWwcVhF_7z9MYZgEhNQzJLYMBWdebFo
JWT_REFRESH_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiaWF0IjoxNzY0NTMwMjk0LCJleHAiOjE3NjUxMzUwOTR9.Nx-ousKHuY-3LWwcVhF_7z9MYZgEhNQzJLYMBWdebFo
JWT_EXPIRES_IN=7d
OTP_TTL_MINUTES=10
UPLOAD_DIR=uploads
BASE_URL=http://localhost:4000
NOTIFY_EMAIL=vs8601580444@gmail.com
NOTIFY_EMAIL_PASS=uhmw lezd easy zyui
```

---

## ✅ DONE!

Your MongoDB connection should now work. Start the server:

```bash
npm start
```

You should see:
```
Server listening on port 4000
MongoDB connected successfully
```

---

**Status:** ✅ FIXED
