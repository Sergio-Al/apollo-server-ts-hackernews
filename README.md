# Typescript GraphQL Hackernews Backend

This is app is based is using the following tools

- TypeScript: our app need to have type safe values
- ts-node-dev: Runs the project with typescript, watching for every change
- apollo-server: A fully featured GraphQL server based on Express adn a few other libraries
- graphql
- nexus: is a library to create type-safe GraphQL schemas with a code first approach.

## Add a env file
create an `.env` file and add your values, `.env.example` is the template, add these values to your real `.env` file with your values.

## Run the project

install dependencies
```
npm install
```
generate your files (if you don't have `schema.graphql` and `nexus-typegen.ts`)
```
npm run generate
```
Generate our prisma migration database files, run this command if you modify the schema too
```
npx prisma generate
```
run the project
```
npm run dev
```
Optional: you can explore your database data with Prisma Studio
this will open a new tab in your browser
```
npx prisma studio
```
 ---
Now if you open http://localhost:3000 (with internet connection) you should enter to the Apllo studio GraphQL playground

![apollo-image](/assets/info/apollo-playground.png)

> Remember to run `npm run generate` if you change you schema,
> Don't touch generated files
