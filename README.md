![Opengraph](https://user-images.githubusercontent.com/61944452/162560018-f7397679-60b7-437e-8260-26f44502381c.png)

---

# Getting Started

1. Create a .env.local file and populate it with a PostgreSQL Database URL, Admin Public Key and RPC Url

```
POSTGRES_URL=
NEXT_PUBLIC_ADMIN_PUBLIC_KEY=
NEXT_PUBLIC_MAINNET_ENDPOINT=
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

## Deploying with Vercel

**Prerequisites:**

- A Vercel account.
- A GitHub account.

### Step-by-step Guide:

1. **Use the 'Deploy with Vercel' Button:**

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWordcel%2Fwordcel-oss-dapp-ui&env=NEXT_PUBLIC_ADMIN_PUBLIC_KEY,NEXT_PUBLIC_MAINNET_ENDPOINT&stores=%5B%7B"type"%3A"postgres"%7D%5D&build-command=yarn%20prisma%20generate%20%26%26%20yarn%20prisma%20db%20push%20%26%26%20next%20build)

   Clicking on the button will navigate you to the Vercel platform for deployment initialization. Through this process:

   - A new repository is created in your GitHub account with the source code.
   - A PostgreSQL storage instance is set up on Vercel. If you're inclined to use an external PostgreSQL instance, you'll need to set the `POSTGRES_URL` environment variable in the Vercel app.

   During this deployment phase, be ready to provide values for certain environment variables (`NEXT_PUBLIC_ADMIN_PUBLIC_KEY` and `NEXT_PUBLIC_MAINNET_ENDPOINT`).

2. **Post-Deployment Configurations:**

   Should you decide to host your PostgreSQL externally, make it a point to whitelist the Vercel deployment URL, ensuring uninterrupted access for the application to the database.
