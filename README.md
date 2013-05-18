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
X   1) Migrate locker rental information to locker.
    2) Permissions: Client creation, master user, CRUD user info, CRUD site info
    -- Create a Client manager account? In progress

        Make everything "backbone compliant" so just render everything, including dropdowns. Makes it possible to edit items on the spot too.

    3) Client CRUD controls
    4) API permissions
    5) CSRF protection
    6) Modularize Backbone JS scripts, run through minifier for production use
    7) Add atomicity to locker reservation