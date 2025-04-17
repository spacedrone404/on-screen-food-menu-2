► ON-SCREEN FOOD MENU FOR RESTAURANTS  
######################################

I hate lack of documentation, so here you will find comprehensive information about the project.  
I deployed project on Vercel, because i don't have idea how to do it in a fast way on GitHub pages.


![PIX](public/assets/admin.png)


► IMPLEMENTED FUNCTIONALITY  
############################

This web application combines abilities not only for restaurant customer service, but also for restaurant staff.
Functionality should be expanded in a while, just give me some time.

Display information for clients: 
* shows dinning menu on multiple monitors
* data are taken from PostgreSQL database by means of JS queries and PHP scripts

Functionality for restaurant staff:
* dashboard for adding new dishes
* removing dishes in the database by ID
* listing available dishes
* direct editing of listed elements
* real-time live search by title and ID

► DISTINCTIVE FEATURES  
#######################

* wide range of technologies used
* no lamer frameworks were used
* pure SCSS, no images were used
* purely made in VS Code
* made in Windows 7 x64 ESU/RedFox 135

► TECHNOLOGY STACK    
###################
 
FRONTEND SIDE  

PUG markup/SCSS  
JavaScript/NodeJs 23.7  
Webpack 5.98  
VS Code 1.93 (hacked)  

BACKEND SIDE  

XAMPP (to make PHP 8 work on Windows 7)  
Apache (embedded version)
PHP 8.2  
PostgreSQL 14  
PGAdmin 6.21 (hacked)  

Project includes the following technologies:
* Apache > hosting of  server PHP logic
* Webpack > module bundler to compile frontend side of the project 
* PUG > modern, modular replacement for classic HTML
* SCSS > graphics rendering and animation [btw, no images were used in the project]
* JavaScript > POST/GET queries to the PHP backend
* PHP > retrieve needed data from the database

► DATABASE ENVIRONMENT [_db folder]
####################################

Host: localhost  
Database : menus  
Table: dinnermenus  

To import "dinnermenus" table to "menus" database execute following:
```
psql -U postgres -d menus < dinnermenus.sql
```

SQL QUERY TO INSERT DATA

```
INSERT INTO dinnermenus (id, code, category, title, description, weight, price)
VALUES
(1, '1032', 'Cold dishes', 'Cold dishes menu 1', 'secondary description', '100', '100'),
(2, '1034', 'Cold dishes', 'Cold dishes menu 2', 'secondary description', '100', '120'),
(3, '1066', 'Side dishes', 'Side dishes 1 extra', 'secondary description', '150', '55'),
(4, '1067', 'Side dishes', 'Side dishes 1 extra', 'secondary description', '150', '65'),
(5, '2015', 'First courses', 'Soup with meat 1', 'secondary description', '100', '90'),
(6, '2006', 'First courses', 'Soup with meat 2', 'secondary description', '250', '80'),
(7, '3046', 'Second courses', 'Delicious fish 1', 'secondary description', '75', '75'),
(8, '3040', 'Second courses', 'Delicious fish 2', 'secondary description', '50', '20'),
(9, '3047', 'Drinks', 'Coca-Cola Light 1', 'secondary description', '75', '80'),
(10, '3041', 'Drinks', 'Coca-Cola Light 2',	'secondary description', '50', '100'),
(11, '3048', 'Bakery', 'Rug roll ban 1', 'secondary description', '75', '110'),
(12, '3049', 'Bakery', 'Rug roll ban 2', 'secondary description', '50', '150'),
(13, '3050', 'Bread', 'Bread 1', 'secondary description', '54', '70'),
(14, '3051', 'Bread', 'Bread 2', 'secondary description', '40', '65');
```

► PHP SERVER-SIDE LOGIC [_htdocs]  
##################################

info.php > reports PHP environment status  
connection.php > tests database connectivity  
extractor.php > extracts dishes by category  
injector.php > injects a new dish into the database  
list.php > lists all dishes in the database  
wiper.php > deletes dish by ID code in the database  


► TECHNICAL DETAILS  
####################

Project implements solution for a dinning menu generation, where data are taken from PostgreSQL database via PHP script.
On frontend side data is received by means of pure Javascript.
Webpack environment is used for a frontend foundation.
PUG syntax is used instead of plain HTML.
   
Take a note that Webpack module bundler is tuned for proxy connections in webpack.config.js
to be able to connect frontend JS with backend PHP hosted on localhost Apache service.

Also make sure to check entry points of webpack.config.js.
There are index1, index2, index3 and admin.
So bundler will emit index1.html, index2.html, index3.html to the browser.  

http://localhost:8080/screen1.html  
http://localhost:8080/screen2.html  
http://localhost:8080/screen3.html  
http://localhost:8080/admin.html  

and so on ....

Such feature will be useful to display independent information on different screens.
You can add more of them if you have such needs.

► FAQ & TROUBLESHOOTING  
############################

0] To start frontend-environment
```
npm run serve
```

1] Make sure that you have PostgreSQL/PHP/Node in User/System variables:
C:\Program Files\PostgreSQL\14\bin;
C:\xampp\php;

2] Check that PHP is correctly configured:
```
c:\xampp\php\php.ini
```
```
extension=pdo_pgsql
extension=pgsql
```

3] Double-check that crucial services like PostgreSQL/Apache are up and running:
```
services.msc
```
