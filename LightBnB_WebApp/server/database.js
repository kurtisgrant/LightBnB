const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});



/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT * FROM users WHERE email = $1;
  `, [email])
    .then(res => res.rows[0] || null)
    .catch(err => console.log(err.message));
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users WHERE id = $1
  `, [id])
    .then(res => res.rows[0] || null)
    .catch(err => console.log(err.message));
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool.query(`
  INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;
  `, [user.name, user.email, user.password])
    .then(res => res.rows[0])
    .catch(err => console.log(err.message));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
  SELECT * FROM reservations 
  JOIN (
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews on property_reviews.property_id = properties.id
    GROUP BY properties.id
  ) p2 on reservations.property_id = p2.id
  WHERE reservations.guest_id = $1 
  LIMIT $2;
  `, [guest_id, limit])
    .then(res => res.rows)
    .catch(err => console.log(err.message));
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

  // Modify option values to suit query needs
  const qOptions = {
    city: '%',
    user_id: options.user_id,
    min_price: options.minimum_price_per_night || 0,
    max_price: options.maximum_price_per_night || 1000000,
    min_rating: options.minimum_rating || 0
  };
  if (options.city) {
    qOptions.city = options.city.length > 3 ?
      `%${options.city.slice(1, -1)}%` :
      `%${options.city}%`;
  }

  const queryStr = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews on property_reviews.property_id = properties.id
  WHERE city LIKE $1
  AND cost_per_night > $2
  AND cost_per_night < $3 \
  ${qOptions.user_id ? `\nAND user_id = ${qOptions.user_id}` : ''}
  GROUP BY properties.id
  HAVING avg(property_reviews.rating) > $4
  ORDER BY properties.cost_per_night
  LIMIT $5;
  `;
  const values = [qOptions.city, qOptions.min_price * 100, qOptions.max_price * 100, qOptions.min_rating, limit];

  return pool.query(queryStr, values)
    .then(res => res.rows)
    .catch(err => console.log(err.message));
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  let colsStr = '';
  let paramsStr = '';
  let valsArr = [];
  let ind = 0;
  for (const [key, value] of Object.entries(property)) {
    ind++;
    colsStr = colsStr.length ? `${colsStr}, ${key}` : key;
    paramsStr = paramsStr.length ? `${paramsStr}, $${ind}` : `$${ind}`;
    valsArr.push(value);
  }

  const queryStr =
    `INSERT INTO properties (${colsStr}) \
    VALUES (${paramsStr}) RETURNING *;`;

  return pool.query(queryStr, valsArr)
    .then(res => res.rows)
    .catch(err => console.log(err.message));
};
exports.addProperty = addProperty;
