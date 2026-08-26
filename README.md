# Multi-Tenant E-Commerce Platform (SaaS)

# High-Level Application Flow

Customer
   ↓
Open Website
   ↓
Open a Store
   ↓
Browse Products
   ↓
Open Product Details
   ↓
Select Variant
   ↓
Add to Cart
   ↓
Checkout
   ↓
Enter Shipping Address
   ↓
Place Order
   ↓
Payment
   ↓
Order Confirmation


Vendor flow:

Vendor
   ↓
Login
   ↓
Store
   ↓
Manage Products
   ↓
Manage Inventory
   ↓
View Orders
   ↓
Analytics

------------------------------------------------------------------------

# Architecture

Frontend
   ↓
React Application
   ↓
REST APIs
   ↓
Node + Express
   ↓

The frontend handles the user interface and state.

The backend handles:

-   Authentication
-   Authorization
-   Business logic
-   Tenant isolation
-   Database operations
-   Orders
-   Payments

MongoDB stores the application's data.

------------------------------------------------------------------------

# Multi-Tenant Concept

A Vendor is the user who owns a store. A Store is the tenant.

Example:

Vendor A -> Store A -> Products A
   
Vendor B -> Store A -> Products A

A vendor's JWT identifies the vendor.

The backend then finds that vendor's store:

JWT
 ↓
req.user
 ↓
Vendor ID
 ↓
Find Store where owner = Vendor ID


When creating or modifying products, the backend uses the vendor's store
instead of trusting a store ID supplied by the frontend.

This prevents one vendor from managing another vendor's products.
------------------------------------------------------------------------

# Backend Progress

## Authentication / Authorization and RBAC

Implemented and used throughout the project:

JWT
 ↓
protect middleware
 ↓
authorize("VENDOR")

Vendor-only operations require a valid Vendor JWT.

Customer-only operations require a valid Customer JWT.

------------------------------------------------------------------------

## Store APIs

# Create Store
(A vendor can create their store)

POST /api/stores
Protect: JWT + VENDOR

### Get My Store
(Returns the logged-in vendor's store)

GET /api/stores/my-store
Protect: JWT + VENDOR

### Public Store
(Customers do not need to log in to view a store)

GET /api/stores/:slug

Eg: GET /api/stores/preethi-fashion

------------------------------------------------------------------------

# Product Management
(Products belong to a store)

Relationship: Store -> Product

## Create Product
(**The frontend does not choose the store**)

POST /api/products
Protect: JWT + VENDOR

What does backend do here?

JWT
 ↓
Vendor
 ↓
Find Vendor Store
 ↓
Attach Store ID
 ↓
Create Product

## Get Vendor Products
(Returns only products belonging to the logged-in vendor's store.)

GET /api/products/my-store
Protect: JWT + VENDOR

## Get Store Products (Public)
(Used by customers to browse products inside a store)

GET /api/products/store/:storeId

## Get Product Details (Public)
(Returns product information and variants)
GET /api/products/:productId

## Update Product

PUT /api/products/:productId
Protect: JWT + VENDOR

The backend checks:

Product ID + Vendor's Store ID 
before allowing the update.

## Delete Product
(The same tenant-safety check is applied)
DELETE /api/products/:productId
Protect: JWT + VENDOR
