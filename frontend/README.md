Pixie Event Intelligence & Analytics Dashboard
Developed by: Rohan Modi 

A production-ready, full-stack system designed to automate the discovery, deduplication, and analysis of live events. Built to solve the challenge of manual event tracking.

Key Features
Automated ETL Pipeline: Uses Puppeteer to scrape live events with a self-healing headless browser configuration.

Smart Deduplication: Implements a Map-based hashing algorithm to ensure zero data redundancy.

Advanced Filtering: Logic-based filtering to isolate 'Events' from 'Movies' and 'Cinema' listings.

Lifecycle Management: Automatically tracks event age and marks them as Active or Expired after 24 hours.

Real-time Analytics: A live dashboard showing key performance indicators (KPIs) like total discovered events.

Operations Ready: Built-in Excel synchronization for marketing and outreach teams.

Tech Stack
Frontend: React.js (Hooks, Functional Components)

Backend: Node.js, Express.js

Scraping: Puppeteer (Headless Browser)

Automation: Node-Cron (Background Tasks)

Data Handling: XLSX, File System (JSON Database)

System Architecture
Plaintext

/project-root
├── bmsScrape.js       # The Scraper Engine (Developed by Rohan Modi)
├── Server.js          # Express API & Cron Job Scheduler
├── events.json        # Persistent JSON Database
├── /public            # Static assets & Generated Excel Reports
└── /frontend          # React Dashboard (Client-side)
How It Works
Extraction: Every 6 hours, a Cron job triggers bmsScrape.js.

Transformation: The system cleans the data, removes movies, and generates a unique ID for each event.

Loading: New events are merged with the existing database without overwriting old data.

Visualization: The React dashboard fetches analytics from /api/dashboard and displays them via a responsive UI.

Getting Started
Backend
Install dependencies: npm install

Start the server: node Server.js

Manual trigger (optional): Visit http://localhost:5000/api/run-scraper

Frontend
Navigate to frontend: cd frontend

Install dependencies: npm install

Start the app: npm start

Developed with  by Rohan Modi
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
