![Opengraph](https://user-images.githubusercontent.com/61944452/162560018-f7397679-60b7-437e-8260-26f44502381c.png)

---

# Getting Started

1. Create a .env.local file and populate it with a PostgreSQL Database URL, Admin Public Key and RPC Url

```
POSTGRES_URL=
NEXT_PUBLIC_ADMIN_PUBLIC_KEY=
NEXT_PUBLIC_MAINNET_ENDPOINT=
NEXT_PUBLIC_DEVNET_ENDPOINT=
NEXT_PUBLIC_DIALECT_PUBLIC_KEY=
```

2. Install all dependencies

```
yarn
```

3. Generate the Prisma client

```
yarn prisma generate
```

4. Deploy the Prisma schema

```
yarn prisma db push
```

5. Run the development server

```
yarn dev
```

6. Open the Prisma GUI to add values to your db

```
yarn prisma studio
```

# Deploying on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWordcel%2Fwordcel-oss-dapp-ui&env=NEXT_PUBLIC_ADMIN_PUBLIC_KEY,NEXT_PUBLIC_DIALECT_PUBLIC_KEY,NEXT_PUBLIC_MAINNET_ENDPOINT,NEXT_PUBLIC_DEVNET_ENDPOINT&stores=%5B%7B"type"%3A"postgres"%7D%5D&build-command=yarn%20prisma%20generate%20%26%26%20yarn%20prisma%20db%20push%20%26%26%20next%20build)

## Prerequisites:

- Ensure you have a Vercel account.

- Before deploying, make sure you have set up a PostgreSQL instance. This can be done on platforms like Railway, Heroku, or other cloud providers.

## Steps:

1. **Click the 'Deploy with Vercel' Button**

   This will take you to the Vercel platform where you can set up your project. You'll be prompted to provide values for environment variables such as POSTGRES_URL, NEXT_PUBLIC_ADMIN_PUBLIC_KEY, etc.

2. **Override the Build Command**

   After deploying, go to your project settings on Vercel. In the "General" section, override the build command with the following:

   ```
   yarn prisma generate && next build
   ```

3. **Post Deployment Configurations (If Necessary)**

   Depending on your PostgreSQL hosting, you might need to whitelist the Vercel deployment URL to allow the application to access the database.
