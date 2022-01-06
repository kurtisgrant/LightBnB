SELECT city, count(reservations) as total_reservations
FROM reservations
JOIN properties on property_id = properties.id
GROUP BY city
ORDER BY total_reservations desc;