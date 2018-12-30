<?php
/* Toloe Fanavaran AWAN
 * YanaGroup Framework (YFrame 2)
 * Programmer: ali ghalambaz <aghalambaz@gmail.com>
 * Version: 2.01
 * Date: 10/5/13
 * Time: 9:28 PM
*/

require_once('../model/NestableModelAbstract.php');
class ExampleModel extends NestableModelAbstract{

    public function __construct($connect_it =true,$connection_name='noname',$user = null ,$engine=null)
    {
        parent::__construct($connect_it,$connection_name,$user,$engine);
        $this->setTableName("tb_ag_nestable");
        if(!$this->tableExist())
        {
            $this->createDatabaseTable($this->getTableName());
        }
    }
}