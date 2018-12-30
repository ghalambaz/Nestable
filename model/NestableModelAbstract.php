<?php
/* Toloe Fanavaran AWAN
 * YanaGroup Framework (YFrame 2)
 * Programmer: ali ghalambaz <aghalambaz@gmail.com>
 * Version: 2.01
 * Date: 10/4/13
 * Time: 7:29 PM
*/

require_once('NestableModelInterface.php');
require_once('ModelAbstract.php');
abstract class NestableModelAbstract extends ModelAbstract implements NestableModelInterface
{
    //MYISAM doesn't support transactions
    private $table_name = null;
    public function tableExist()
    {
        if($this->table_name)
        {
            $query="SHOW TABLES LIKE '".$this->table_name."'";
        }
        else
        return false;
        try
        {
            $stm = $this->connection->prepare($query);
            $stm->execute();
            return $stm->rowCount();
        }
        catch(\Exception $e)
        {
            //raise some error here => __error::silent_error('SQL_EXCEPTION_NESTABLE_MODEL_CREATE_DATABASE', $e->getMessage());
        }
    }
    public function createDatabaseTable($name)
    {
        $query = "CREATE TABLE {$name} (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  name char(100) NOT NULL,
  lable varchar(255) NOT NULL,
  parent int(10) unsigned NOT NULL,
  status enum('active','deactivate','deleted') NOT NULL DEFAULT 'active',
  priority int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY index_unique_name (name),
  KEY index_parent_priority (parent,priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

";
        try
        {
            $this->connection->exec($query);
            $this->addNewItem(0,'root','root','active','1');
        }
        catch(\Exception $e)
        {
            return false;
            //raise some error here => __error::silent_error('SQL_EXCEPTION_NESTABLE_MODEL_CREATE_DATABASE', $e->getMessage());
        }
    }
    public function dropTable(){} //ok
    public function changePriority($parent_id,$priorities_arr)
    {
        $query = "update ".$this->table_name." set priority=:priority where parent=:parent and id=:id limit 1";
        $switch = 0;
        try
        {
            $stm = $this->connection->prepare($query);
            foreach($priorities_arr as $priority => $id)
            {
                $stm->bindParam("priority",$priority,\PDO::PARAM_INT);
                $stm->bindParam("id",$id,\PDO::PARAM_INT);
                $stm->bindParam("parent",$parent_id,\PDO::PARAM_INT);
                if(!$stm->execute())
                {
                    $switch++;
                }
            }
            if($switch > 0)
            {
                //raise some error here =>__error::silent_error('SQL_ERROR_NESTABLE_MODEL_CHANGE_PRIORITY',"FIND $switch Errors,Execution Failed!");
                return false;
            }
            return true;
        }
        catch(\Exception $e)
        {
            //raise some error here =>__error::silent_error('SQL_EXCEPTION_NESTABLE_MODEL_CHANGE_PRIORITY', $e->getMessage());
            return false;
        }

    }
    public function changeItems($parent_id,$dragged_id,$priorities_arr)
    {
        $query = "update ".$this->table_name." set parent=:parent where id=:id limit 1";
        try
        {
            $stm = $this->connection->prepare($query);
            $stm->bindParam("id",$dragged_id,\PDO::PARAM_INT);
            $stm->bindParam("parent",$parent_id,\PDO::PARAM_INT);
            if($stm->execute())
            {
                 return $this->changePriority($parent_id,$priorities_arr);
            }
            //raise some error here =>__error::silent_error('SQL_ERROR_NESTABLE_MODEL_CHANGE_PRIORITY','Execution Failed!');
            return false;
        }
        catch(\Exception $e)
        {
            //raise some error here =>__error::silent_error('SQL_EXCEPTION_NESTABLE_MODEL_CHANGE_PRIORITY', $e->getMessage());
            return false;
        }


    }
    public function getChildsOf($parentID = 0)
    {
        $query="Select id,name,lable,parent,status from ".$this->table_name." where parent = :parent";
        try
        {
            $stm =$this->connection->prepare($query);
            $stm->bindParam("parent",$parentID,\PDO::PARAM_INT);
            if($stm->execute())
            {
                if($stm->rowCount() > 0)
                return $stm->fetchAll();
                else
                return 0;
            }
            //raise some error here =>__error::silent_error('SQL_ERROR_NESTABLE_MODEL_GET_CHILDS_OF', "Execution Failed!");
            return false;
        }
        catch(\Exception $e)
        {
            //raise some error here =>__error::silent_error('SQL_EXCEPTION_NESTABLE_MODEL_GET_CHILDS_OF', $e->getMessage());
            return false;
        }

    }
    public function removeItem($id)
    {
        $id = implode(',',$id);
        $query = "Delete From ".$this->table_name."  where id in ($id)";
        try
        {
            $stm =$this->connection->prepare($query);
            if($stm->execute())
            {
                return true;
            }
            //raise some error here =>__error::silent_error('SQL_ERROR_NESTABLE_MODEL_EDIT_ITEM','Execution Failed!');
            return false;
        }
        catch(\Exception $e)
        {
            //raise some error here =>__error::silent_error('SQL_EXCEPTION_NESTABLE_MODEL_EDIT_ITEM', $e->getMessage());
            return false;
        }
    }
    public function editItem($id,$name,$lable)
    {
        $query = "Update ".$this->table_name." Set name=:name,lable=:lable where id=:id limit 1";
        try
        {
            $stm =$this->connection->prepare($query);
            $stm->bindParam("name",$name,\PDO::PARAM_STR);
            $stm->bindParam("id",$id,\PDO::PARAM_INT);
            $stm->bindParam("lable",$lable,\PDO::PARAM_STR);
            if($stm->execute())
            {
                return true;
            }
            //raise some error here =>__error::silent_error('SQL_ERROR_NESTABLE_MODEL_EDIT_ITEM','Execution Failed!');
            return false;
        }
        catch(\Exception $e)
        {
            //raise some error here =>__error::silent_error('SQL_EXCEPTION_NESTABLE_MODEL_EDIT_ITEM', $e->getMessage());
            return false;
        }
    }
    public function addNewItem($parent,$name,$lable,$status,$priority)
    {
        $query="Insert into ".$this->table_name." (name,lable,parent,status,priority)values(:name,:lable,:parent,:status,:priority)";
        try
        {
            $stm = $this->connection->prepare($query);
            $stm->bindParam("name",$name,\PDO::PARAM_STR);
            $stm->bindParam("lable",$lable,\PDO::PARAM_STR);
            $stm->bindParam("parent",$parent,\PDO::PARAM_INT);
            $stm->bindParam("status",$status,\PDO::PARAM_STR);
            $stm->bindParam("priority",$priority,\PDO::PARAM_INT);
            if($stm->execute())
            {
                return $this->connection->lastInsertId();
            }
            //raise some error here =>__error::silent_error('SQL_ERROR_NESTABLE_MODEL_ADD_NEW_ITEM',"Execution Failed!");
            return false;
        }
        catch(\Exception $e)
        {
            //raise some error here =>__error::silent_error('SQL_EXCEPTION_NESTABLE_MODEL_ADD_NEW_ITEM', $e->getMessage());
            return false;
        }
    }
    public function ExportXml()
    {

    }
    public function ExportCSV()
    {

    }
    public function changeOrder($parentID,$Orders)
    {

    }
    public function getTableName()
    {
        return $this->table_name;
    }
    public function setTableName($table_name)
    {
        $this->table_name = $table_name;
        return $this;
    }
    public function getAll()
    {
        $query = "Select id,name,lable,parent,priority from ".$this->table_name." where status='active' order by parent,priority";
        try
        {
            $stm = $this->connection->prepare($query);
            if($stm->execute())
            {
                return $stm->fetchAll();
            }
            return false;
        }
        catch(\Exception $e)
        {
            //raise some error here =>__error::silent_error('SQL_ERROR_PROVINCE_GET_ALL_EXCEPTION','');
        }
    } //ok
    public function render()
    {
        $rows = $this->getAll();
        if($rows)
        {
            foreach($rows as $key => $data)
            {
                $ref[$data['parent']][$key] =  array('lable' => $data['lable'], 'id' => $data['id'],'name'=>$data['name']);
            }
        }

            echo '<div class="dd" data-id="0"><ol class="dd-list" id="main-dd-list">';
        if(!empty($ref))
        {
            $this->echo_sub($ref, 0);
        }
            echo '</ol></div>';


    } //ok
    private function echo_sub($arr,$parent)
    {
        foreach($arr[$parent] as $item)
        {
            $id = (int)$item['id'];
            printf('<li class="dd-item" data-id="%s" data-name="%s" data-lable="%s"><div class="dd-handle"> %s </div>',$id,$item['name'],$item['lable'],$item['lable']);
            if(isset($arr[$id]))
            {
                echo '<ol class="dd-list">';
                $this->echo_sub($arr, $id);
                echo '</ol>';
            }
            echo '</li>';
        }

    } //ok
}
