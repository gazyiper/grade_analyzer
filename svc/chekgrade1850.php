<?php
header("Content-Type: text/html;charset=utf-8");
$id = $_POST["user"];//接收login.php POST的考生号
setcookie("user",$id, time()+3600);
$ib = $id+1; 
$con = mysql_connect("localhost", "root", "123631");//连接数据库
if (!$con){
   die('连接失败: ' . mysql_error());
}
$db_selected = mysql_select_db("demosql",$con);//选中数据库
$sqla = "SELECT * FROM `testt` WHERE `test` LIKE '$id'";//取出考生成绩
$sqlc = "SELECT * FROM `testt` WHERE `test` LIKE '$ib'";
$sqlb = "SELECT * FROM `testt` WHERE `test` LIKE '考号'";//取出表格头-ui
$sqld = "SELECT * FROM `testt` WHERE `test` LIKE 'id'";//取出表格头-
$resulta = mysql_query($sqla,$con);
$resultb = mysql_query($sqlb,$con);
$resultc = mysql_query($sqlc,$con);
$resultd = mysql_query($sqld,$con);
$rowb = mysql_fetch_array($resultb);
$rowa = mysql_fetch_array($resulta);
$rowc = mysql_fetch_array($resultc);
$rowd = mysql_fetch_array($resultd);


 //设置cookies

$d = 1;

$aa=array();
   while (isset($rowd[$d])) {
     $aa[$d] = $rowa[$d] - $rowc[$d];
 setcookie("$rowd[$d]",$rowa[$d], time()+360000);
 setcookie("$rowd[$d]_a",$rowc[$d], time()+360000);
 setcookie("$rowd[$d]_Balance",$aa[$d], time()+360000);
   $d++;

      }


 


?>



<script>
var strCookie=document.cookie; 
var arrCookie=strCookie.split("; "); 


for(var i=0;i<arrCookie.length;i++){ 
         var arr=arrCookie[i].split("=");

         window[arr[0]] = arr[1];
         //i++;
         //var grr = arrCookie[i].split("=");
         //window[arr[0]+'_Balance'] = arr[1] - grr[1];
         //i--;
} 

function updown(Balance){
  if (Balance > 0) {
    
      document.write("<i class='i_uarr'>↑</i>");
      }
  else{
      if (Balance < 0) {
        document.write("<i class='i_darr'>↑</i>");
      }
      else{
        document.write("<i class='i_sarr'>↑</i>");
      }
  }
    
  }

function updown_Bling(Balance_a){
  if (Balance_a > 0) {
    
      document.write("<h4 id='todayPV' class='up'>");
      }
  else{
      if (Balance_a < 0) {
        document.write("<h4 id='todayPV' class='down'>");
      }
      else{
        document.write("<h4 id='todayPV' class='stable'>");
      }
  }
    
  }
function updown_Big(Balance_b){
  if (Balance_b > 0) {
    
      document.write("<h4>较上次排名上升");
      }
  else{
      if (Balance_b < 0) {
        document.write("<h4>较上次排名下降");
      }
      else{
        document.write("<h4>-----coding-------");
      }
  }
    
  }

//alert(+updown(3)+);
</script>

<!--开始网页-->

<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="Description" content="">
<meta name="Keywords" content="">
<script src="js/Chart.js"></script>
<link href="bootstrap.css" rel="stylesheet" type="text/css" />
<meta http-equiv="content-type" content="textml; charset=UTF-8" />
<title>成绩查询</title>
</head>
<body class="body_bg">

<style type="text/css">.WPA-CONFIRM { z-index:2147483647; min-width:400px; min-height:105px; width:auto!important; height:auto!important; width:400px; height:105px; margin:0; padding:12px 8px 30px 18px; border:1px solid #3473a3; border-radius:3px; background-color:#f9fcff;}.WPA-CONFIRM-TITLE { height:12px; margin:0; padding:0; line-height:12px; color:#234864; font-weight:bold; font-size:12px;}.WPA-CONFIRM-CONTENT { margin:0; padding:19px 10px 0 0; line-height:19px; color:#234864; font-size:12px;}.WPA-CONFIRM-PANEL { position:absolute; right:8px; bottom:8px; margin:0; padding:0; text-align:right;}.WPA-CONFIRM-BUTTON { position:relative; display:inline-block!important; display:inline; zoom:1; min-width:62px; height:22px; margin:0 0 0 5px; padding:0 4px; background:url(http://cdn.b.qq.com/account/bizqq/images/wpa/wpa_confirm_sprites.png) repeat-x 0 -163px; line-height:22px; color:#234864; text-decoration:none; font-size:12px; text-align:center;}.WPA-CONFIRM-BUTTON:hover { background-position:0 -207px; text-decoration:none; color:##234864;}.WPA-CONFIRM-BUTTON:active { background-position:0 -251px; text-decoration:none; color:##234864;}.WPA-CONFIRM-BUTTON-FOCUS { background-position:0 -31px;}.WPA-CONFIRM-BUTTON-FOCUS:hover { background-position:0 -75px;}.WPA-CONFIRM-BUTTON-FOCUS:active { background-position:0 -119px;}.WPA-CONFIRM-BUTTON-PADDING { position:absolute; left:0; top:0; display:inline-block!important; display:inline; zoom:1; width:4px; height:22px; background:url(http://cdn.b.qq.com/account/bizqq/images/wpa/wpa_confirm_sprites.png) no-repeat 0 -141px;}.WPA-CONFIRM-BUTTON:hover .WPA-CONFIRM-BUTTON-PADDING { background-position:0 -185px;}.WPA-CONFIRM-BUTTON:active .WPA-CONFIRM-BUTTON-PADDING { background-position:0 -229px;}.WPA-CONFIRM-BUTTON-FOCUS .WPA-CONFIRM-BUTTON-PADDING { background-position:0 -9px;}.WPA-CONFIRM-BUTTON-FOCUS:hover .WPA-CONFIRM-BUTTON-PADDING { background-position:0 -53px;}.WPA-CONFIRM-BUTTON-FOCUS:active .WPA-CONFIRM-BUTTON-PADDING { background-position:0 -97px;}.WPA-CONFIRM-BUTTON-RIGHT { left:auto; right:0; background-position:-5px -141px;}.WPA-CONFIRM-BUTTON:hover .WPA-CONFIRM-BUTTON-RIGHT { background-position:-5px -185px;}.WPA-CONFIRM-BUTTON:active .WPA-CONFIRM-BUTTON-RIGHT { background-position:-5px -229px;}.WPA-CONFIRM-BUTTON-FOCUS .WPA-CONFIRM-BUTTON-RIGHT { background-position:-5px -9px;}.WPA-CONFIRM-BUTTON-FOCUS:hover .WPA-CONFIRM-BUTTON-RIGHT { background-position:-5px -53px;}.WPA-CONFIRM-BUTTON-FOCUS:active .WPA-CONFIRM-BUTTON-RIGHT { background-position:-5px -97px;}</style>
<div id="header">
<div class="logo">
<a href="http://" title="LOGO"><img src="abc_files/logow.png" alt="LOGO"></a>
</div>
<div class="nav_cont">
<div class="nav" id="menu_main"><ul>
<li class="current" menu="main-0"><a href="http://www.baidu.com">成绩单</a></li>
    
<li class="" menu="main-1"><a href="javascript:;">错题本</a></li>
    
<li class="" menu="main-0"><a href="123.254.110.146/elfinder-CSDN/elfinder.html">课件夹</a></li>
    
<li class="" menu="main-3"><a href="javascript:;">Gazyip</a></li>
      
<li class="" menu="main-3"><a href="javascript:;">Beanstalk</a></li>
    
<li style="display: none;" class="" menu="main-7"><a href="javascript:;">X6</a></li>
</ul></div>
</div>
</div>
</div>


</br></br></br></br>






<?php
$b = 2;
    while (isset($rowb[$b])) {

//输出表格头
  if ($b == 2) {
         echo "<div class='table-responsive' >";
         echo "<table class='table table-striped table-bordered table-condensed  table-hover' >";
         echo "<thead>";
         echo "<tr>";
         echo "<th>".$rowb[$b]."</th>";
      }
      else {
         echo "<th>".$rowb[$b]."</th>";
      }
  $b++;
      }
    
   echo"</tr>";
   echo "</thead>";

//输出成绩

    $a = 2;
    while (isset($rowa[$a])) {
      if ($a == 2) {
        echo "<tbody>";
         echo "<tr>";
         echo "<td>".$rowa[$a]."</td>";
      }
      else{
        echo "<td>".$rowa[$a]."</td>";
      }
     $a++;
    }
 
 echo "</tr>";

//输出成绩2

    $c = 2;
    while (isset($rowc[$c])) {
      if ($c == 2) {
        echo "<tbody>";
         echo "<tr>";
         echo "<td>".$rowc[$c]."</td>";
      }
      else{
        echo "<td>".$rowc[$c]."</td>";
      }
     $c++;
    }
 
 echo "</tr>";
 echo "</tbody>";
echo "</table>";
 echo "</div>";


//关闭sql连接
mysql_close($con);
?>

<!--这里输出图像化成绩-->
               
<div class="summary cf">
        <div class="datalist">
            <ul>
                <li>
                    <h3>语文</h3>
                    <script type="text/javascript" >updown_Bling(ChineseScore_Balance)</script>
              
                      <script type="text/javascript" >document.write(ChineseScore)</script>
                    </h4>
                    <div class="data" id="data_pv" onmouseover="c_exec(this)" style="display: block;">
                        <p>较上次：<span><script type="text/javascript" >updown(ChineseScore_Balance)</script><script type="text/javascript" >document.write(Math.abs(ChineseScore_Balance))</script>分</span></p>
                        </div>
                    <div class="map" id="map_pv" style="height: 46px; display: none;"><div class="highcharts-container" id="highcharts-79" style="position: relative; overflow: hidden; width: 150px; height: 46px; text-align: left; line-height: normal; font-family: 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif; font-size: 12px;"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="150" height="46"><defs><clipPath id="highcharts-80"><rect rx="0" ry="0" fill="none" x="0" y="0" width="150" height="47" stroke-width="0.000001"></rect></clipPath></defs><rect rx="5" ry="5" fill="#FFFFFF" x="0" y="0" width="150" height="46" stroke-width="0.000001"></rect><g class="highcharts-grid" zIndex="1"></g><g class="highcharts-grid" zIndex="1"><path fill="none" d="M 0 0.5 L 150 0.5" stroke="#eae9e9" stroke-width="1" zIndex="1"></path><path fill="none" d="M 0 46.5 L 150 46.5" stroke="#eae9e9" stroke-width="1" zIndex="1"></path></g><g class="highcharts-series-group" zIndex="3"><g class="highcharts-series" visibility="visible" clip-path="url(http://v2.tsummary/index?sId=7835836#highcharts-80)"><path fill="none" d="M 3.125 41.8 L 9.375 44.6 L 15.625 45.3 L 21.875 45.3 L 28.125 45.3 L 34.375 45.6 L 40.625 43.5 L 46.875 44.3 L 53.125 35.7 L 59.375 30 L 65.625 14.6 L 71.875 8.8 L 78.125 28.7 L 84.375 25.7 L 90.625 26.4 L 96.875 27.9 L 103.125 16.6 L 109.375 20.3 L 115.625 29 L 121.875 32.2 L 128.125 30.4 L 134.375 44.2" stroke="#1bd0dc" stroke-width="2"></path><path fill="rgb(27,208,220)" d="M 3.125 41.8 L 9.375 44.6 L 15.625 45.3 L 21.875 45.3 L 28.125 45.3 L 34.375 45.6 L 40.625 43.5 L 46.875 44.3 L 53.125 35.7 L 59.375 30 L 65.625 14.6 L 71.875 8.8 L 78.125 28.7 L 84.375 25.7 L 90.625 26.4 L 96.875 27.9 L 103.125 16.6 L 109.375 20.3 L 115.625 29 L 121.875 32.2 L 128.125 30.4 L 134.375 44.2 L 134.375 46 L 3.125 46" fill-opacity="0.1"></path></g></g><g class="highcharts-axis" zIndex="7"><path fill="none" d="M 9.5 46 L 9.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 16.5 46 L 16.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 22.5 46 L 22.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 28.5 46 L 28.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 34.5 46 L 34.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 41.5 46 L 41.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 47.5 46 L 47.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 53.5 46 L 53.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 59.5 46 L 59.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 66.5 46 L 66.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 72.5 46 L 72.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 78.5 46 L 78.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 84.5 46 L 84.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 91.5 46 L 91.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 97.5 46 L 97.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 103.5 46 L 103.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 109.5 46 L 109.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 116.5 46 L 116.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 122.5 46 L 122.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 128.5 46 L 128.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 134.5 46 L 134.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 141.5 46 L 141.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 147.5 46 L 147.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 3.5 46 L 3.5 51" stroke="#C0D0E0" stroke-width="1"></path></g><g class="highcharts-axis" zIndex="7"></g><path fill="none" d="M 0 46.5 L 150 46.5" stroke="#6a7791" stroke-width="1" zIndex="7" visibility="visible"></path><g class="highcharts-tracker" zIndex="9"><g zIndex="1" clip-path="url(http://v2.ta./summary/index?sId=7835836#highcharts-80)"><path fill="none" d="M -6.875 41.8 L 3.125 41.8 L 9.375 44.6 L 15.625 45.3 L 21.875 45.3 L 28.125 45.3 L 34.375 45.6 L 40.625 43.5 L 46.875 44.3 L 53.125 35.7 L 59.375 30 L 65.625 14.6 L 71.875 8.8 L 78.125 28.7 L 84.375 25.7 L 90.625 26.4 L 96.875 27.9 L 103.125 16.6 L 109.375 20.3 L 115.625 29 L 121.875 32.2 L 128.125 30.4 L 134.375 44.2 L 144.375 44.2" isTracker="true" stroke-linejoin="bevel" visibility="visible" stroke-opacity="0.000001" stroke="rgb(192,192,192)" stroke-width="22" style=""></path></g></g></svg></div></div>
                </li>
                <li>
                    <h3>数学</h3>
                   <script type="text/javascript" >updown_Bling(MathScore_Balance)</script>
                      <script type="text/javascript" >document.write(MathScore)</script>
                    </h4>
                    <div class="data" id="data_iv" onmouseover="c_exec(this)" style="display: block;">
                        <p>较上次：<span><script type="text/javascript" >updown(MathScore_Balance)</script><script type="text/javascript" >document.write(Math.abs(MathScore_Balance))</script>分</span></p>
                    </div>
                    <div class="map" id="map_iv" style="height: 46px; display: none;"><div class="highcharts-container" id="highcharts-87" style="position: relative; overflow: hidden; width: 150px; height: 46px; text-align: left; line-height: normal; font-family: 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif; font-size: 12px;"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="150" height="46"><defs><clipPath id="highcharts-88"><rect rx="0" ry="0" fill="none" x="0" y="0" width="150" height="47" stroke-width="0.000001"></rect></clipPath></defs><rect rx="5" ry="5" fill="#FFFFFF" x="0" y="0" width="150" height="46" stroke-width="0.000001"></rect><g class="highcharts-grid" zIndex="1"></g><g class="highcharts-grid" zIndex="1"><path fill="none" d="M 0 0.5 L 150 0.5" stroke="#eae9e9" stroke-width="1" zIndex="1"></path><path fill="none" d="M 0 46.5 L 150 46.5" stroke="#eae9e9" stroke-width="1" zIndex="1"></path></g><g class="highcharts-series-group" zIndex="3"><g class="highcharts-series" visibility="visible" clip-path="url(http://v2.taummary/index?sId=7835836#highcharts-88)"><path fill="none" d="M 3.125 41.3 L 9.375 44.3 L 15.625 45.2 L 21.875 45.1 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.3 L 59.375 31.5 L 65.625 29.3 L 71.875 21.4 L 78.125 31.4 L 84.375 31.4 L 90.625 33.3 L 96.875 34.6 L 103.125 31.1 L 109.375 31.4 L 115.625 33.7 L 121.875 36.2 L 128.125 33.7 L 134.375 43.6" stroke="#1bd0dc" stroke-width="2"></path><path fill="rgb(27,208,220)" d="M 3.125 41.3 L 9.375 44.3 L 15.625 45.2 L 21.875 45.1 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.3 L 59.375 31.5 L 65.625 29.3 L 71.875 21.4 L 78.125 31.4 L 84.375 31.4 L 90.625 33.3 L 96.875 34.6 L 103.125 31.1 L 109.375 31.4 L 115.625 33.7 L 121.875 36.2 L 128.125 33.7 L 134.375 43.6 L 134.375 46 L 3.125 46" fill-opacity="0.1"></path></g></g><g class="highcharts-axis" zIndex="7"><path fill="none" d="M 9.5 46 L 9.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 16.5 46 L 16.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 22.5 46 L 22.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 28.5 46 L 28.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 34.5 46 L 34.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 41.5 46 L 41.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 47.5 46 L 47.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 53.5 46 L 53.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 59.5 46 L 59.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 66.5 46 L 66.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 72.5 46 L 72.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 78.5 46 L 78.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 84.5 46 L 84.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 91.5 46 L 91.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 97.5 46 L 97.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 103.5 46 L 103.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 109.5 46 L 109.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 116.5 46 L 116.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 122.5 46 L 122.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 128.5 46 L 128.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 134.5 46 L 134.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 141.5 46 L 141.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 147.5 46 L 147.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 3.5 46 L 3.5 51" stroke="#C0D0E0" stroke-width="1"></path></g><g class="highcharts-axis" zIndex="7"></g><path fill="none" d="M 0 46.5 L 150 46.5" stroke="#6a7791" stroke-width="1" zIndex="7" visibility="visible"></path><g class="highcharts-tracker" zIndex="9"><g zIndex="1" clip-path="url(http://summary/index?sId=7835836#highcharts-88)"><path fill="none" d="M -6.875 41.3 L 3.125 41.3 L 9.375 44.3 L 15.625 45.2 L 21.875 45.1 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.3 L 59.375 31.5 L 65.625 29.3 L 71.875 21.4 L 78.125 31.4 L 84.375 31.4 L 90.625 33.3 L 96.875 34.6 L 103.125 31.1 L 109.375 31.4 L 115.625 33.7 L 121.875 36.2 L 128.125 33.7 L 134.375 43.6 L 144.375 43.6" isTracker="true" stroke-linejoin="bevel" visibility="visible" stroke-opacity="0.000001" stroke="rgb(192,192,192)" stroke-width="22" style=""></path></g></g></svg></div></div>
                </li>
                <li>
                    <h3>英语</h3>
                    <script type="text/javascript" >updown_Bling(EnglishScore_Balance)</script>
                      <script type="text/javascript" >document.write(EnglishScore)</script>
                    </h4>
                    <div class="data" id="data_uv" onmouseover="c_exec(this)" style="display: block;">
                        <p>较上次：<span><script type="text/javascript" >updown(EnglishScore_Balance)</script><script type="text/javascript" >document.write(Math.abs(EnglishScore_Balance))</script>分</span></p>
                    </div>
                    <div class="map" id="map_uv" style="height: 46px; display: none;"><div class="highcharts-container" id="highcharts-89" style="position: relative; overflow: hidden; width: 150px; height: 46px; text-align: left; line-height: normal; font-family: 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif; font-size: 12px;"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="150" height="46"><defs><clipPath id="highcharts-90"><rect rx="0" ry="0" fill="none" x="0" y="0" width="150" height="47" stroke-width="0.000001"></rect></clipPath></defs><rect rx="5" ry="5" fill="#FFFFFF" x="0" y="0" width="150" height="46" stroke-width="0.000001"></rect><g class="highcharts-grid" zIndex="1"></g><g class="highcharts-grid" zIndex="1"><path fill="none" d="M 0 0.5 L 150 0.5" stroke="#eae9e9" stroke-width="1" zIndex="1"></path><path fill="none" d="M 0 46.5 L 150 46.5" stroke="#eae9e9" stroke-width="1" zIndex="1"></path></g><g class="highcharts-series-group" zIndex="3"><g class="highcharts-series" visibility="visible" clip-path="url(http://v2.tam/summary/index?sId=7835836#highcharts-90)"><path fill="none" d="M 3.125 41.9 L 9.375 44.3 L 15.625 45.2 L 21.875 45.2 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.7 L 59.375 29.8 L 65.625 23.3 L 71.875 10.4 L 78.125 29 L 84.375 29.3 L 90.625 30.1 L 96.875 31.9 L 103.125 23.6 L 109.375 27 L 115.625 30.5 L 121.875 35 L 128.125 32.2 L 134.375 43.2" stroke="#1bd0dc" stroke-width="2"></path><path fill="rgb(27,208,220)" d="M 3.125 41.9 L 9.375 44.3 L 15.625 45.2 L 21.875 45.2 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.7 L 59.375 29.8 L 65.625 23.3 L 71.875 10.4 L 78.125 29 L 84.375 29.3 L 90.625 30.1 L 96.875 31.9 L 103.125 23.6 L 109.375 27 L 115.625 30.5 L 121.875 35 L 128.125 32.2 L 134.375 43.2 L 134.375 46 L 3.125 46" fill-opacity="0.1"></path></g></g><g class="highcharts-axis" zIndex="7"><path fill="none" d="M 9.5 46 L 9.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 16.5 46 L 16.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 22.5 46 L 22.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 28.5 46 L 28.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 34.5 46 L 34.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 41.5 46 L 41.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 47.5 46 L 47.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 53.5 46 L 53.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 59.5 46 L 59.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 66.5 46 L 66.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 72.5 46 L 72.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 78.5 46 L 78.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 84.5 46 L 84.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 91.5 46 L 91.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 97.5 46 L 97.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 103.5 46 L 103.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 109.5 46 L 109.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 116.5 46 L 116.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 122.5 46 L 122.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 128.5 46 L 128.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 134.5 46 L 134.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 141.5 46 L 141.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 147.5 46 L 147.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 3.5 46 L 3.5 51" stroke="#C0D0E0" stroke-width="1"></path></g><g class="highcharts-axis" zIndex="7"></g><path fill="none" d="M 0 46.5 L 150 46.5" stroke="#6a7791" stroke-width="1" zIndex="7" visibility="visible"></path><g class="highcharts-tracker" zIndex="9"><g zIndex="1" clip-path="url(http://v2om/summary/index?sId=7835836#highcharts-90)"><path fill="none" d="M -6.875 41.9 L 3.125 41.9 L 9.375 44.3 L 15.625 45.2 L 21.875 45.2 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.7 L 59.375 29.8 L 65.625 23.3 L 71.875 10.4 L 78.125 29 L 84.375 29.3 L 90.625 30.1 L 96.875 31.9 L 103.125 23.6 L 109.375 27 L 115.625 30.5 L 121.875 35 L 128.125 32.2 L 134.375 43.2 L 144.375 43.2" isTracker="true" stroke-linejoin="bevel" visibility="visible" stroke-opacity="0.000001" stroke="rgb(192,192,192)" stroke-width="22" style=""></path></g></g></svg></div></div>
                </li>
                <li>
                    <h3>物理</h3>
                    <script type="text/javascript" >updown_Bling(PhysicScore_Balance)</script>
                      <script type="text/javascript" >document.write(PhysicScore)</script>
                    </h4>
                    <div class="data" id="data_uv" onmouseover="c_exec(this)" style="display: block;">
                        <p>较上次：<span><script type="text/javascript" >updown(PhysicScore_Balance)</script><script type="text/javascript" >document.write(Math.abs(PhysicScore_Balance))</script>分</span></p>
                    </div>
                    <div class="map" id="map_uv" style="height: 46px; display: none;"><div class="highcharts-container" id="highcharts-89" style="position: relative; overflow: hidden; width: 150px; height: 46px; text-align: left; line-height: normal; font-family: 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif; font-size: 12px;"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="150" height="46"><defs><clipPath id="highcharts-90"><rect rx="0" ry="0" fill="none" x="0" y="0" width="150" height="47" stroke-width="0.000001"></rect></clipPath></defs><rect rx="5" ry="5" fill="#FFFFFF" x="0" y="0" width="150" height="46" stroke-width="0.000001"></rect><g class="highcharts-grid" zIndex="1"></g><g class="highcharts-grid" zIndex="1"><path fill="none" d="M 0 0.5 L 150 0.5" stroke="#eae9e9" stroke-width="1" zIndex="1"></path><path fill="none" d="M 0 46.5 L 150 46.5" stroke="#eae9e9" stroke-width="1" zIndex="1"></path></g><g class="highcharts-series-group" zIndex="3"><g class="highcharts-series" visibility="visible" clip-path="url(http://com/summary/index?sId=7835836#highcharts-90)"><path fill="none" d="M 3.125 41.9 L 9.375 44.3 L 15.625 45.2 L 21.875 45.2 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.7 L 59.375 29.8 L 65.625 23.3 L 71.875 10.4 L 78.125 29 L 84.375 29.3 L 90.625 30.1 L 96.875 31.9 L 103.125 23.6 L 109.375 27 L 115.625 30.5 L 121.875 35 L 128.125 32.2 L 134.375 43.2" stroke="#1bd0dc" stroke-width="2"></path><path fill="rgb(27,208,220)" d="M 3.125 41.9 L 9.375 44.3 L 15.625 45.2 L 21.875 45.2 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.7 L 59.375 29.8 L 65.625 23.3 L 71.875 10.4 L 78.125 29 L 84.375 29.3 L 90.625 30.1 L 96.875 31.9 L 103.125 23.6 L 109.375 27 L 115.625 30.5 L 121.875 35 L 128.125 32.2 L 134.375 43.2 L 134.375 46 L 3.125 46" fill-opacity="0.1"></path></g></g><g class="highcharts-axis" zIndex="7"><path fill="none" d="M 9.5 46 L 9.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 16.5 46 L 16.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 22.5 46 L 22.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 28.5 46 L 28.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 34.5 46 L 34.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 41.5 46 L 41.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 47.5 46 L 47.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 53.5 46 L 53.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 59.5 46 L 59.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 66.5 46 L 66.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 72.5 46 L 72.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 78.5 46 L 78.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 84.5 46 L 84.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 91.5 46 L 91.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 97.5 46 L 97.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 103.5 46 L 103.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 109.5 46 L 109.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 116.5 46 L 116.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 122.5 46 L 122.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 128.5 46 L 128.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 134.5 46 L 134.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 141.5 46 L 141.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 147.5 46 L 147.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 3.5 46 L 3.5 51" stroke="#C0D0E0" stroke-width="1"></path></g><g class="highcharts-axis" zIndex="7"></g><path fill="none" d="M 0 46.5 L 150 46.5" stroke="#6a7791" stroke-width="1" zIndex="7" visibility="visible"></path><g class="highcharts-tracker" zIndex="9"><g zIndex="1" clip-path="url(http://vcom/summary/index?sId=7835836#highcharts-90)"><path fill="none" d="M -6.875 41.9 L 3.125 41.9 L 9.375 44.3 L 15.625 45.2 L 21.875 45.2 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.7 L 59.375 29.8 L 65.625 23.3 L 71.875 10.4 L 78.125 29 L 84.375 29.3 L 90.625 30.1 L 96.875 31.9 L 103.125 23.6 L 109.375 27 L 115.625 30.5 L 121.875 35 L 128.125 32.2 L 134.375 43.2 L 144.375 43.2" isTracker="true" stroke-linejoin="bevel" visibility="visible" stroke-opacity="0.000001" stroke="rgb(192,192,192)" stroke-width="22" style=""></path></g></g></svg></div></div>
                </li>
                 <li>
                    <h3>化学</h3>
                    <script type="text/javascript" >updown_Bling(ChemistryScore_Balance)</script>
                      <script type="text/javascript" >document.write(ChemistryScore)</script>
                    </h4>
                    <div class="data" id="data_uv" onmouseover="c_exec(this)" style="display: block;">
                        <p>较上次：<span><script type="text/javascript" >updown(ChemistryScore_Balance)</script><script type="text/javascript" >document.write(Math.abs(ChemistryScore_Balance))</script>分</span></p>
                    </div>
                    <div class="map" id="map_uv" style="height: 46px; display: none;"><div class="highcharts-container" id="highcharts-89" style="position: relative; overflow: hidden; width: 150px; height: 46px; text-align: left; line-height: normal; font-family: 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif; font-size: 12px;"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="150" height="46"><defs><clipPath id="highcharts-90"><rect rx="0" ry="0" fill="none" x="0" y="0" width="150" height="47" stroke-width="0.000001"></rect></clipPath></defs><rect rx="5" ry="5" fill="#FFFFFF" x="0" y="0" width="150" height="46" stroke-width="0.000001"></rect><g class="highcharts-grid" zIndex="1"></g><g class="highcharts-grid" zIndex="1"><path fill="none" d="M 0 0.5 L 150 0.5" stroke="#eae9e9" stroke-width="1" zIndex="1"></path><path fill="none" d="M 0 46.5 L 150 46.5" stroke="#eae9e9" stroke-width="1" zIndex="1"></path></g><g class="highcharts-series-group" zIndex="3"><g class="highcharts-series" visibility="visible" clip-path="url(http://vcom/summary/index?sId=7835836#highcharts-90)"><path fill="none" d="M 3.125 41.9 L 9.375 44.3 L 15.625 45.2 L 21.875 45.2 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.7 L 59.375 29.8 L 65.625 23.3 L 71.875 10.4 L 78.125 29 L 84.375 29.3 L 90.625 30.1 L 96.875 31.9 L 103.125 23.6 L 109.375 27 L 115.625 30.5 L 121.875 35 L 128.125 32.2 L 134.375 43.2" stroke="#1bd0dc" stroke-width="2"></path><path fill="rgb(27,208,220)" d="M 3.125 41.9 L 9.375 44.3 L 15.625 45.2 L 21.875 45.2 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.7 L 59.375 29.8 L 65.625 23.3 L 71.875 10.4 L 78.125 29 L 84.375 29.3 L 90.625 30.1 L 96.875 31.9 L 103.125 23.6 L 109.375 27 L 115.625 30.5 L 121.875 35 L 128.125 32.2 L 134.375 43.2 L 134.375 46 L 3.125 46" fill-opacity="0.1"></path></g></g><g class="highcharts-axis" zIndex="7"><path fill="none" d="M 9.5 46 L 9.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 16.5 46 L 16.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 22.5 46 L 22.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 28.5 46 L 28.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 34.5 46 L 34.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 41.5 46 L 41.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 47.5 46 L 47.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 53.5 46 L 53.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 59.5 46 L 59.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 66.5 46 L 66.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 72.5 46 L 72.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 78.5 46 L 78.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 84.5 46 L 84.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 91.5 46 L 91.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 97.5 46 L 97.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 103.5 46 L 103.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 109.5 46 L 109.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 116.5 46 L 116.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 122.5 46 L 122.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 128.5 46 L 128.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 134.5 46 L 134.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 141.5 46 L 141.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 147.5 46 L 147.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 3.5 46 L 3.5 51" stroke="#C0D0E0" stroke-width="1"></path></g><g class="highcharts-axis" zIndex="7"></g><path fill="none" d="M 0 46.5 L 150 46.5" stroke="#6a7791" stroke-width="1" zIndex="7" visibility="visible"></path><g class="highcharts-tracker" zIndex="9"><g zIndex="1" clip-path="url(http://.com/summary/index?sId=7835836#highcharts-90)"><path fill="none" d="M -6.875 41.9 L 3.125 41.9 L 9.375 44.3 L 15.625 45.2 L 21.875 45.2 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.7 L 59.375 29.8 L 65.625 23.3 L 71.875 10.4 L 78.125 29 L 84.375 29.3 L 90.625 30.1 L 96.875 31.9 L 103.125 23.6 L 109.375 27 L 115.625 30.5 L 121.875 35 L 128.125 32.2 L 134.375 43.2 L 144.375 43.2" isTracker="true" stroke-linejoin="bevel" visibility="visible" stroke-opacity="0.000001" stroke="rgb(192,192,192)" stroke-width="22" style=""></path></g></g></svg></div></div>
                </li>
                 <li>
                    <h3>生物</h3>
                    <script type="text/javascript" >updown_Bling(BiologyScore_Balance)</script>
                      <script type="text/javascript" >document.write(BiologyScore)</script>
                    </h4>
                    <div class="data" id="data_uv" onmouseover="c_exec(this)" style="display: block;">
                        <p>较上次：<span><script type="text/javascript" >updown(BiologyScore_Balance)</script><script type="text/javascript" >document.write(Math.abs(BiologyScore_Balance))</script>分</span></p>
                    </div>
                    <div class="map" id="map_uv" style="height: 46px; display: none;"><div class="highcharts-container" id="highcharts-89" style="position: relative; overflow: hidden; width: 150px; height: 46px; text-align: left; line-height: normal; font-family: 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif; font-size: 12px;"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="150" height="46"><defs><clipPath id="highcharts-90"><rect rx="0" ry="0" fill="none" x="0" y="0" width="150" height="47" stroke-width="0.000001"></rect></clipPath></defs><rect rx="5" ry="5" fill="#FFFFFF" x="0" y="0" width="150" height="46" stroke-width="0.000001"></rect><g class="highcharts-grid" zIndex="1"></g><g class="highcharts-grid" zIndex="1"><path fill="none" d="M 0 0.5 L 150 0.5" stroke="#eae9e9" stroke-width="1" zIndex="1"></path><path fill="none" d="M 0 46.5 L 150 46.5" stroke="#eae9e9" stroke-width="1" zIndex="1"></path></g><g class="highcharts-series-group" zIndex="3"><g class="highcharts-series" visibility="visible" clip-path="url(http://v/summary/index?sId=7835836#highcharts-90)"><path fill="none" d="M 3.125 41.9 L 9.375 44.3 L 15.625 45.2 L 21.875 45.2 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.7 L 59.375 29.8 L 65.625 23.3 L 71.875 10.4 L 78.125 29 L 84.375 29.3 L 90.625 30.1 L 96.875 31.9 L 103.125 23.6 L 109.375 27 L 115.625 30.5 L 121.875 35 L 128.125 32.2 L 134.375 43.2" stroke="#1bd0dc" stroke-width="2"></path><path fill="rgb(27,208,220)" d="M 3.125 41.9 L 9.375 44.3 L 15.625 45.2 L 21.875 45.2 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.7 L 59.375 29.8 L 65.625 23.3 L 71.875 10.4 L 78.125 29 L 84.375 29.3 L 90.625 30.1 L 96.875 31.9 L 103.125 23.6 L 109.375 27 L 115.625 30.5 L 121.875 35 L 128.125 32.2 L 134.375 43.2 L 134.375 46 L 3.125 46" fill-opacity="0.1"></path></g></g><g class="highcharts-axis" zIndex="7"><path fill="none" d="M 9.5 46 L 9.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 16.5 46 L 16.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 22.5 46 L 22.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 28.5 46 L 28.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 34.5 46 L 34.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 41.5 46 L 41.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 47.5 46 L 47.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 53.5 46 L 53.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 59.5 46 L 59.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 66.5 46 L 66.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 72.5 46 L 72.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 78.5 46 L 78.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 84.5 46 L 84.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 91.5 46 L 91.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 97.5 46 L 97.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 103.5 46 L 103.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 109.5 46 L 109.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 116.5 46 L 116.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 122.5 46 L 122.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 128.5 46 L 128.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 134.5 46 L 134.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 141.5 46 L 141.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 147.5 46 L 147.5 51" stroke="#C0D0E0" stroke-width="1"></path><path fill="none" d="M 3.5 46 L 3.5 51" stroke="#C0D0E0" stroke-width="1"></path></g><g class="highcharts-axis" zIndex="7"></g><path fill="none" d="M 0 46.5 L 150 46.5" stroke="#6a7791" stroke-width="1" zIndex="7" visibility="visible"></path><g class="highcharts-tracker" zIndex="9"><g zIndex="1" clip-path="url(http:/q.com/summary/index?sId=7835836#highcharts-90)"><path fill="none" d="M -6.875 41.9 L 3.125 41.9 L 9.375 44.3 L 15.625 45.2 L 21.875 45.2 L 28.125 45.3 L 34.375 45.4 L 40.625 43.9 L 46.875 43.2 L 53.125 35.7 L 59.375 29.8 L 65.625 23.3 L 71.875 10.4 L 78.125 29 L 84.375 29.3 L 90.625 30.1 L 96.875 31.9 L 103.125 23.6 L 109.375 27 L 115.625 30.5 L 121.875 35 L 128.125 32.2 L 134.375 43.2 L 144.375 43.2" isTracker="true" stroke-linejoin="bevel" visibility="visible" stroke-opacity="0.000001" stroke="rgb(192,192,192)" stroke-width="22" style=""></path></g></g></svg></div></div>
                </li>
            </ul>
        </div>
        <div class="animation">
            <div id="div_rocket" class="animation_float animation_down">
            </div>
            <div id="div_domain_order" class="animation_cont"> <script type="text/javascript" >updown_Big(Total_L_Rank_Balance)</script><strong><script type="text/javascript" >document.write(Math.abs(Total_L_Rank_Balance))</script></strong><em>位</em></h4><p>二中内部排名位于前30%</p></div>
        </div>
    </div>                   
    </br>   



<!--这里输出图形-->
  <div class="summary-bar cf" style="position:absolute; left:5%;">><!--外部圆角框架-->
    <canvas id="canvas" ></canvas><!--这里只是声明图形  就像变量一样 先声明 再使用 图形的绘制由下方的script标签进行-->
  </div>
  <div class="summary-doughnut " style="position:absolute; left:55%; ">
    <canvas id="chart-area" /></canvas>
</div>
<hr style="FILTER: alpha(opacity=0,finishopacity=100,style=1)" width="80%" color=#0090FF SIZE=3/>
  <div class="summary-bar cf" style="position:absolute; left:5%; bottom:-35%;">
    <canvas id="canvas2" ></canvas>
  </div>
  <div class="summary-doughnut " style="position:absolute; left:55%; bottom:-35%;">
    <canvas id="canvas3" ></canvas>
  </div>

<!--这里是页脚

  <p>
    Copyright © 1998 - 2014 wei-zhi. All Rights Reserved.
  </p>
  <p>
    wei-zhi <a href="http:/" target="_blank">版权所有</a>
  </p>
-->

<!--这里开始处理图形  所有图形变量都是下方处理-->
<script>






  //bar 条状统计图-处理数据----------------------------------我从这里开始
 var randomScalingFactor = function(){ return Math.round(Math.random()*100)};

  var barChartData = {
    labels : ["语文","数学","英语","物理","化学","生物"],
    datasets : [
      {
        fillColor : "rgba(220,220,220,0.5)",
        strokeColor : "rgba(220,220,220,0.8)",
        highlightFill: "rgba(220,220,220,0.75)",
        highlightStroke: "rgba(220,220,220,1)",
        data : [ChineseScore,MathScore,EnglishScore,PhysicScore,ChemistryScore,BiologyScore]
      },
      {
        fillColor : "rgba(151,187,205,0.5)",
        strokeColor : "rgba(151,187,205,0.8)",
        highlightFill : "rgba(151,187,205,0.75)",
        highlightStroke : "rgba(151,187,205,1)",
        data : [ChineseScore_a,MathScore_a,EnglishScore_a,PhysicScore_a,ChemistryScore_a,BiologyScore_a]
      }
    ]

  }
//这里调用函数绘图并输出到id=canvas的canvas内!!!!!注意 此处绘图函数并不执行  具体执行在最后面的window.onload
   function f1(){
    var ctx1 = document.getElementById("canvas").getContext("2d");
    window.myBar = new Chart(ctx1).Bar(barChartData, {
      responsive : true
    });
  }

  //doughnut圆圈统计图-----------------------------我从这里开始哦

    var doughnutData = [
        {
          value: 300,
          color:"#F7464A",
          highlight: "#FF5A5E",
          label: "Red"
        },
        {
          value: 50,
          color: "#46BFBD",
          highlight: "#5AD3D1",
          label: "Green"
        },
        {
          value: 100,
          color: "#FDB45C",
          highlight: "#FFC870",
          label: "Yellow"
        },
        {
          value: 40,
          color: "#949FB1",
          highlight: "#A8B3C5",
          label: "Grey"
        },
        {
          value: 120,
          color: "#4D5360",
          highlight: "#616774",
          label: "Dark Grey"
        }

      ];
//这里调用函数绘图并输出到id=canvas的chart-area内
       function f2(){
        var ctx2 = document.getElementById("chart-area").getContext("2d");
        window.myDoughnut = new Chart(ctx2).Doughnut(doughnutData, {responsive : true});
      };

//rader---------------------------------擦，我竟然也从这里开始？
var radarChartData = {
    labels: ["语文", "数学", "英语", "物理", "化学", "生物", ],
    datasets: [
      {
        label: "My First dataset",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [ChineseScore,MathScore,EnglishScore,PhysicScore,ChemistryScore,BiologyScore]
      },
      {
        label: "My Second dataset",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: [ChineseScore_a,MathScore_a,EnglishScore_a,PhysicScore_a,ChemistryScore_a,BiologyScore_a]
      }
    ]
  };
//这里调用函数绘图并输出到id=canvas的canvas2内
 function f3(){
    window.myRadar = new Chart(document.getElementById("canvas2").getContext("2d")).Radar(radarChartData, {
      responsive: true
    });
  }
//line--------------------------------人家才不要从这里开始呢！
var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
    var lineChartData = {
      labels : ["January","February","March","April","May","June","July"],
      datasets : [
        {
          label: "My First dataset",
          fillColor : "rgba(220,220,220,0.2)",
          strokeColor : "rgba(220,220,220,1)",
          pointColor : "rgba(220,220,220,1)",
          pointStrokeColor : "#fff",
          pointHighlightFill : "#fff",
          pointHighlightStroke : "rgba(220,220,220,1)",
          data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
        },
        {
          label: "My Second dataset",
          fillColor : "rgba(151,187,205,0.2)",
          strokeColor : "rgba(151,187,205,1)",
          pointColor : "rgba(151,187,205,1)",
          pointStrokeColor : "#fff",
          pointHighlightFill : "#fff",
          pointHighlightStroke : "rgba(151,187,205,1)",
          data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
        }
      ]

    }
//这里调用函数绘图并输出到id=canvas的canvas3内
 function f4(){
    var ctx = document.getElementById("canvas3").getContext("2d");
    window.myLine = new Chart(ctx).Line(lineChartData, {
      responsive: true
    });
  }
//从这里开始才真正的执行绘图函数 windows.onload（当页面加载时开始处理script的图形函数）
//一个网页内只可以有一个window.onload 多个会导致变量冲突 
//所以4个图形只能统一在下方处理

window.onload = function (){
  f1();
  f2();
  f3();
  f4();
}

  </script>
</body>
</html>