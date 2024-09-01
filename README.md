# MOVIE BOOKING BACKEND

This is a backend app for a movie booking system. Managers can add movies and sessions to the system. Users can then view available sessions and buy tickets.

You can register a new user and their role will be __client__. To create a manager, 'create user' endpoint should be used and it can only be used by a manager so use this to kickstart the app :
```json

{
  "username": "manager",
  "password": "password123"
}

```
After registering a user can login and get a JWT token.

Apart from auth endpoints, all other endpoints are protected and can only be accessed by a user with a valid JWT token.

Some other endpoints can only be used by a manager, which checks for the role of the user : 
```json

ROLE
0: MANAGER
1: CUSTOMER

```
In addition to that, customers cannot buy tickets for other users and cannot use other users' tickets to watch movies.


## Important Checks

* A ticket for a session can only be bought if the session date is in the future.

* Only one ticket can be bought for each session.

* In order to watch a movie, one can use their ticket but:
    
  * If the session date is in the past, movie cannot be watched.

  * If the session date is not today, movie cannot be watched either.

* There cannot be two sessions with the same date(YYYY-mm-dd), timeSlot and room.

* Sessions timeSlots can only be certain time slots, which are:
  * 10.00-12.00, 12.00-14.00, ..., 22.00-00.00
     * note: timeSlot data is converted to ENUM with a decorator before processed by the controller and for responses it is converted back again with DTO mapper in the controller to return sensible data.


## Installation

### Env

These envs should be set:
```bash
DATABASE_URL: postgres db url
DIRECT_URL: extra db url for supabase
JWT_SECRET: secret for jwt
```
### Commands

```bash
npm install
```

```bash
npm run prisma:generate
```

```bash
npm start
```

For tests:
```bash
npm run test
```
```bash
npm run test:cov
```
