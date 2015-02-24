/**
 * @name AnyChart
 * @projectDescription AnyChart JavaScript Integration Library
 *
 * @version 2.5
 *
 */

var com = {};
com.anychart = {};

/**
 * BrowserTypeInformation class
 * @static
 * @class BrowserTypeInformation
 * Brower information
 */
var BrowserTypeInformation = function(){};

/**
 * Is browser Internet Explorer?
 * @static
 * @field {Boolean}
 */
BrowserTypeInformation.isIE = /(msie|internet explorer)/i.test(navigator.userAgent);

/**
 * Is browser Apple Sarari?
 * @static
 * @field {Boolean}
 */
BrowserTypeInformation.isSafari = /safari/i.test(navigator.userAgent);

/**
 * Is browser Opera?
 * @static
 * @field {Boolean}
 */
BrowserTypeInformation.isOpera = (window.opera != undefined);

//---------------------------------------------------------------------
//
//						AnyChart class
//
//---------------------------------------------------------------------

/**
 * AnyChart class
 *
 * @class AnyChart
 * @alias com.anychart.AnyChart
 * @param {String} [swfPath] path to chart swf file
 * @param {String} [preloaderSWFPath] path to chart preloader swf file
 */
com.anychart.AnyChart = function(){
	switch (arguments.length) {
		case 0:
			this.constructor();
			break;
		case 1:
			this.constructor(arguments[0]);
			break;
		case 2:
			this.constructor(arguments[0],arguments[1]);
			break;
	}
};
var AnyChart = com.anychart.AnyChart;

AnyChart._charts = {};

AnyChart.prototype = {

    //------------------------------------
    //			html wrapper
    //------------------------------------

    /**
    * chart id
    * @field {String}
    */
    id: null,

    /**
    * chart width
    * @see AnyChart.width
    * @field {String}
    */
    width: NaN,

    /**
    * chart height
    * @see AnyChart.height
    * @field {String}
    */
    height: NaN,

    quality: "high",

    /**
    * Flash movie background html color
    * @field {String}
    */
    bgColor: "#FFFFFF",

    /**
    * Path to swf file
    * @field {String}
    */
    swfFile: null,

    /**
    * Path to preloader swf file
    * @field {String}
    */
    preloaderSWFFile: null,

    /**
    * embed (or object) DOM element with chart
    * @field {Object}
    */
    flashObject: null,

    _containerNode: null,
    _containerId: null,

    _isWrited: false,

    /**
    * Text to be shown on preloader initilization
    * @field {String}
    */
    preloaderInitText: null,

    /**
    * Text to be shown while AnyChart is loading  AnyChart.Swf
    * @field {String}
    */
    preloaderLoadingText: null,

    /**
    * Text to be shownwhile AnyChart   is initializing
    * @field {String}
    */
    initText: null,

    /**
    * Text to be shown while AnyChart is loading  XML Data.
    * @field {String}
    */
    xmlLoadingText: null,

    /**
    * Text to be shown while AnyChart is loading  resources (images, etc.)
    * @field {String}
    */
    resourcesLoadingText: null,

    /**
    * Text to be shown when AnyChart gets chart without data.
    * @field {String}
    */
    noDataText: null,

    /**
    * Text to be shown when AnyChart gets no data source (neither XMLFile nor XMLText is set to chart)
    * @field {String}
    */
    waitingForDataText: null,

    /**
    * Text to be shown while AnyChart is loading chart templates
    * @field {String}
    */
    templatesLoadingText: null,

    /**
    * Sets the Window Mode property of the SWF file for transparency, layering, and
    * positioning in the browser. Valid values of wmode are window, opaque, and transparent.
    * Set to <code>window</code> to play the SWF in its own rectangular window on a web page.
    * Set to <code>opaque</code> to hide everything on the page behind it.
    * Set to <code>transparent</code> so that the background of the HTML page shows through all transparent portions of the SWF file.
    * @field {String}
    */
    wMode: null,

    dispatchMouseEvents: true,

    _canDispatchEvent: false,
    _nonDispatcedEvents: null,
    _protocol: "http",

    constructor: function() {

        //check protocol
        if (location.protocol == 'https:')
            this._protocol = 'https';
        else
            this._protocol = 'http';

        this.id = AnyChart.getUniqueChartId();
        switch (arguments.length) {
            case 0:
                this.swfFile = AnyChart.swfFile;
                this.preloaderSWFFile = AnyChart.preloaderSWFFile;
                break;
            case 1:
                this.swfFile = arguments[0];
                this.preloaderSWFFile = AnyChart.preloaderSWFFile;
                break;
            case 2:
                this.swfFile = arguments[0];
                this.preloaderSWFFile = arguments[1];
                break;
        }
        this.width = AnyChart.width;
        this.height = AnyChart.height;
        this.quality = 'high';
        this.bgColor = '#FFFFFF';
        this._xmlFile = null;
        this.loaded = false;
        this._listeners = new Array();
        this._loaded = false;
        this._created = false;
        this._canDispatchEvent = false;
        this._nonDispatcedEvents = new Array();
        this.wMode = null;
        this.dispatchMouseEvents = true;
        var ths = this;
        this.addEventListener('create', function(e) {
            ths._onChartLoad();
        });
        this.addEventListener('draw', function(e) {
            ths._onChartDraw();
        });
        this._xmlSource = null;
        this._isWrited = false;
        this._containerId = null;
        this._containerNode = null;

        this.preloaderInitText = AnyChart.preloaderInitText;
        this.preloaderLoadingText = AnyChart.preloaderLoadingText;
        this.initText = AnyChart.initText;
        this.xmlLoadingText = AnyChart.xmlLoadingText;
        this.resourcesLoadingText = AnyChart.resourcesLoadingText;
        this.noDataText = AnyChart.noDataText;
        this.waitingForDataText = AnyChart.waitingForDataText;
        this.templatesLoadingText = AnyChart.templatesLoadingText;

        this._enableMouseEvents = false;

        AnyChart._registerChart(this);
    },

    /**
    * Write anychart html code into page<br />
    * if target not specified - Directly write to the current window
    * else if target is String - Write to element in the current window by its id
    * else write to element in the current window by its reference
    * @method
    * @param {Object} [target]
    */
    write: function() {
        if (!this._checkPlayerVersion()) {
            document.getElementById(arguments[0]).innerHTML = '<h1 style="padding:10px 10px 0 10px;">您还未安装Flash插件，请先点击下载，然后安装，安装完成后刷新页面即可</h1>'
            + '<p style="padding:5px 10px 0 10px;"><a href="http://www.adobe.com/go/getflashplayer" target="_blank">'
            + '<img src="http://www.adobe.com/images/shared/download_buttons/get_adobe_flash_player.png" alt="Get Adobe Flash player" /></a></p>';
            return;
        }
        if (this._isWrited) return;
        var htmlCode = this._getFlashObjectHTML();
        if (arguments[0] == undefined) {
            this._writeToCurrentWindow(htmlCode);
        } else {
            var target = arguments[0];
            if (!BrowserTypeInformation.isIE && (!BrowserTypeInformation.isSafari && !BrowserTypeInformation.isOpera && target instanceof Window)) {
                this._writeToWindow(target, htmlCode);
            } else if (typeof (target) == 'string' || (!BrowserTypeInformation.isSafari && target instanceof String)) {
                this._writeToHTMLTarget(target, htmlCode);
            } else if (BrowserTypeInformation.isIE && target.innerHTML == undefined) {
                this._writeToWindow(target, htmlCode);
            } else {
                this._writeToHTMLTarget(target, htmlCode);
            }
        }
        this._canDispatchEvent = true;
        for (var i = 0; i < this._nonDispatcedEvents.length; i++) {
            this.dispatchEvent(this._nonDispatcedEvents[i]);
        }
        this._isWrited = true;
    },

    _writeToCurrentWindow: function(htmlCode) {
        this._writeToWindow(window, htmlCode);
    },

    _writeToWindow: function(w, htmlCode) {
        this._initFlashObject(w, htmlCode, false);
        if (w != window) {
            w.AnyChart = AnyChart;
        }
    },

    _writeToHTMLTarget: function(target, htmlCode) {
        if (typeof (target) == 'string' || (!BrowserTypeInformation.isSafari && target instanceof String)) {
            target = document.getElementById(String(target));
        }
        this._initFlashObject(target, htmlCode, true);
    },

    _createContainer: function() {
        this._containerId = AnyChart._getUniqueContainerId(this.id);
        var container = document.createElement('div');
        container.setAttribute('id', this._containerId);
        this._initPrint();
        return container;
    },

    _initFlashObject: function(htmlTarget, htmlCode, useInnerHTML) {
        var target = (BrowserTypeInformation.isIE) ? htmlTarget : this._createContainer();
        if (BrowserTypeInformation.isIE) {
            try {
                var path = document;
                var obj = target;
                var hasErrorsInTree = false;
                if (obj != undefined) {
                    obj = obj.parentNode;
                    while (obj != undefined && obj != null) {
                        if (obj.nodeName != null && obj.nodeName.toLowerCase() == 'form') {
                            if (obj.name == undefined || obj.name == null || obj.name.length == 0) {
                                hasErrorsInTree = true;
                                break;
                            } else {
                                path = path.forms[obj.name];
                            }
                        }
                        obj = obj.parentNode;
                    }
                }
            } catch (e) { }

            if (!hasErrorsInTree) {
                window[this.id] = new Object();
                window[this.id].SetReturnValue = function() { };
                try {
                    if (useInnerHTML) {
                        target.innerHTML = htmlCode;
                    } else {
                        target.document.write(htmlCode);
                    }
                } catch (e) { }
                window[this.id].SetReturnValue = null;
                var fncts = {};
                for (var j in window[this.id]) {
                    if (typeof (window[this.id][j]) == 'function')
                        fncts[j] = window[this.id][j];
                }
                window[this.id] = path[this.id];

                this.flashObject = window[this.id];

                for (var j in fncts) {
                    this._rebuildExternalInterfaceFunction(this.flashObject, j);
                }
                this._onHTMLCreate();
            }
        } else {
            target.innerHTML = htmlCode;
            this._createImage(target);
            if (useInnerHTML) {
                htmlTarget.innerHTML = '';
                htmlTarget.appendChild(target);
            } else {
                htmlTarget.document.getElementsByTagName('body')[0].appendChild(target);
            }

            this.flashObject = document.getElementById(this.id);
            this._containerNode = this.flashObject.parentNode;
            this._onHTMLCreate();
        }
    },

    _rebuildExternalInterfaceFunction: function(obj, functionName) {
        eval('obj[functionName] = function(){return eval(this.CallFunction("<invoke name=\\"' + functionName + '\\" returntype=\\"javascript\\">" + __flash__argumentsToXML(arguments,0) + "</invoke>"));}');
    },

    _getFlashObjectHTML: function() {
        return BrowserTypeInformation.isIE ? this._getObjectHTML() : this._getEmbedHTML();
    },

    _buildFlashVars: function() {
        var res = new String();
        res += '__externalObjId=' + this.id;
        if (this._xmlFile != null)
            res += '&XMLFile=' + this._xmlFile;
        if (this.preloaderSWFFile != null) {
            res += '&swffile=' + this.swfFile;
            if (this.preloaderInitText != null)
                res += '&preloaderInitText=' + this.preloaderInitText;
            if (this.preloaderLoadingText != null)
                res += '&preloaderLoadingText=' + this.preloaderLoadingText;
        }
        if (this.initText != null)
            res += '&initText=' + this.initText;
        if (this.xmlLoadingText != null)
            res += '&xmlLoadingText=' + this.xmlLoadingText;
        if (this.resourcesLoadingText != null)
            res += '&resourcesLoadingText=' + this.resourcesLoadingText;
        if (this.waitingForDataText != null)
            res += '&waitingForDataText=' + this.waitingForDataText;
        if (this.templatesLoadingText != null)
            res += '&templatesLoadingText=' + this.templatesLoadingText;
        if (this.noDataText != null)
            res += '&nodatatext=' + this.noDataText;
        if (this._enableMouseEvents)
            res += '&__enableevents=1';
        return res;
    },

    updateSize: function(width, height) {
        this.flashObject.setAttribute('width', width);
        this.flashObject.setAttribute('height', height);
    },

    _getMoviePath: function() {
        return this.preloaderSWFFile != null ? this.preloaderSWFFile : this.swfFile;
    },

    _getObjectHTML: function() {
        var source = '<obj' + 'ect id="' + this.id + '" name="' + this.id + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + this.width + '" height="' + this.height + '" codebase="' + this._protocol + '://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">';
        source += '<param name="movie" value="' + this._getMoviePath() + '" />';
        source += '<param name="bgcolor" value="' + this.bgColor + '" />';
        source += '<param name="allowScriptAccess" value="always" />';
        source += '<param name="FlashVars" value="' + this._buildFlashVars() + '" />';
        if (this.wMode != null)
            source += '<param name="wmode" value="' + this.wMode + '" />';
        source += '</obj' + 'ect>';
        return source;
    },

    _getEmbedHTML: function() {
        var source = '<embed type="application/x-shockwave-flash" pluginspage="' + this._protocol + '://www.adobe.com/go/getflashplayer" ';
        source += 'src="' + this._getMoviePath() + '" ';
        source += 'width="' + this.width + '" ';
        source += 'height="' + this.height + '" ';
        source += 'id="' + this.id + '" ';
        source += 'name="' + this.id + '" ';
        source += 'bgColor="' + this.bgColor + '" ';
        source += 'allowScriptAccess="always" ';
        if (this.wMode != null)
            source += 'wmode="' + this.wMode + '" ';
        source += 'flashvars="' + this._buildFlashVars() + '" />';
        return source;
    },

    //------------------------------------
    //			Printing
    //------------------------------------

    _onChartDraw: function() {
        if (!BrowserTypeInformation.isIE) {
            this._setPrintImage();
        } else {
            this._initIEPrinting();
        }
    },

    _initIEPrinting: function() {

        var obj = this.flashObject;
        if (obj == null) return;

        window.attachEvent("onbeforeprint", function(e) {
            obj.setAttribute("tmpW", obj.width);
            obj.setAttribute("tmpH", obj.height);

            obj.width = (obj.getWidth != undefined) ? obj.getWidth() : obj.width;
            obj.height = (obj.getHeight != undefined) ? obj.getHeight() : obj.height;

            if (obj.getAttribute("tmpW").indexOf("%") != -1 ||
			    obj.getAttribute("tmpH").indexOf("%") != -1) {
                //ie percent width or height hack
                obj.focus();
            }
        });
        window.attachEvent("onafterprint", function() {
            obj.width = obj.getAttribute("tmpW");
            obj.height = obj.getAttribute("tmpH");
        });
    },

    _createNormalCSS: function() {
        var head = document.getElementsByTagName('head');
        head = ((head.length != 1) ? null : head[0]);

        if (head == null)
            return false;

        if (this._containerId == null)
            return false;

        //crete style node
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.setAttribute('media', 'screen');
        //write normal style
        var objDescriptor = 'div#' + this._containerId;
        var imgDescriptor = objDescriptor + ' img';
        var objRule = "width: " + this.width + ";\n" +
					  "height: " + this.height + ";" +
					  "padding: 0;\n" +
					  "margin: 0;";
        var imgRule = "display: none;\n" +
					  "width: " + this.width + ";" +
					  "height: " + this.height + ";";
        style.appendChild(document.createTextNode(objDescriptor + '{' + objRule + "}\n"));
        style.appendChild(document.createTextNode(imgDescriptor + '{' + imgRule + '}'));
        //add style to head
        head.appendChild(style);

        return true;
    },

    _createPrintCSS: function() {
        var head = document.getElementsByTagName('head');
        head = ((head.length != 1) ? null : head[0]);

        if (this._containerId == null)
            return false;

        //create image style node for print
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.setAttribute('media', 'print');
        //write image style
        var imgDescriptor = '#' + this._containerId + ' img';
        var imgRule = 'display: block;';
        if (this.flashObject != null &&
			this.flashObject.getWidth != undefined &&
			this.flashObject.getHeight != undefined) {
            imgRule += 'width: ' + this.flashObject.getWidth() + 'px;';
            imgRule += 'height: ' + this.flashObject.getHeight() + 'px;';
        }
        style.appendChild(document.createTextNode(imgDescriptor + '{' + imgRule + '}'));
        //write object style
        var objDescriptor = '#' + this._containerId + ' embed';
        var objRule = 'display: none;';
        style.appendChild(document.createTextNode(objDescriptor + '{' + objRule + '}'));
        //add style to head
        head.appendChild(style);
        return true;
    },

    _initPrint: function() {
        this._createNormalCSS();
        this._createPrintCSS();
    },

    _createImage: function(target) {
        var img = document.createElement('img');
        target.appendChild(img);
    },

    _setPrintImage: function() {
        var img = this._containerNode.getElementsByTagName('img');
        if (img.length != 1) return;
        img = img[0];
        img.src = 'data:image/png;base64,' + this.getPng();
    },

    //------------------------------------
    //			resize
    //------------------------------------

    _resizeChart: function() {
        if (this.flashObject.ResizeChart != undefined)
            this.flashObject.ResizeChart();
    },

    //------------------------------------
    //			data
    //------------------------------------

    _xmlSource: null,

    /**
    * Set chart data
    * @method
    * @param {Object} data
    */
    setData: function(data) {
        if (typeof (data) == 'string' || (!BrowserTypeInformation.isSafari && data instanceof String)) {
            if (!this._loaded || !this._created) {
                this._xmlSource = data;
            } else {
                this.setXMLDataFromString(data);
            }
            return;
        }
    },

    setJSData: function(data) {
        var xmlData = JSONConverter.toXML(data);
        this.setData(xmlData);
    },

    updateData: function(path, data) {
        if (this.flashObject != null && this.flashObject.UpdateData != null)
            this.flashObject.UpdateData(path, data);
    },

    updatePointData: function(groupName, pointName, data) {
        if (this.flashObject != null && this.flashObject.UpdatePointData != null)
            this.flashObject.UpdatePointData(groupName, pointName, data);
    },

    addPoint: function(seriesName, pointData) {
	if (this.flashObject != null && this.flashObject.AddPoint != null)
            this.flashObject.AddPoint(seriesName, pointData);
    },

    deletePoint: function(seriesName, pointName) {
	if (this.flashObject != null && this.flashObject.DeletePoint != null)
            this.flashObject.DeletePoint(seriesName, pointName);
    },

    replacePoint: function(seriesName, pointName, pointData) {
	if (this.flashObject != null && this.flashObject.UpdatePoint != null)
            this.flashObject.UpdatePoint(seriesName, pointName, pointData);
    },

    refresh: function() {
	if (this.flashObject != null && this.flashObject.Refresh != null)
            this.flashObject.Refresh();
    },


    updateViewPointData: function(viewName, groupName, pointName, data) {
        if (this.flashObject != null && this.flashObject.UpdateViewPointData != null)
            this.flashObject.UpdateViewPointData(groupName, pointName, data);
    },

    _checkPath: function(path) {
        var currentHost = location.host;
        var currentPath = location.pathname;
        if (location.protocol == "file:")
            return path;
        var protocol = location.protocol;
        currentHost = protocol + "//" + currentHost;
        currentPath = currentHost + currentPath.substr(0, currentPath.lastIndexOf("/") + 1);
        if ((path.charAt(0) + path.charAt(1)) == './') {
            return currentPath + path;
        } else if (path.charAt(0) == '/') {
            return currentHost + path;
        }
        return path;
    },

    /**
    * Set chart data file path
    * @method
    * @param {String} path
    */
    setXMLFile: function(path) {
        path = this._checkPath(path);
        if (this._created || this._loaded)
            this.setXMLDataFromURL(path);
        else
            this._xmlFile = path;
    },

    _checkPresetXMLSource: function() {
        if (this._xmlSource != null && this._created && this._loaded) {
            var ths = this;
            setTimeout(function() {
                ths.setXMLDataFromString(ths._xmlSource);
            }, 100);
        }
    },

    //------------------------------------
    //			events
    //------------------------------------

    _onChartLoad: function() {
        this._loaded = true;
        this._checkPresetXMLSource();
    },

    _onHTMLCreate: function() {
        this._created = true;
        this._checkPresetXMLSource();
    },

    _created: false,
    _loaded: false,

    _listeners: null,
    _enableMouseEvents: false,

    /**
    * Add listener to the event
    *
    * @param {String} event - the type of the event
    * @param {Function} callback - function called when an event occurs
    */
    addEventListener: function(event, callback) {
        this._listeners.push({ type: event, call: callback });
        if (event.indexOf("point") == 0) {
            this._enableMouseEvents = true;
            if (this._loaded && this.flashObject != null && this.flashObject.EnableEvents != null)
                this.flashObject.EnableEvents();
        }
    },

    removeEventListener: function(type) {
    	var newIndexes = [];
    	var i;
    	for (i = 0;i<this._listeners.length;i++) {
    		if (this._listeners[i].type != type)
    			newIndexes.push(this._listeners[i]);
    	}
    	this._listeners = newIndexes;
    },

    dispatchEvent: function(event) {
        if (!this._canDispatchEvent) {
            this._nonDispatcedEvents.push(event);
        };
        var type = event.type;
        event.target = this;
        for (var i = 0; i < this._listeners.length; i++) {
            if (this._listeners[i].type == type) {
                this._listeners[i].call(event);
            }
        }
    },

    //------------------------------------
    //			actions
    //------------------------------------

    setXMLDataFromString: function(data) {
        if (this.flashObject != null &&
			this.flashObject.SetXMLDataFromString != null) {
            this.flashObject.SetXMLDataFromString(data.toString());
		} else {
		    this._rebuildExternalInterfaceFunction(this.flashObject, 'SetXMLDataFromString');
		}
    },

    setXMLDataFromURL: function(url) {
        if (this.flashObject != null &&
			this.flashObject.SetXMLDataFromURL != null) {
            this.flashObject.SetXMLDataFromURL(url);
        }
    },

    /**
    * Sets XML path to the certain view in dashboard.
    * @param {String} viewId view id
    * @param {String} xmlPath path to XML file
    */
    setViewXMLFile: function(viewId, url) {
        if (this.flashObject != null &&
			this.flashObject.UpdateViewFromURL != null)
            this.flashObject.UpdateViewFromURL(viewId, url);
    },

    /**
    * Sets XML string to the certain view in dashboard.
    * @param {String} viewId view id
    * @param {String} data string with XML
    */
    setViewData: function(viewId, data) {
        if (this.flashObject != null &&
			this.flashObject.UpdateViewFromString != null)
            this.flashObject.UpdateViewFromString(viewId, data);
    },

    /**
    * Displays loading message
    *
    * dashboard:
    * setLoading(viewId, messageText)
    *
    * global:
    * setLoading(messageText)
    *
    * @param {String} messageTextOrViewId message text or view id
    * @param {String} messageText message text
    */
    setLoading: function() {
        if (this.flashObject == null || this.flashObject.SetLoading == null) return;
        switch (arguments.length) {
            case 1:
                this.flashObject.SetLoading(null, arguments[0]);
                break;
            case 2:
                this.flashObject.SetLoading(arguments[0], arguments[1]);
                break;
        }
    },

    /**
    * Gets base64 encoded png chart screenshot
    * @return {String}
    */
    getPng: function() {
        return this.flashObject.GetPngScreen();
    },

    /**
    * Gets base64 encoded jpeg chart screenshot
    * @return {String}
    */
    getJpeg: function() {
        return this.flashObject.GetJPEGScreen();
    },

    /**
    * Runs chart printing dialog
    */
    printChart: function() {
        this.flashObject.PrintChart();
    },

    /**
    * Runs image saving dialog
    */
    saveAsImage: function() {
        this.flashObject.SaveAsImage();
    },

    /**
    * Runs pdf saving dialog
    */
    saveAsPDF: function() {
        this.flashObject.SaveAsPDF();
    },

    /**
    * Gets information
    * @return {Object}
    */
    getInformation: function() {
        return this.flashObject.GetInformation();
    },

    scrollXTo: function(xValue) {
        if (this.flashObject != null && this.flashObject.ScrollXTo != null)
            this.flashObject.ScrollXTo(xValue);
    },

    scrollYTo: function(yValue) {
        if (this.flashObject != null && this.flashObject.ScrollYTo != null)
            this.flashObject.ScrollYTo(yValue);
    },

    scrollTo: function(xValue, yValue) {
        if (this.flashObject != null && this.flashObject.ScrollTo != null)
            this.flashObject.ScrollTo(xValue, yValue);
    },

    viewScrollXTo: function(viewName, xValue) {
        if (this.flashObject != null && this.flashObject.ViewScrollXTo != null)
            this.flashObject.ViewScrollXTo(viewName, xValue);
    },

    viewScrollYTo: function(viewName, yValue) {
        if (this.flashObject != null && this.flashObject.ViewScrollXTo != null)
            this.flashObject.ViewScrollYTo(viewName, yValue);
    },

    viewScrollTo: function(viewName, xValue, yValue) {
        if (this.flashObject != null && this.flashObject.ViewScrollTo != null)
            this.flashObject.ViewScrollTo(viewName, xValue, yValue);
    },

    setXZoom: function(settings) {
        if (this.flashObject != null && this.flashObject.SetXZoom != null)
            this.flashObject.SetXZoom(settings);
    },

    setYZoom: function(settings) {
        if (this.flashObject != null && this.flashObject.SetYZoom != null)
            this.flashObject.SetYZoom(settings);
    },

    setZoom: function(xZoomSettings, yZoomSettings) {
        if (this.flashObject != null && this.flashObject.SetZoom != null)
            this.flashObject.SetZoom(xZoomSettings, yZoomSettings);
    },

    setViewXZoom: function(viewName, settings) {
        if (this.flashObject != null && this.flashObject.SetViewXZoom != null)
            this.flashObject.SetViewXZoom(viewName, settings);
    },

    setViewYZoom: function(viewName, settings) {
        if (this.flashObject != null && this.flashObject.SetViewYZoom != null)
            this.flashObject.SetViewYZoom(viewName, settings);
    },

    setViewZoom: function(viewName, xZoomSettings, yZoomSettings) {
        if (this.flashObject != null && this.flashObject.SetViewZoom != null)
            this.flashObject.SetViewZoom(viewName, xZoomSettings, yZoomSettings);
    },

    getXScrollInfo: function() {
        if (this.flashObject != null && this.flashObject.GetXScrollInfo != null)
            return this.flashObject.GetXScrollInfo();
    },

    getYScrollInfo: function() {
        if (this.flashObject != null && this.flashObject.GetYScrollInfo != null)
            return this.flashObject.GetYScrollInfo();
    },

    getViewXScrollInfo: function(viewName) {
        if (this.flashObject != null && this.flashObject.GetViewXScrollInfo != null)
            return this.flashObject.GetViewXScrollInfo(viewName);
    },

    getViewYScrollInfo: function(viewName) {
        if (this.flashObject != null && this.flashObject.GetViewYScrollInfo != null)
            return this.flashObject.GetViewYScrollInfo(viewName);
    },

    //------------------------------------
    //			player version
    //------------------------------------

    _checkPlayerVersion: function() {
        var version = this._getFlashPlayerVersion();
        if (version == null) return false;
        if (version.major < 9) return false;
        return true;
    },

    _getFlashPlayerVersion: function() {

        if (navigator.plugins != null && navigator.mimeTypes.length > 0) {
            var flashPlugin = navigator.plugins["Shockwave Flash"];
            if (flashPlugin != null && flashPlugin.description != null) {
                var versionInfo = flashPlugin.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split(".");
                return { major: versionInfo[0], minor: versionInfo[1], rev: versionInfo[2] };
            }
            return null;
        }

        var activeX = null;

        if (navigator.userAgent != null && navigator.userAgent.indexOf("Windows CE") != -1) {
            var versionIndex = 4;

            while (true) {
                try {
                    activeX = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + versionIndex);
                    versionIndex++;
                } catch (e) {
                    break;
                }
            }

            if (activeX == null) return null;
            return { major: versionIndex, minor: 0, rev: 0 };

        }

        var version = null;

        try {
            activeX = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
        } catch (e) {
            try {
                activeX = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
                version = { major: 6, minor: 0, rev: 21 };
                activeX.AllowScriptAccess = "always";
            } catch (e) {
                if (version != null && version.major == 6) return version;
            }
            try {
                activeX = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            } catch (e) { /* do nothing */ }
        }
        if (activeX == null) return null;
        var versionInfo = activeX.GetVariable("$version").split(" ")[1].split(",");
        return { major: versionInfo[0], minor: versionInfo[1], rev: versionInfo[2] };
    }
};

/**
 * Get chart by its id
 *
 * @static
 * @method
 * @param {String} id chart id
 * @return {AnyChart} chart
 *
 */
AnyChart.getChartById = function(id) {
	return AnyChart._charts[id];
};

AnyChart._chartsCount = 0;

AnyChart._registerChart = function(chart) {
	AnyChart._charts[chart.id] = chart;
	AnyChart._chartsCount ++;
};

/**
 * Default AnyChart swf file
 * @static
 * @field {String}
 */
AnyChart.swfFile = null;

/**
 * Default AnyChart preloader swf file
 * @static
 * @field {String}
 */
AnyChart.preloaderSWFFile = null;

/**
 * Default chart width
 * @static
 * @field
 */
AnyChart.width = 550;

/**
 * Default chart height
 * @static
 * @field
 */
AnyChart.height = 400;

/**
 * Default text to be shown on preloader initilization
 * @static
 * @field {String}
 */
AnyChart.preloaderInitText = "正在初始化...";

/**
 * Default text to be shown when preloader loads AnyChart.Swf
 * @static
 * @field {String}
 */
AnyChart.preloaderLoadingText = "数据读取中... ";

/**
 * Default text to be shown when AnyChart is initializing
 * @static
 * @field {String}
 */
AnyChart.initText = "初始化...";

/**
 * Default text to be shown when AnyChart loads XML Data.
 * @static
 * @field {String}
 */
AnyChart.xmlLoadingText = "数据读取中...";

/**
 * Default text to be shown when AnyChart loads resources (images, etc.)
 * @static
 * @field {String}
 */
AnyChart.resourcesLoadingText  = "数据读取中...";

/**
 * Default text to be shown when AnyChart gets chart without data
 * @static
 * @field {String}
 */
AnyChart.noDataText = "该时间段内无数据";

/**
 * Text to be shown when AnyChart gets no data source (neither XMLFile nor XMLText is set to chart)
 * @static
 * @field {String}
 */
AnyChart.waitingForDataText = "正在读取数据...";

/**
 * Text to be shown while AnyChart is loading chart templates.
 * @static
 * @field {String}
 */
AnyChart.templatesLoadingText = "展示模板读取中...";

AnyChart._replaceInfo = new Array();

/**
 * Generate unique chart id
 * @static
 * @method
 * @return {String}
 */
AnyChart.getUniqueChartId = function() {
	return 'chart__'+AnyChart._chartsCount;
}

AnyChart._getUniqueContainerId = function(chartId) {
	return '___CONTAINER___N'+chartId;
}

var JSONConverter = {};
JSONConverter.toXML = function(data) {
	return JSONConverter.createNode("anychart",data);
}
JSONConverter.isAttribute = function(prop) {
	return (typeof(prop) == "string" || typeof(prop) == "number" || typeof(prop) == "boolean");
}
JSONConverter.isCollection = function(prop) {
	return (prop instanceof Array);
}
JSONConverter.createNode = function(nodeName, data) {
	var res = "<"+nodeName;
	for (var j in data) {
		if (j != "format" && j != "text" && JSONConverter.isAttribute(data[j])) {
			res += " "+j+"=\""+data[j]+"\"";
		}
	}
	res += ">";
	for (var j in data) {
		if (j == "format" || j == "text") {
			res += "<"+j+"><![CDATA["+data[j]+"]]></"+j+">";
		}else if (JSONConverter.isCollection(data[j])) {
			var nodes = data[j];
			for (var i = 0;i<nodes.length;i++) {
				res += JSONConverter.createNode(j,nodes[i]);
			}
		}else if (!JSONConverter.isAttribute(data[j])) {
			res += JSONConverter.createNode(j,data[j]);
		}
	}
	res += "</"+nodeName+">";
	return res;
}