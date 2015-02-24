<?php
//本脚本作用  输出所请求的id的某一科成绩
//使用方法： 在本php后加 ?id=所请求的考生号&subject=所请求科目
header("Content-Type:text/html;charset=utf-8"); 
$id=$_COOKIE["user"];
$subject=$_GET['subject'];
$con = mysql_connect("localhost", "root", "123631");//连接数据库
if (!$con){
   die('连接失败: ' . mysql_error());
}
mysql_query("SET NAMES UTF8");
mysql_query("set character_set_client=utf8"); 
mysql_query("set character_set_results=utf8");
$db_selected = mysql_select_db("demosql",$con);//选中数据库
$sqlb = "SELECT * FROM `testt` WHERE `test` LIKE '考号'";//取出表格
$sqla = "SELECT * FROM `testt` WHERE `test` LIKE '$id'";//取出考生成绩
$resulta = mysql_query($sqla,$con);
$resultb = mysql_query($sqlb,$con);
$b = 3;

//echo "document.write('$subject');";
while($rowb = mysql_fetch_array($resultb)){
	//echo "document.write('$rowb[$b]');";
	
	 while ($rowb[$b] !== $subject) {
			$b++;
		}
	}
while($rowa = mysql_fetch_array($resulta)){

echo "document.write('$rowa[$b]')";
}
mysql_close($con);
?>