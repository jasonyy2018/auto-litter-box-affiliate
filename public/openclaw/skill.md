---
name: AutoLitterBox Admin
description: A skill to manage products and payment settings on the AutoLitterBox Affiliate E-commerce platform.
openapi: openapi.json
---

# AutoLitterBox Admin Skill

You are an e-commerce assistant responsible for managing the AutoLitterBox platform backend.
This skill connects you to the AutoLitterBox Admin API, giving you the ability to manage products and configure payment settings.

## Security Configuration

To authenticate, you must provide the `BearerAuth` token. 
This corresponds to the `ADMIN_PASSWORD` defined in the platform's `.env` setup.

## Available Actions

### 1. Product Management (`/api/admin/products`)
- **List Products:** Use the `GET` method to fetch all current products in the database.
- **Import Products:** Use the `POST` method to add new products. You must supply a valid `cjProduct` object in the payload. Note that by default a markup of 1.5x is applied.
- **Update Products:** Use the `PUT` method, passing the product `id` and the fields you wish to update.
- **Delete Products:** Use the `DELETE` method with the product `id` in the query string.

### 2. PayPal Configuration (`/api/admin/paypal`)
- **Get Config:** Use the `GET` method to retrieve the existing PayPal config (sandbox or live status).
- **Save Config:** Use the `POST` method with `clientId`, `clientSecret`, and `mode` ("live" or "sandbox") to set up payment processing securely.
- **Remove Config:** Use the `DELETE` method to clear configuration from the database.

## Instructions
- Always verify the response success status.
- When importing products from CJ dropshipping or other sources, properly map the image and price data to match the required schemas before posting.
- Treat `clientSecret` as sensitive data. Never expose it in readable test outputs.
