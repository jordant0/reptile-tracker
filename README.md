# Herps Tracker

![](https://github.com/jordant0/reptile-tracker/workflows/CI%2FCD/badge.svg)

Website for tracking reptile activities: https://herpstracker.com

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Lints and fixes files
```
yarn run lint
```

## Deploying

1. Install `firebase-tools` if necessary

    ```
    npm install -g firebase-tools
    ```

1. Login to `firebase`

    ```
    firebase login
    ```

1. Compiles and minifies for production

    ```
    yarn run build
    ```

1. Deploy

    ```
    firebase deploy
    ```

## Encrypting/Decrypting secrets

* Encrypt `.env.production`

    ```
    openssl enc -aes-256-cbc -in .env.production -out .env.production.enc -k [ENCRYPTION_KEY]
    ```

* Decrypt `.env.production.enc`

    ```
    openssl enc -d -aes-256-cbc -in .env.production.enc -out .env.production -k [ENCRYPTION_KEY]
    ```
