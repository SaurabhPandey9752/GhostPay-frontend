import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const ApiDocs = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState("register");

  const endpoints = [
    {
      id: "register",
      name: "POST /auth/register/:role",
      desc: "Register a new user",
    },
    { id: "login", name: "POST /auth/login", desc: "Login user" },
    {
      id: "refresh-token",
      name: "POST /auth/refresh-token",
      desc: "Refresh access token",
    },
    { id: "issue-card", name: "POST /cards", desc: "Issue a new card" },
    { id: "get-card", name: "GET /cards/:id", desc: "Get card status" },
    {
      id: "card-analytics",
      name: "GET /cards/analytics/overview",
      desc: "Get card analytics",
    },
    { id: "charge-card", name: "POST /charges", desc: "Process card charge" },
    {
      id: "transaction-details",
      name: "GET /transactions/:id",
      desc: "Get transaction details",
    },
    {
      id: "merchant-analytics",
      name: "GET /transactions/analytics/merchant",
      desc: "Get merchant analytics",
    },
    {
      id: "admin-analytics",
      name: "GET /transactions/analytics/admin",
      desc: "Get admin analytics",
    },
  ];

  const renderEndpointContent = () => {
    switch (selectedEndpoint) {
      case "issue-card":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Issue a new card</h3>
              <p className="text-text-muted mb-2">
                Creates a new card for the authenticated user.
              </p>
              <div className="bg-primary text-white px-3 py-1 rounded-md inline-block font-medium">
                POST /cards
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Required Role</h4>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <span className="text-sm font-medium">USER</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Request Headers</h4>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <pre className="text-sm">
                  Authorization: Bearer {"{your_jwt_token}"}
                </pre>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Request Body</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "cardHolderName": "John Doe",
  "maxLimit": 5000  // Optional, defaults to 10000
}`}
              </SyntaxHighlighter>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Response (201 Created)</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "message": "Card issued successfully",
  "card": {
    "id": "65f2e8b7c261e6001234abcd",
    "cardNumber": "123456789012",
    "cardHolderName": "John Doe",
    "type": "credit",
    "expiryDate": "03/2027",  // Format: MM/YYYY
    "cvv": "123",
    "maxLimit": 5000,
    "currentBalance": 0,
    "isActive": true
  }
}`}
              </SyntaxHighlighter>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Error Responses</h4>
              <div className="space-y-4">
                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    400 Bad Request
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Missing required fields"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    401 Unauthorized
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Invalid or missing token"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    403 Forbidden
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "User role not authorized"
}`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </>
        );

      case "get-card":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Get Card Status</h3>
              <p className="text-text-muted mb-2">
                Retrieves the status and details of a specific card.
              </p>
              <div className="bg-primary text-white px-3 py-1 rounded-md inline-block font-medium">
                GET /cards/{"{id}"}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Required Role</h4>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <span className="text-sm">
                  <span className="font-medium">USER</span> or{" "}
                  <span className="font-medium">ADMIN</span>
                  <ul className="list-disc ml-5 mt-2">
                    <li>Users can only view their own cards</li>
                    <li>Admins can view any card</li>
                  </ul>
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">URL Parameters</h4>
              <div className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-md">
                <div className="font-medium">id</div>
                <div className="col-span-2">Card ID (MongoDB ObjectId)</div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Request Headers</h4>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <pre className="text-sm">
                  Authorization: Bearer {"{your_jwt_token}"}
                </pre>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Response (200 OK)</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "card": {
    "id": "65f2e8b7c261e6001234abcd",
    "cardNumber": "123456789012",
    "cardHolderName": "John Doe",
    "type": "credit",
    "expiryDate": "03/2027",  // Format: MM/YYYY
    "maxLimit": 5000,
    "currentBalance": 1000,
    "isActive": true,
    "transactions": [
      {
        "amount": 1000,
        "merchantId": "65f2e8b7c261e6001234efgh",
        "timestamp": "2024-03-15T10:30:00.000Z",
        "status": "completed",
        "description": "Purchase at Store XYZ"
      }
    ]
  }
}`}
              </SyntaxHighlighter>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Error Responses</h4>
              <div className="space-y-4">
                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    401 Unauthorized
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Invalid or missing token"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    403 Forbidden
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "User role not authorized"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    404 Not Found
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Card not found"
}`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </>
        );

      case "charge-card":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Process Card Charge
              </h3>
              <p className="text-text-muted mb-2">
                Processes a charge on a card (Merchant only).
              </p>
              <div className="bg-primary text-white px-3 py-1 rounded-md inline-block font-medium">
                POST /charges
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Required Role</h4>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <span className="text-sm font-medium">MERCHANT</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Request Headers</h4>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <pre className="text-sm">
                  Authorization: Bearer {"{your_jwt_token}"}
                </pre>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Request Body</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "cardNumber": "123456789012",
  "cvv": "123",
  "expiryDate": "03/2027",  // Format: MM/YYYY
  "amount": 1000,
  "description": "Purchase at Store XYZ"
}`}
              </SyntaxHighlighter>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Response (200 OK)</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "message": "Charge processed successfully",
  "transaction": {
    "amount": 1000,
    "status": "completed",
    "timestamp": "2024-03-15T10:30:00.000Z",
    "description": "Purchase at Store XYZ",
    "remainingBalance": 4000
  }
}`}
              </SyntaxHighlighter>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Error Responses</h4>
              <div className="space-y-4">
                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    400 Bad Request
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Invalid expiry date format",
  "expectedFormat": "MM/YYYY"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    400 Bad Request
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Charge amount exceeds card limit",
  "currentBalance": 4000,
  "maxLimit": 5000,
  "remainingLimit": 1000
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    404 Not Found
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Card not found"
}`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </>
        );

      case "register":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Register a new user
              </h3>
              <p className="text-text-muted mb-2">
                Register a new user with a specific role.
              </p>
              <div className="bg-primary text-white px-3 py-1 rounded-md inline-block font-medium">
                POST /auth/register/{"{role}"}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">URL Parameters</h4>
              <div className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-md">
                <div className="font-medium">role</div>
                <div className="col-span-2">
                  User role (admin/merchant/user)
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Request Body</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "email": "string",
  "password": "string",
  "name": "string"
}`}
              </SyntaxHighlighter>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Validation Rules</h4>
              <ul className="list-disc pl-5 space-y-1 text-text-muted">
                <li>Email: Must be valid email format</li>
                <li>
                  Password: Minimum 8 characters, must contain at least one
                  number and one special character
                </li>
                <li>Name: Minimum 2 characters, maximum 50 characters</li>
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Response (201 Created)</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "message": "User registered successfully",
  "token": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string"
  }
}`}
              </SyntaxHighlighter>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Error Responses</h4>
              <div className="space-y-4">
                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    400 Bad Request
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Invalid role"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    400 Bad Request
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "User already exists"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    400 Bad Request
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Invalid email format"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    400 Bad Request
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Password must be at least 8 characters"
}`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </>
        );

      case "login":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Login user</h3>
              <p className="text-text-muted mb-2">
                Authenticate a user and receive access and refresh tokens.
              </p>
              <div className="bg-primary text-white px-3 py-1 rounded-md inline-block font-medium">
                POST /auth/login
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Request Body</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "email": "string",
  "password": "string"
}`}
              </SyntaxHighlighter>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Response (200 OK)</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "message": "Login successful",
  "token": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string"
  }
}`}
              </SyntaxHighlighter>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Error Responses</h4>
              <div className="space-y-4">
                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    400 Bad Request
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Email and password are required"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    401 Unauthorized
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Invalid credentials"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    429 Too Many Requests
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Too many login attempts. Please try again later"
}`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </>
        );

      case "refresh-token":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Refresh Token</h3>
              <p className="text-text-muted mb-2">
                Get a new access token using a refresh token.
              </p>
              <div className="bg-primary text-white px-3 py-1 rounded-md inline-block font-medium">
                POST /auth/refresh-token
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Headers</h4>
              <div className="overflow-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Header
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Value
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Required
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Authorization
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Bearer {"{token}"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">Yes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Request Body</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "refreshToken": "string"
}`}
              </SyntaxHighlighter>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Response (200 OK)</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "token": "string"
}`}
              </SyntaxHighlighter>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Error Responses</h4>
              <div className="space-y-4">
                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    400 Bad Request
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Refresh token required"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    401 Unauthorized
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Invalid refresh token"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    401 Unauthorized
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Refresh token expired"
}`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </>
        );

      case "card-analytics":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Get Card Analytics</h3>
              <p className="text-text-muted mb-2">
                Get comprehensive analytics for user's cards.
              </p>
              <div className="bg-primary text-white px-3 py-1 rounded-md inline-block font-medium">
                GET /cards/analytics/overview
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Required Role</h4>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <span className="text-sm font-medium">USER</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Request Headers</h4>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <pre className="text-sm">
                  Authorization: Bearer {"{your_jwt_token}"}
                </pre>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Response (200 OK)</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "overview": {
    "totalCards": 3,
    "activeCards": 2,
    "usedCards": 1,
    "totalSpent": 5000,
    "totalOutstanding": 2000
  },
  "spending": {
    "monthly": [
      {
        "month": "2024-03",
        "amount": 3000
      },
      {
        "month": "2024-02",
        "amount": 2000
      }
    ],
    "byMerchant": [
      {
        "merchantId": "65f2e8b7c261e6001234efgh",
        "merchantName": "Store XYZ",
        "count": 3,
        "total": 3000
      },
      {
        "merchantId": "65f2e8b7c261e6001234ijkl",
        "merchantName": "Store ABC",
        "count": 2,
        "total": 2000
      }
    ]
  },
  "cards": [
    {
      "cardId": "65f2e8b7c261e6001234abcd",
      "cardNumber": "••••••••9012",
      "cardHolderName": "John Doe",
      "currentBalance": 2000,
      "maxLimit": 5000,
      "isActive": true,
      "isUsed": true,
      "totalTransactions": 3,
      "totalSpent": 3000,
      "lastTransactionDate": "2024-03-15T10:30:00.000Z",
      "topMerchants": [
        {
          "merchantId": "65f2e8b7c261e6001234efgh",
          "merchantName": "Store XYZ",
          "count": 2,
          "total": 2000
        }
      ]
    }
  ]
}`}
              </SyntaxHighlighter>
            </div>
          </>
        );

      case "transaction-details":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Get Transaction Details
              </h3>
              <p className="text-text-muted mb-2">
                Get detailed information about a specific transaction.
              </p>
              <div className="bg-primary text-white px-3 py-1 rounded-md inline-block font-medium">
                GET /transactions/:transactionId
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Required Role</h4>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <span className="text-sm">
                  <span className="font-medium">ADMIN</span>,{" "}
                  <span className="font-medium">MERCHANT</span>, or{" "}
                  <span className="font-medium">USER</span>
                  <ul className="list-disc ml-5 mt-2">
                    <li>
                      Admins get full transaction details including card
                      information
                    </li>
                    <li>
                      Merchants get transaction details with customer info but
                      no card details
                    </li>
                    <li>
                      Customers get transaction details with merchant info but
                      no card details
                    </li>
                  </ul>
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Request Headers</h4>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <pre className="text-sm">
                  Authorization: Bearer {"{your_jwt_token}"}
                </pre>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Response (200 OK)</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "transaction": {
    "id": "TXN1234567890",
    "amount": 1000,
    "status": "completed",
    "timestamp": "2024-03-15T10:30:00.000Z",
    "description": "Purchase at Store XYZ",
    "cardId": {
      "cardNumber": "••••••••9012",
      "cardHolderName": "John Doe"
    },
    "merchantId": {
      "name": "Store XYZ",
      "email": "store@example.com"
    },
    "customerId": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}`}
              </SyntaxHighlighter>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Error Responses</h4>
              <div className="space-y-4">
                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    401 Unauthorized
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "User not authenticated"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    403 Forbidden
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Access denied to this transaction"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    404 Not Found
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Transaction not found"
}`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </>
        );

      case "merchant-analytics":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Get Merchant Analytics
              </h3>
              <p className="text-text-muted mb-2">
                Get comprehensive analytics for a merchant.
              </p>
              <div className="bg-primary text-white px-3 py-1 rounded-md inline-block font-medium">
                GET /transactions/analytics/merchant
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Required Role</h4>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <span className="text-sm">
                  <span className="font-medium">MERCHANT</span> or{" "}
                  <span className="font-medium">ADMIN</span>
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Query Parameters</h4>
              <div className="overflow-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Parameter
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Type
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Description
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Required
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        merchantId
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        string
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Merchant ID (admin only)
                      </td>
                      <td className="border border-gray-300 px-4 py-2">No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Request Headers</h4>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <pre className="text-sm">
                  Authorization: Bearer {"{your_jwt_token}"}
                </pre>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Response (200 OK)</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "merchant": {
    "id": "65f2e8b7c261e6001234efgh",
    "name": "Store XYZ",
    "email": "store@example.com"
  },
  "overview": {
    "totalTransactions": 15,
    "totalAmount": 12000,
    "averageAmount": 800,
    "successRate": 95,
    "totalCustomers": 8
  },
  "timeAnalysis": {
    "daily": [
      {
        "date": "2024-03-15",
        "amount": 3000
      }
    ],
    "monthly": [
      {
        "month": "2024-03",
        "amount": 7000
      },
      {
        "month": "2024-02",
        "amount": 5000
      }
    ]
  },
  "statusBreakdown": {
    "completed": 14,
    "failed": 1,
    "pending": 0
  },
  "recentTransactions": [
    {
      "id": "TXN1234567890",
      "amount": 1000,
      "timestamp": "2024-03-15T10:30:00.000Z",
      "status": "completed",
      "description": "Purchase at Store XYZ",
      "customerName": "John Doe"
    }
  ]
}`}
              </SyntaxHighlighter>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Error Responses</h4>
              <div className="space-y-4">
                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    400 Bad Request
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Valid merchant ID required for admin"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    401 Unauthorized
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "User not authenticated"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    404 Not Found
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Merchant not found"
}`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </>
        );

      case "admin-analytics":
        return (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Get Admin Analytics
              </h3>
              <p className="text-text-muted mb-2">
                Get comprehensive analytics for the entire system.
              </p>
              <div className="bg-primary text-white px-3 py-1 rounded-md inline-block font-medium">
                GET /transactions/analytics/admin
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Required Role</h4>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <span className="text-sm font-medium">ADMIN</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Request Headers</h4>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <pre className="text-sm">
                  Authorization: Bearer {"{your_jwt_token}"}
                </pre>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Response (200 OK)</h4>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{ borderRadius: "0.375rem" }}
              >
                {`{
  "overview": {
    "totalUsers": 50,
    "totalMerchants": 10,
    "totalTransactions": 500,
    "totalAmount": 250000,
    "averageAmount": 500,
    "successRate": 98,
    "totalOutstanding": 50000
  },
  "userAnalysis": {
    "totalActiveUsers": 45,
    "totalInactiveUsers": 5,
    "usersWithCards": 40,
    "usersWithTransactions": 35,
    "userOutstandingAmount": 50000,
    "averageOutstandingPerUser": 1250
  },
  "merchantAnalysis": {
    "totalActiveMerchants": 8,
    "totalInactiveMerchants": 2,
    "merchantsWithTransactions": 7,
    "averageTransactionsPerMerchant": 71,
    "averageAmountPerMerchant": 35714,
    "topMerchants": [
      {
        "merchantId": "65f2e8b7c261e6001234efgh",
        "merchantName": "Store XYZ",
        "totalTransactions": 150,
        "totalAmount": 80000,
        "successRate": 99,
        "uniqueCustomers": 30
      }
    ]
  },
  "transactionAnalysis": {
    "statusBreakdown": {
      "completed": 490,
      "failed": 8,
      "pending": 2
    },
    "timeAnalysis": {
      "monthly": [
        {
          "month": "2024-03",
          "amount": 90000
        },
        {
          "month": "2024-02",
          "amount": 80000
        }
      ]
    },
    "recentTransactions": [
      {
        "id": "TXN1234567890",
        "amount": 1000,
        "timestamp": "2024-03-15T10:30:00.000Z",
        "status": "completed",
        "description": "Purchase at Store XYZ",
        "merchantName": "Store XYZ",
        "customerName": "John Doe"
      }
    ]
  }
}`}
              </SyntaxHighlighter>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Error Responses</h4>
              <div className="space-y-4">
                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    401 Unauthorized
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "User not authenticated"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    403 Forbidden
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Admin access required"
}`}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    429 Too Many Requests
                  </span>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.375rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {`{
  "message": "Too many analytics requests, please try again after 5 minutes",
  "retryAfter": 300
}`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return (
          <div className="flex items-center justify-center h-40 text-text-muted">
            Select an API endpoint from the list to view documentation.
          </div>
        );
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-background pt-[130px] pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary-dark">
            API Documentation
          </h1>
          <p className="text-lg text-text mb-12 max-w-3xl leading-relaxed">
            GhostPay-Lite provides a RESTful API for issuing single-use virtual
            cards and processing charges. Each endpoint is documented below.
          </p>

          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg shadow-sm">
            <h3 className="font-semibold text-blue-800">Security Notes</h3>
            <ul className="list-disc ml-5 mt-2 text-blue-700">
              <li>All passwords are hashed using bcrypt before storage</li>
              <li>Failed login attempts are tracked</li>
              <li>Tokens are signed using JWT_SECRET</li>
              <li>HTTPS is recommended for all API calls</li>
              <li>Rate limiting is applied to prevent brute force attacks</li>
            </ul>
          </div>

          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-lg shadow-sm">
            <h3 className="font-semibold text-yellow-800">Token Information</h3>
            <ul className="list-disc ml-5 mt-2 text-yellow-700">
              <li>Access Token: Valid for 7 days</li>
              <li>Refresh Token: Valid for 30 days</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="sticky top-20">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-medium mb-3 text-text-muted uppercase text-sm">
                    Endpoints
                  </h3>
                  <nav className="space-y-1">
                    {endpoints.map((endpoint) => (
                      <button
                        key={endpoint.id}
                        onClick={() => setSelectedEndpoint(endpoint.id)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedEndpoint === endpoint.id
                            ? "bg-primary text-white"
                            : "text-text hover:bg-gray-100"
                        }`}
                      >
                        <div className="font-medium text-sm">
                          {endpoint.name}
                        </div>
                        <div
                          className={`text-xs ${
                            selectedEndpoint === endpoint.id
                              ? "text-white/70"
                              : "text-text-muted"
                          }`}
                        >
                          {endpoint.desc}
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[400px]">
                {renderEndpointContent()}
              </div>
            </div>
          </div>

          <div className="mt-12 bg-primary/5 p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-primary-dark">
              API Explorer
            </h3>
            <p className="mb-6 text-text">
              Try out the API endpoints directly from our interactive API
              Explorer in the Dashboard.
            </p>
            <div className="flex">
              <a
                href="/dashboard"
                className="bg-secondary hover:bg-secondary-dark px-4 py-2 rounded-md font-medium transition-colors text-white"
              >
                Open API Explorer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
