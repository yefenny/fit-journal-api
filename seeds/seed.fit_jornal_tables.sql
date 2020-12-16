BEGIN;

TRUNCATE users, users_body_composition, meals, exercises , body_part, muscle_group, exercises_muscle_group, workouts, workouts_exercises RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, full_name, password)
values ('dunder','Dunder Mifflin', 'password'),
('Carlos','Carlos Martinez', 'pas345'),
('Mary','Mary James','new123'),
('West', 'West Knight','mypassword'),
('Ann', 'Ann Martin','a01234');

INSERT INTO users_body_composition (user_id,left_arm,right_arm,chest, waist, hips,left_thigh, right_thigh,left_calf, right_calf, weight, body_fat)
values (1,10,10,32,25,37.5,20.5,20.5,12,12,113,20.3),
(3,11,11,32,24,40,23,23,11,11,120,18.2),
(1,10,10,32,24,38,22,22,13,13,110,17.6),
(4,18,18,50,42,40,28,28,14,14,150,11.2);

INSERT INTO meals (title, url, description, user_id)
values ('pumpkin protein cookies','https://www.burnthefatblog.com/healthy-pumpkin-spice-protein-cookies/', 'High protein pumpin cookies',1),
 ('Banana protein bread','https://www.burnthefatblog.com/protein-banana-bread/', 'High protein banana bread',1),
 ('Chipotle tomato salsa','https://www.culinaryhill.com/fresh-tomato-salsa-chipotle-copycat/#wprm-recipe-container-29457','Copycat of chipotle tomato salsa',2),
 ('Pollo and Pinto mini tacos','https://mealprepmanual.com/pollo-and-pinto-mini-tacos/','Mini tacos with chicken and pinto beans',1);

 INSERT INTO exercises (title,url, description,user_id)
 values ('squat','https://www.runtastic.com/blog/en/squat-4-common-squat-mistakes-avoid/','regural squats',1),
 ('sumo squat','https://classpass.com/movements/sumo-squat', 'The Sumo Squat is a lower-body strength exercise that’s a variation of a standard squat. The key difference in this squat is that you take a wider stance and position your feet turned out. ',1),
 ('pistol squat','https://classpass.com/movements/pistol-squat','A Pistol Squat is a squat performed on one leg. It’s an advanced strength movement often included in CrossFit workout regimens. Pistol squats test the strength of your core, stabilizing muscles and the entire leg from glutes to ankles.',2),
 ('lunges','https://classpass.com/movements/lunge','A lunge is a versatile strength training move for your lower body that can be done in place or while moving across the floor. Lunges don’t require any special equipment and can be practiced anywhere, making them a great exercise for when you’re on the go.', 2);

 INSERT INTO body_part(name,category) 
 values('chest','upper body'),
 ('back','upper body'),
 ('arms','upper body'),
 ('abdominals','upper body'),
 ('legs','lower body'),
 ('shoulders','upper body');

 INSERT into muscle_group (name, body_part_id)
 values ('calves',5),
 ('hamstrings',5),
 ('quadriceps',5),
 ('glutes',5),
 ('biceps',3),
 ('triceps',3),
 ('forearms',3),
 ('trapezius',6),
 ('Latissimus dorsi',2),
 ('upper chest', 1),
 ('middle chest',1),
 ('lower chest', 1),
 ('abdominals',4);

INSERT into exercises_muscle_group(exercise_id,muscle_group_id)
values (1,1),
(1,2),
(1,3),
(1,4),
(2,3),
(2,4),
(3, 4),
(3, 2),
(3, 3),
(3,1),
(4,2),
(4,3),
(4,4),
(4,1)

INSERT INTO workouts (name)
values ('full body workout'),
('lower body'),
('upper body');

INSERT INTO workouts_exercises (workout_id, exercise_id, sets, reps)
values (2,1,4,12),
(2,2,4,12),
(2,3,4,10),
(2,4,4,15);

COMMIT;

