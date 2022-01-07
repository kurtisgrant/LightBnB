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
  console.log('getting res for id: ', guest_id);
  return pool.query(`
  SELECT * FROM reservations 
  JOIN properties on reservations.property_id = properties.id
  WHERE guest_id = $1 
  LIMIT $2;
  `, [guest_id, limit])
    .then(res => res.rows)
    .catch(err => console.log(err.message));
};
getAllReservations(3, 10).then(res => console.log(res));
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  if (options.city && options.city.length > 3) {
    options.city = `%${options.city.slice(1, -1)}%`;
  } else if (options.city && options.city.length > 0) {
    options.city = `%${options.city}%`;
  } else {
    options.city = '%';
  }
  if (options.user_id) {
    options.user_id = `AND user_id = ${options.user_id}` || ``;
  }
  options.minimum_price_per_night = options.minimum_price_per_night || 0;
  options.maximum_price_per_night = options.maximum_price_per_night || 100000000;
  options.minimum_rating = options.minimum_rating || 0;

  return pool.query(`
  SELECT properties.*, avg(property_reviews.rating) 
  FROM properties
  JOIN property_reviews on property_reviews.property_id = properties.id
  WHERE city LIKE $1
  AND cost_per_night > $2
  AND cost_per_night < $3
  $4
  GROUP BY properties.id
  HAVING avg(property_reviews.rating) > $5
  ORDER BY properties.cost_per_night
  LIMIT $6;
  `, [options.city, options.minimum_price_per_night * 10, options.maximum_price_per_night * 10, options.user_id, options.minimum_rating, limit])
    .then(res => console.log('res: ', res.rows.map(r => r.title)))
    .catch(err => console.log(err.message));
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
