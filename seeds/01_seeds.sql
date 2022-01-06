INSERT INTO users (name, email, password) 
VALUES ('Gary Haynes','gary.haynes@example.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Sara Johnson','s.johnson@example.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Keith Sanderson','kman@example.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Michael Scott','michael.scott@michaelscott.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (2, 'On The Corner', 'Description of a property on a corner', 'https://source.unsplash.com/random', 'https://source.unsplash.com/random', 150, 0, 1, 2, 'Canada', 'Street St.', 'Ottawa', 'Ontario', 'X0X 1Y1', TRUE),
(2, 'Pink House', 'Description of a property with a pink house', 'https://source.unsplash.com/random', 'https://source.unsplash.com/random', 180, 1, 2, 3, 'Canada', 'Pink St.', 'Kingston', 'Ontario', 'Y1Y 2A2', TRUE),
(1, 'Rough One', 'Description of a property with a crappy house', 'https://source.unsplash.com/random', 'https://source.unsplash.com/random', 90, 0, 1, 1, 'Canada', 'Cheap St.', 'Bancroft', 'Ontario', 'K0L 1C0', TRUE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id) 
VALUES ('2021/09/02', '2021/09/09', 1, 3),
('2021/11/12', '2021/11/15', 1, 3),
('2021/10/28', '2021/11/07', 2, 2),
('2021/12/20', '2022/01/03', 1, 3),
('2021/11/08', '2021/12/30', 2, 4),
('2021/11/01', '2021/11/03', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (3, 1, 1, 5, 'I liked it a lot.'),
(3, 1, 2, 5, 'I liked it a lot again.'),
(2, 2, 3, 5, 'What wonderful decorations here. The owner must have impeccable design sense.'),
(4, 2, 5, 4.5, '"Would visit again" -Michael Scott'),
(2, 3, 6, 2.5, 'Not gonna lie. I''d probably try the Pink House or On The Corner house. They''re much better for your health.');

