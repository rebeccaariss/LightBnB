# LightBnB

Designed to practice implementing an AirBnB-like multi-page web application, LightBnB is a Lighthouse Labs project backed by a PostgreSQL databas and Express server. Users can create an account (with credentials hashed and stored in the database), search for rental properties based on various user-supplied criteria/search parameters, and view existing reservations.

## Project Structure

```
.
├── db
│   ├── json
│   └── database.js
├── public
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── libraries
│   │   ├── index.js
│   │   ├── network.js
│   │   └── views_manager.js
│   ├── styles
│   │   ├── main.css
│   │   └── main.css.map
│   └── index.html
├── routes
│   ├── apiRoutes.js
│   └── userRoutes.js
├── styles  
│   ├── _forms.scss
│   ├── _header.scss
│   ├── _property-listings.scss
│   └── main.scss
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

* `db` contains all the database interaction code.
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.
* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `routes` contains the router files which are responsible for any HTTP requests to `/users/something` or `/api/something`. 
* `styles` contains all of the sass files. 
* `server.js` is the entry point to the application. This connects the routes to the database.

## Dependencies
  "bcrypt": "^3.0.6",
  "cookie-session": "^1.3.3",
  "express": "^4.17.1",
  "nodemon": "^1.19.1",
  "pg": "^8.11.2"

Install dependencies by running `npm install` from the terminal.

## Running the Server
`npm run local`

Access from `localhost:3000`

## Preview
**Landing page/listings:**

!["Screenshot of LightBnB home page"](docs/home-page.png)

**Search parameters and results returned:**

!["Search form & criteria"](docs/search-parameters.png)

!["Results returned from search (above)"](docs/resulting-search.png)

**User creation and login:**

!["Screenshot of user sign up form"](docs/sign-up.png)

!["Create listing page: signed in user at top left of page"](docs/signed-in.png)