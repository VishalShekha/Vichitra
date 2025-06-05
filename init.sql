CREATE DATABASE mydb;

\c mydb;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE passwords (
  id SERIAL PRIMARY KEY,
  website TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL
);
