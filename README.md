# Reddit Clone

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What is this app?

This app is a challenge for a basic Reddit clone.

## How to run it?

This app works with Planetscale, for database, and Clerk, for authentication.
To run this project you basically need the following env vars:

```text
# Planetscale
DATABASE_URL='planetscale database url'
DATABASE_HOST='planetscale database host'
DATABASE_NAME='planetscale database name'
DATABASE_USERNAME='planetscale database username'
DATABASE_PASSWORD='planetscale database password'

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY='clerk publishable key'
CLERK_SECRET_KEY='clerk secret key'
CLERK_WEBHOOK_KEY='clerk webhook key'
```

Ps.: we make use of Clerk webhook to create a user on our database whenever it is created on Clerk. We store just basic information so we can provide some user inforamtions regarding name, username and account image.

## How do I deploy this?

A simple deploy on [Vercel](https://create.t3.gg/en/deployment/vercel) or [Netlify](https://create.t3.gg/en/deployment/netlify) would do the job, with the required env vars.
