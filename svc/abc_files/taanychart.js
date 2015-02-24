// 图表 Flash 对象
var OBJECT_FLASH_CHARTS = [];

/**
 * 画图函数
 * @param data 图表 Json 数据
 * @param fcId 图表所在位置ID
 * @param options 参数选项
 */
function paintFlashChart(data, fcId, options) {
    var defaults = {
        swfUrl : '/misc/anychart/AnyChart.swf', // flash 地址
        width : '100%', // flash 宽度
        height : 200, // flash 高度
        type : 'data', // flash 数据来源类型
        wmode : 'opaque' // flash 的 wmode 属性
    };
    this.__pfc_cfg = $.extend({}, defaults, options);
    // 如果对象已经存在
    if(OBJECT_FLASH_CHARTS[fcId]) {
//        setFlashChartData(OBJECT_FLASH_CHARTS[fcId], data, this.__pfc_cfg.type);
//        return true;
    }
    // 创建图表对象
    OBJECT_FLASH_CHARTS[fcId] = new AnyChart(this.__pfc_cfg.swfUrl);
    OBJECT_FLASH_CHARTS[fcId].width = this.__pfc_cfg.width;
    OBJECT_FLASH_CHARTS[fcId].height = this.__pfc_cfg.height;
    OBJECT_FLASH_CHARTS[fcId].wMode = this.__pfc_cfg.wmode;
    setFlashChartData(OBJECT_FLASH_CHARTS[fcId], data, this.__pfc_cfg.type);
	OBJECT_FLASH_CHARTS[fcId].write(fcId);
}

/**
 * 更新 Flash 图表数据
 * @param objFlash object 图表 Flash 对象
 * @param data string 图表 XML 数据字串或地址
 * @param type string 数据类型(data:XML 字串; file:XML 地址)
 */
function setFlashChartData(objFlash, data, type) {
    if('undefined' == typeof(type)) {
        type = 'data';
    }
    if('file' == this.__pfc_cfg.type) {
        objFlash.setXMLFile(data);
    } else {
        objFlash.setData(data);
    }
}
