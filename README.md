![Opengraph](https://user-images.githubusercontent.com/61944452/162560018-f7397679-60b7-437e-8260-26f44502381c.png)

___

# Getting Started

1. Create a .env file and populate it with a PostgreSQL Database URL
```
DATABASE_URL=
SLACK_HOOK=
BUNDLR_PRIVATE_KEY=
```

2. Install all dependencies
```
yarn
```

3. Generate the Prisma client
```
yarn prisma generate
```

4. Run the development server
```
yarn dev
```

5. Open the Prisma GUI to add values to your db
```
yarn prisma studio
```

