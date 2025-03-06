# Borrow Hub

This is a minimal REST API built with Node.js and Express for a React project. It includes endpoints for managing equipments and borrow requests.

## Prerequisites

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/miri831/BorrowHub.git
    ```

2. Navigate to the project directory:

    ```sh
    cd BorrowHub
    ```

3. Install the dependencies:

    ```sh
    npm install
    ```


## Running the Server

    ```sh
    npm start
    ```
    
The server will be running on `http://localhost:3000`.

### Data Structures

- **Equipment**:

    ```typescript
    interface Equipment {
        id: number;
        status: 'available' | 'borrowed';
        category: string;
        name: string;
        imgUri?: string;
        description?: string;
    }
    ```

    Example:

    ```typescript
    const equipment = {      
        id: 254,
        name: 'Dell Monitor',
        status: 'available', 
        category: 'monitor',
    }
    ```

- **User**:

    ```typescript
    interface User {
        id: number;
        username: string;
        password: string;
        phone?: string;
        email?: string;
    }
    ```

    Example:

    ```typescript
    const user = {
        id: 89,
        username: 'joe',
        password: '1209jjjjd3',
        phone: '034544990',
        email: 'joe@example.com'
    }
    ```

- **Borrow**:

    ```typescript
    interface Borrow {
        id: number;
        userId: number;
        equipmentId: number;
        startDate: Date;
        endDate: Date;
        status: 'available' | 'borrowed' | 'completed' | 'rejected';
    }
    ```

    Example:

    ```typescript
    const borrow1 = {
        id: 1209,
        userId: 89,
        equipmentId: 254,
        startDate: new Date('2025-02-05'),
        endDate: new Date('2025-02-25'),
        status: 'available',
    }
    ```

### Endpoints

#### POST /auth/register

- **Description**: Registers a new user.
- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**: JSON object with `username`, `password`, `phone`, and `email` properties.
- **Response**: User object if registration is successful, otherwise an error message.

#### POST /auth/login

- **Description**: Authenticates a user.
- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**: JSON object with `username` and `password` properties.
- **Response**: User object if authentication is successful, otherwise an error message.

#### POST /admin/equipments

- **Description**: Adds a new equipment to the equipments array. This method is used by admin user.
- **URL**: `/admin/equipments`
- **Method**: `POST`
- **Request Body**: JSON object representing the new equipment.
- **Headers**: Must include a "user" header in the request.
- **Response**: The newly added equipment.

#### GET /equipments

- **Description**: Retrieves a list of all equipments.
- **URL**: `/equipments`
- **Method**: `GET`
- **Response**: Array of equipment objects.

#### GET /equipments/:id

- **Description**: Retrieves a specific equipment by ID.
- **URL**: `/equipments/:id`
- **Method**: `GET`
- **Response**: Equipment object if found, otherwise an error message.

#### PUT /admin/equipments/:id

- **Description**: Updates an existing equipment by ID. This method is used by admin user.
- **URL**: `/admin/equipments/:id`
- **Method**: `PUT`
- **Request Body**: JSON object representing the updated equipment.
- **Headers**: Must include a "user" header in the request.
- **Response**: The updated equipment object if successful, otherwise an error message.

#### DELETE /admin/equipments/:id

- **Description**: Deletes an equipment by ID. This method is used by admin user.
- **URL**: `/admin/equipments/:id`
- **Method**: `DELETE`
- **Headers**: Must include a "user" header in the request.
- **Response**: Success message if the equipment is deleted, otherwise an error message.

#### POST /borrow

- **Description**: Processes a borrow request.
- **URL**: `/borrow`
- **Method**: `POST`
- **Request Body**: JSON object with `userId`, `equipmentId`, `startDate`, and `endDate` properties.
- **Headers**: Must include a "user" header in the request. The "user" header should contain the user ID.
- **Response**: Success message if the borrow request is processed, otherwise an error message.

#### GET /admin/borrows

- **Description**: Retrieves a list of all borrow requests of all users. This method is used by admin user only.
- **URL**: `/admin/borrows`
- **Method**: `GET`
- **Headers**: Must include a "user" header in the request. The "user" header should contain the string `admin`.
- **Response**: Array of borrow  objectsrequest.

#### PUT /admin/borrows/:id

- **Description**: Updates an existing borrow request by ID. This method is used by admin user only.
- **URL**: `/admin/borrows/:id`
- **Method**: `PUT`
- **Request Body**: JSON object representing the update request, the fields should be updated: `endDate` and `status`.
- **Headers**: Must include a "user" header in the request. The "user" header should contain the string `admin`.
- **Response**: The updated borrow request object if successful, otherwise an error message.

#### POST /borrow/:borrowId/return

- **Description**: Processes the return of a borrowed equipment. This method is used by a logged in user.
- **URL**: `/borrow/:borrowId/return`
- **Method**: `POST`
- **Headers**: Must include a "user" header in the request. The "user" header should contain the user ID.
- **Response**: Success message if the return is processed, otherwise an error message.


#### POST /borrow

- **Description**: Processes a borrow request.
- **URL**: `/borrow`
- **Method**: `POST`
- **Request Body**: JSON object with [equipmentId], [startDate], and [endDate] properties.
- **Headers**: Must include a "user" header in the request. The "user" header should contain the user ID.
- **Response**: Success message if the borrow request is processed, otherwise an error message.

#### PUT /borrow/:borrowId/return

- **Description**: Processes the return of a borrowed equipment. This method is used by a logged in user.
- **URL**: `/borrow/:borrowId/return`
- **Method**: `PUT`
- **Headers**: Must include a "user" header in the request. The "user" header should contain the user ID.
- **Response**: Success message if the return is processed, otherwise an error message.

#### PUT /admin/borrow/:borrowId/return

- **Description**: Processes the return of a borrowed equipment by an admin.
- **URL**: `/admin/borrow/:borrowId/return`
- **Method**: `PUT`
- **Headers**: Must include a "user" header in the request. The "user" header should contain the string `admin`.
- **Response**: Success message if the return is processed, otherwise an error message.

#### GET /borrows/me

- **Description**: Retrieves a list of borrow requests made by the logged-in user.
- **URL**: `/borrows/me`
- **Method**: `GET`
- **Headers**: Must include a "user" header in the request. The "user" header should contain the user ID.
- **Response**: Array of borrow request objects.

#### GET /admin/borrows

- **Description**: Retrieves a list of all borrow requests. This method is used by admin user only.
- **URL**: `/admin/borrows`
- **Method**: `GET`
- **Headers**: Must include a "user" header in the request. The "user" header should contain the string `admin`.
- **Response**: Array of borrow request objects.

#### GET /admin/borrows/overdue

- **Description**: Retrieves a list of overdue borrow requests. This method is used by admin user only.
- **URL**: `/admin/borrows/overdue`
- **Method**: `GET`
- **Headers**: Must include a "user" header in the request. The "user" header should contain the string `admin`.
- **Response**: Array of overdue borrow request objects.

#### PUT /admin/borrow/:id

- **Description**: Updates an existing borrow request by ID. This method is used by admin user only.
- **URL**: `/admin/borrow/:id`
- **Method**: `PUT`
- **Request Body**: JSON object representing the updated borrow request.
- **Headers**: Must include a "user" header in the request. The "user" header should contain the string `admin`.
- **Response**: The updated borrow request object if successful, otherwise an error message.

#### GET /categories

- **Description**: Retrieves a list of all equipment categories.
- **URL**: `/categories`
- **Method**: `GET`
- **Response**: Array of category strings.

#### GET /admin/users

- **Description**: Retrieves a list of all users. This method is used by admin user only.
- **URL**: '/admin/users'
- **Method**: `GET`
- **Headers**: Must include a "user" header in the request. The "user" header should contain the string `admin`.
- **Response**: Array of user objects.


## License

This project is licensed under the MIT License.
