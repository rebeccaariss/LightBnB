const { Pool } = require('pg');

const pool = new Pool({
  user: 'rebeccaariss',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

const properties = require("./json/properties.json");
const users = require("./json/users.json");

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  return pool
    .query(`
      SELECT *
      FROM users
      WHERE email = $1
      `, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool
    .query(`
      SELECT *
      FROM users
      WHERE id = $1
      `, [id])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (obj) => {

  const name = obj.name;
  const email = obj.email;
  const pwd = obj.password;

  return pool
    .query(`
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
      `, [name, email, pwd])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guest_id, limit = 10) => {
  return pool
    .query(`
      SELECT reservations.*, properties.*, properties.cost_per_night, reservations.start_date, AVG(rating) as average_rating
      FROM reservations
      JOIN properties ON properties.id = reservations.property_id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date ASC
      LIMIT $2;
      `, [guest_id, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  // 1. Search filters/parameters provided by user will be stored in this array:
  const queryParams = [];
  
  // 2. Establish query (all syntax preceding WHERE clause):
  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3. Check for user search filters/parameters,
  // add them to queryParams array,
  // append queryString with relevant WHERE clause:
  if (options.city || options.owner_id || options.minimum_price_per_night && options.maximum_price_per_night) {
    queryString += `WHERE `;
  }

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `city LIKE $${queryParams.length} `; // this works because length of queryParams is checked here immediately after pushing this param (from if condition block) to array.
  }

  if (options.owner_id) {
    if (options.city) {
      queryString += `AND `;
    }
    queryParams.push(`${options.owner_id}`);
    queryString += `owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    if (options.city || options.owner_id) {
      queryString += `AND `;
    }
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    queryString += `properties.cost_per_night >= $${queryParams.length - 1} AND properties.cost_per_night <= $${queryParams.length} `;
  }

  queryString += `GROUP BY properties.id `;

  // HAVING clause for aggregate functions must follow GROUP BY per syntax:
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += ` HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  // 4. Add limit to queryParams and append query with final clauses (including results limit):
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5. Check for correct output:
  console.log(queryString, queryParams);

  // 6. Execute query:
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
