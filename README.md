# React Project Server

This is a Node.js server built with Express for a React project. It includes endpoints for managing books, equipments, users, and borrow requests.

## Prerequisites

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/react-project-server.git
    ```

2. Navigate to the project directory:

    ```sh
    cd react-project-server
    ```

3. Install the dependencies:

    ```sh
    npm install
    ```

## Running the Server

1. Compile the TypeScript code:

    ```sh
    npx tsc
    ```

2. Start the server:

    ```sh
    node dist/index.js
    ```

The server will be running on `http://localhost:3000`.

## File Structure

### [index.ts](http://_vscodecontentref_/1)

- **Description**: Main entry point for the server.
- **Dependencies**: Express, body-parser, cors.
- **Port**: 3000

### Data Structures

- **Equipment**: Represents an equipment with [id], [status], [category], and [name].
- **User**: Represents a user with [id], `username`, `password`, `email` and `phone`.
- **Borrow**: Represents a borrow request with `userId`, `equipmentId`, `startDate`, and `endDate`.

### Endpoints


#### POST /auth/register

- **Description**: Registers a new user.
- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**: JSON object with `username`, `password`, `phone` and `email` properties.
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
- **URL**: `admin/equipments/:id`
- **Method**: `DELETE`
- **Headers**: Must include a "user" header in the request.
- **Response**: Success message if the equipment is     deleted, otherwise an error message.

#### POST /borrow

- **Description**: Processes a borrow request. 
- **URL**: `/borrow`
- **Method**: `POST`
- **Request Body**: JSON object with `userId`, `equipmentId`, `startDate`, and `endDate` properties.
- **Response**: Success message if the borrow request is processed, otherwise an error message.

#### GET /admin/borrows

- **Description**: Retrieves a list of all borrow requests of all users. This method is used by admin user only.
- **URL**: `/admin/borrows`
- **Method**: `GET`
- **Response**: Array of borrow request objects.


#### PUT /admin/borrows/:id

- **Description**: Updates an existing borrow request by ID. This method is used by admin user only.
- **URL**: `/admin/borrows/:id`
- **Method**: `PUT`
- **Request Body**: JSON object representing the update  request, the fields should be updated: `endDdate` and `status`.
- **Response**: The updated borrow request object if successful, otherwise an error message.

#### POST /borrow/:borrowId/return

- **Description**: Processes the return of a borrowed equipment. This method is used by a logged in user.
- **URL**: `/borrow/:borrowId/return`
- **Method**: `POST`
- **Request Body**: JSON object with `returnDate` property.
- **Response**: Success message if the return is processed, otherwise an error message.


## License

This project is licensed under the MIT License.