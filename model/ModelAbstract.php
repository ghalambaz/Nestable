<?php
/* Toloe Fanavaran AWAN
 * YanaGroup Framework (YFrame)
 * Programmer: ali ghalambaz <aghalambaz@gmail.com>
 * Version: 0.01
 * Date: 12/24/11 
 * Time: 4:58 PM */
abstract class ModelAbstract
{
    private static $db_config = null;
    private static $active = array();
    private static $counter = 0;
    public $connection = null;

    public function __construct($connect_it = true, $name = 'noname', $user = null, $engine = null)
    {
        if ($connect_it)
            $this->connection = self::connect($name = 'noname', $user = null, $engine = null);
    }

    public static function connect($name = 'noname', $user = null, $engine = null)
    {
        if (self::$db_config == null)
            self::getDataBaseConfig();
        if ($engine == null) {
            $engine = self::$db_config['default_engine'];
        }
        if ($user == null) {
            $user = self::$db_config['default_user'];
        }
        list($username, $password, $database, $host) = explode(';', self::$db_config['config'][$engine][$user]);
        $dsn = self::$engine($database, $host);
        try {
            $con = new \PDO($dsn, $username, $password);
            $con->setAttribute(\PDO::ATTR_CASE, \PDO::CASE_LOWER);
            $con->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
            $con->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $index = count(self::$active);
            self::$active[$index]['connection'] = $con;
            self::$active[$index]['name'] = $name;
            self::$active[$index]['user'] = $user;
            self::$active[$index]['engine'] = $engine;
            return $con;
        } catch (\PDOException $e) {
            echo 'Could not connect to database please check config file in /nestable/config/database.php';
            // raise some error here  => __error::silent_error('UNDEFINED',$e->getMessage());
            return false;
        }
    }

    private static function getDataBaseConfig()
    {
        $_DATABASE = array();
        include_once('../config/database.php');
        self::$db_config = $_DATABASE;
        return $_DATABASE;
    }

    public static function getActiveConnections()
    {
        return self::$active;
    }

    private static function mysql($db_name, $host = 'local', $port = 3306)
    {
        return "mysql:host=$host;port=$port;dbname=$db_name;charset=UTF8";
    }
}
