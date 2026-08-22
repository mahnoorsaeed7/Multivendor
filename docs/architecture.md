# Multivendor Marketplace Architecture

## 1. Project Goal

A multi-vendor marketplace where buyers can purchase products
from multiple sellers, sellers manage their own products and
orders, and admins oversee the platform.

## 2. Actors

### Buyer

- Browse products
- Search/filter
- Manage cart
- Checkout
- Pay
- View own orders
- Review eligible products

### Seller

- Manage own products
- Manage inventory
- View own orders
- Update permitted order statuses
- View seller dashboard

### Admin

- Manage users
- Manage sellers
- Moderate products
- Inspect orders
- Oversee platform state

## 3. Core Entities

User
Product
Cart
Order
Payment
Review

## 4. Ownership

Buyer owns:
- cart
- own orders
- eligible reviews

Seller owns:
- own products
- seller inventory
- seller-visible order information

Admin owns platform-level administrative operations.

## 5. Authentication

Google acts as the external Identity Provider.

Google establishes identity.

Multivendor establishes the application user,
role, permissions, and ownership.

## 6. Authorization

Authorization is enforced on the backend.

Example:

Seller A cannot modify Seller B's product.

## 7. Initial Request Flow

Browser
    ↓
React
    ↓
HTTP request
    ↓
Express
    ↓
MongoDB
    ↓
JSON response
    ↓
React

## 8. Production Deployment

Domain
    ↓
Frontend
    ↓
API subdomain
    ↓
Express backend
    ↓
MongoDB

External services:
- Google authentication
- Payment provider

## 9. Environment Configuration

Development:
- frontend localhost
- backend localhost
- development database/configuration

Production:
- frontend domain
- API subdomain
- production database
- production environment variables

Secrets must never be committed.

## 10. Important Failure Points

- frontend cannot reach backend
- API unavailable
- database unavailable
- authentication provider unavailable
- unauthorized request
- invalid input
- payment failure
- duplicate payment notification
- stale data
- deployment failure

## 11. Security Boundaries

Frontend is untrusted.

Backend validates:
- identity
- role
- ownership
- input
- payment result

## 12. Deployment Goal

Final application must have:
- live frontend
- live backend
- production database
- HTTPS
- configured domain/subdomain
- protected environment variables
- working production authentication
- working production payment webhooks