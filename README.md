# Food Ordering App 🍔📱

A full-stack Food Ordering Mobile Application built using React Native, Expo, Expo Router, and Supabase. This project includes user authentication, restaurant browsing, cart management, real-time order tracking, and an admin dashboard for managing products and orders.

---

# 🚀 Features

## 👤 User Features

* User Authentication (Login/Register)
* Browse Restaurants
* View Food Categories
* Add Products to Cart
* Checkout & Place Orders
* Real-Time Order Tracking
* Order History
* User Profile Management

---

## 🛠️ Admin Features

* Admin Authentication
* Dashboard Analytics
* Manage Restaurants
* Add/Edit/Delete Products
* Manage Orders
* Update Order Status
* Real-Time Order Updates

---

# 🧑‍💻 Tech Stack

## Frontend

* React Native
* Expo
* Expo Router
* TypeScript
* Zustand / Context API

---

## Backend

* Supabase

  * Authentication
  * PostgreSQL Database
  * Realtime Subscriptions
  * Storage

---

## Tools & Services

* Expo Go
* Android Studio
* Git & GitHub

---

# 📱 App Screens

## User App

* Splash Screen
* Login/Register
* Home Screen
* Restaurant Details
* Product Details
* Cart Screen
* Checkout Screen
* Orders Screen
* Profile Screen

---

## Admin App

* Dashboard
* Product Management
* Restaurant Management
* Orders Management
* Analytics

---

# 📂 Folder Structure

```bash
food-ordering-app/
│
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   │
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── cart.tsx
│   │   ├── orders.tsx
│   │   └── profile.tsx
│   │
│   ├── restaurant/
│   │   └── [id].tsx
│   │
│   └── product/
│       └── [id].tsx
│
├── components/
├── services/
├── store/
├── assets/
├── constants/
├── hooks/
├── supabase/
├── types/
└── utils/
```

---

# 📱 App Preview

### User App
![Home Screen](assets/screenshots/Home(user).jpg)
![Cart Screen](assets/screenshots/Cart(user).jpg)
![Orders Screen](assets/screenshots/Orders(User).jpg)
![Home2 Screen](assets/screenshots/Home2(user).jpg)
![ProductDetails Screen](assets/screenshots/ProductDetails(user).jpg)
![Profile](assets/screenshots/Profile(user).jpg)
![DashBoard Details](assets/screenshots/DashBoard(Admin).jpg)
![Restaurant Details](assets/screenshots/Orders(Admin).jpg)

# 📲 Try It Yourself

Scan the QR code below using the **Expo Go App**:

![QR Code](assets/screenshots/qr/qr.png)



### Admin App
![Dashboard](assets/screenshots/admin-dashboard.png)
![Orders Management](assets/screenshots/orders.png)


# 🔐 Authentication

Authentication is handled using Supabase Auth.

## Features

* Email & Password Login
* User Registration
* Persistent Sessions
* Role-Based Access (User/Admin)

---

# 🗄️ Database Schema

## Users Table

```sql
users
- id
- email
- role
```

## Restaurants Table

```sql
restaurants
- id
- name
- image
- delivery_fee
```

## Products Table

```sql
products
- id
- restaurant_id
- name
- price
- image
- description
```

## Orders Table

```sql
orders
- id
- user_id
- status
- total
```

## Order Items Table

```sql
order_items
- id
- order_id
- product_id
- quantity
```

---

# ⚡ Real-Time Features

Supabase Realtime is used for:

* Live Order Status Updates
* Real-Time Admin Notifications
* Instant UI Synchronization

---

# 🖼️ Image Storage

Product and restaurant images are stored using:

* Supabase Storage Buckets

---

# 🛒 Order Workflow

```text
User Login
   ↓
Browse Restaurants
   ↓
Add Items to Cart
   ↓
Checkout
   ↓
Order Created
   ↓
Admin Receives Order
   ↓
Admin Updates Status
   ↓
User Receives Real-Time Updates
```

---

# 🛠️ Installation & Setup

# 1️⃣ Clone Repository

```bash
git clone https://github.com/yemulambika/FoodOrdering.git
cd FoodOrdering
```

---

# 2️⃣ Install Dependencies

```bash
npm install
```

---

# 3️⃣ Configure Environment Variables

Create `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://blakhneuhtqkwalayggc.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_hdadk4sPGtYmIKxQVBHalQ_KvvSvLwM
```

---

# 4️⃣ Start Development Server

```bash
npx expo start
```

---

# 📱 Run on Android

## Using Emulator

* Install Android Studio
* Start Android Emulator
* Press:

```bash
a
```

inside Expo terminal.

---

## Using Physical Device

* Install Expo Go App
* Scan QR Code

---

# 🧪 Admin Credentials

```text
Email: admin@example.com
Password: admin123
```

---

# 🌟 Key Learning Outcomes

This project demonstrates:

* Full-Stack Mobile Development
* Authentication & Authorization
* Real-Time Systems
* Database Design
* CRUD Operations
* State Management
* Cloud Storage
* Mobile UI/UX
* Production App Architecture

---

# 📦 Future Improvements

* Online Payments Integration
* Push Notifications
* Google Authentication
* Location Tracking
* Delivery Partner Module
* Favorites & Reviews
* Dark Mode

---

# 🤝 Contributing

Contributions are welcome. Feel free to fork the repository and submit pull requests.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

Developed by Your Name

* GitHub: [https://github.com/your-username](https://github.com/yemulambika)
* LinkedIn: [https://linkedin.com/in/your-profile](https://linkedin.com/in/ambika-yemul-9ab81130b)
