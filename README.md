# Mail Classifier App

A full-stack Next.js application that classifies a user's recent emails into categories like **Promotions**, **Spam**, **Important**, and more. Built with Node.js backend and Google OAuth integration, this tool leverages OpenAI for intelligent email categorization.

## Features

- Google Sign-In for secure authentication
- User-provided OpenAI API key for classification
- Fetches and analyzes the first 15 emails from Gmail
- Categorizes emails into:
  - Promotions
  - Spam
  - Important
  - Social
  - Updates
- Responsive UI built with React and Next.js
- Secure backend powered by Node.js and Express

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Node.js, Express
- **Auth**: Google OAuth 2.0
- **AI**: OpenAI API
- **Email Access**: Gmail API (OAuth scopes)
- **State Management**: Redux Toolkit (optional)
- **Styling**: CSS Modules / Tailwind (customizable)

## Authentication Flow

1. User enters their OpenAI API key.
2. User signs in via Google OAuth.
3. App requests Gmail read-only access.
4. First 15 emails are fetched and sent to backend.
5. Backend uses OpenAI to classify each email.
6. Results are displayed in categorized sections.

# .env

- NEXT_PUBLIC_API_URL = backend_URI

## Installation

```bash
git clone https://github.com/girijakangutkar/Mailifier-Frontend.git
cd mail-classifier-app
npm install
```
