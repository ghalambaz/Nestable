<?php
/* Toloe Fanavaran AWAN
 * YanaGroup Framework (YFrame 2)
 * Programmer: ali ghalambaz <aghalambaz@gmail.com>
 * Version: 2.01
 * Date: 10/24/13
 * Time: 1:43 PM
*/
if (isset($_POST['action'])) {
    require_once('ExampleModel.php');
    $pm = new ExampleModel();
    switch($_POST['action'])
    {
        case 'update':
            if (isset($_POST['isItemChanged']) && $_POST['isItemChanged'] == 'true') {
                if ($pm->changeItems($_POST['parent'], $_POST['dragged'], $_POST['order'])) {
                    echo 'Items Changed Successfully';
                } else {
                    echo 'Items Changing Failed';
                }
            } elseif (isset($_POST['isOrderChanged']) && $_POST['isOrderChanged'] == 'true') {
                if ($pm->changePriority($_POST['parent'], $_POST['order'])) {
                    echo 'Order Changed Successfully';
                } else {
                    echo 'Order Changing Failed';
                }
            }
            break;
        case 'add':
            $res =$pm->addNewItem(0,$_POST['name'],$_POST['lable'],'active',PHP_INT_MAX);
            if($res)
            {
                echo $res;
                return;
            }
            echo 'false';
            break;
        case 'delete':
            if($pm->removeItem($_POST['id']))
            {
                echo 'true';
            }
            else
            {
                echo 'false';
            }
            break;
        case 'edit':
            if($pm->editItem($_POST['id'],$_POST['name'],$_POST['lable']))
            {
                echo 'true';
            }
            else
            {
                echo 'false';
            }
            break;
        default:
            break;
    }

}
exit;
 