# Northcoders News API

In order to run this project locally, you will need to create the following files on the first level of the project's folder:

1: ".env.test" file with the following text on line 1: PGDATABASE=nc_news_test

2: ".env.development" file with the following text on line 1: PGDATABASE=nc_news

These files will create the environment variables that will allow the project to connect to the applicable databases. 

In addition, please be sure install/update the following packages:

- dotenv
- express
- pg
- jest
- jest-sorted

