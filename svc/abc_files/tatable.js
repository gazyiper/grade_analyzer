
(function($){$.fn.tableSorterPager=function(options){return this.each(function(){var defaults={size:20,sizeselection:null,offset:0,delta:2,page:0,totalRows:0,totalPages:0,container:null,formerTrs:[],isCompare:0,isCompareRealTime:0,trs:[],orders:[],sortArr:[],showPageSize:true,cssNext:'next',cssPrev:'prev',cssFirst:'first',cssLast:'last',cssPageDisplay:'current',cssPageSize:'show',cssPageSelect:'ipt_show',cssPageLink:'pg',cssTable:'tablesorter',cssHeader:'hover',cssHeaderSortUp:'i_orderu',cssHeaderSortDown:'i_orderd',cssHeaderSortNone:'i_caret_no',cssDot:'dot',sortColumnClass:'order'};var opts=$.extend({},defaults,options);var __target=$(this);__target.toggleClass(opts.cssTable);function multi(){var start=Math.max(opts.page-Math.floor(opts.offset/2),1);var end=Math.min(start+opts.offset,opts.totalPages);var as=[];var ps=createPageSize(5);$('#'+opts.container).empty().append(ps);if(opts.totalPages<=1){return false;}
if(opts.page>1){var p=createHref(opts.page-1,'上一页');$(p).css('class',opts.cssPrev);as.push(p);as.push(createHref(1));}else{opts.page=1;as.push(createCurrentPage());}
var left=Math.max(opts.page-2,0);var right;var leftMore=0;if(left>opts.delta){left=opts.delta;leftMore=opts.page-2-left;}
right=Math.max(opts.totalPages-opts.page-1,0);if(right<opts.delta){for(var i=opts.delta-right;leftMore>0&&i>0;leftMore--,i--){left++;}}
right=Math.min(right,2*opts.delta-left)
if(opts.page-left>2){as.push(createDot());}
if(left>0){for(var i=opts.page-left;i<=opts.page-1;i++){as.push(createHref(i));}}
if(opts.page>1&&opts.page<opts.totalPages){as.push(createCurrentPage());}
if(right>0){for(var i=opts.page+1;i<=opts.page+right;i++){as.push(createHref(i));}}
if(opts.page+right<opts.totalPages-1){as.push(createDot());}
if(opts.page<opts.totalPages){as.push(createHref(opts.totalPages));var n=createHref(opts.page+1,'下一页');$(n).css('class',opts.cssNext);as.push(n);}else{opts.page=opts.totalPages;as.push(createCurrentPage());}
if(!$('#'+opts.container).get(0)){__target.after('<div id="'+opts.container+'"></div>');}
var pl=document.createElement('div');$(pl).addClass(opts.cssPageLink).append(as);$('#'+opts.container).append(pl).show();};function createHref(page,html){var a=document.createElement('a');html='undefined'==typeof(html)?page:html;$(a).attr('href','javascript:;');$(a).html(html);$(a).bind('click',function(){showPage(page);});return a;};function createCurrentPage(){var strong=document.createElement('strong');$(strong).addClass(opts.cssPageDisplay);$(strong).html(opts.page);return strong;}
function createDot(){var strong=document.createElement('strong');$(strong).addClass(opts.cssDot);$(strong).html("...");return strong;}
function createPageSize(sizeNum){if(!opts.showPageSize){return'';}
var realSize=1;if(1==opts.isCompare&&0==opts.isCompareRealTime){realSize=2;}else if(0<opts.isCompareRealTime){realSize=3;}
var recordCount=opts.totalRows/realSize;var divSize=document.createElement('div');var sp=document.createElement('span');var list=document.createElement('select');$(list).addClass(opts.cssPageSelect);$(sp).html('共'+recordCount+'项,每页显示');for(var i=1;i<=sizeNum;i++){var size=i*10;$(list).append('<option value="'+size*realSize+'">'+size+'</option>');}
$(list).val(opts.size);$(list).bind('change',function(){showPageData(parseInt($(this).val()));});$(divSize).addClass(opts.cssPageSize).append(sp).append(list);return divSize;};function showPage(page){opts.page=page;multi();showData();};function showPageData(size){var oldSize=opts.size;opts.size=size;opts.totalPages=Math.ceil(opts.totalRows/opts.size);opts.page=Math.min(opts.page,opts.totalPages);multi();showData();}
function quickSort(arr,ascDesc){if(arr.length<=1){return arr;}
var pivotIndex=Math.floor(arr.length/2);var pivot=arr.splice(pivotIndex,1)[0];var left=[];var right=[];for(var i=0;i<arr.length;i++){if('asc'==ascDesc){if(arr[i][1]<pivot[1]){left.push(arr[i]);}else{right.push(arr[i]);}}else{if(arr[i][1]<pivot[1]){right.push(arr[i]);}else{left.push(arr[i]);}}}
return quickSort(left,ascDesc).concat([pivot],quickSort(right,ascDesc));};function clearHeaderCss(){$(opts.orders).each(function(){$(this).removeClass(opts.cssHeaderSortUp);$(this).removeClass(opts.cssHeaderSortDown);$(this).addClass(opts.cssHeaderSortNone);$(this).removeAttr('ascdesc');});};function sortClick(event){var ascDesc=$(this).find('i').attr('ascdesc');clearHeaderCss();if('undefined'==typeof(ascDesc)||'asc'==ascDesc){ascDesc='desc';$(this).find('i').removeClass(opts.cssHeaderSortNone).addClass(opts.cssHeaderSortDown);}else{ascDesc='asc';$(this).find('i').removeClass(opts.cssHeaderSortNone).addClass(opts.cssHeaderSortUp);}
$(this).find('i').attr('ascdesc',ascDesc);var trsLen=opts.formerTrs.length;if(0==trsLen){return true;}
var sortArr=[];useIdx=false;if('undefined'==typeof(opts.sortArr[event.data.index])){useIdx=$(this).attr('useidx');for(var i=0;i<trsLen;i++){if(0<opts.isCompareRealTime&&event.data.index>1){i++;}
if(useIdx){v=i;}else{if(0<opts.isCompareRealTime&&event.data.index>1){var objThTd=$(opts.formerTrs[i]).find('td, th').get(event.data.index-1);}else{var objThTd=$(opts.formerTrs[i]).find('td, th').get(event.data.index);}
var numRe=/^[+\-]?\d+(.\d+)?/ig;var v=$(objThTd).text();if(v.match(/^\-/i)){var re=/[\:\%\s\,\n\r]/ig;}else{var re=/[\-\:\%\s\,\n\r]/ig;}
v=v.replace(re,'');if(v.match(numRe)){v=parseFloat(v);}
if(''==v){v=0;}else if('-'==v){v=-99999;}}
sortArr.push([i,v]);if(0<opts.isCompare){i++;}
if(0<opts.isCompareRealTime&&event.data.index==1){i++;}}
quickSort(sortArr,0,sortArr.length-1);opts.sortArr[event.data.index]=sortArr;}else{sortArr=opts.sortArr[event.data.index];}
opts.trs=[];var iTmp=0;for(var i=0;i<sortArr.length;i++){iTmp=sortArr[i][0];if('desc'==ascDesc){if(0<opts.isCompareRealTime&&event.data.index==1){opts.trs.unshift(opts.formerTrs[iTmp+2]);}
if(0<opts.isCompare){opts.trs.unshift(opts.formerTrs[iTmp+1]);}
opts.trs.unshift(opts.formerTrs[iTmp]);if(0<opts.isCompareRealTime&&event.data.index>1){opts.trs.unshift(opts.formerTrs[iTmp-1]);}}else{if(0<opts.isCompareRealTime&&event.data.index>1){opts.trs.push(opts.formerTrs[iTmp-1]);}
opts.trs.push(opts.formerTrs[iTmp]);if(0<opts.isCompare){opts.trs.push(opts.formerTrs[iTmp+1]);}
if(0<opts.isCompareRealTime&&event.data.index==1){opts.trs.push(opts.formerTrs[iTmp+2]);}}}
showData();try{if(typeof(eval(opts.callBack))=='function'){opts.callBack();}}catch(e){}};function showData(){var start=(opts.page-1)*opts.size;var end=start+opts.size;end=end>opts.trs.length?opts.trs.length:end;__target.find('tr').each(function(){if($(this).parent().is('thead, tfoot')){return true;}
$(this).remove();});for(var i=start;i<end;i++){var td_th=$(opts.trs[i]).find('td, th');var orderNum=i;if(1==opts.isCompare&&0==opts.isCompareRealTime){orderNum=orderNum/2;}else if(0<opts.isCompareRealTime){orderNum=orderNum/3;}
if(0==opts.isCompare||(0==opts.isCompareRealTime&&0==i%2)||(1==opts.isCompareRealTime&&0==i%3)){if(td_th.get(1)){td_th.get(0).innerHTML=orderNum+1;}}
__target.append(opts.trs[i]);}};function initEvent(){var theadTr=__target.find('thead').find('tr');var trCount=0;__target.find('tr').each(function(){if($(this).parent().is('thead, tfoot')){return true;}
opts.formerTrs.push($(this).get(0));trCount++;});opts.trs=opts.formerTrs;opts.totalRows=trCount;opts.totalPages=Math.ceil(trCount/opts.size);if(1>opts.offset){opts.offset=9;}
if(1>opts.page){opts.page=1;}
showPage(opts.page);var isFirst=true;theadTr.children().filter(function(index){if($(this).hasClass(opts.sortColumnClass)){if(opts.invalidTrCount){index-=opts.invalidTrCount;}
$(this).mouseover(function(){$(this).addClass(opts.cssHeader);}).mouseout(function(){$(this).removeClass(opts.cssHeader);});$(this).append('<i></i>');var orderObj=$(this).find('i');$(orderObj).attr('useidx',$(this).attr('useidx'));if((opts.startColumn&&index==opts.startColumn)||(!opts.startColumn&&isFirst)){isFirst=false;if(opts.ascdesc=='asc'){orderObj.removeClass(opts.cssHeaderSortNone).addClass(opts.cssHeaderSortUp).attr('ascdesc','asc');}else{orderObj.removeClass(opts.cssHeaderSortNone).addClass(opts.cssHeaderSortDown).attr('ascdesc','desc');}}
$(this).bind('click',{index:index},sortClick);opts.orders.push(orderObj.get(0));}});};function quickSort(a,s,e){if(s<e){var pos=partition(a,s,e);quickSort(a,s,pos-1);quickSort(a,pos+1,e);}}
function partition(a,st,en){var s=st;var e=en+1;var temp=a[s];while(1){while('undefined'!=typeof(a[++s])&&a[s][1]<temp[1]);while(a[--e][1]>temp[1]);if(s>e)break;var tem=a[s];a[s]=a[e];a[e]=tem;}
a[st]=a[e];a[e]=temp;return e;}
opts.formerTrs.length=0;opts.trs.length=0;opts.orders.length=0;opts.sortArr.length=0;$('#'+opts.container).empty();initEvent();});};})(jQuery);var STATS_FORM='statsForm';var STATS_TABLE_FORM='statsTableForm';var AJAX_LOADING=[];var AJAX_MD5=[];var ITEM_TIPS=[];var ITEM_IDS=[];var ITEM_TIPS_MESSAGE=[];var TIPS_TIMEOUT={};var TIPS_SHOW_TIMEOUT={};var INIT_CSS=false;function initItemTips(className){if('undefined'==typeof(className)){className='itemTips';}
$('td, th').each(function(){if($(this).hasClass(className)){var item=$(this).attr('item');if('undefined'==typeof(ITEM_TIPS_MESSAGE[item])){return true;}
var aObj=document.createElement('A');aObj.innerHTML='<img class="vm" src="'+STATIC_DOMAIN+'/stats/images/btn_help.png">';$(aObj).bind('mouseover',function(event){showItemTips(ITEM_TIPS_MESSAGE[item],this,{id:item+'_item_tips_div'});event.stopPropagation();return true;});$(this).append(aObj);}});}
function showItemTips(tipsContent,offsetElement,extra){if(!INIT_CSS){INIT_CSS=true;$('head').append('<link rel="stylesheet" type="text/css" media="all" href="http://discuz.gtimg.cn/cloud/styles/common.dialog.css?v=2" />');}
tipsId=(extra&&typeof(extra['id'])!='undefined')?extra['id']:'f_win_tips';tipsTop=(extra&&typeof(extra['top'])!='undefined')?extra['top']:-20;tipsLeft=(extra&&typeof(extra['left'])!='undefined')?extra['left']:-67;autoClose=(extra&&typeof(extra['autoClose'])!='undefined')?extra['autoClose']:true;if(TIPS_TIMEOUT[tipsId]){clearTimeout(TIPS_TIMEOUT[tipsId]);}
pos=$(offsetElement).position();tipsQ='<div id="'+tipsId+'" class="prmm up" style="display:block; position: absolute; z-index: 100000; " initialized="true"> ';tipsQ+='<div class="prmc">';tipsQ+='<ul><li>'+tipsContent+'</li>';if(!autoClose){tipsQ+='<li style="text-align: right; padding-bottom: 5px;"><a onclick="$(\'#'+tipsId+'\').fadeOut();" style="color: #336699; cursor: pointer;">我知道了</a></li>';}
tipsQ+='</ul></div></div>';if(!$('#'+tipsId)[0]){$(tipsQ).appendTo('body');}
tipsStyle={'top':(pos.top-$('#'+tipsId).height()+tipsTop)+'px','left':(pos.left+tipsLeft)+'px','display':'none'};$('#'+tipsId).css(tipsStyle);$('#'+tipsId).mouseover(function(){clearTimeout(TIPS_TIMEOUT[tipsId]);});$('#'+tipsId).mouseout(function(){clearTimeout(TIPS_TIMEOUT[tipsId]);TIPS_TIMEOUT[tipsId]=setTimeout(function(){$('#'+tipsId).fadeOut();},200);});$(offsetElement).mouseout(function(){if(TIPS_SHOW_TIMEOUT[tipsId]){clearTimeout(TIPS_SHOW_TIMEOUT[tipsId]);}
if(TIPS_TIMEOUT[tipsId]){clearTimeout(TIPS_TIMEOUT[tipsId]);}
TIPS_TIMEOUT[tipsId]=setTimeout(function(){$('#'+tipsId).fadeOut();},200);});$("div.prmm.up").fadeOut();TIPS_SHOW_TIMEOUT[tipsId]=setTimeout(function(){$('#'+tipsId).fadeIn();},600);}
function pageHrefAjax(pageWrapId){if('undefined'==typeof(pageWrapId)){pageWrapId='pageAjax';}
$('#'+pageWrapId).find('a').bind('click',function(){Ta.module.report.set({'ajaxObj.url':$(this).attr('href')+'&ajax=1','ajaxObj.data':''});return false;});}
function orderAjax(url,order,ascDesc,className,wrapId){if('undefined'==typeof(wrapId)){wrapId='dataTheadTr';}
$('#'+wrapId).find('td, th').each(function(){if($(this).hasClass(className)){$(this).mouseover(function(){$(this).addClass('hover');}).mouseout(function(){$(this).removeClass('hover');});$(this).append('<i></i>');var orderObj=$(this).find('i');$(orderObj).attr('useidx',$(this).attr('useidx'));if(order==$(this).attr('order')){$(orderObj).addClass('desc'==ascDesc?'i_orderd':'i_orderu');}
$(this).bind('click',function(){var currentOrder=$(this).attr('order');var ajaxUrl=url+'&order='+currentOrder;if(order==currentOrder){ajaxUrl+='&ascDesc='+('desc'==ascDesc?'asc':'desc');}
if($('#order').get(0)){$('#order').val(currentOrder);}
Ta.module.report.set({'ajaxObj.url':ajaxUrl+'&ajax=1','ajaxObj.data':''});return false;});}});}
function sendHotClick(obj){Ta.util.sendHotClick(obj);}/*  |xGv00|3682a2aa3fb0607356c0eef9c6ac322e */