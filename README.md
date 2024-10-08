# Chat for Web 

## Overview

This project is a web-based implementation of  Chat, designed for rich conversations among users. The messaging interface mimics a familiar chat experience, with messages displayed in “bubbles” and grouped logically.

## Getting Started

1. Clone the Repository: `git clone https://github.com/xaviemirmon/next-chat-app.git`
2. Navigate to the directory in terminal
3. Add a local `.env` file in the root of the project folder: 
```sh
NEXT_PUBLIC_API_URL=localhost:3001
API_URL=backend:3001
```
4. Run `docker-compose up` (the first time you fire up the containers it may take 5-10mins as everything is downloaded and propagated).  

When you see something like:
```sh
web-1      |   ▲ Next.js 14.2.14
web-1      |   - Local:        http://localhost:3000
web-1      | 
web-1      |  ✓ Starting...
web-1      |  ⚠ "next start" does not work with "output: standalone" configuration. Use "node .next/standalone/server.js" instead.
web-1      |  ✓ Ready in 608ms
```
you are good go!

5. Open `http://localhost:3000` in your browser to view the application.

## Features

* Message Bubbles: Each message is displayed in a distinct bubble for better visual separation.

### Login page

When you visit `http://localhost:3000` you'll be greated with a list of all possible users

Click on one then takes you to the Connections page

For this example, "Sender" and "Alisha" match the state of the screenshot.

### Connections page

A list of your connections you can chat with

### Chat page

Chat shows an ongoing chat for a connection

Message Grouping:
* Messages separated by more than an hour are sectioned with the date and time.
* Messages from the same user sent within 20 seconds are grouped together with reduced vertical spacing.

#### Sending a message
Type the message you want to send then hit Enter/Return

## Components 
The components directory contains reusable UI components such as Message, Chat, ChatHeader, and ChatFooter.
Each message bubble handles its own styling and logic, ensuring reusability.

The project use and Express API and websocket to manage realtime and asynchronous message communitcation.  Loggged in user is stored with React Context.

Events are stored in a Postgres DB with Prisma as the ORM.

## Websockets

With websockets you can open up two windows logged in as the different connected user (e.g. Sender and Alisha) chat together in realtime.

You can also change `NEXT_PUBLIC_API_URL` to your local IP e.g. `NEXT_PUBLIC_API_URL=192.168.1.10:3001` and have a play from a mobile.

## Styling

* This project utilizes CSS modules for component-specific styles, allowing for scoped and reusable styles without conflicts.
* Global styles can be added to the styles/globals.css file.

## Testing

Navigate to the app you 

### Unit Testing (frontend only)

Jest is used for unit testing of components. Tests can be found in files suffixed with .test.tsx.
To run Jest tests:

```bash
yarn test
```

### Linting & Formatting
ESLint and Prettier are set up to maintain code quality and consistency.
To run ESLint:

```bash
yarn lint
```

To run Prettier:

```bash
yarn format
```
## Further Considerations

### Testing Coverage

Aim for comprehensive test coverage, including unit tests and integration tests.

### UI Consistency

Collaborate with designers for a consistent UI library. Consider using third-party UI frameworks or design system for rapid development.  More mobile styling.

### Online/Offline status

Add Online/Offline status indicator for chat

### Login/connection pages
An actual auth system and connection addition page.