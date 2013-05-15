CloudCubbie.com

<h3>CloudCubbie AJAX guide</h3>

URL: /api/*

Lockers are grouped by location.

/api/locker/location/:locationId

<h3>Authentication && permissions</h3>

read, update, create, delete
->Users, 

<h5>Permissions</h5>

(1) Owner -- CRUD everything
(2) Master -- CRUD everything except Owner account
(3) Employee -- C/R/U/D on permission based level, no user control

<h5>Todo</h5>
1) Migrate locker rental information to locker.
2) Permissions: Create client creator script, master user, user management, site management
3) Ability to modify items from client view
4) CSRF protection
