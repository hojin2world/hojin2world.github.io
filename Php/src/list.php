<?php 
require 'service/BoardService.php';
require 'service/Pagenation.php';
require $_SERVER['DOCUMENT_ROOT']."/files/config/db.config.php";

/* GET PARAM */
$page_index = isset ($_GET['page']) ? trim($_GET['page']) : 1;
$category = isset ($_GET['category']) ? trim($_GET['category']) : '';

/* SERVICE LOGIC*/
$boardService = new BoardService($db_info);
$pagenation = new Pagenation(10, 5);	

/*MODELS*/
$result_categories = $boardService->getCategories();
$result_board_list = $boardService->getBoardList($page_index, $category, $pagenation);

?>
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="/a/bootstrap/css/bootstrap.css" rel="stylesheet">

  </head>
  <body>
	<div class="page-header">
	    <h1>문의 접수 (신규 게시판)</h1>
	    <div class="dropdown">
	    <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
        [고객 설문조사]
        <span class="caret"> </span>
    	</button>
		<ul class="nav nav-tabs dropdown-menu" role="menu">
			<?php 
			/* Sub-menu */
			$default_active_str = ($category=='' ) ? "class='active'" : '';
			echo "<li role='presentation' $default_active_str><a href='/?mid=contact_biz_list'>전체</a></li>";	
			echo "<br/>";
			echo "<br/>";	
			while ($row = mysql_fetch_assoc($result_categories)) {
				$active_str = ($category == $row['category']) ? "class='active'"  : '';
				echo "<br/><li role='presentation' $active_str><a href='/?mid=contact_biz_list&category=$row[category]'>$row[category]</a></li>";
				echo "<br/>";		
			}
			?>
      	</ul>
      </div>
	</div>
	<div class="page-content">
		<ul class="pagination">
		<?php
		/* Paging */
		if(!$pagenation->is_first_group) echo "<li><a href='/?mid=contact_biz_list&category=".$row['category']."&page=".$pagenation->getPrev_end_page()."'>이전페이지</a></li>";
		for ($i = $pagenation->getStart_page(); $i <= $pagenation->getEnd_page(); $i++) 
		{ 
		  $paging_active_str =  ($page_index == $i) ? "class='active'" :'';
		  echo "<li $paging_active_str><a href='/?mid=contact_biz_list&category=$category&page=$i'>$i</a></li>";
		} 
		if(!$pagenation->is_last_group) echo "<li><a href='/?mid=contact_biz_list&category=".$row['category']."&page=".$pagenation->getNext_start_page()."'>다음페이지</a></li>";
		?>
		</ul>
		<table class="table">
		  	<thead>
	          <tr>
	            <th>회사명</th>
	            <th>담당자</th>
	            <th>제목</th>
	            <th>연락처</th>
	            <th>이메일</th>
	            <th>카테고리</th>
	            <th>등록시각</th>
	          </tr>
	        </thead>
			<tbody>
			<?php
			while ($row = mysql_fetch_assoc($result_board_list)) {
				/* cut title string */
				$title = mb_strlen($row['title'], "UTF-8") > 10 ? mb_substr($row['title'], 0, 10, 'UTF-8').'...' : $row['title'];
			?>
			<tr>
				<td><?=$row['company']?></td>
				<td><?=$row['manager']?></td>
				<td><a href='/?mid=contact_biz_view&uid=<?=$row['uid']?>&category=<?=$category?>&page=<?=$page_index?>'><?=$title?></a></td>
				<td><?=$row['phone']?></td>
				<td><?=$row['email']?></td>
				<td><?=$row['category']?></td>
				<td><?=$row['reg_date']?></td>
			</tr>
			<?php
			}
			?>
			</tbody>
		</table>
     </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="/a/bootstrap/js/bootstrap.min.js"></script>
  </body>
</html>
