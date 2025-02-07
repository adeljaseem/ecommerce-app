# E-Commerce Website with Admin Product Management

## Overview

This project is a simple E-commerce web application where an Admin can manage products (add, edit, delete, list) and Users can view products. It consists of a Node.js/Express backend and a React frontend.

## Installation

Follow these steps to install and set up the application:

### Backend Setup

1.  **Navigate to the Backend Directory:**

    ```bash
    cd backend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

### Frontend Setup

1.  **Navigate to the Frontend Directory:**

    ```bash
    cd ../frontend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

### Database Setup

1.  **Install MySQL Server:** Follow the installation instructions for your operating system.

2.  **Connect to MySQL:**

    Use MySQL Workbench or the command line:

    ```bash
    mysql -u root -p
    ```

    Enter the root password you set during the installation.

3.  **Create the Database and Tables:**

    Execute the following SQL commands:

    ```sql
    CREATE DATABASE ecommerce;
    USE ecommerce;

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user'
    );

    CREATE TABLE products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL,
        image VARCHAR(255)
    );
    ```

## Configuration

### Backend Configuration

1.  **Create `.env` file:**

    In the `backend` directory, create a file named `.env`.

2.  **Add Environment Variables:**

    Add the following environment variables to the `.env` file, replacing the placeholders with your actual values:

    ```
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=ecommerce
    JWT_SECRET=your_secret_key
    ```

## Running the Application

### Running the Backend

1.  **Navigate to the Backend Directory:**

    ```bash
    cd backend
    ```

2.  **Start the Server:**

    ```bash
    npm start
    ```

### Running the Frontend

1.  **Navigate to the Frontend Directory:**

    ```bash
    cd frontend
    ```

2.  **Start the Development Server:**

    ```bash
    npm start
    ```