# Avionics Delay Predictor Frontend

This is the frontend application for the Flight Delay Predictor, built with Next.js and Tailwind CSS. It consumes data from a Python Flask backend to provide flight delay predictions and insights.

## Project Structure

\`\`\`
frontend/
├── app/                    # Next.js App Router (root layout, main page, global styles)
│   ├── page.tsx           # Main homepage component
│   ├── layout.tsx         # Root layout for the application
│   └── globals.css        # Global Tailwind CSS styles
├── components/            # Reusable React components
│   ├── hero.tsx           # Hero section for the landing page
│   ├── features.tsx       # Section highlighting key features
│   ├── prediction-form.tsx # Form for submitting flight details and getting predictions
│   ├── insights-dashboard.tsx # Dashboard displaying model insights and analytics
│   └── ui/               # shadcn/ui components (automatically added via CLI)
├── public/                # Static assets (images, icons)
├── package.json          # Project dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── next.config.mjs       # Next.js configuration
├── .gitignore           # Files and directories to ignore in Git
└── README.md            # This README file
\`\`\`

## Getting Started

To run the frontend application locally:

1.  **Navigate to the `frontend` directory:**
    \`\`\`bash
    cd frontend
    \`\`\`
2.  **Install dependencies:**
    \`\`\`bash
    npm install
    # or yarn install
    # or pnpm install
    \`\`\`
3.  **Run the development server:**
    \`\`\`bash
    npm run dev
    # or yarn dev
    # or pnpm dev
    \`\`\`
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## API Backend

This frontend application connects to the following API backend:

`https://airplane-delay-model-backend.onrender.com`

Ensure this backend service is running and accessible for the frontend to function correctly. If you encounter "Failed to fetch" errors, please check the status and logs of your backend deployment on Render.

## Deployment

You can deploy this Next.js application to Vercel, Netlify, or any other static hosting provider.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
