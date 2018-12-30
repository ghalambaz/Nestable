<?php
/* Toloe Fanavaran AWAN
 * YanaGroup Framework (YFrame 2)
 * Programmer: ali ghalambaz <aghalambaz@gmail.com>
 * Version: 2.01
 * Date: 10/24/13
 * Time: 1:23 PM
*/
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Improved Nestable</title>
    <!--[if lt IE 9]>
    <script src="../resources/js/html5.js"></script>
    <link rel="stylesheet" type="text/css" href="../resources/css/style_ie.css"/>
    <![endif]-->
    <link rel="stylesheet" type="text/css" href="../resources/css/bootstrap.min.css">
<!--    <link rel="stylesheet" type="text/css" href="../resources/css/reset.css">-->
    <link rel="stylesheet" type="text/css" href="../resources/css/style.css">
    <link rel="stylesheet" type="text/css" href="../resources/css/jquery.jgrowl.min.css">
    <link rel="shortcut icon" href="" type="image/x-icon"/>
    <meta name="keywords" content=""/>
    <meta name="description" content=""/>
</head>
<body>
<header>
    <div id="logo"></div>
</header>
<div id="wrap">
<div >
<div id="content">
<div class="control">
    <section id="inner-content">

        <div  class=" alert Nnote nInformation">
            Before Start : Check Database Config in nestable\config\database.php
        </div>

        <div class="top-table-control">
            <a href="#modalAdd" role="button" class="btn btn-info" data-toggle="modal" onclick="document.getElementById('add_txt_name').value = '';document.getElementById('add_txt_lable').value = '';"> <i class=" icon-th-list icon-white"> </i>Add New</a>
        </div>

        <div class="inner-form-div clearfix">

            <?php
            require_once('ExampleModel.php');
            $pm = new ExampleModel();
            $pm->render();
            ?>

            <div id="modalAdd" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h3 id="myModalLabel">Add New Item</h3>
                </div>

                <div class="modal-body">

                    <div class="control-group">
                        <label class="control-label" for="add_txt_name">Name</label>

                        <div class="controls">
                            <input id="add_txt_name" name="name" type="text" placeholder="unique name">
                        </div>

                    </div>


                    <div class="control-group">
                        <label class="control-label" for="add_txt_lable">lable</label>

                        <div class="controls">
                            <input id="add_txt_lable" name="lable" type="text" placeholder="type Lable to Show">
                        </div>
                    </div>

                </div>

                <div class="modal-footer">
                    <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                    <button class="btn btn-primary" onclick="add_nestable(document.getElementById('add_txt_name').value,document.getElementById('add_txt_name').value)" data-dismiss="modal" aria-hidden="true" >Add Item</button>
                </div>
            </div>



            <a id="trigeredit" href="#modaledit" role="button" class="btn" data-toggle="modal" style="display:none">Add New Item</a>

            <div id="modaledit" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h3 id="myModalLabel">Edit</h3>
                </div>

                <div class="modal-body">


                    <div class="control-group">
                        <label class="control-label" for="edit_txt_name">Name</label>

                        <div class="controls">
                            <input id="edit_txt_name" name="name" type="text" placeholder="unique name">
                        </div>

                    </div>


                    <div class="control-group">
                        <label class="control-label" for="add_txt_lable">lable</label>

                        <div class="controls">
                            <input id="edit_txt_lable" name="lable" type="text">
                            <input type="hidden" id="edit_hid_id" value="0">
                        </div>
                    </div>

                </div>

                <div class="modal-footer">
                    <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                    <button class="btn btn-primary" onclick="edit_nestable_save(document.getElementById('edit_hid_id').value,document.getElementById('edit_txt_name').value,document.getElementById('edit_txt_lable').value)" data-dismiss="modal" aria-hidden="true" >Apply</button>
                </div>
            </div>
        </div>


    </section>

</div> <!-- #control -->

</div> <!-- #content -->

</div> <!-- #left-side -->

</div> <!-- end id="wrap -->


<footer>
    <br>
    <br>
    <a href="mailto:aghalambaz@gmail.com">ALi Ghalambaz</a>
</footer>

<script src="../resources/js/jquery-1.8.3.min.js"></script>
<script src="../resources/js/bootstrap.min.js"></script>
<script src="../resources/js/jquery.jgrowl.min.js"></script>
<link rel="stylesheet" type="text/css" href="../resources/css/jquery.nestable.css">
<script type="text/javascript">
    $(document).ready(function(){
        $("#status-changer").find("li").eq(1).click(function(){
            $("a#statuss").removeClass("btn-info");
            $("a#statuss").addClass("btn-danger");
            $("a#statuss i").text("deactivate");
            var status =$("a#statuss").data("active");
            // alert(status)
        });

        $("#status-changer").find("li").eq(0).click(function(){
            $("a#statuss").removeClass("btn-danger");
            $("a#statuss").addClass("btn-info");
            $("a#statuss i").text("activate");
            var status =$("a#statuss").data("active");
            // alert(status)
        });

    });
</script>
<script type="text/javascript" src="../resources/js/jquery.nestable.js">
</script>
<script type="text/javascript" src="../resources/js/helper.js">
</script>
<script type="text/javascript">
    $('.dd').nestable({});
    $('.dd').on('change', function () {
        save_nestable("token");
    });
    function modaledit(){
        $('#trigeredit').trigger('click');
    };
</script>

</body>
</html>
