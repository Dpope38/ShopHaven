# E-commerce API

Welcome to E-commerce API! This application provides various endpoints for managing users, products, reviews, and orders within an e-commerce and online store environment.
Designed with simplicity, security, and efficiency in mind, this API invites you to explore its core functionalities that drive seamless e-commerce experiences!

## Table of Contents

- [E-commerce API](#e-commerce-api)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
  - [Security](#security)
  - [Documentation](#documentation)
    - [API Documentation](#api-documentation)
    - [Postman Documentation](#postman-documentation)
  - [Useful Takeaways](#useful-takeaways)

## Introduction

This Express.js application serves as the backend for an e-commerce platform. The application allows users to register, log in, browse products, leave reviews, and create orders. The API is designed to be secure, scalable, and easy to use.

## Features

- User authentication and authorization.
- CRUD operations for users, products, reviews, and orders, brands, colors.
- File upload functionality for product images.
- Security measures, including rate limiting, helmet protection, and data sanitization.
- Error handling and logging for improved debugging.

## Installation

1. Clone the repository: `git clone https://github.com/Dpope38/ShopHaven.git`
2. Install dependencies: `npm install`
3. Rename the `.config.env` file to `.env`.
4. Open the `.env` file and set the environment variables specified within.

## Usage

To start the server, run the following command:

```bash
npm start testApp
```

The server will start on the specified port (or default to 7000 if not changed in the .env file).

## API Endpoints

- **Authentication:**

  - `POST /api/v1/user/register` - Register a new user.
  - `POST /api/v1/user/login` - User login.
  - `GET /api/v1/user/logout` - User logout.

- **Users:**

  - `GET /api/v1/users` - Get all users (admin only).
  - `GET /api/v1/users/:id` - Get a single user by ID (admin only).
  - `PUT /api/v1/users/:id` - Update a user by ID (admin only).
  - `PUT /api/v1/user/update/shipping` -Update shipping status.

- **Products:**

  - `GET /api/v1/product` - Get all products.
  - `GET /api/v1/product/:id` - Get a single product by ID.
  - `POST /api/v1/product` - Create a new product (admin only).
  - `PUT /api/v1/product/:id` - Update a product by ID (admin only).
  - `DELETE /api/v1/product/:id` - Delete a product by ID (admin only).

- **Reviews:**

  - `GET /api/v1/review` - Get all reviews.
  - `GET /api/v1/review/:id` - Get a single review by ID.
  - `POST /api/v1/review` - Create a new review.
  - `PUT /api/v1/reviews/:id` - Update a review by ID.
  - `DELETE /api/v1/review/:id` - Delete a review by ID.

- **Orders:**
  - `GET /api/v1/orders` - Get all orders (admin only).
  - `GET /api/v1/orders/:id` - Get a single order by ID (admin only).
  - `POST /api/v1/orders` - Create a new order.
  - `PUT /api/v1/orders/:id` - Update an order by ID (admin only).
  - `GET /api/v1/orders/sales/sum` - Get a total summary of order

- **Colors:**
  - `GET /api/v1/color` - Get all orders (admin only).
  - `GET /api/v1/color/:id` - Get a single color by ID (admin only).
  - `POST /api/v1/color` - Create a new color.
  - `PUT /api/v1/color/:id` - Update a color by ID (admin only).

- **Categories:**
  - `GET /api/v1/category` - Get all categories (admin only).
  - `GET /api/v1/category/:id` - Get a single category by ID (admin only).
  - `POST /api/v1/category` - Create a new category.
  - `PUT /api/v1/category/:id` - Update a category by ID (admin only).
  - `DEL /api/v1/category/:id` -Delete

- **Categories:**
  - `GET /api/v1/coupons` - Get all coupons (admin only).
  - `GET /api/v1/coupons/:id` - Get a single coupon by ID (admin only).
  - `POST /api/v1/coupon` - Create a new coupon.
  - `PUT /api/v1/coupons/:id` - Update a coupon by ID (admin only).
  - `DEL /api/v1/coupon/:id` -Delete coupon by ID

  

## Security

This API implements several security measures, including:

- **Rate Limiting:** Limits the number of requests a client can make within a specified time frame.
- **Helmet Protection:** Adds various HTTP headers to enhance security.
- **XSS Protection:** Sanitizes user input to prevent cross-site scripting attacks.
- **Data Sanitization:** Prevents NoSQL query injection by sanitizing user-supplied data.
- **CORS:** Enables Cross-Origin Resource Sharing to control which domains can access the API.

## Documentation

#### API Documentation

You can access the API documentation by visiting the root route of the application. The documentation provides detailed information about the API endpoints, request/response formats, and usage examples.

**How to View:** Simply open your web browser and go to the root route, for example, `https://shophaven-4.onrender.com/api/v1/{product}`.


**Guidance:** Refer to this documentation for instructions on interacting with the API effectively and making the most of its features, [shophave-api-docs.apidog.io](shophave-api-docs.apidog.io)

#### Postman Documentation

To enhance usability, the API endpoints have been documented in Postman.

You can find the collection in the `ecommerce-api.postman_collection` file. Import this collection into your Postman application to interactively explore the available endpoints.

## Useful Takeaways

- We've included a `utils` folder for easy integration into other projects.

- Consider using an object for function arguments (as seen in the `createJWT` function in `jwt.js`) to eliminate concerns about argument order.

- To register the first user as an admin:

  ```javascript
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';
  ```

- **Sending the Token vs Attaching the Token to a Cookie:**

  - When sending the token in the response:
    - The frontend manages token storage, typically saving it to `localStorage`.
  - When attaching the token to a cookie from the backend:
    - No frontend handling is required.
    - Enhanced security as client-side JavaScript cannot access the token due to the `httpOnly` option.
    - Be mindful of the cookie's maximum size.
    - By default, the cookie is sent back to its origin server. If your frontend and backend are on different servers, ensure proper setup, like using a proxy in development (e.g., `"proxy": "server-url"`) or redirects in production.


## Error Handling

The API follows standard HTTP status codes and provides error responses in JSON format. In case of an error, the response will contain relevant information about the error, such as error code, message, and possibly additional details.

## Testing

To run the test suite, execute the following command:

```bash
npm run test
```

The tests cover different use cases and edge scenarios to ensure the correctness of the application.

## Contributing

We welcome contributions to improve the project. To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your forked repository.
5. Create a pull request to the main repository.

We will review your pull request and provide feedback as soon as possible.

## License


