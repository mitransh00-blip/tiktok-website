# MITRANSH Database Schema

## Database Name: `mitransh`

---

## Collections (Tables)

### 1. users Collection

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Unique ID |
| username | String | Yes | Unique username (3-20 chars) |
| email | String | Yes | Unique email |
| phone | String | Yes | Unique Cameroon phone (+237...) |
| password | String | Yes | Hashed password (bcrypt) |
| profilePic | String | No | Profile picture URL |
| language | String | No | "en" or "fr" (default: "en") |
| isVendor | Boolean | No | Is user a vendor (default: false) |
| followers | Array[ObjectId] | No | Array of User IDs who follow |
| following | Array[ObjectId] | No | Array of User IDs being followed |
| totalLikes | Number | No | Total likes received |
| totalTransactions | Number | No | Total transactions completed |
| bio | String | No | User bio (max 150 chars) |
| location | String | No | User location |
| mtnNumber | String | No | MTN Mobile Money number |
| orangeNumber | String | No | Orange Money number |
| viralScore | Number | No | Viral algorithm score |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

---

### 2. products Collection

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Unique ID |
| title | String | Yes | Product title |
| description | String | No | Product description |
| caption | String | No | Product caption |
| price | Number | Yes | Product price |
| mediaUrl | String | Yes | Image/video URL |
| mediaType | String | No | "image" or "video" |
| quantity | Number | No | Total quantity available |
| quantityLeft | Number | No | Remaining quantity |
| seller | ObjectId | Yes | Reference to User (vendor) |
| colors | Array[String] | No | Available colors |
| sizes | Array[String] | No | Available sizes |
| location | String | No | Product location |
| likes | Array[ObjectId] | No | Users who liked |
| comments | Array[Object] | No | Comments with user, text, date |
| favorites | Array[ObjectId] | No | Users who favorited |
| views | Number | No | View count |
| viralScore | Number | No | Viral algorithm score |
| transactionCount | Number | No | Number of transactions |
| isActive | Boolean | No | Is product active |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

**Comments Structure:**
```
{
  user: ObjectId,
  text: String,
  createdAt: Date
}
```

---

### 3. orders Collection

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Unique ID |
| buyer | ObjectId | Yes | Reference to User (buyer) |
| vendor | ObjectId | Yes | Reference to User (seller) |
| product | ObjectId | Yes | Reference to Product |
| quantity | Number | Yes | Order quantity |
| size | String | No | Size selected |
| color | String | No | Color selected |
| totalPrice | Number | Yes | Total order price |
| status | String | No | pending/approved/paid/delivered/cancelled/refunded |
| paymentMethod | String | No | "mtn" or "orange" |
| paymentConfirmed | Boolean | No | Payment confirmed |
| paidAt | Date | No | Payment timestamp |
| deliveredAt | Date | No | Delivery timestamp |
| deliveryDeadline | Date | No | 7-day deadline for delivery |
| vendorPaid | Boolean | No | 97% paid to vendor |
| vendorPaidAt | Date | No | Vendor payment timestamp |
| vendorNotes | String | No | Notes from vendor |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

---

### 4. notifications Collection

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Unique ID |
| recipient | ObjectId | Yes | User receiving notification |
| sender | ObjectId | Yes | User who triggered notification |
| type | String | Yes | Notification type |
| product | ObjectId | No | Related product |
| order | ObjectId | No | Related order |
| message | String | Yes | Notification message |
| isRead | Boolean | No | Has been read |
| conversationId | ObjectId | No | For chat messages |
| createdAt | Date | Auto | Creation timestamp |

**Notification Types:**
- `order_request` - New order from buyer
- `order_approved` - Vendor approved order
- `order_paid` - Buyer confirmed payment
- `order_delivered` - Vendor delivered order
- `order_confirmed` - Buyer confirmed receipt
- `order_refunded` - Auto-refund after 7 days
- `follow` - New follower
- `like` - Someone liked your product
- `comment` - Comment on your product
- `message` - Direct message
- `system` - System notification

---

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐
│    users    │       │   products  │
├─────────────┤       ├─────────────┤
│ _id         │       │ _id         │
│ username    │◄──────│ seller      │
│ email       │       │ likes[]     │
│ phone       │       │ favorites[] │
│ password    │       │ comments[]  │
│ profilePic  │       │ views       │
│ language    │       │ viralScore  │
│ isVendor    │       └──────┬──────┘
│ followers[] │              │
│ following[] │       ┌──────▼──────┐
│ totalLikes  │       │   orders    │
│ bio         │       ├─────────────┤
│ location    │       │ _id         │
│ mtnNumber   │       │ buyer       │◄──┐
│ orangeNumber│       │ vendor      │◄──┼──┐
└─────────────┘       │ product     │   │  │
                      │ quantity    │   │  │
┌─────────────┐       │ size        │   │  │
│notifications│       │ color       │   │  │
├─────────────┤       │ totalPrice  │   │  │
│ _id         │       │ status      │   │  │
│ recipient   │◄──────│ paymentMethod   │
│ sender      │       │ deliveryDeadline│
│ type        │       └─────────────────┘
│ product     │
│ order       │
│ message     │
│ isRead      │
└─────────────┘
```

---

## Indexes Created

- **users**: username (unique), email (unique), phone (unique)
- **products**: seller, isActive
- **orders**: buyer, vendor, product, status
- **notifications**: recipient + createdAt, recipient + isRead

