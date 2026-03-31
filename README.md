# GrameenSetu Backend API

> **Fair Price to Farmer, Fresh to You** 🌾

A comprehensive agricultural marketplace backend connecting farmers with vendors. Built with Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Workflow](#workflow)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

GrameenSetu is a digital marketplace platform that bridges the gap between farmers and vendors. It enables:

- **Farmers** to list their crops and receive offers from multiple vendors
- **Vendors** to discover available crops and place competitive offers
- **Transparent Pricing** with fair market rates
- **Efficient Logistics** with integrated delivery management
- **Secure Payments** with multiple payment options

### Key Statistics
- **13 Controllers** - Comprehensive business logic
- **7 MongoDB Models** - Scalable data architecture
- **11 Route Files** - 40+ API endpoints
- **Geolocation Support** - Distance-based crop discovery
- **Multi-language Support** - 12 Indian languages

---

## ✨ Features

### 👨🌾 Farmer Features
- ✅ OTP-based authentication
- ✅ Comprehensive profile management
- ✅ Crop listing with photos and details
- ✅ Receive offers from multiple vendors
- ✅ Accept/Reject/Negotiate offers
- ✅ Track delivery status
- ✅ Receive payment notifications
- ✅ View transaction history

### 🏢 Vendor Features
- ✅ OTP-based authentication
- ✅ Business profile setup
- ✅ Discover crops via feed and search
- ✅ Send competitive offers
- ✅ Arrange pickup/delivery
- ✅ Process payments
- ✅ Track deals and analytics
- ✅ Manage multiple offers

### 🔧 System Features
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Geolocation-based search
- ✅ Email notifications
- ✅ Real-time offer updates
- ✅ Comprehensive error handling
- ✅ Request validation with Joi
- ✅ File upload management

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | 14+ |
| **Framework** | Express.js | 5.1.0 |
| **Database** | MongoDB | 4.4+ |
| **ODM** | Mongoose | 9.0.0 |
| **Authentication** | JWT | 9.0.2 |
| **Security** | bcryptjs | 3.0.3 |
| **Validation** | Joi | 18.0.2 |
| **File Upload** | Multer | 2.0.2 |
| **Email** | Nodemailer | 7.0.12 |
| **Logging** | Morgan | 1.10.0 |
| **CORS** | cors | 2.8.5 |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14 or higher
- MongoDB 4.4 or higher
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/RiteshSingh20/GrameenSetu.git
cd GrameenSetu/Grameensetu_Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the server**

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

5. **Verify server is running**
```bash
curl http://localhost:4000/health
# Response: { "status": "ok" }
```

---

## 📁 Project Structure

```
Grameensetu_Backend/
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── controllers/                 # Business logic (13 files)
│   │   ├── authController.js
│   │   ├── farmerAuthController.js
│   │   ├── vendorAuthController.js
│   │   ├── cropController.js
│   │   ├── cropFeedController.js
│   │   ├── offerController.js       # ⭐ Core offer workflow
│   │   ├── paymentController.js     # ⭐ Payment processing
│   │   ├── deliveryController.js
│   │   ├── dashboardController.js
│   │   ├── marketController.js
│   │   ├── notificationController.js
│   │   ├── vendorProfileController.js
│   │   └── farmerController.js
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   └── errorHandler.js          # Global error handling
│   │
│   ├── models/                      # MongoDB schemas (7 files)
│   │   ├── farmer.js
│   │   ├── Vendor.js
│   │   ├── CropListing.js
│   │   ├── Offer.js                 # ⭐ Core offer model
│   │   ├── Notification.js
│   │   ├── Otp.js
│   │   └── RefreshToken.js
│   │
│   ├── routes/                      # API endpoints (11 files)
│   │   ├── auth.js
│   │   ├── farmerAuth.js
│   │   ├── vendorAuth.js
│   │   ├── crop.js
│   │   ├── cropFeed.js
│   │   ├── offer.js                 # ⭐ Offer endpoints
│   │   ├── payment.js               # ⭐ Payment endpoints
│   │   ├── dashboard.js
│   │   ├── market.js
│   │   ├── notification.js
│   │   └── vendorProfile.js
│   │
│   └── utils/                       # Helper functions
│       ├── app.js                   # Express app setup
│       ├── server.js                # Server entry point
│       ├── deliveryCalculator.js
│       ├── otpHelper.js
│       ├── tokenUtils.js
│       ├── sendEmail.js
│       ├── upload.js
│       ├── validators.js
│       ├── cropValidators.js
│       └── notifyVendor.js
│
├── uploads/                         # File storage
├── .env                             # Environment variables (DO NOT COMMIT)
├── .env.example                     # Environment template
├── .gitignore
├── package.json
├── package-lock.json
├── BACKEND_ANALYSIS.md              # Comprehensive documentation
├── GITHUB_PUSH_GUIDE.md             # GitHub setup guide
└── README.md                        # This file
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Farmer Authentication
```
POST   /api/farmer/auth/send-otp      Send OTP to farmer
POST   /api/farmer/auth/verify-otp    Verify OTP and create account
GET    /api/farmer/auth/profile       Get farmer profile
PUT    /api/farmer/auth/profile       Update farmer profile
```

#### Vendor Authentication
```
POST   /api/vendor/auth/send-otp      Send OTP to vendor
POST   /api/vendor/auth/verify-otp    Verify OTP and create account
GET    /api/vendor/auth/profile       Get vendor profile
PUT    /api/vendor/auth/profile       Update vendor profile
```

### Crop Management

#### Farmer Crop Management
```
POST   /api/crop/list                 Create new crop listing
GET    /api/crop/:cropId              Get crop details
PUT    /api/crop/:cropId              Update crop listing
DELETE /api/crop/:cropId              Delete crop listing
GET    /api/crop/farmer/all           Get all farmer crops
```

#### Vendor Crop Discovery
```
GET    /api/vendor/crops/feed         Get crop feed (paginated, filtered)
GET    /api/vendor/crops/search       Search crops by name, location, price
GET    /api/vendor/crops/:cropId      Get crop details
```

### Offer Management ⭐

```
POST   /api/offers/send               Vendor sends offer on crop
POST   /api/offers/respond            Farmer accepts/rejects/negotiates
POST   /api/offers/delivery           Vendor arranges pickup
GET    /api/offers/payment/:offerId   Proceed to payment (validates delivery)
GET    /api/offers/farmer             Get all offers for farmer
GET    /api/offers/vendor             Get all offers sent by vendor
POST   /api/offers/:offerId/mark-seen Mark offer as seen
POST   /api/offers/complete           Farmer confirms deal completion
```

### Payment Management ⭐

```
GET    /api/payment/proceed/:offerId  Validate payment eligibility
POST   /api/payment/confirm/:offerId  Confirm payment
```

### Dashboard & Analytics

```
GET    /api/dashboard/vendor          Vendor dashboard statistics
GET    /api/dashboard/farmer          Farmer dashboard statistics
```

### Market Information

```
GET    /api/market/prices             Get current market prices
```

### Notifications

```
GET    /api/notifications             Get user notifications
PUT    /api/notifications/:id/read    Mark notification as read
```

---

## 🗄️ Database Models

### Farmer Model
```javascript
{
  fullName: String,
  mobile: String (unique),
  email: String (unique),
  preferredLanguage: String (12 languages),
  profilePhotoUrl: String,
  farmerType: String (Individual, FPO Member),
  govtIdType: String,
  govtIdNumber: String,
  isKycVerified: Boolean,
  village: String,
  district: String,
  state: String,
  pincode: String,
  farmLocation: GeoJSON Point,
  primaryCrops: [String],
  secondaryCrops: [String],
  landSize: { value, unit },
  farmingType: String,
  harvestSeason: String,
  acceptedTerms: Boolean,
  consentForNotifications: Boolean,
  timestamps: true
}
```

### Vendor Model
```javascript
{
  fullName: String,
  mobile: String (unique),
  email: String,
  businessName: String,
  businessType: String,
  gstNumber: String,
  panNumber: String,
  address: String,
  district: String,
  state: String,
  pincode: String,
  location: GeoJSON Point,
  procurementRadiusKm: Number,
  isKycVerified: Boolean,
  timestamps: true
}
```

### CropListing Model
```javascript
{
  farmerId: ObjectId (ref: Farmer),
  cropName: String,
  quantity: Number,
  unit: String (Kg, Quintal, Ton),
  expectedPrice: Number,
  finalPrice: Number,
  harvestDate: Date,
  qualityGrade: String (A, B, C),
  isOrganic: Boolean,
  village: String,
  district: String,
  state: String,
  pincode: String,
  farmLocation: GeoJSON Point,
  pickupType: String,
  photos: [String],
  status: String (Active, Sold, Expired),
  soldAt: Date,
  timestamps: true
}
```

### Offer Model ⭐
```javascript
{
  cropId: ObjectId (ref: CropListing),
  farmerId: ObjectId (ref: Farmer),
  vendorId: ObjectId (ref: Vendor),
  offeredPrice: Number,
  finalPrice: Number,
  status: String (Pending, Accepted, Rejected, Negotiating, Completed),
  seenByFarmer: Boolean,
  seenAt: Date,
  delivery: {
    vehicleType: String,
    distanceKm: Number,
    estimatedTimeHr: Number,
    estimatedFare: Number,
    confirmed: Boolean,
    confirmedAt: Date  // ⭐ Critical for payment validation
  },
  payment: {
    status: String (Pending, Paid),
    method: String,
    amount: Number,
    paidAt: Date,
    upiId: String,
    txnRef: String
  },
  timestamps: true
}
```

---

## 🔄 Workflow: Offer to Payment

### Complete Offer Lifecycle

```
1. VENDOR SENDS OFFER
   POST /api/offers/send
   ├─ Vendor selects crop
   ├─ Vendor enters offered price
   └─ Status: PENDING
   
2. FARMER RESPONDS
   POST /api/offers/respond
   ├─ Farmer accepts/rejects/negotiates
   └─ Status: ACCEPTED | REJECTED | NEGOTIATING
   
3. VENDOR ARRANGES PICKUP ⭐
   POST /api/offers/delivery
   ├─ Vendor selects vehicle type
   ├─ Vendor enters distance
   ├─ System calculates delivery fare
   └─ delivery.confirmed = true
   
4. VENDOR PROCEEDS TO PAYMENT ⭐
   GET /api/payment/proceed/:offerId
   ├─ Validates: status === ACCEPTED
   ├─ Validates: delivery.confirmed === true  ← CRITICAL
   └─ Returns: dealId, amount
   
5. VENDOR CONFIRMS PAYMENT
   POST /api/payment/confirm/:offerId
   ├─ Processes payment
   ├─ Updates offer status to COMPLETED
   ├─ Marks crop as SOLD
   └─ Sends email to farmer
```

### Key Validation Rules

✅ **Delivery Confirmation Required**
- Vendor CANNOT proceed to payment without confirming delivery
- `delivery.confirmed` must be `true`
- `delivery.confirmedAt` timestamp is recorded

✅ **Offer Status Validation**
- Only ACCEPTED offers can proceed to payment
- PENDING or REJECTED offers are blocked

✅ **Crop Status Validation**
- Only ACTIVE crops can receive offers
- Crop status changes to SOLD after payment

---

## 🔐 Security

### Authentication
- JWT-based token authentication
- OTP verification for signup
- Refresh token mechanism
- Role-based access control (RBAC)

### Password Security
- bcryptjs hashing with 10 salt rounds
- Never store plain text passwords

### Data Validation
- Joi schema validation on all inputs
- Input sanitization
- Type checking

### Database Security
- MongoDB connection with SSL
- Indexed queries for performance
- Partial filter expressions for geo indexes

### File Upload Security
- Multer file size limits (50MB)
- File type validation
- Secure file storage

### CORS
- Configured for cross-origin requests
- Whitelist specific domains in production

---

## 📧 Email Notifications

### Configured Events

| Event | Recipient | Trigger |
|-------|-----------|---------|
| New Offer | Farmer | Vendor sends offer |
| Offer Accepted | Vendor | Farmer accepts offer |
| Offer Rejected | Vendor | Farmer rejects offer |
| Offer Negotiated | Vendor | Farmer counter-offers |
| Pickup Ready | Farmer | Vendor arranges delivery |
| Payment Received | Farmer | Payment confirmed |

### Email Configuration
```env
NOTIFY_EMAIL=your_email@gmail.com
NOTIFY_EMAIL_PASS=your_app_specific_password
```

**Note:** Use Gmail App Password, not your regular password.
Generate at: https://myaccount.google.com/apppasswords

---

## 🌍 Geolocation Features

### Geo-Indexed Collections
- `Farmer.farmLocation` - 2dsphere index
- `Vendor.location` - 2dsphere index
- `CropListing.farmLocation` - 2dsphere index

### Use Cases
- Find crops near vendor location
- Find vendors near farmer location
- Distance-based delivery calculation
- Radius-based crop discovery

---

## 🚀 Deployment

### Environment Setup
1. Create `.env` file with production values
2. Update MongoDB URI to production cluster
3. Generate strong JWT_SECRET
4. Configure email credentials
5. Set BASE_URL to production domain

### Deployment Platforms
- **Heroku** - Easy deployment with git push
- **AWS EC2** - Full control and scalability
- **DigitalOcean** - Simple and affordable
- **Railway** - Modern deployment platform
- **Render** - Free tier available

### Pre-deployment Checklist
- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] HTTPS/SSL configured
- [ ] CORS whitelist updated
- [ ] Error tracking (Sentry) configured
- [ ] Logging configured
- [ ] Rate limiting enabled
- [ ] File upload storage configured (S3)

---

## 🧪 Testing

### Manual Testing with Postman
1. Import `GrameenSetu_Offer_Workflow.postman_collection.json`
2. Set environment variables
3. Run requests in sequence

### API Testing
```bash
# Health check
curl http://localhost:4000/health

# Send OTP
curl -X POST http://localhost:4000/api/farmer/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'
```

---

## 📊 Performance Optimization

### Database Optimization
- Indexed queries on frequently searched fields
- Partial indexes for geo queries
- Connection pooling

### API Optimization
- Response pagination
- Field selection (projection)
- Caching strategies

### File Upload Optimization
- Multer streaming
- File size limits
- Compression

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: MONGO_URI not set in .env
```
**Solution:** Add MONGO_URI to .env file

### JWT Token Expired
```
Error: Invalid or expired token
```
**Solution:** Use refresh token endpoint to get new token

### Email Not Sending
```
Error: Failed to send email
```
**Solution:** Verify email credentials and enable "Less secure app access"

### File Upload Failed
```
Error: File size exceeds limit
```
**Solution:** Increase MAX_FILE_SIZE in .env

---

## 📝 Contributing

### Code Style
- Use ES6+ syntax
- Follow Express.js conventions
- Add comments for complex logic
- Use meaningful variable names

### Commit Messages
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
refactor: Refactor code
test: Add tests
```

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

---

## 📄 License

This project is licensed under the ISC License.

---

## 📞 Support

For issues, questions, or suggestions:
- Create GitHub Issue
- Email: support@grameensetu.com
- Documentation: See BACKEND_ANALYSIS.md

---

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core offer workflow
- ✅ Payment processing
- ✅ Email notifications

### Phase 2 (Planned)
- Real payment gateway integration (Razorpay)
- SMS notifications (Twilio)
- Real-time updates (WebSockets)
- Advanced analytics

### Phase 3 (Future)
- Dispute resolution system
- Rating & reviews
- Bulk offers
- Subscription plans

---

## 🙏 Acknowledgments

Built with ❤️ for Indian farmers and vendors.

**GrameenSetu** - Connecting farmers with fair prices and fresh produce to consumers.

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅
