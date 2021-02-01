# Fit-Journal!

This is the server of my first capstone project.

Fit-journal is an app where an user can store body composition progress, meals, exercises and workout routines.

### Back-end Structure - Business Objects

- Users (database table)

  - id (auto-generated integer)
  - email (text)
  - full_name (text)
  - password (text)
  - date_created (timestamp)
  - date_updated (timestamp)

- Exercises (database table)

  - id (auto-generated integer)
  - title (text required)
  - url (text)
  - description (text)
  - date_created (timestamp)
  - user_id (integer foreign key)

- Meals (database table)

  - id (auto-generated integer)
  - title (text required)
  - url (text)
  - description (text)
  - date_created (timestamp)
  - user_id (integer foreign key)

- Users_body_composition (database table)

  - id (auto-generated integer)
  - left_arm (numeric)
  - right (numeric)
  - chest (numeric)
  - waist (numeric)
  - hips (numeric)
  - left_thigh (numeric)
  - right_calf (numeric)
  - weight (numeric)
  - body_fat (numeric)
  - date_created (timestamp)
  - date_updated (timestamp)
  - user_id (integer foreign key)

- Exercises_muscle_group (database table)

  - id (auto-generated integer)
  - exercise_id (integer foreign key)
  - muscle_id (integer foreign key)

- Body_part (database table)

  - id (auto-generated integer)
  - name (text)
  - category ( body_category as ENUM ('lower body','upper body'))
  - date_created (timestamp)

- Muscle_group (database table)
  - id (auto-generated integer)
  - name (text)
  - body_part_id (integer foreign key)
  - date_created (timestamp)

### API Documentation

API Documentation details:

```text
/api
.
├── /body-compositions
│   └── GET
│       ├── /
│       ├── /chart/average
│       ├── /:id
│   └── POST
│       ├── /
│   └── PATCH
│       ├── /:id
│   └── DELETE
│       ├── /:id
├── /users
│   └── GET
│       ├── /
│   └── POST
│       └── /login/
│   └── POST
│       └── /signup/
├── /meals
│   └── GET
│       ├── /
│       ├── /:id
│       ├── /find/:query
│   └── POST
│       └── /
│   └── PATCH
│       └── /:id
│   └── DELETE
│       └── /:id
├── /exercises
│   └── GET
│       ├── /
│       ├── /:id
│       ├── /find/:query
│   └── POST
│       └── /
│   └── PATCH
│       └── /:id
│   └── DELETE
│       └── /:id
├── /body-parts
│   └── GET
│       ├── /
├── /muscle-groups
│   └── GET
│       ├── /
│       ├── /body-parts/:id
```

#### GET `/api/body-compositions/`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// res.body
[
    {
        "id": 7,
        "left_arm": "10",
        "right_arm": "10",
        "chest": "32",
        "waist": "25",
        "hips": "37.5",
        "left_thigh": "20.5",
        "right_thigh": "20.5",
        "left_calf": "12",
        "right_calf": "12",
        "weight": "113",
        "body_fat": "19.77",
        "date_created": "2021-01-22T00:11:25.455Z",
        "date_updated": "2021-01-26T20:37:40.864Z",
        "user_id": 1
    },
    {
        "id": 6,
        "left_arm": null,
        "right_arm": "10",
        "chest": "32",
        "waist": "25",
        "hips": "37.5",
        "left_thigh": "20.5",
        "right_thigh": "20.5",
        "left_calf": "12",
        "right_calf": "12",
        "weight": "113",
        "body_fat": "18",
        "date_created": "2021-01-22T00:11:22.509Z",
        "date_updated": "2021-01-26T20:38:06.145Z",
        "user_id": 1
    },
    {
        "id": 5,
        "left_arm": "10",
        "right_arm": "10",
        "chest": "32",
        "waist": "25",
        "hips": "37.5",
        "left_thigh": "20.5",
        "right_thigh": "20.5",
        "left_calf": "12",
        "right_calf": "12",
        "weight": "113",
        "body_fat": "20.3",
        "date_created": "2021-01-22T00:11:12.019Z",
        "date_updated": "2021-01-25T23:15:39.199Z",
        "user_id": 1
    },
   ...
]
```

#### GET `/api/body-compositions/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  id:id
}

// res.body

{
    "id": 1,
    "left_arm": "10",
    "right_arm": "10",
    "chest": "32",
    "waist": "25",
    "hips": "37.5",
    "left_thigh": "20.5",
    "right_thigh": "20.5",
    "left_calf": "12",
    "right_calf": "12",
    "weight": "113",
    "body_fat": "20.3",
    "date_created": "2020-12-31T02:10:42.853Z",
    "date_updated": "2021-01-21T23:51:13.948Z",
    "user_id": 1
}


```

#### GET `/api/body-compositions/chart/average`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// res.body
[
  {
        "to_char": "December  2020",
        "weight": "111.5000000000000000",
        "body_fat": "18.9500000000000000"
    },
    {
        "to_char": "January   2021",
        "weight": "113.0000000000000000",
        "body_fat": "20.3000000000000000"
    },
   ...
]
```

#### POST `/api/body-compositions/`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.body

  {
    "left_arm": "10",
    "right_arm": "10",
    "chest": "32",
    "waist": "25",
    "hips": "37.5",
    "left_thigh": "20.5",
    "right_thigh": "20.5",
    "left_calf": "12",
    "right_calf": "12",
    "weight": "113",
    "body_fat": "20.3"
}

// res.body

  {
    "id": 1,
    "left_arm": "10",
    "right_arm": "10",
    "chest": "32",
    "waist": "25",
    "hips": "37.5",
    "left_thigh": "20.5",
    "right_thigh": "20.5",
    "left_calf": "12",
    "right_calf": "12",
    "weight": "113",
    "body_fat": "20.3",
    "date_created": "2020-12-31T02:10:42.853Z",
    "date_updated": "2021-01-21T23:51:13.948Z",
    "user_id": 1
}

```

#### PATCH `/api/body-compositions/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.body
{
  id: id
}
// res.body

  {
    "left_arm": "13",
    "right_arm": "13",
    "chest": "32",
    "waist": "25",
    "hips": "37.5",
    "left_thigh": "20.5",
    "right_thigh": "20.5",
    "left_calf": "12",
    "right_calf": "12",
    "weight": "113",
    "body_fat": "20.3"
}

// res.body

  {

}

```

#### Delete `/api/body-compositions/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  id:id
}

// req.body

  {

}

// res.body

  {

}

```

#### GET `/api/users/

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// res.body

{
    "full_name": "Dunder Mifflin"
}


```

#### POST `/api/users/login`

```js

// req.body


  {
    "email": "dunder@gmail.com",
"password": "password"
}


// res.body


{
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MTE4Nzk2NzUsInN1YiI6ImR1bmRlckBnbWFpbC5jb20ifQ.ku3rU1lGeWVEUvA-_NWDQoM7hauIZU1V4K0EmPgMwlY"
}


```

#### POST `/api/users/signup`

```js

// req.body

{
"email": "test@gmail.com",
"full_name": "test name",
"password": "testpassword"
}



// res.body


{
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MTE4Nzk2NzUsInN1YiI6ImR1bmRlckBnbWFpbC5jb20ifQ.ku3rU1lGeWVEUvA-_NWDQoM7hauIZU1V4K0EmPgMwlY"
}


```

#### GET `/api/meals/

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// res.body
[
    {
        "id": 4,
        "title": "Pollo and Pinto mini tacos",
        "url": "https://mealprepmanual.com/pollo-and-pinto-mini-tacos/",
        "description": "Mini tacos with chicken and pinto beans",
        "date_created": "2020-12-31T02:10:42.853Z",
        "user_id": 1
    },
    {
        "id": 1,
        "title": "pumpkin protein cookies",
        "url": "https://www.burnthefatblog.com/healthy-pumpkin-spice-protein-cookies/",
        "description": "High protein pumpkin cookies 2",
        "date_created": "2020-12-31T02:10:42.853Z",
        "user_id": 1
    },
    ...
]


```

#### GET `/api/meals/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  id: id
}

// res.body
[
    {
        "id": 4,
        "title": "Pollo and Pinto mini tacos",
        "url": "https://mealprepmanual.com/pollo-and-pinto-mini-tacos/",
        "description": "Mini tacos with chicken and pinto beans",
        "date_created": "2020-12-31T02:10:42.853Z",
        "user_id": 1
    },
    {
        "id": 1,
        "title": "pumpkin protein cookies",
        "url": "https://www.burnthefatblog.com/healthy-pumpkin-spice-protein-cookies/",
        "description": "High protein pumpkin cookies 2",
        "date_created": "2020-12-31T02:10:42.853Z",
        "user_id": 1
    },
    ...
]


```

#### GET `/api/meals/find/:query`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  query: query
}

// res.body

   [
    {
        "id": 1,
        "title": "pumpkin protein cookies",
        "url": "https://www.burnthefatblog.com/healthy-pumpkin-spice-protein-cookies/",
        "description": "High protein pumpkin cookies 2",
        "date_created": "2020-12-31T02:10:42.853Z",
        "user_id": 1
    }
]


```

#### POST `/api/meals/`

```js

// req.header
{
    "Authorization": "Bearer ${token}",
}
// req.body

{
{"title":"Grilled chicken breats",
"url": "https://www.onceuponachef.com/recipes/perfectly-grilled-chicken-breasts.html",
"description": "A grilled chicken recipe"}
}



// res.body


{
    "id": 11,
    "title": "Grilled chicken breats",
    "url": "https://www.onceuponachef.com/recipes/perfectly-grilled-chicken-breasts.html",
    "description": "A grilled chicken recipe",
    "date_created": "2021-01-30T03:30:20.570Z",
    "user_id": 1
}


```

#### PATCH `/api/meals/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  id: id
}

// req.body

{
    "title":"Grilled chicken breats 2",
    "url": "https://www.onceuponachef.com/recipes/perfectly-grilled-chicken-breasts.html",
    "description": "A grilled chicken recipe 2"
}

```

#### DELETE `/api/meals/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}



// res.body

{
}

```

#### GET `/api/exercises/

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// res.body
[
  {
        "id": 1,
        "title": "squat",
        "url": "https://www.runtastic.com/blog/en/squat-4-common-squat-mistakes-avoid/",
        "description": "regural squats",
        "date_created": "2020-12-31T02:10:42.853Z",
        "user_id": 1
    },
    {
        "id": 27,
        "title": "squat",
        "url": "https://www.youtube.com/watch?v=U3HlEF_E9fo",
        "description": "exercise to better legs",
        "date_created": "2021-01-26T04:12:00.191Z",
        "user_id": 1
    },
    {
        "id": 28,
        "title": "squat",
        "url": "https://www.youtube.com/watch?v=U3HlEF_E9fo",
        "description": "exercise to better legs",
        "date_created": "2021-01-26T04:12:00.802Z",
        "user_id": 1
    },
    ...
]


```

#### GET `/api/exercises/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  id: id
}

// res.body
{
    "id": 28,
    "title": "squat",
    "url": "https://www.youtube.com/watch?v=U3HlEF_E9fo",
    "description": "exercise to better legs",
    "exercises_muscle_group": [
        {
            "id": 10,
            "name": "upper chest",
            "body_part_id": 1
        }
    ]
}


```

#### GET `/api/exercises/find/:query`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  query: query
}

// res.body

   [
    {
        "id": 27,
        "title": "squat",
        "url": "https://www.youtube.com/watch?v=U3HlEF_E9fo",
        "description": "exercise to better legs",
        "exercises_muscle_group": [
            {
                "id": 10,
                "name": "upper chest",
                "body_part": {
                    "id": 1,
                    "name": "chest"
                }
            }
        ]
    },
    {
        "id": 28,
        "title": "squat",
        "url": "https://www.youtube.com/watch?v=U3HlEF_E9fo",
        "description": "exercise to better legs",
        "exercises_muscle_group": [
            {
                "id": 10,
                "name": "upper chest",
                "body_part": {
                    "id": 1,
                    "name": "chest"
                }
            }
        ]
    },
    {
        "id": 1,
        "title": "squat",
        "url": "https://www.runtastic.com/blog/en/squat-4-common-squat-mistakes-avoid/",
        "description": "regural squats",
        "exercises_muscle_group": [
            {
                "id": 1,
                "name": "calves",
                "body_part": {
                    "id": 5,
                    "name": "legs"
                }
            },
            {
                "id": 2,
                "name": "hamstrings",
                "body_part": {
                    "id": 5,
                    "name": "legs"
                }
            },
            {
                "id": 3,
                "name": "quadriceps",
                "body_part": {
                    "id": 5,
                    "name": "legs"
                }
            },
            {
                "id": 4,
                "name": "glutes",
                "body_part": {
                    "id": 5,
                    "name": "legs"
                }
            }
        ]
    },
    ...
]


```

#### POST `/api/exercises/`

```js

// req.header
{
    "Authorization": "Bearer ${token}",
}
// req.body

{
    "title":"squat",
    "muscle_ids": [ {
      "muscle_group_id": 10
    }],
    "url": "https://www.youtube.com/watch?v=U3HlEF_E9fo",
    "description": "exercise to better legs"}


```

#### PATCH `/api/exercises/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  id: id
}

// req.body

{
   {
     "title":"squat",
     "muscle_ids": [ {
      "muscle_group_id": 2
      },{
      "muscle_group_id": 1
     }],
    "url": "https://www.youtube.com/watch?v=U3HlEF_E9fo",
    "description": "exercise to work legs"}
}

```

#### DELETE `/api/exercises/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}



// res.body

{
}

```

#### GET `/api/body-parts/`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// res.body
[
    {
        "id": 1,
        "name": "chest",
        "category": "upper body",
        "date_created": "2020-12-31T02:10:42.853Z"
    },
    {
        "id": 2,
        "name": "back",
        "category": "upper body",
        "date_created": "2020-12-31T02:10:42.853Z"
    },
    {
        "id": 3,
        "name": "arms",
        "category": "upper body",
        "date_created": "2020-12-31T02:10:42.853Z"
    },
   ...
]
```

#### GET `/api/muscle-groups/`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// res.body
[
   {
        "id": 1,
        "name": "calves",
        "body_part_id": 5,
        "date_created": "2020-12-31T02:10:42.853Z"
    },
    {
        "id": 2,
        "name": "hamstrings",
        "body_part_id": 5,
        "date_created": "2020-12-31T02:10:42.853Z"
    },
    {
        "id": 3,
        "name": "quadriceps",
        "body_part_id": 5,
        "date_created": "2020-12-31T02:10:42.853Z"
    },
   ...
]
```

#### GET `/api/muscle-groups/body-parts/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  id:id
}

// res.body
[

    {
        "id": 10,
        "name": "upper chest",
        "body_part_id": 1,
        "date_created": "2020-12-31T02:10:42.853Z"
    },
    {
        "id": 11,
        "name": "middle chest",
        "body_part_id": 1,
        "date_created": "2020-12-31T02:10:42.853Z"
    },
    {
        "id": 12,
        "name": "lower chest",
        "body_part_id": 1,
        "date_created": "2020-12-31T02:10:42.853Z"
    },
   ...
]
```

These server is developed with:
Node.js, express, mocha, chai and PostgreSql.
