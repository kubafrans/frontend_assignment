# frontend_assignment
Zadanie zaliczeniowe z FrontEndu - CRUD do MariaDB
Projekt składa się z części klienta (React), serwerowej (Node.js, Express.js) i bazodanowej (MariaDB)
Zawiera on takie funkcjonalności jak:
- logowanie
- wyświetlanie rekordów z bazy danych
- edycję rekordów w bazie danych
- dodawanie nowych rekordów do bazy danych
- usuwanie rekordów z bazy danych
Wykorzystane technologie:
- React + TypeScript
- Node.js i Express.js
- MariaDB
- Styled Components
- MaterialUI
Aby uruchomić projekt, należy:
- w folderach frontend i backend wywołać npm install
- następnie uruchomić poleceniem npm start
Projekt używa portów:
- frontend 3000
- backend 3001
- database 3306
Do logowania użyć:
-username: user
-password: user
SQL do utworzenia bazy danych shop (w razie zmiany nazwy należy zmienić w plikach backendu nazwę do której następuje połączenie):

create or replace table clothes
(
    product_id    int auto_increment
        primary key,
    product_name  varchar(50) not null,
    product_price double      not null,
    in_stock      int         not null
);

create or replace table products
(
    product_id    int auto_increment
        primary key,
    product_name  varchar(50) not null,
    product_price double      not null,
    in_stock      int         not null
);


INSERT INTO shop.clothes (product_id, product_name, product_price, in_stock) VALUES (1, 'Koszula', 52, 50);
INSERT INTO shop.clothes (product_id, product_name, product_price, in_stock) VALUES (2, 'Spodnie', 49.99, 15);
INSERT INTO shop.clothes (product_id, product_name, product_price, in_stock) VALUES (3, 'Czapka', 4, 4);

INSERT INTO shop.products (product_id, product_name, product_price, in_stock) VALUES (1, 'Mleko 3%', 5.99, 7);
INSERT INTO shop.products (product_id, product_name, product_price, in_stock) VALUES (2, 'Chleb ', 12.99, 10);
INSERT INTO shop.products (product_id, product_name, product_price, in_stock) VALUES (3, 'Kapusta', 7, 5);

SQL do utworzenia tabeli w bazie users:

create or replace table registered_users
(
    id       int auto_increment
        primary key,
    username varchar(50) default '' not null,
    password varchar(80) default '' not null
);

INSERT INTO users.registered_users (id, username, password) VALUES (1, 'user', '$2b$10$ydNVmcvpKZ1Ayrb3U8Zd4ubeIDGRMBeAtd491tu3QCq.DEmZ.AeKC');

