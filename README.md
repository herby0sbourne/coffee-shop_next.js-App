# Before you run the app

Please go through the below details before you run the app.

## Environment Variables

For this app to work, you need to configure the following environment variables in your .env.local file so please create
a .env.local file in the root of your project right next to readme.md and the file needs to look like this:

```
NEXT_PUBLIC_FOURSQUARE_API_KEY=<value>
AIRTABLE_API_KEY=<value>
AIRTABLE_BASE_KEY=<value>
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=<value>
```

#### PLEASE NOTE,

You need to configure the above API keys by going to [Foursquare](https://foursquare.com/)
, [Airtable](https://www.airtable.com/) and [Unsplash](https://unsplash.com/) for their respective keys.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed
on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited
in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated
as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

