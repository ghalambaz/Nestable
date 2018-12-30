<?php
/* Toloe Fanavaran AWAN
 * YanaGroup Framework (YFrame 2)
 * Programmer: ali ghalambaz <aghalambaz@gmail.com>
 * Version: 2.01
 * Date: 10/24/13
 * Time: 1:04 PM
*/
//change it with your default config
$db_username  = 'database username';
$db_password  = 'database password';
$db_name = 'database name';
$db_host = 'localhost';

//please do not edit!
$_DATABASE['default_engine'] = 'mysql';
$_DATABASE['default_user'] = 'admin';
$_DATABASE['config']['mysql']['admin'] = "{$db_username};{$db_password};{$db_name};{$db_host}"; //username;password;database_host