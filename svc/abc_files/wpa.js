/**
 * Created by JetBrains PhpStorm.
 * User: amoschen
 * Date: 12-12-06
 * Time: 下午8:31
 * To change this template use File | Settings | File Templates.
 */

/*
 * wpa arguments
 * wty: wpa type { 0 - TA&Invite only || 1 - normal wpa || 2 - link wpa }
 * kfuin: kfuin
 * type: wpa style type { 1-9 button styles || b1-b4 float styles ｝
 * sv: session version { 0 - defult || 3 - china telecom || 4 - TA }
 * sp: session param, only pvid at this point
 * aty: appointed type { 0 - auto || 1 - appointed kfext || 2 - appointed group }
 * a: appointed kfext or group
 * iv: is invite wpa { 0 - default || 1 - invite(including auto invite) }
 * ws: website
 * btn1: btn1 text(click to chat)
 * btn2: btn2 text(click to cancel)
 * fsty: float style { 0 - fixed || 1 - scroll }
 * fposX: float x-coordinate position { 0 - left || 1 - center || 2 - right }
 * fposY: float y-coordinate position { 0 - top || 1 - center || 2 - bottom }
 * csty: color style
 * tx: face image
 * key: encode params' info, including bqq's real number
 * wid: id of element to be wpa
 * di: defined invite, the name function which will be call when invite
 */

if(!window.BQQWPALOAD){
    (function(window, undefined){
        var VERSION = '2.1.20130819'; // Last update: 20130225

        var DEBUG = false,
            GREY = false;

        //wpa params
        var WPA_TYPE_TA_INVITE_ONLY = '0', //no wpa will be created, TA & invite logic only
            WPA_TYPE_NORMAL = '1', //normal wpa, with TA & invite logic
            WPA_TYPE_LINK = '2', //for forumn & weibo, a link
            SESSION_VERSION_TA = '4', //session version for wpa with TA, seperated from user customed wpa
            WPA_STYLE_TYPE_INVITE = '20', //invite wpa's style type
            APPOINTED_TYPE_AUTO = '0', //appointed type of automatic diversion
            APPOINTED_TYPE_KFEXT = '1', //appointed type of appointed kfext
            APPOINTED_TYPE_GROUP = '2', //appointed type of appointed group
            APPOINTED_TYPE_AUTO_INVITE = '4', //appointed type of auto invite
            APPOINTED_TYPE_INVITE = '5', //appointed type of invite
            WPA_FLOAT_TYPE_FIXED = '0', //wpa style: float style fixed
            WPA_FLOAT_TYPE_SCROLL = '1', //wpa style: float style scroll
            WPA_FLOAT_POSITION_X_LEFT = '0', //wpa style: x-coordinate position, left
            WPA_FLOAT_POSITION_X_CENTER = '1', //wpa style: x-coordinate position, center
            WPA_FLOAT_POSITION_X_RIGHT = '2', //wpa style: x-coordinate position, right
            WPA_FLOAT_POSITION_Y_TOP = '0', //wpa style: y-coordinate position, top
            WPA_FLOAT_POSITION_Y_CENTER = '1', //wpa style: y-coordinate position, center
            WPA_FLOAT_POSITION_Y_BOTTOM = '2', //wpa style: y-coordinate position, bottom
            IS_INVITE_WPA_FALSE = '0', //param that seperate wpa conversations, false means normal wpa conversation
            IS_INVITE_WPA_TRUE = '1'; //param that seperate wpa conversations, invite wpa conversation

        //task execute gaps
        var MASTER_MONITOR_GAP = 2000, //time gap that slave monitors master
            INVITE_MONITOR_GAP = 1000, //time gap that slave monitors invite state
            MASTER_HEATBEAT_GAP = 2000, //mater's heartbeat gap
            SLAVE_HEARTBEAT_GAP = 2000, //slave's heartbeat gap
            SERVER_MONITOR_GAP_MIN = 5000, //the floor gap that master monitors server
            SERVER_MONITOR_GAP_MAX = 15000, //the ceil gap that master monitors server
            SERVER_MONITOR_SLEEPCHECK_GAP = 3600000, //the gap that before master checking web page's residence time, if bigger than the gap, then stop server monitor and sleep
            SERVER_MONITOR_SLEEPING_GAP = 1000; //the gap master checking web page's activity, if alive again, then recover server monitor

        //global cookie keys
        var KFUIN = 'kfu', //eqq's uin
            UID = 'pgv_pvi'; //visitor id

        //kfuin cookie keys
        var INVITE_SIGNAL = 'is', //invite state's signal
            INVITE_KFEXT = 'ik', //invite kfext
            INVITE_MSG = 'msg', //invite msg
            MASTER_HEARTBEATS = 'mh', //master's last heartbeat time(in timestamp)
            MASTER_ID = 'mid', //master's id, for recover and de-emphasis
            SLAVE_IDS = 'slid'; //slave's id, prefix for slave id list and slave heartbeat

        //cookie values
        var INVITE_SIGNAL_UNINVITED = '0', //uninvite state
            INVITE_SIGNAL_INVITE = '1', //inviting state
            INVITE_SIGNAL_INVITED = '2', //invited state
            INVITE_KFEXT_AUTO = '0', //automatic diversion
            MASTER_HEARTBEATS_ERROR = '-1', //master heartbeat's value when error occurs
            DATA_SEPERATOR = '|'; //seperator for data

        //CGIs
        var GET_CONFIG_URL = 'http://visitor.crm2.qq.com/cgi/visitorcgi/ajax/wpa_first_heart_beat.php', //cgi url for getting initiation config in load process
            HEARTBEAT_URL = 'http://visitor.crm2.qq.com/cgi/visitorcgi/ajax/wpa_heart_beat.php', //cgi url for user's heartbeat report and getting invite state
            CONFIRM_AUTO_INVITE_URL = 'http://visitor.crm2.qq.com/cgi/visitorcgi/ajax/auto_invite.php'; //cgi url for confirming raising an auto invite

        //CGI code
        var RESULT_SUCCESS = 0, //success code for all cgi
            INVITE_STATE_UNINVITED = '0', //uninvited state value
            INVITE_STATE_INVITE = '1', //inviting state value
            INVITE_STATE_INVITED = '2', //invited state value
            AUTO_INVITE_TRUE = 1; //value that confirms auto invite

        //Other Const
        var PVID_RETRY_TIME = 3000, // 3000 * 200ms = 10 min
            TITLE_FLASH_GAP = 120; //gap between title flashes

        var TA_BLACKLIST = '',
            CRM_BLACKLIST = 'qq.com,pengyou.com,qzoneapp.com,nipic.com,docin.com,51zxw.net,2155.com,xd.com,yto.net.cn,c-c.com,27.cn,05wan.com,alivv.cn,gogo.com,doctorjob.com.cn,emoney.cn,m4.cn,chinaktv.net,yk988.com,bangkaow.com,wsxsp.com,55tools.com,youxi518.com',
            CRM_BLOCK_ON_SERVERSIDE = 1,
            CRM_WHITELIST = 'b.qq.com,sales.b.qq.com,guilin.house.qq.com,ta.qq.com,hn.qq.com,nantong.house.qq.com';

        var HOST = 'http://cdn.b.qq.com',
            PATH = HOST + '/account/bizqq/';

        var WPA_VIEW_HELPER = '_WPA_VIEW_HELPER',
            WPA_VIEW_HELPER_PREFIX = 'WPA_VIEW_HELPER';

        var SPEED_REPORT_RATE = 0.9;

        //fast link to global variant
        var document = window.document;

        //if mozilla, use error.fileName to accurately wpa's handle error
        //throw out other errors
        /*
        if(/(mozilla)(?:.*? rv:([\w.]+))?/.test(window.navigator.userAgent)){
            window.onerror = function(e){
                return e.fileName.indexOf('wpa.js') === -1;
            };
        }
        */

        //get timestamp
        var now = function(){ return +new Date();};

        var GUID = function(){
            function S4(){
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }

            /**
             * Generate a GUID ( global unique identity )
             * @return {String}
             */
            return function(){
                return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
            };
        }();

        //use image as a report tool, send certain data to server side using get method
        var report = function(url){
            //add timestamp in case of browser's cache
            url += url.indexOf('?') > -1 ? '' : '?';
            url += '&' + now();

            //send data
            var name = 'log_' + now(),
                img = window[name] = new Image();

            img.onload = img.onerror = function(){
                window[name] = null;
            };

            img.src = url;
            img = null;
        };

        //report important speed points to isd speed monitor system
        var SpeedReport;
        (function(){
            SpeedReport = function(flag1, flag2, flag3){
                this.url = 'http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=' + flag1 + '&flag2=' + flag2 + '&flag3=' + flag3 + '&';
                this.p0 = now();
                this.points = [this.p0];
            };

            SpeedReport.prototype = {
                addPoint: function(point, time){
                    var points = this.points;
                    if(point >= points.length){
                        for(var i=points.length; i<point; i++){
                            points.push(0);
                        }
                    }

                    time = time || (now() - this.p0);
                    points[point] = time;
                    return this;
                },
                pushPoint: function(time){
                    time = time || (now() - this.p0);
                    this.points.push(time);
                    return this;
                },
                send: function(){
                    var url = this.url,
                        points=this.points;

                    for(var i=1, len=points.length; i<len; i++){
                        if(points[i]){
                            url += i + '=' + points[i] + '&';
                        }
                    }

                    (Math.random()<SPEED_REPORT_RATE) && report(url);
                    return this;
                }
            };
        })();

        var speedReport = new SpeedReport('7818', '4', '1');

        //protocol type
        var isHttps = /^https/.test(window.location.href);

        //top-level domain
        var domain = document.domain;
        var topDomain = function(){
            //in case of domains end up with .com.cn .edu.cn .gov.cn .org.cn
            var reg1 = /\.(?:(?:edu|gov|com|org|net)\.cn|co\.nz)$/,
            //in case of ip
                reg2 = /^[12]?\d?\d\.[12]?\d?\d\.[12]?\d?\d\.[12]?\d?\d$/,
            // for domain ends like .com.cn, top domain starts from -3
            // for ip starts from 0
            // else slice from -2
                slicePos = reg1.test(domain) ? -3 : reg2.test(domain) ? 0 : -2;
            return domain.split('.').slice(slicePos).join('.');
        }();

        var TAFilter = function(){
            //in case of ip
            var dm = topDomain,
                IPReg = /^[12]?\d?\d\.[12]?\d?\d\.[12]?\d?\d\.[12]?\d?\d$/,
                LocalReg = /^localhost$/;

            return TA_BLACKLIST.indexOf(dm) === -1 && !IPReg.test(dm) && !LocalReg.test(dm);
        }();

        var CRMFilter = function(){
            //match white list
            try{
                var domain = /^http[s]?:[\/]{2,3}([^\/$]+)/.exec(location.href)[1];
                var reg = new RegExp('(^|,)' + domain);
                if(reg.test(CRM_WHITELIST)){
                    return true;
                }

                //check black list
                var dm = topDomain,
                    dmReg = new RegExp('(^|,)' + topDomain);
                    IPReg = /^[12]?\d?\d\.[12]?\d?\d\.[12]?\d?\d\.[12]?\d?\d$/, //IP check
                    LocalReg = /^localhost$/; //localhost check

                return !dmReg.test(CRM_BLACKLIST) && !IPReg.test(dm) && !LocalReg.test(dm);
            } catch(e){}
        }();

        var browser = function(ua){
            ua = ua.toLowerCase();

            var browser = {};

            // Browser Base
            // Borrowed from jQuery
            var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
                /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
                /(msie) ([\w.]+)/.exec( ua ) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
                [];

            var matched = {
                browser: match[ 1 ] || "",
                version: match[ 2 ] || "0"
            };

            if ( matched.browser ) {
                browser[ matched.browser ] = true;
                browser.version = matched.version;
            }

            // Chrome is Webkit, but Webkit is also Safari.
            if ( browser.chrome ) {
                browser.webkit = true;
            } else if ( browser.webkit ) {
                browser.safari = true;
            }

            // Mobile detect
            browser.isMobile = ua.match(/(nokia|iphone|android|motorola|^mot\-|softbank|foma|docomo|kddi|up\.browser|up\.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam\-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte\-|longcos|pantech|gionee|^sie\-|portalmmm|jig\s browser|hiptop|^ucweb|^benq|haier|^lct|opera\s*mobi|opera\*mini|320x320|240x320|176x220)/i);

            browser.isWindow = /windows|win32/.test(ua);

            return browser;
        }(window.navigator.userAgent);

        // proxy function for appointting a namespace to a certain function
        var proxy = function(ns, fn){
                    return function(){
                        fn.apply(ns, arguments);
                    }
                };

        // console link switch, turn off when publish
        var console = {
            log: window.console && DEBUG ? function(obj) {
                    window.console.log(obj);
                } : function(){}
        };

        /**
         * 获取对象getScrollTop值
         */
        var getScrollTop = function(doc){
            return function(){
                return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
            };
        }(document);

        /**
         * 获取对象的可视区域高度
         */
        var getClientWidth = function(doc) {
            return function(){
                return doc.compatMode == "CSS1Compat" ? doc.documentElement.clientWidth : doc.body.clientWidth;
            };
        }(document);

        /**
         * 获取对象的可视区域高度
         */
        var getClientHeight = function(doc) {
            return function(){
                return doc.compatMode == "CSS1Compat" ? doc.documentElement.clientHeight : doc.body.clientHeight;
            };
        }(document);

        /**
         * contains Element contains another
         * @param {HTMLElement} node The node to be contained
         * @param {object} context The context in which the node is contained
         * @borrow jQuery.contains
         */
        var contains = document.documentElement.contains ?
            function( node, context ) {
                var adown = node.nodeType === 9 ? node.documentElement : node,
                    bup = context && context.parentNode;
                return node === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
            } :
            document.documentElement.compareDocumentPosition ?
                function( node, context ) {
                    return context && !!( node.compareDocumentPosition( context ) & 16 );
                } :
                function( node, context ) {
                    while ( (context = context.parentNode) ) {
                        if ( context === node ) {
                            return true;
                        }
                    }
                    return false;
                };

        /**
         * css Node's style operation
         * @param {HTMLElement} node Node to be set
         * @param {string|object} style Style name or the styles' pairs
         * @param {string} [value] Style value
         * @retrun {string} Style value, only with string type style  and no value
         */
        var css = function(){
            var getStyle = document.defaultView && document.defaultView.getComputedStyle ?
                // for standard W3C method
                function(node, style){
                    //font-wight而非fontWight
                    style = style.replace(/([A-Z])/g,"-$1").toLowerCase();

                    //获取样式对象并获取属性（存在的话）值
                    var s = document.defaultView.getComputedStyle(node,"");
                    return s && s.getPropertyValue(style);
                }:
                // for ie
                function(node, style){
                    return node.currentStyle[style];
                };

            var inDom = function(node, fn){
                if(!contains(node, document)){
                    return fn();
                }

                var inVisible = {
                    opacity: 0,
                    filter: 'alpha(opacity=0)'
                    },
                    parent = node.parentNode,
                    nextSibling = node.nextSibling;
                    div = document.createElement('div'),
                    returnValue;

                div.appendChild(node);
                css(div, inVisible);
                css(node, inVisible);
                document.body.appendChild(div);

                returnValue = fn();

                nextSibling ? parent.insertBefore(node, nextSibling) : parent.appendChild(node);
                div.parentNode.removeChild(div);

                return returnValue;
            };

            return function(node, style, value){
                var cssText;

                if(!value){
                    // get style
                    if(typeof style === 'string'){
                        return inDom(node, function(){
                            return getStyle(node, style);
                        });
                    }

                    // type validation
                    if(typeof style !== 'object'){
                        new TypeError('Arg style should be string or object');
                    }

                    // batch set
                    cssText = [];
                    for(var styleName in style){
                        cssText.push(styleName + ':' + style[styleName]);
                    }
                    cssText = cssText.join(';');
                } else {
                    cssText = style + ':' + value;
                }

                // set style with value
                cssText = cssText.replace(/([A-Z])/g,"-$1").toLowerCase();
                node.style.cssText += ';' + cssText; // cssText ends up without a semicolon in ie
                return node;
            }
        }();

        /**
         * Operation on node's class attribute
         * @type {object} Methods collection
         */
        var styleClass = function(){
            return {
                /**
                 * Add class to a node
                 * @param {HTMLElement} node A node
                 * @param {string} cname Class name
                 * @return {HTMLElement} The node
                 */
                addClass: function(node, cname){
                    if(!node || !cname) {
                        return node;
                    }

                    if(!node.className){
                        node.className = cname;
                        return node;
                    }

                    if (this.hasClass(node, cname)) {
                        return node;
                    }

                    node.className += ' ' + cname;
                    return node;
                },

                /**
                 * Judge whether the node has the class
                 * @param {HTMLElement} node A node
                 * @param {string} cname Class name
                 * @return {boolean} Judgement, true when the node has the class
                 */
                hasClass: function(node, cname) {
                    return (node && cname) ? new RegExp('\\b' + cname + '\\b').test(node.className) : false;
                },

                /**
                 * Remove a class from the node
                 * @param {HTMLElement} node A node
                 * @param {string} cname Class name
                 * @return {HTMLElement} The node
                 */
                removeClass: function(node, cname){
                    if(!node || !cname){
                        return node;
                    }

                    if(!this.hasClass(node, cname)){
                        return node;
                    }

                    if(node.className){
                        node.className = node.className.replace(cname, '');
                    } else {
                        node.setAttribute = node.getAttribute('class').replace(cname, '');
                    }

                    return node;
                }
            };
        }();


        /**
         * Bind event to node
         * @param {HTMLElement} node The node to be bound
         * @param {string} type The event type
         * @param {function} event Event's handler
         * @return {HTMLElement} The node itself
         */
        var addEvent = function(window){
            return window.addEventListener ? function(node, type, event){
                node.addEventListener(type, event);
                return node;
            } : function(node, type, event){
                node.attachEvent('on' + type, event);
                return node;
            };
        }(window);

        /**
         * Unbind event from node
         * @param {HTMLElement} node The node to be unbound
         * @param {string} type The event type
         * @param {function} event Event's handler
         * @return {HTMLElement} The node itself
         */
        var removeEvent = function(window){
            return window.removeEventListener ? function(node, type, event){
                node.removeEventListener(type, event);
                return node;
            } : function(node, type, event){
                node.detachEvent('on' + type, event);
                return node;
            };
        }(window);

        /**
         * Add event handler to onLoad event
         * @param {function} fn Event handler
         * @param {object} [context=window] The context to add event listener
         */
        var onLoad = function(fn, context){
            context = context || window;

            if(/loaded|complete|undefined/.test(context.document.readyState)){
                fn();
            } else {
                addEvent(context, 'load', fn);
            }

            return context;
        };

        /**
         * Load script asynchronously
         * @param {string} url Script's source link
         * @param {object} [opts] Options for loading script
         * @param {object} [opts.context] Context to load script
         * @param {function} [opts.callback] Callback when script loaded
         * @param {string} [opts.charset='utf-8'] Charset of script
         * @return {HTMLElement} The newly injected script
         */
        var loadScript = function(url, opts){
            opts = opts || {};
            var context = opts.context || window,
                document = context.document || document,
                callback = opts.callback;

            var parent = document.getElementsByTagName('head')[0],
                baseElement = parent.getElementsByTagName('base')[0],
                script = document.createElement('script');

            script.onload = script.onerror = script.onreadystatechange = function(event){
                //Firefox got no readyState, readyState undefined means Firefox's onload event fires
                //IE has readyState, readyState would be loaded or complete when done
                if(/loaded|complete|undefined/.test(script.readyState)){
                    // Ensure only run once and handle memory leak in IE
                    script.onload = script.onerror = script.onreadystatechange = null;

                    // Remove the script to reduce memory leak
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }

                    script = null;

                    callback && callback(event || context.event, script);
                }
            };

            // For some cache cases in IE 6-9, the script executes IMMEDIATELY after
            // the end of the insertBefore execution, so use `currentlyAddingScript`
            // to hold current node, for deriving url in `define`.
//            currentScript = script;

            script.type = 'text/javascript';
            script.charset = opts.charset || 'utf-8';
            script.async = true;
            script.src = url;

            (function() {
                try{
                    // ref: #185 & http://dev.jquery.com/ticket/2709
                    baseElement ?
                        parent.insertBefore(script, baseElement) :
                        parent.appendChild(script);
                } catch(e){
                    setTimeout(arguments.callee, 0);
                }
            })();

            return script;
        };

        /**
         * Load stylesheet asynchronously
         * @type {object} Load methods collection
         */
        var Style = function(){
            return {
                /**
                 * Load css file to page
                 * @param {string} name Assign a name
                 * @param {string} href CSS file's link
                 * @param {object} [opts] Options for loading
                 * @param {object} [opts.context] Context to load css
                 * @return {HTMLElement} The newly injected link
                 */
                load: function(name, href, opts){
                    opts = opts || {};
                    var context = opts.context || document;

                    // add stylesheet to context
                    var style = context.createElement('link');
                    style.name = name;
                    style.type = 'text/css';
                    style.setAttribute('rel', 'stylesheet');
                    style.setAttribute('href', href);

                    (function(){
                        try{
                            var parent = context.getElementsByTagName('head')[0];
                            parent.insertBefore(style, parent.firstChild);
                        } catch(e){
                            setTimeout(arguments.callee, 1);
                        }
                    })();

                    return style;
                },

                /**
                 * Add style tag to page P.S.class name or id cannot start with '_' in ie6 & ie7!
                 * @param {string} name Assign a name
                 * @param {string} cssText CSS text
                 * @param {object} [opts] Options for loading
                 * @param {object} [opts.context] Context to add style
                 * @return {HTMLElement} The newly injected link
                 */
                //
                add: function(name, cssText, opts){
                    opts = opts || {};
                    var context = opts.context || document;

                    // add stylesheet to page
                    var style = context.createElement('style');
                    style.type = 'text/css';
                    style.name = name;

                    // insert style into dom before setting cssText
                    // otherwise, ie6 will not be set properly
                    var parent = context.getElementsByTagName('body')[0];
                    parent.insertBefore(style, parent.firstChild);

                    if(style.styleSheet){
                        style.styleSheet.cssText = cssText;
                    } else {
                        style.appendChild(context.createTextNode(cssText));
                    }

                    return style;
                }
            };
        }();

        /**
         * getJSONP For cross-domain JSON  request
         * @param {string} url The data source url
         * @param {object} [opt] The additional params for getting data
         * @param {function} fn Data handler, invoke with the returned JSON object
         */
        var getJSONP = (function(){
            var count = 0;
            return function(url, opt, fn){
                // Arguments' handler for optional param
                if(!fn){
                    fn = opt;
                    opt = {};
                }

                //define callback handler
                var callbackname = 'JSONP_CALLBACK_' + count++,
                    script;

                window[callbackname] = function(){
                    fn && fn.apply(window, arguments);

                    script.parentNode.removeChild(script);
                    window[callbackname] = null;
                };

                //generate url with params
                opt.cb = callbackname;
                var queryString = [];
                for(var i in opt){
                    if(opt[i] && opt.hasOwnProperty(i)){
                        queryString.push(i + '=' + encodeURIComponent(opt[i] || ''));
                    }
                }
                url += (url.indexOf('?') > -1 ? '&' : '?') + queryString.join('&');

                script = loadScript(url);
            }
        })();

        /**
         * @Class Cookie Collection of cookie operations
         */
        var Cookie;
        (function(){
            Cookie = {
                /**
                 * Set cookie
                 * @static
                 * @public
                 * @param {string} name Cookie's name(key)
                 * @param {string} value Cookie's value
                 * @param {string} [domain] Cookie's domain, pay attention to same origin limit
                 * @param {string} [path] Cookie's path
                 * @param {string} [expires=session] Cookie's expire time
                 * @return {object} Cookie object
                 */
                set: function(name, value, domain, path, expires){
                    if(expires){
                        expires = new Date(now() + expires);
                    }

                    var tempcookie = name + '=' + escape(value) +
                            ((expires) ? '; expires=' + expires.toGMTString() : '') +
                            ((path) ? '; path=' + path : '') +
                            ((domain) ? '; domain=' + domain : '');

                    //Ensure the cookie's size is under the limitation
                    if(tempcookie.length < 4096) {
                        window.document.cookie = tempcookie
                    }

                    return Cookie;
                },

                /**
                 * Get cookie by name
                 * @static
                 * @public
                 * @param {string} name Cookie's name(key)
                 * @return {string|null} Cookie's value, null when no such cookie exists
                 */
                get: function(name){
                    var carr = window.document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                    if (carr != null){
                        return unescape(carr[2]);
                    }

                    return null;
                },

                /**
                 * Delete a cookie
                 * @static
                 * @public
                 * @param {string} name Cookie's name(key)
                 * @param {string} [domain] Cookie's domain, pay attention to same origin limit
                 * @param {string} [path] Cookie's path
                 * @return {object} Cookie object
                 */
                del: function(name, domain, path){
                    if (this.get(name)){
                        window.document.cookie = name + '=' +
                        ((path) ? '; path=' + path : '') +
                        ((domain) ? '; domain=' + domain : '') +
                        ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
                    }
                },

                /**
                 * Find certain string in cookie with regexp
                 * @static
                 * @public
                 * @param pattern The regular expression to be matched
                 * @return {Array} The matched results
                 */
                find: function(pattern){
                    return window.document.cookie.match(pattern).split(',');
                }
            };
        })();

        /**
         * @Class Storage Collection of storage operations, using cookie as storage media and block storage idea
         */
        var Storage;
        (function(){
            var storage = Cookie;

            //block storage, use block index as prefix
            Storage = function(blockIndex){
                this.blockIndex = blockIndex;
            };

            //static get method, without block index
            Storage.get = function(name){
                return storage.get(name);
            };

            //static set method, without block index
            Storage.set = function(name, value){
                return storage.set(name, value, topDomain);
            };

            //static del method, without block index
            Storage.del = function(name){
                return storage.del(name, topDomain);
            };

            //static find method, without block index
            Storage.find = function(){
                return storage.find.apply(storage, arguments);
            };

            //methods within block storage
            Storage.prototype = {
                set: function(name, value){
                    return storage.set(this.blockIndex + name, value, topDomain);
                },
                get: function(name){
                    return storage.get(this.blockIndex + name);
                },
                del: function(name){
                    return storage.del(this.blockIndex + name, topDomain);
                },
                find: function(pattern){
                    var oDataArr = storage.find(new RegExp(this.blockIndex + '[^=]*')),
                        dataArr = oDataArr.join(';').replace(new RegExp(this.blockIndex, 'g'), '').split(';');

                    for(var i=0, d, arr=[]; d=dataArr[i++];){
                        if(pattern.test && pattern.test(d)){
                            arr.push(d);
                            continue;
                        }
                        if(d.indexOf(pattern) > -1){
                            arr.push(d);
                        }
                    }

                    return arr;
                }
            };
        })();

        /**
         * @Class Panel Panel Component
         */
        var Panel = function(){
            /**
             * Default settings
             * @type {Object}
             */
            var SETTINGS = {
                // container where panel to be contained
                container: document.getElementsByTagName('body')[0],

                // template of panel
                template: [
                    '<div class="WPA-CONFIRM">',
                        '<h3 class="WPA-CONFIRM-TITLE"><%=title%></h3>',
                        '<div class="WPA-CONFIRM-CONTENT" style="">',
                            '<%=content%>',
                        '</div>',
                        '<div class="WPA-CONFIRM-PANEL" style=""><%=buttons%></div>',
                    '</div>'
                ].join(''),

                // template of button
                buttonTemplate: [
                    '<a href="javascript:;" class="WPA-CONFIRM-BUTTON"><span class="WPA-CONFIRM-BUTTON-PADDING WPA-CONFIRM-BUTTON-LEFT"></span><span class="WPA-CONFIRM-BUTTON-TEXT"><%=text%></span><span class="WPA-CONFIRM-BUTTON-PADDING WPA-CONFIRM-BUTTON-RIGHT"></span></a>'
                ].join(''),

                // panel's style
                cssText: [
                    '.WPA-CONFIRM { z-index:2147483647; min-width:400px; min-height:105px; width:auto!important; height:auto!important; width:400px; height:105px; margin:0; padding:12px 8px 30px 18px; border:1px solid #3473a3; border-radius:3px; background-color:#f9fcff;}',
                    '.WPA-CONFIRM-TITLE { height:12px; margin:0; padding:0; line-height:12px; color:#234864; font-weight:bold; font-size:12px;}',
                    '.WPA-CONFIRM-CONTENT { margin:0; padding:19px 10px 0 0; line-height:19px; color:#234864; font-size:12px;}',
                    '.WPA-CONFIRM-PANEL { position:absolute; right:8px; bottom:8px; margin:0; padding:0; text-align:right;}',
                    '.WPA-CONFIRM-BUTTON { position:relative; display:inline-block!important; display:inline; zoom:1; min-width:62px; height:22px; margin:0 0 0 5px; padding:0 4px; background:url(http://cdn.b.qq.com/account/bizqq/images/wpa/wpa_confirm_sprites.png) repeat-x 0 -163px; line-height:22px; color:#234864; text-decoration:none; font-size:12px; text-align:center;}',
                    '.WPA-CONFIRM-BUTTON:hover { background-position:0 -207px; text-decoration:none; color:##234864;}',
                    '.WPA-CONFIRM-BUTTON:active { background-position:0 -251px; text-decoration:none; color:##234864;}',
                    '.WPA-CONFIRM-BUTTON-FOCUS { background-position:0 -31px;}',
                    '.WPA-CONFIRM-BUTTON-FOCUS:hover { background-position:0 -75px;}',
                    '.WPA-CONFIRM-BUTTON-FOCUS:active { background-position:0 -119px;}',
                    '.WPA-CONFIRM-BUTTON-PADDING { position:absolute; left:0; top:0; display:inline-block!important; display:inline; zoom:1; width:4px; height:22px; background:url(http://cdn.b.qq.com/account/bizqq/images/wpa/wpa_confirm_sprites.png) no-repeat 0 -141px;}',
                    '.WPA-CONFIRM-BUTTON:hover .WPA-CONFIRM-BUTTON-PADDING { background-position:0 -185px;}',
                    '.WPA-CONFIRM-BUTTON:active .WPA-CONFIRM-BUTTON-PADDING { background-position:0 -229px;}',
                    '.WPA-CONFIRM-BUTTON-FOCUS .WPA-CONFIRM-BUTTON-PADDING { background-position:0 -9px;}',
                    '.WPA-CONFIRM-BUTTON-FOCUS:hover .WPA-CONFIRM-BUTTON-PADDING { background-position:0 -53px;}',
                    '.WPA-CONFIRM-BUTTON-FOCUS:active .WPA-CONFIRM-BUTTON-PADDING { background-position:0 -97px;}',
                    '.WPA-CONFIRM-BUTTON-RIGHT { left:auto; right:0; background-position:-5px -141px;}',
                    '.WPA-CONFIRM-BUTTON:hover .WPA-CONFIRM-BUTTON-RIGHT { background-position:-5px -185px;}',
                    '.WPA-CONFIRM-BUTTON:active .WPA-CONFIRM-BUTTON-RIGHT { background-position:-5px -229px;}',
                    '.WPA-CONFIRM-BUTTON-FOCUS .WPA-CONFIRM-BUTTON-RIGHT { background-position:-5px -9px;}',
                    '.WPA-CONFIRM-BUTTON-FOCUS:hover .WPA-CONFIRM-BUTTON-RIGHT { background-position:-5px -53px;}',
                    '.WPA-CONFIRM-BUTTON-FOCUS:active .WPA-CONFIRM-BUTTON-RIGHT { background-position:-5px -97px;}'
                ].join(''),

                // default buttons
                buttons: [
                    {
                        isFocus: true,
                        text: '\u786E\u8BA4', //确认
                        events: {
                            click: function(){
                                this.remove();
                            }
                        }
                    },
                    {
                        text: '\u53D6\u6D88', //取消
                        events: {
                            click: function(){
                                this.remove();
                            }
                        }
                    }
                ],

                // use modal or not
                modal: true
            };

            // add confirm style to page
            Style.add('_WPA_CONFIRM_STYLE', SETTINGS.cssText);

            /**
             * Panel constructor
             * @constructor
             */
            var Panel = function(opts){
                this.opts = opts;
                this.render();
            };

            Panel.prototype = {
                render: function(){
                    var confirm = this,
                        opts = this.opts,
                        body = this.container = opts.container || document.getElementsByTagName('body')[0];

                    // template handler
                    var frameHTML = opts.template || SETTINGS.template,
                        buttonReplaceID = 'WPA_BUTTONS_PLACE' + (+new Date() % 100) + Math.floor(Math.random() * 100);
                    frameHTML = frameHTML.replace(/<%=title%>/g, opts.title || '')
                                        .replace(/<%=content%>/g, opts.content || '')
                                        .replace(/<%=buttons%>/g, '<div id="' + buttonReplaceID + '"></div>');

                    // create dom element
                    var frag = document.createElement('div'),
                        frame;
                    frag.innerHTML = frameHTML;
                    this.$el = frame = frag.firstChild;

                    // insert into dom
                    (function(){
                        try{
                            body.appendChild(frame);
                        } catch(e){
                            setTimeout(arguments.callee, 1);
                            return;
                        }

                        // when frame is inserted into dom

                        // render modal
                        if(opts.modal || SETTINGS.modal){
                            confirm.renderModal();
                        }

                        // render buttons
                        // can't get node when it's still in memory
                        confirm.renderButtons(buttonReplaceID);

                        // set position
                        // only node is in document can we get computedStyles correctly
                        confirm.setCenter();
                    })();
                },

                renderButtons: function(buttonReplaceID){
                    var replaceElement = document.getElementById(buttonReplaceID),
                        parentNode = replaceElement.parentNode;
                    parentNode.removeChild(replaceElement);

                    var buttonOpts = this.opts.buttons || SETTINGS.buttons,
                        buttonTempl = this.opts.buttonTemplate || SETTINGS.buttonTemplate,
                        frag = document.createElement('div'),
                        button, opt, events;

                    for(var i= 0, l=buttonOpts.length; i<l; i++){
                        opt = buttonOpts[i];
                        frag.innerHTML = buttonTempl.replace('<%=text%>', opt.text);
                        button = frag.firstChild;

                        opt.isFocus && styleClass.addClass(button, 'WPA-CONFIRM-BUTTON-FOCUS');

                        // bind events
                        if(opt.events){
                            events = opt.events;
                            for(var type in events){
                                if(events.hasOwnProperty(type)){
                                    addEvent(button, type, proxy(this, events[type]));
                                }
                            }
                        }

                        // insert
                        parentNode.appendChild(button);
                    }
                },

                renderModal: function(){
                    var container = this.container,
                        width = css(container, 'width'),
                        height = css(container, 'height'),
                        overflow = css(container, 'overflow');

                    var modalLayer = document.createElement('div'),
                        styles = {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            zIndex: 2147483647,
                            width: getClientWidth() + 'px',
                            height: getClientHeight() + 'px',
                            backgroundColor: 'black',
                            opacity: 0.3,
                            filter: 'alpha(opacity=30)'
                        };

                    // ie6 or quirk mode css reset
                    var isQuirk = document.compatMode === 'BackCompat';
                    if( (browser.msie && parseInt(browser.version, 10) < 7) || isQuirk){
                        // css reset
                        styles.position = 'absolute';

                        // scroll update
                        setInterval(proxy(modalLayer, function(){
                            this.style.top = getScrollTop() + 'px';
                        }), 128);
                    }

                    css(modalLayer, styles);
                    container.insertBefore(modalLayer, this.$el);
                    this.modal = modalLayer;

                    addEvent(window, 'resize', proxy(modalLayer, function(){
                        css(this, {
                            width: getClientWidth() + 'px',
                            height: getClientHeight() + 'px'
                        });
                    }));
                },

                show: function(){
                    this.css('display', 'block');
                    this.modal && css(this.modal, 'display', 'block');
                    return this;
                },

                hide: function(){
                    this.css('display', 'none');
                    this.modal && css(this.modal, 'display', 'none');
                    return this;
                },

                remove: function(){
                    this.$el.parentNode.removeChild(this.$el);
                    this.modal && this.modal.parentNode.removeChild(this.modal);
                    return this;
                },

                css: function(){
                    var args = [this.$el].concat(Array.prototype.slice.call(arguments));
                    return css.apply(this, args);
                },

                setCenter: function(){
                    // set position to make sure it would not be affected by parent node
                    this.css({
                        position: 'absolute', // make it compatible for ie
                        top: '50%',
                        left: '50%'
                    });

                    // standard mode css reset
                    var styles = {
                        position: 'fixed', // reset to fixed in standard mode
                        marginLeft: '-' + this.outerWidth()/2 + 'px',
                        marginTop: '-' + this.outerHeight()/2 + 'px'
                    };

                    // ie6 or quirk mode css reset
                    var isQuirk = document.compatMode === 'BackCompat';
                    if( (browser.msie && parseInt(browser.version, 10) < 7) || isQuirk){
                        // css reset
                        styles.position = 'absolute';
                        styles.marginTop = 0;
                        var top = styles.top = (getClientHeight() - this.outerHeight())/2;

                        // scroll update
                        setInterval(proxy(this.$el, function(){
                            this.style.top = getScrollTop() + top + 'px';
                        }), 128);
                    }

                    // batch set styles
                    this.css(styles);
                },

                outerWidth: function(){
                    return this.$el.offsetWidth;
                },

                outerHeight: function(){
                    return this.$el.offsetHeight;
                }
            };

            return Panel;
        }();

        //add script to page
        var Plugin;
        (function(){
            Plugin = {
                add: function(url){
                    var script = document.createElement('script');
                    script.src = url;
                    document.getElementsByTagName('head')[0].appendChild(script);
                }
            };
        })();

        /**
         * @Class TaskManager
         * Manage scheduled tasks, with one timer and performance optimization
         */
        var TaskManager;
        (function(){
            //requestAnimationFrame will stop functioning when page is out of vision
            /**
             * requestAnimationFrame
             */
            /*
            var timer = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (fn) { setTimeout(fn, 13);};
            */

            var TASK_RUN = 'run', //task state: running
                TASK_PAUSE = 'pause', //task state: pauseed
                TASK_DROP = 'drop', //task state: to be dropped
                LOOP_TIME = 500; //execution time in a loop

            var TM = function(){
                this.circle = [];
                this.pos = 0;
                setInterval(proxy(this, this.loop), 16);
            };

            TM.prototype = {
                //factory mode, create task an instance
                newTask: function(fn, gap){
                    var t = new Task(fn, gap);
                    this.circle.push(t);
                    return t;
                },

                //create once job
                once: function(fn, gap){
                    return this.newTask(function(){
                        fn.apply(this);
                        this.drop();
                    }, gap);
                },

                //main loop, execute tasks in sequence and stop when loop time is up
                loop: function(){
                    var c = this.circle,
                        pos = this.pos,
                        count = c.length,
                        start = now(),
                        loopTime = LOOP_TIME,
                        t = c[pos];

                    while(count > 0 && now() - start < loopTime){
                        if(t.isRunning()){
                            t.execute();
                        } else if(t.isDropped()){
                            c.splice(pos, 1);
                            pos--;
                        }

                        pos = (pos + 1) % c.length;
                        t = c[pos];
                        count--;
                    }

                    this.pos = pos;
                }
            };

            /*
             * @Class Task
             * a task is a function to be executed every certain time
             */
            var Task = function(fn, gap){
                this.fn = fn;
                this.gap = gap;
                this.status = TASK_PAUSE;
                this.lastExecTime = now();
            };

            Task.prototype = {
                run: function(){
                    this.status = TASK_RUN;
                    return this;
                },

                pause: function(){
                    this.status = TASK_PAUSE;
                    return this;
                },

                drop: function(){
                    this.status = TASK_DROP;
                    return this;
                },

                execute: function(){
                    if(now() - this.lastExecTime < this.gap){
                        return false;
                    }

                    this.fn();
                    this.lastExecTime = now();
                    return true;
                },

                getGap: function(){
                    return this.gap;
                },

                setGap: function(newGap){
                    this.gap = newGap;
                    return this;
                },

                isRunning: function(){
                    return this.status === TASK_RUN;
                },

                isPaused: function(){
                    return this.status === TASK_PAUSE;
                },

                isDropped: function(){
                    return this.status === TASK_DROP;
                }
            };

            TaskManager = new TM();
        })();

        //method for flashing title
        var titleFlash;
        (function(document){
            var title = document.title,
                task = TaskManager.newTask(function(){
                    var t = document.title;
                    document.title = t.substr(1, t.length) + t.substr(0, 1);
                }, TITLE_FLASH_GAP);

            titleFlash = {
                on: function(msg){
                    //add msg before original title
                    document.title = msg + ('' + document.title);
                    task.run();
                },
                off: function(){
                    task.pause();
                    document.title = title;
                }
            }
        })(document);

        var pad = function(str, pad, length, isLeft){
            var padLength = length - str.length,
                i;

            if(isLeft === false){
                for(i=0; i<padLength; i++){
                    str += pad;
                }
            } else {
                for(i=0; i<padLength; i++){
                    str = pad + str;
                }
            }

            return str;
        };

        var Bits = function(){
            var setChar = function(str, index, newChar){
                return str.replace(new RegExp('(^[\\d]{' + index + '})\\d'), '$1#' + newChar).replace('#', '');
            };

            var Bits = function(bits){
                this.bits = bits;
            };

            Bits.prototype = {
                pad: function(pad, length, isLeft){
                    var args = Array.prototype.slice.call(arguments);
                    this.bits = pad.apply(this, [this.bits].concat(args));
                    return this;
                },

                padLeft: function(){
                    return proxy(this, this.pad);
                },

                padRight: function(){
                    var args = Array.prototype.slice.call(arguments).push(false);
                    return this.pad.apply(this, args);
                },

                getChar: function(index){
                    return this.bits.charAt(index);
                },

                setChar: function(index, value){
                    this.bits = setChar(this.bits, index, value);
                    return this;
                },

                reverse: function(){
                    var bits = this.bits,
                        length = bits.length;

                    for(var i=0; i<length; i++){
                        this.setChar(i, parseInt(bits[i], 2) ^ 1);
                    }

                    return this;
                }
            };

            return Bits;
        }();

        // get QQ version
        // hard dependence on browser
        var getQQVersion =  function(browser){
            // for cache
            // version = null means can't get version
            var version;

            return getVersion = function(callback){
                if(typeof version !== 'undefined'){
                    callback(version);
                    return;
                }

                // for IE, invoke activeX
                if(browser.msie){
                    try{
                        var xmlhttp = new ActiveXObject("TimwpDll.TimwpCheck");
                        version = xmlhttp.GetHummerQQVersion();
                    } catch(e){
                        version = null;
                    }

                    callback(version);
                    return;
                }

                //for webkit and firefox
                if(browser.mozilla || browser.webkit){
                    // browser plugin is limited in qq.com domain
                    // so load embed tag in a iframe to break through
                    var body = document.getElementsByTagName('body')[0],
                        iframe = document.createElement('iframe'),
                        proxyPage = 'http://cdn.b.qq.com/account/bizqq/wpa/getQQVersion.html';

                    iframe.style.display = 'none';
                    addEvent(window, 'message', function(event){
                        if(event.origin !== 'http://cdn.b.qq.com'){
                            return;
                        }

                        version = event.data;
                        callback(version);
                        removeEvent(window, 'message', arguments.callee);
                        iframe.parentNode.removeChild(iframe);
                    });

                    iframe.src = proxyPage;
                    body.insertBefore(iframe, body.firstChild);

                    return;
                }

                version = null;
                callback(version);
            };
        }(browser);

        var WPAManager;
        (function(){
            // templates for all WPAs
            var settings = {
                'a01': {
                    templ: '<div id="wpa_release_a01" class="wpa_release_a01"><a id="launchBtn" href="javascript:;"></a></div>',
                    script: 'js/wpa_a01',
                    style: 'css/wpa',
                    init: function(context, helper){
                        // innerText is not supported in firefox
                        context.getElementById('launchBtn').innerHTML = helper.xssFilter(helper.params['btn1']);
                        helper.getOnlineStatus();

                        //绑定事件
                        helper.addEvent(context.getElementById('launchBtn'), 'click', helper.proxy(helper, helper.chat));
                    }
                },
                'a02': {
                    templ: '<div id="wpa_release_a02" class="wpa_release_a02"><a id="launchBtn" href="javascript:;"></a></div>',
                    script: 'js/wpa_a02',
                    style: 'css/wpa',
                    init: function(context, helper){
                        context.getElementById('launchBtn').innerHTML = helper.xssFilter(helper.params['btn1']);
                        helper.getOnlineStatus();

                        //绑定事件
                        helper.addEvent(context.getElementById('launchBtn'), 'click', helper.proxy(helper, helper.chat));
                    }
                },
                'a03': {
                    templ: '<div id="wpa_release_a03" class="wpa_release_a03"><a id="launchBtn" href="javascript:;"></a></div>',
                    script: 'js/wpa_a03',
                    style: 'css/wpa',
                    init: function(context, helper){
                        context.getElementById('launchBtn').innerHTML = '\u533F\u540D\u4EA4\u8C08'; //匿名交谈
                        helper.getOnlineStatus();

                        //绑定事件
                        helper.addEvent(context.getElementById('launchBtn'), 'click', helper.proxy(helper, helper.chat));

                        //anonymous type should get config for click, to avoid block of window.open
                        helper.wpa.getConfig();
                    }
                },
                'a04': {
                    templ: '<div id="wpa_release_a04" class="wpa_release_a04"><a id="launchBtn" href="javascript:;"></a></div>',
                    script: 'js/wpa_a04',
                    style: 'css/wpa',
                    init: function(context, helper){
                        context.getElementById('launchBtn').innerHTML = helper.xssFilter(helper.params['btn1']);
                        helper.getOnlineStatus();

                        //绑定事件
                        helper.addEvent(context.getElementById('launchBtn'), 'click', helper.proxy(helper, helper.chat));
                    }
                },
                'a05': {
                    templ: '<div id="wpa_release_a05" class="wpa_release_a05"><a id="launchBtn" href="javascript:;"></a></div>',
                    script: 'js/wpa_a05',
                    style: 'css/wpa',
                    init: function(context, helper){
                        context.getElementById('launchBtn').innerHTML = helper.xssFilter(helper.params['btn1']);
                        helper.getOnlineStatus();

                        //绑定事件
                        helper.addEvent(context.getElementById('launchBtn'), 'click', helper.proxy(helper, helper.chat));
                    }
                },
                'a06': {
                    templ: '<div id="wpa_release_a06" class="wpa_release_a06"><a id="launchBtn" href="javascript:;"></a></div>',
                    script: 'js/wpa_a06',
                    style: 'css/wpa',
                    init: function(context, helper){
                        context.getElementById('launchBtn').innerHTML = helper.xssFilter(helper.params['btn1']);
                        helper.getOnlineStatus();

                        //绑定事件
                        helper.addEvent(context.getElementById('launchBtn'), 'click', helper.proxy(helper, helper.chat));
                    }
                },
                'a07': {
                    templ: '<div id="wpa_release_a07" class="wpa_release_a07 wpa_release_a07_01"><div><table><tr><td valign="middle" id="btn"></td></tr></table></div></div>',
                    script: 'js/wpa_a07',
                    style: 'css/wpa',
                    init: function(context, helper){
                        context.getElementById('btn').innerHTML = helper.xssFilter(helper.params['btn1']);

                        //获取头像风格
                        helper.addClass(context.getElementById('wpa_release_a07'), 'wpa_release_a07_0' + parseInt(helper.params['tx'], 10));

                        helper.getOnlineStatus();

                        //绑定事件
                        helper.addEvent(context.getElementById('wpa_release_a07'), 'click', helper.proxy(helper, helper.chat));
                    }
                },
                'a08': {
                    templ: '<div id="wpa_release_a08" class="wpa_release_a08 wpa_release_a08_01"><div><table><tr><td valign="middle" id="launchBtn"></td></tr></table></div></div>',
                    script: 'js/wpa_a08',
                    style: 'css/wpa',
                    init: function(context, helper){
                        context.getElementById('launchBtn').innerHTML = helper.xssFilter(helper.params['btn1']);

                        //获取头像风格
                        helper.addClass(context.getElementById('wpa_release_a08'), 'wpa_release_a08_0' + parseInt(helper.params['tx'], 10));

                        helper.getOnlineStatus();

                        //绑定事件
                        helper.addEvent(context.getElementById('wpa_release_a08'), 'click', helper.proxy(helper, helper.chat));
                    }
                },
                'a09': {
                    templ: '<div id="wpa_release_a09" class="wpa_release_a09 wpa_release_a09_01"><a id="wpa_release_a09_btn" href="javascript:;"><span class="wpa_release_a09_c_s1" id="wpa_release_a09_c_s1"></span><br /><span class="wpa_release_a09_c_s2" id="wpa_release_a09_c_s2"></span></a></div>',
                    script: 'js/wpa_a09',
                    style: 'css/wpa',
                    init: function(context, helper){
                        context.getElementById('wpa_release_a09_c_s1').innerHTML = helper.xssFilter(helper.params['btn1']);
                        context.getElementById('wpa_release_a09_c_s2').innerHTML = helper.xssFilter(helper.params['btn2']);

                        //获取头像风格
                        helper.addClass(context.getElementById('wpa_release_a09'), 'wpa_release_a09_0' + parseInt(helper.params['tx'], 10));

                        helper.getOnlineStatus();

                        //绑定事件
                        helper.addEvent(context.getElementById('wpa_release_a09'), 'click', helper.proxy(helper, helper.chat));
                    }
                },
                'b01': {
                    templ: [
                        '<div id="wpa_release_b01" class="wpa_release_b01 wpa_release_b01_01">',
                            '<div id="wpa_release_b01_title" class="wpa_release_b01_title"></div>',
                            '<div id="wpa_release_b01_content" class="wpa_release_b01_content"></div>',
                            '<div id="wpa_release_b01_btn_box" class="wpa_release_b01_btn_box"><a id="wpa_release_b01_btn" href="javascript:;"></a></div>',
                        '</div>'
                    ].join(''),
                    script: 'js/wpa_b01',
                    style: 'css/wpa',
                    init: function(context, helper){
                        context.getElementById('wpa_release_b01_btn').innerHTML = helper.xssFilter(helper.params['btn1']);
                        context.getElementById('wpa_release_b01_title').innerHTML = helper.xssFilter(helper.params['title']);

                        //获取头像风格
                        var tx = decodeURIComponent(helper.params['tx']);
                        if(tx.indexOf('http') === -1){
                            //normal tx
                            tx = /^https/.test(window.location.href) ?
                                'https://id.b.qq.com/static/account/bizqq/images/wpa/wpa_tx_0' +  tx + '.jpg' ://for preview
                                'http://cdn.b.qq.com/account/bizqq/images/wpa/wpa_tx_0' +  tx + '.jpg';
                        }
                        context.getElementById('wpa_release_b01_content').innerHTML = '<img src="' + helper.xssFilter(tx) + '" alt="' + helper.xssFilter(helper.params['title']) + '" />';
                        helper.addClass(context.getElementById('wpa_release_b01'), 'wpa_release_b01_0' + parseInt(helper.params['csty'], 10));

                        //绑定事件
                        helper.addEvent(context.getElementById('wpa_release_b01_btn'), 'click', helper.proxy(helper, helper.chat));
                    }
                },
                'b02': {
                    templ: [
                        '<div id="wpa_release_b02" class="wpa_release_b02 wpa_release_b02_01">',
                            '<div class="wpa_release_b02_title"><span id="wpa_release_b02_title"></span></div>',
                            '<div id="wpa_release_b02_content" class="wpa_release_b02_content">',
                                '<div id="wpa_release_b02_c_lc" class="wpa_release_b02_c_lc"></div>',
                                '<div id="wpa_release_b02_c_rc" class="wpa_release_b02_c_rc"></div>',
                            '</div>',
                            '<div id="wpa_release_b02_btn_box" class="wpa_release_b02_btn_box"><a id="wpa_release_b02_btn_yes" class="wpa_release_b02_btn_yes" href="javascript:;"></a><a id="wpa_release_b02_btn_no" class="wpa_release_b02_btn_no" href="javascript:;"></a></div>',
                            '<div id="closeBtn" class="closeBtn"></div>',
                        '</div>'
                    ].join(''),
                    script: 'js/wpa_b02',
                    style: 'css/wpa',
                    init: function(context, helper){
                        var params = helper.params,
                            btn1 = params['btn1'] || '',
                            btn2 = params['btn2'] || '',
                            title = params['title'] || '',
                            cot = params['cot'] || '',
                            wpa_release_b02 = context.getElementById('wpa_release_b02'),
                            wpa_release_b02_title = context.getElementById('wpa_release_b02_title'),
                        //wpa_release_b02_btn_close = doc.getElementById('wpa_release_b02_btn_close'),
                            wpa_release_b02_c_lc = context.getElementById('wpa_release_b02_c_lc'),
                            wpa_release_b02_c_rc  = context.getElementById('wpa_release_b02_c_rc'),
                            wpa_release_b02_btn_yes = context.getElementById('wpa_release_b02_btn_yes'),
                            wpa_release_b02_btn_no = context.getElementById('wpa_release_b02_btn_no'),
                            closeBtn = context.getElementById('closeBtn');

                        //填充内容
                        wpa_release_b02_title.innerHTML = helper.xssFilter(title);
                        wpa_release_b02_c_rc.innerHTML = helper.xssFilter(cot).replace(/\n/g, '<br />');
                        wpa_release_b02_btn_yes.innerHTML = helper.xssFilter(btn1);
                        wpa_release_b02_btn_no.innerHTML = helper.xssFilter(btn2);

                        //获取头像风格
                        var tx = decodeURIComponent(params['tx']);
                        if(tx.indexOf('http') === -1){
                            //normal tx
                            tx = /^https/.test(window.location.href) ?
                                'https://id.b.qq.com/static/account/bizqq/images/wpa/wpa_tx_0' +  tx + '.jpg' ://for preview
                                'http://cdn.b.qq.com/account/bizqq/images/wpa/wpa_tx_0' +  tx + '.jpg';
                        }
                        wpa_release_b02_c_lc.innerHTML = '<img src="' + helper.xssFilter(tx) + '" alt="' + helper.xssFilter(title) + '" />';
                        helper.addClass(wpa_release_b02, 'wpa_release_b02_0' + parseInt(helper.params['csty'], 10));

                        //绑定事件
                        helper.addEvent(wpa_release_b02_btn_yes, 'click', helper.proxy(helper, helper.chat));
                        helper.addEvent(wpa_release_b02_btn_no, 'click', helper.proxy(helper, helper.remove));
                        helper.addEvent(closeBtn, 'click', helper.proxy(helper, helper.remove));
                    }
                },
                'b03': {
                    templ: [
                        '<div id="wpa_release_b03" class="wpa_release_b03 wpa_release_b03_01">',
                            '<div class="wpa_release_b03_title"><span id="wpa_release_b03_title"></span></div>',
                            '<div id="wpa_release_b03_content" class="wpa_release_b03_content">',
                                '<p id="wpa_release_b03_c_1" class="wpa_release_b03_c_1"></p>',
                                '<p id="wpa_release_b03_c_2" class="wpa_release_b03_c_2"></p>',
                            '</div>',
                            '<div id="wpa_release_b03_btn_box" class="wpa_release_b03_btn_box"><a id="wpa_release_b03_btn_yes" class="wpa_release_b03_btn_yes" href="javascript:;"></a><a id="wpa_release_b03_btn_no" class="wpa_release_b03_btn_no" href="javascript:;"></a></div>',
                            '<div id="closeBtn" class="closeBtn"></div>',
                        '</div>'
                    ].join(''),
                    script: 'js/wpa_b03',
                    style: 'css/wpa',
                    init: function(context, helper){
                        var params = helper.params,
                            btn1 = params['btn1'] || '',
                            btn2 = params['btn2'] || '',
                            title = params['title'] || '',
                            cot1 = params['cot1'] || '',
                            cot2 = params['cot2'] || '',
                            wpa_release_b03 = context.getElementById('wpa_release_b03'),
                            wpa_release_b03_title = context.getElementById('wpa_release_b03_title'),
                        //wpa_release_b03_btn_close = document.getElementById('wpa_release_b03_btn_close'),
                            wpa_release_b03_c_1  = context.getElementById('wpa_release_b03_c_1'),
                            wpa_release_b03_c_2 = context.getElementById('wpa_release_b03_c_2'),
                            wpa_release_b03_btn_yes = context.getElementById('wpa_release_b03_btn_yes'),
                            wpa_release_b03_btn_no = context.getElementById('wpa_release_b03_btn_no'),
                            closeBtn = context.getElementById('closeBtn');

                        //填充内容
                        wpa_release_b03_title.innerHTML = helper.xssFilter(title);
                        wpa_release_b03_c_1.innerHTML = helper.xssFilter(cot1);
                        wpa_release_b03_c_2.innerHTML = helper.xssFilter(cot2);
                        wpa_release_b03_btn_yes.innerHTML = helper.xssFilter(btn1);
                        wpa_release_b03_btn_no.innerHTML = helper.xssFilter(btn2);

                        //获取头像风格
                        helper.addClass(wpa_release_b03, 'wpa_release_b03_0' + parseInt(helper.params['tx'], 10));

                        //绑定事件
                        helper.addEvent(wpa_release_b03_btn_yes, 'click', helper.proxy(helper, helper.chat));
                        helper.addEvent(wpa_release_b03_btn_no, 'click', helper.proxy(helper, helper.remove));
                        helper.addEvent(closeBtn, 'click', helper.proxy(helper, helper.remove));
                    }
                },
                'b04': {
                    templ: [
                        '<div id="wpa_release_b04" class="wpa_release_b04 wpa_release_b04_01">',
                            '<div class="wpa_release_b04_title"><span id="wpa_release_b04_title"></span></div>',
                            '<div id="wpa_release_b04_content" class="wpa_release_b04_content">',
                                '<p id="wpa_release_b04_c_1" class="wpa_release_b04_c_1"></p>',
                                '<p id="wpa_release_b04_c_2" class="wpa_release_b04_c_2"></p>',
                            '</div>',
                            '<div id="wpa_release_b04_btn_box" class="wpa_release_b04_btn_box"><a id="wpa_release_b04_btn" class="wpa_release_b04_btn" href="javascript:;"></a></div>',
                            '<div id="closeBtn" class="closeBtn"></div>',
                        '</div>'
                    ].join(''),
                    script: 'js/wpa_b04',
                    style: 'css/wpa',
                    init: function(context, helper){
                        var params = helper.params,
                            kfuin = params['kfuin'] || '',
                            title = params['title'] || '',
                            cot1 = params['cot1'] || '',
                            btn1 = params['btn1'] || '',
                            wpa_release_b04 = context.getElementById('wpa_release_b04'),
                            wpa_release_b04_title = context.getElementById('wpa_release_b04_title'),
                        //wpa_release_b04_btn_close = doc.getElementById('wpa_release_b04_btn_close'),
                            wpa_release_b04_c_1  = context.getElementById('wpa_release_b04_c_1'),
                            wpa_release_b04_c_2 = context.getElementById('wpa_release_b04_c_2'),
                            wpa_release_b04_btn = context.getElementById('wpa_release_b04_btn'),
                            closeBtn = context.getElementById('closeBtn');

                        //填充内容
                        wpa_release_b04_title.innerHTML = helper.xssFilter(kfuin);
                        wpa_release_b04_c_1.innerHTML = helper.xssFilter(title);
                        wpa_release_b04_c_2.innerHTML = helper.xssFilter(cot1).replace(/\n/g, '<br />');
                        wpa_release_b04_btn.innerHTML = helper.xssFilter(btn1);

                        //获取头像风格
                        helper.addClass(wpa_release_b04, 'wpa_release_b04_0' + parseInt(helper.params['tx'], 10));

                        //绑定事件
                        helper.addEvent(wpa_release_b04_btn, 'click', helper.proxy(helper, helper.chat));
                        helper.addEvent(closeBtn, 'click', helper.proxy(helper, helper.remove));
                    }
                },
                'i01': {
                    templ: [
                        '<div id="wpa_release_i01" class="wpa_release_i01">',
                            '<div class="bg"></div>',
                            '<a id="wpa_release_i01_closeBtn" class="wpa_release_i01_closeBtn" href="javascript:;">close</a>',
                            '<a id="wpa_release_i01_confirmBtn" class="wpa_release_i01_confirmBtn" href="javascript:;">' + '\u5F00\u59CB\u4EA4\u8C08' + '</a>', //开始交谈
                            '<p id="cnt" class="cnt">' + '\u60A8\u597D\uFF0C\u8BF7\u6709\u4EC0\u4E48\u53EF\u4EE5\u5E2E\u5230\u60A8\uFF1F\u8BF7\u63A5\u53D7\u804A\u5929\u9080\u8BF7\u3002' + '</p>', //您好，请问有什么可以帮到您？请接受聊天邀请。
                            '<div id="closeBtn" class="closeBtn"></div>',
                        '</div>'
                    ].join(''),
                    script: 'js/wpa_i01',
                    style: 'css/wpa',
                    init: function(context, helper){
                        var closeBtn = context.getElementById('closeBtn'),
                            chatBtn = context.getElementById('wpa_release_i01_confirmBtn');

                        context.getElementById('cnt').innerHTML = helper.xssFilter(helper.params['msg']);

                        //绑定事件
                        helper.addEvent(closeBtn, 'click', helper.proxy(helper, function(){
                            this.remove();
                            titleFlash.off();

                            report('http://visitor.crm2.qq.com/cgi/visitorcgi/ajax/reject_invite.php?nameAccount=' + this.params.nameAccount + '&uid=' + uid);
                        }));
                        helper.addEvent(chatBtn, 'click', helper.proxy(helper, function(){
                            this.chat();
                            this.remove();
                            titleFlash.off();

                            report('http://visitor.crm2.qq.com/cgi/visitorcgi/ajax/accept_invite.php?nameAccount=' + this.params.nameAccount + '&uid=' + uid);
                        }));
                    }
                },
                'w01': {
                    templ: '<div id="wpa_release_w01" class="wpa_release_w01"><a id="wpa_release_w01_btn" href="javascript:;"></a></div>',
                    script: 'js/wpa_w01',
                    style: 'css/wpa',
                    init: function(context, helper){
                        context.getElementById('launchBtn').innerHTML = helper.xssFilter(helper.params['btn1']);
                        helper.getOnlineStatus();

                        //绑定事件
                        helper.addEvent(context.getElementById('launchBtn'), 'click', helper.proxy(helper, helper.chat));
                    }
                },
                'w02': {
                    templ: '<div id="wpa_release_w02" class="wpa_release_w02"><a id="wpa_release_w02_btn" href="javascript:;"></a></div>',
                    script: 'js/wpa_w02',
                    style: 'css/wpa',
                    init: function(context, helper){
                        context.getElementById('launchBtn').innerHTML = helper.xssFilter(helper.params['btn1']);
                        helper.getOnlineStatus();

                        //绑定事件
                        helper.addEvent(context.getElementById('launchBtn'), 'click', helper.proxy(helper, helper.chat));
                    }
                }
            };

            // wpa view helper
            var ViewHelper = function( context, wpa ){
                this.doc = context.document;
                this.wpa = wpa;
                this.params = wpa.params;

                this.params['tx'] && (this.params['tx'] = this.txFilter(this.params['tx']));
            };

            ViewHelper.prototype = {
                getJSONP: getJSONP,

                proxy: proxy,

                onLoad: onLoad,

                /**
                 * 上报Performance timing数据；
                 * 如果某个时间点花费时间为0，则此时间点数据不上报。
                 *
                 * @param {String}
                 *            f1 flag1简写，测速系统中的业务ID，譬如校友业务为164
                 *
                 * @param {String}
                 *            f2 flag2简写，测速的站点ID
                 *
                 * @param {String}
                 *            f3_ie flag3简写，测速的页面ID
                 *（因为使用过程中我们发现IE9的某些数据存在异常，
                 * 如果IE9和chrome合并统计，会影响分析结果，所以这里建议分开统计）
                 *
                 * @param {String}
                 *            f3_c flag3简写，测速的页面ID
                 * （如果为空，则IE9和chrome合并统计）
                 *
                 */
                setTimingRpt: function(f1, f2, f3_ie, f3_c){

                    var _t, _p = window.performance || window.webkitPerformance || window.msPerformance, _ta = ["navigationStart","unloadEventStart","unloadEventEnd","redirectStart","redirectEnd","fetchStart","domainLookupStart","domainLookupEnd","connectStart","connectEnd","requestStart",/*10*/"responseStart","responseEnd","domLoading","domInteractive","domContentLoadedEventStart","domContentLoadedEventEnd","domComplete","loadEventStart","loadEventEnd"], _da = [], _t0, _tmp, f3 = f3_ie;

                    if (_p && (_t = _p.timing)) {

                        if (typeof(_t.msFirstPaint) != 'undefined') {	//ie9
                            _ta.push('msFirstPaint');
                        } else {
                            if (f3_c) {
                                f3 = f3_c;
                            }
                        }

                        _t0 = _t[_ta[0]];
                        for (var i = 1, l = _ta.length; i < l; i++) {
                            _tmp = _t[_ta[i]];
                            _tmp = (_tmp ? (_tmp - _t0) : 0);
                            if (_tmp > 0) {
                                _da.push( i + '=' + _tmp);
                            }
                        }

                        if (window.d0) {//统计页面初始化时的d0时间
                            _da.push('30=' + (window.d0 - _t0));
                        }

                        var url = 'http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=' + f1 + '&flag2=' + f2 + '&flag3=' + f3 + '&' + _da.join('&');

                        report(url);
                    }

                },

                getOnlineStatus: function(){
                    var helper = this,
                        params = this.params;
                    //指定工号、分组的列表
                    var al = (params.al || params.a);
                    //自动分配时，无需请求在线状态
                    if( !al ){
                        return;
                    }

                    var isPreview = this.doc.location.href.indexOf('https://id.b.qq.com') > -1;
                    var url = isPreview ? 'https://id.b.qq.com/crm/index.php?rr=wpa/kfstatus&isAjax=1' + '&aty=' + params.aty + '&al=' + (params.al || params.a) :
                        'http://crm2.qq.com/cgi/portalcgi/get_kf_status.php?kfuin=' + params.kfuin + '&aty=' + params.aty + '&al=' + al;

                    getJSONP(url,  function(json){
                        var isOffline = json.r === 0 && json.data.list[al] !== 1;
                        isOffline && helper.setOffline();
                    });
                },

                setOffline: function(){
                    this.addClass(this.doc.body, 'offline');
                },

                addClass: styleClass.addClass,

                hasClass: styleClass.hasClass,

                removeClass: styleClass.removeClass,

                addEvent: addEvent,

                xssFilter: function(str){
                    if(!str){
                        return '';
                    }
                    return str.replace(/</g, '&lt;').replace(/>/, '&gt;').replace(/'/g, '&acute;').replace(/"/, '&quot;');
                },

                chat: function(){
                    this.wpa.launchChat();
                },

                remove: function(){
                    this.wpa.remove();
                },

                txFilter: function(tx){
                    if(typeof tx === 'string' && /^https?:\/\/[^\/]+\.qq\.com\/\s+/.test(tx)){
                        return tx;
                    }

                    return parseInt(tx, 10) || 1;
                }
            };

            //for wpa index storage
            var wpas = {},
                kfuinCache = {},
                sidCache = {};

            WPAManager = {
                newWPA: function(params){
                    var kfuin = params.kfuin;
                    if(!kfuin){
                        return false;
                    }

                    var w = new WPA(params);
                    wpas[kfuin] ? wpas[kfuin].push(w) : wpas[kfuin] = [w];
                    return w;
                },
                findInPage: function(kfuin){
                    return wpas[kfuin] !== undefined;
                },
                getParams: function(){
                    var doc = window.document;

                    var script = doc.getElementsByTagName('script');
                    if(!script.length || script.length<1){
                        return false;
                    }

                    script = script[script.length-1];
                    var ps = script.src.substring(script.src.indexOf('?')+1, script.src.length),
                        paramsArr = ps.split('&'),
                        params = {};
                    for(var k=0, p, arr; p=paramsArr[k++];){
                        arr = p.split('=');
                        params[arr[0]] = decodeURIComponent(arr[1]);
                    }

                    //统计页面来源
                    //长度过长需要截断，避免超过浏览器和服务器限制
                    params['referrer'] = doc.referrer.length > 500 ? doc.referrer.substr(0, 500) : doc.referrer;
                    params['cref'] = window.location.href.length > 500 ? window.location.href.substr(0, 500) : window.location.href;
                    params['pt'] = doc.title.length > 500 ? doc.title.substr(0, 500) : doc.title;

                    //kfext
                    if(params['aty'] === '1'){
                        params['kfext'] =  params['a'];
                    }

                    params['kfext'] = params['kfext'] || '';

                    params['dm'] = topDomain;

                    return params;
                },
                invite: function(di, params){
                    if(!di){
                        //【您有新消息】 utf-8编码， 若不转码，在非utf-8页面会引起乱码
                        titleFlash.on('\u3010\u60A8\u6709\u65B0\u4FE1\u606F\u3011');

                        WPAManager.newWPA(params);
                        return;
                    }

                    try{
                        var chat = proxy({params: params}, WPA.prototype.launchChat);
                        window[di] && window[di](chat, params['msg']);
                    }catch(e){
                        // invite wpa is created after initialization, so add uid to it
                        // use event principle would be better
                        WPAManager.newWPA(params);
                    }
                }
            };

            var WPA = function(params){
                this.params = params;
                this.kfuin = this.nameAccount = params.nameAccount = params.kfuin;
                this.wty = params.wty || WPA_TYPE_NORMAL;

                //only if wpa type is normal, wpa will be shown up
                if(this.wty !== WPA_TYPE_NORMAL){
                    return;
                }

                //creat wpa view
                this.render();
            };

            WPA.prototype = {
                getConfig: function(callback){
                    if(this.sp){
                        callback && callback();
                        return;
                    }

                    var wpa = this,
                        configReadyState = new Bits('00'),
                        nameAccount = this.nameAccount,
                        setKfuin = function(kfuin){
                            var params = wpa.params,
                                nameAccount = wpa.nameAccount;

                            wpa.kfuin = params.kfuin = kfuin;

                            // update cache
                            kfuinCache[nameAccount] = kfuin;

                            // updatcallback && callback();e configurations' ready state
                            configReadyState.setChar(0, '1');
                        },
                        setSid = function(sid){
                            wpa.sid = sid;

                            // update cache
                            sidCache[wpa.nameAccount + ':' + topDomain] = sid;

                            // update configurations' ready state
                            configReadyState.setChar(1, '1');

                            // update session parameter
                            setSessionParam();
                        },
                        setSessionParam = function(){
                            // only both configurations are ready can session parameter be created;
                            if(configReadyState.getChar(0) === '0' || configReadyState.getChar(1) === '0'){
                                wpa.sp = '';
                                return;
                            }

                            // session parameter transform
                            // transform uid and sid to hexadecimal and add padding 0 on left side
                            wpa.sp = pad(parseInt(uid, 10).toString(16), '0', 16) + pad(parseInt(wpa.sid || '', 10).toString(16), '0', 16);

                            // 0000
                            // 0001
                            // 9cfd
                            // 4000
                            // 0000
                            // 0000
                            // 0010
                            // ffde
                            console.log('session parameter:' + wpa.sp);
                        };

                    if(kfuinCache[nameAccount]){
                        setKfuin(kfuinCache[nameAccount]);
                    }

                    if(sidCache[nameAccount + ':' + topDomain]){
                        setSid(sidCache[nameAccount]);
                    }

                    if(configReadyState.bits === '11'){
                        callback && callback();
                        return;
                    }

                    var opts = {
                        type: new Bits(configReadyState.bits).reverse().bits,
                        kfuin: nameAccount,
                        nameAccount: nameAccount
                    };

                    if(configReadyState.getChar(1) === '0'){
                        opts.dm = topDomain;
                    }

                    getJSONP('http://crm2.qq.com/cgi/wpacgi/get_wpa_click_params.php', opts, function(rs){
                        if(rs.numRet && rs.numRet.r === 0){
                            var kfuin = (rs.numRet.kfuin || nameAccount) + '';
                            setKfuin(kfuin);
                        }

                        if(rs.taRet && rs.taRet.r === 0){
                            var sid = (rs.taRet.sid || '') + '';
                            setSid(sid);
                        }

                        callback && callback();
                    });
                },

                render: function(){
                    var params = this.params,
                        wid = params['wid'];

                    if(wid){
                        var wElem = document.getElementById(wid),
                            initDefinedWPA = proxy(this, function(wElem){
                                this.wElem = wElem;
                                this.createDefinedWPA();
                            });

                        if(wElem){
                            initDefinedWPA(wElem);
                        } else {
                            onLoad(proxy(this, function(){
                                var wElem = document.getElementById(wid);
                                wElem && initDefinedWPA(wElem);
                            }));
                        }
                        return;
                    }

                    //业务分发器，动态加载当前样式所需的业务js
                    var width, height,
                        type = parseInt(params['type']),
                        typeStr,
                        isFloat = false;

                    switch(type){
                        //浮动层的尺寸
                        case 1: typeStr = 'a01'; width = 102; height = 24; break;
                        case 2: typeStr = 'a02'; width = 102; height = 24; break;
                        case 3: typeStr = 'a03'; width = 84; height = 24; break;
                        case 4: typeStr = 'a04'; width = 120; height = 40; break;
                        case 5: typeStr = 'a05'; width = 126; height = 42; break;
                        case 6: typeStr = 'a06'; width = 126; height = 42; break;
                        case 7: typeStr = 'a07'; width = 174; height = 80; break;
                        case 8: typeStr = 'a08'; width = 174; height = 80; break;
                        case 9: typeStr = 'a09'; width = 230; height = 92; break;
                        case 10: typeStr = 'b01'; width = 106; height = 164; isFloat = true; break;
                        case 11: typeStr = 'b02'; width = 346; height = 164; isFloat = true; break;
                        case 12: typeStr = 'b03'; width = 404; height = 200; isFloat = true; break;
                        case 13: typeStr = 'b04'; width = 138; height = 320; isFloat = true; break;
                        case 20: typeStr = 'i01'; width = 368; height = 192; isFloat = true; break;
                        case 30: typeStr = 'w01'; width = 25; height = 25; break;
                        case 31: typeStr = 'w02'; width = 102; height = 24; break;
                        case 14: typeStr = 'c01'; break;
                    }

                    this.type = typeStr;
                    this.width = width;
                    this.height = height;

                    var wpa = this;
                    this.createWPA(function(){
                        if((type > 9 && type < 14) || type === 20){
                            wpa.initFloatWPA();
                        }
                    });
                },

                // create WPA iframe
                createWPA: function(onCreate){
                    // speed report: start time stamp of view page
                    var speedReport = new SpeedReport('7818', '4', '1');

                    var id = 'iframediv' + now(),
                        wpa = this,
                        type = this.type,
                        width = this.width,
                        height = this.height,
                        setting = settings[type];

                    // if document is ready, stops
                    var readyState = document.readyState;
                        // ie will reject operations when parent's domain is set


                    if(readyState === 'loaded' || readyState === 'complete'){
                        var iframe;
                        try{
                            iframe = document.createElement('<iframe id="' + id + '" scrolling="no" frameborder="0" width="' + width + '" height="' + height + '" allowtransparency="true" src="about:blank"></iframe>');
                        } catch(e) {
                            iframe = document.createElement('iframe');
                            iframe.id = id;
                            iframe.width = width;
                            iframe.height = height;
                            iframe.setAttribute('scrolling', 'no');
                            iframe.setAttribute('frameborder', 0);
                            iframe.setAttribute('allowtransparency', true);
                            iframe.setAttribute('src', 'about:blank');
                        }

                        document.getElementsByTagName('body')[0].appendChild(iframe);
                    } else{
                        document.write('<iframe id="' + id + '" scrolling="no" frameborder="0" width="' + width + '" height="' + height + '" allowtransparency="true" src="about:blank"></iframe>');
                    }

                    var trials = 0;
                    (function(){
                        var iframe = wpa.iframe = document.getElementById(id);
                        if(!iframe){
                            ++trials;
                            trials < 20 && setTimeout(arguments.callee, 50);
                            return;
                        }

                        if(browser.msie){
                            // when domain is set in parent page and blank iframe is not ready, access to it's content is denied in ie
                            try{
                                var accessTest = iframe.contentWindow.document;
                            } catch(e){
                                // Test result shows that access is denied
                                // So reset iframe's document.domain to be the same as parent page
                                iframe.src = 'javascript:void((function(){document.open();document.domain=\''+ document.domain + '\';document.close()})())';
                            }
                        }

                        // set domain in case cross-domain problems in IE
                        var loaded = function(){
                            var iWin = iframe.contentWindow,
                                iDoc = iframe.contentDocument || iWin.document;

                            // add helper for views' initiation
                            var helper = new ViewHelper(iWin, wpa);

                            iDoc.open();
                            iDoc.write([
                                '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
                                '<html xmlns="http://www.w3.org/1999/xhtml">',
                                '<head>',
                                    '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />',
                                    browser.msie && iframe.src !== 'about:blank' ? '<script>document.domain=\'' + document.domain + '\';</script>' : '',
                                '</head>',
                                '<body>',
                                    setting.templ,
                                '</body>',
                                '</html>'
                            ].join(''));
                            iDoc.close();

                            // add stylesheet to iframe
                            Style.load('style', PATH + 'css/wpa.' + (GREY ? 'grey.' : '') + 'css?v=' + VERSION, { context: iDoc});

                            //iDoc.getElementsByTagName('body')[0].innerHTML = setting.templ;

                            setting.init(iDoc, helper);

                            //record time & report
                            var point = GREY ? 4 : 2;
                            speedReport.addPoint(point).send();
                        };

                        if(/loaded|complete|undefined/.test(iframe.readyState)){
                            loaded();
                        } else {
                            var handler = function(){
                                removeEvent(iframe, 'load', handler);
                                loaded();
                            };
                            addEvent(iframe, 'load', handler);
                        }

                        onCreate();
                    })();
                },

                /**
                 * 浮动WPA的iframe加载器，判断目标页面加载成功后再show出来
                 */
                initFloatWPA: function(){
                    //创建浮动层
                    var doc = window.document,
                        params = this.params,
                        type = parseInt(params['type']),
                        iframe = this.iframe,
                        width = this.width,
                        height = this.height;

                    iframe.style.cssText = [
                        'display:none;',
                        'position:absolute;',
                        'z-index:2147483647!important;'
                    ].join(' ');

                    //判断页面是否加载完毕
                    onLoad(initIframeLoad);

                    /**
                    * 对B01、B02、B03、B04 iframe进行处理
                    */
                    function initIframeLoad(){
                        var isty = iframe.style,
                            isIE = browser.msie,
                            ver = parseInt(browser.version, 10),
                            isQuirk = doc.compatMode === 'BackCompat';

                        //非IE6统一使用position:fixed
                        isty.position = parseInt(params['fsty']) == 0 ? 'fixed' : 'absolute';

                        //获取浮动的位置
                        if(parseInt(params['fposX']) == 0){
                            isty.left = 8 + 'px';
                            isty.right = 'auto';
                            isty.marginLeft = 0;
                        }else if(parseInt(params['fposX']) == 1){
                            isty.left = '50%';
                            isty.right = 'auto';
                            isty.marginLeft = '-'+parseInt(width/2) + 'px';
                        }else{
                            isty.left = 'auto';
                            isty.right = 8 + 'px';
                            isty.marginLeft = 0;
                        }
                        if(parseInt(params['fposY']) == 0){
                            isty.top = 8 + 'px';
                            isty.bottom = 'auto';
                            isty.marginTop = 0;
                        }else if(parseInt(params['fposY']) == 1){
                            isty.top = '50%';
                            isty.bottom = 'auto';
                            isty.marginTop = '-'+parseInt(height/2) + 'px';
                        }else{
                            isty.top = 'auto';
                            isty.bottom = 8 + 'px';
                            isty.marginTop = 0;
                        }

                        //对IE6进行特殊处理position:absolute，用setInterval实现滚动跟随
                        if((isIE & ver < 7) || isQuirk){
                            isty.position = 'absolute';
                            if(parseInt(params['fsty']) == 0){
                                //reset
                                isty.marginTop = 0;
                                var itop;

                                if(parseInt(params['fposY']) == 0){
                                    itop = 8;
                                }else if(parseInt(params['fposY']) == 1){
                                    itop = (getClientHeight(doc) - height)/2;
                                }else{
                                    itop = getClientHeight(doc) - height - 8;
                                }

                                setInterval(function(){
                                    isty.top = getScrollTop(doc) + itop + 'px';
                                }, 128);
                            }
                        }

                        isty.display = 'block';
                    }
                },

                createDefinedWPA: function(){
                    addEvent(this.wElem, 'click', proxy(this, this.launchChat));
                },

                remove: function(){
                    var iframe = this.iframe;
                    iframe.parentNode.removeChild(iframe);
                },

                // Chat part
                launchChat: function(){
                    this.getConfig(proxy(this, function(){
                        // Anonymous type
                        if(this.type === 'a03' || !browser.isWindow){
                            this.launchAnonymousChat();
                            return;
                        }

                        var wpa = this;
                        getQQVersion(function(version){
                            if(version){
                                wpa.launchAIOChat();
                                return;
                            }

                            new Panel({
                                title: '\u53D1\u8D77\u4F1A\u8BDD\u63D0\u793A', //发起会话提示
                                content: '\u62B1\u6B49\uFF01\u65E0\u6CD5\u68C0\u6D4B\u5230\u60A8\u7535\u8111\u662F\u5426\u5B89\u88C5QQ\uFF0C\u8BF7\u60A8\u786E\u8BA4\u4EE5\u4FBF\u76F4\u63A5\u5411\u4F01\u4E1A\u53D1\u8D77\u4F1A\u8BDD\u3002', //抱歉！无法检测到您电脑是否安装QQ，请您确认以便直接向企业发起会话。
                                buttons: [
                                    {
                                        isFocus: true,
                                        text: 'QQ\u5DF2\u5B89\u88C5\uFF0C\u70B9\u51FB\u4F1A\u8BDD', //QQ已安装，点击会话
                                        events: {
                                            click: function(){
                                                this.remove();
                                                wpa.launchAIOChat();
                                            }
                                        }
                                    },

                                    {
                                        text: '\u672A\u5B89\u88C5\uFF0C\u53D1\u8D77\u7F51\u9875\u4F1A\u8BDD', //未安装，发起网页会话
                                        events: {
                                            click: function(){
                                                this.remove();
                                                wpa.launchAnonymousChat();
                                            }
                                        }
                                    }
                                ]
                            });
                        });
                    }));
                },

                // Launch PC QQ chat
                launchAIOChat: function(){
                    var iframe = document.createElement('iframe'),
                        body = document.getElementsByTagName('body')[0];
                    iframe.style.display = 'none';
                    body.insertBefore(iframe, body.firstChild);

                    return function(){
                        var params = this.params,
                            kfuin = this.kfuin,
                            opts = {
                                na: params.nameAccount,
                                kfuin: kfuin,
                                aty: params.aty,
                                a: params.a,
                                sid: this.sid || '',
                                uid: uid || '',
                                url: location.href,
                                title: document.title,
                                dm: topDomain
                            },
                            guid = GUID();

                        var sptReport = new SpeedReport('7818','4', '1');

                        getJSONP('http://wpd.b.qq.com/cgi/get_sign.php', opts, function(rs){
                            if(!rs || rs.r !== 0 || !rs.data){
                                return;
                            }

                            iframe.src = rs.data.sign;

                            var clickId = rs.data.clkID;

                            // report log
                            sptReport.addPoint(5).send();
                            report('http://promreport.crm2.qq.com/wpaclick/r.gif?ty=1&kfuin=' + kfuin + '&version=' + VERSION + '&browser=' + encodeURIComponent(navigator.userAgent) + '&bfrom=1&appointType=' + params.aty + '&appoint=' + params.a + '&clkID=' + clickId + '&guid=' + guid);

                            //inform TA
                            window.taClick && window.taClick(clickId, 'clickid');
                        });

                        report('http://promreport.crm2.qq.com/wpaclickorg/r.gif?kfuin=' + kfuin + '&version=' + VERSION + '&browser=' + encodeURIComponent(navigator.userAgent) + '&bfrom=1&appointType=' + params.aty + '&appoint=' + params.a + '&guid=' + guid);
                    }
                }(),

                // Launch anonymous chat
                launchAnonymousChat: function (){
                    var kfuin = this.kfuin,
                        url = "http://webchat.b.qq.com/webchat.htm?sid=" + this.encrypt(this.kfuin.toString());
                    window.open(url, '_blank', 'height=544, width=644,toolbar=no,scrollbars=no,menubar=no,status=no');

                    var params = this.params;
                    report('http://promreport.crm2.qq.com/wpaclick/r.gif?ty=2&kfuin=' + kfuin + '&version=' + VERSION + '&browser=' + encodeURIComponent(navigator.userAgent) + '&bfrom=1&appointType=' + params.aty + '&appoint=' + params.a);
                },

                encrypt: function(n){
                    var ts = "8ABC7DLO5MN6Z9EFGdeJfghijkHIVrstuvwWSTUXYabclmnopqKPQRxyz01234",
                        nl = n.length,
                        t = [],
                        a, b, c, x;

                    var m = function (y) {
                        t[t.length] = ts.charAt(y)
                    };

                    var N = ts.length;

                    var N2 = N * N;

                    var N5 = N * 5;

                    for (x = 0; x < nl; x++) {
                        a = n.charCodeAt(x);
                        if (a < N5) {
                            m(Math.floor(a / N));
                            m(a % N);
                        }
                        else {
                            m(Math.floor(a / N2) + 5);
                            m(Math.floor(a / N) % N);
                            m(a % N);
                        }
                    }
                    var s = t.join("");

                    return String(s.length).length + String(s.length) + s;
                }
            };
        })();

        var Slave;
        (function(){
            Slave = function(kfuin, pvid, cfg){
                //Slave initiation
                this.kfuin = kfuin;
                this.pvid = pvid;
                this.config = cfg;
                this.genID();
                this.storage = new Storage(kfuin);

                //monitor
                this.monitors = {
                    master: TaskManager.newTask(proxy(this, this.masterMonitor), MASTER_MONITOR_GAP).run(),
                    invite: TaskManager.newTask(proxy(this, this.inviteMonitor), INVITE_MONITOR_GAP).run()
                };

                //report slave heart beat
                this.heartBeat = TaskManager.newTask(proxy(this, this.heartBeatProcess), SLAVE_HEARTBEAT_GAP).run();

                //set slave active
                this.setActive();

                //bind focus
                window.onfocus = proxy(this, this.setActive);

                console.log('slave ' + this.id + ' launched!');
            };

            Slave.prototype = {
                genID: function(){
                    //pattern: (uin)slid_xxx_xx
                    this.id = 'slid_' + now()%1000 + '_' + Math.round(Math.random() * 100);
                },
                masterMonitor: function(){
                    if(masters[this.kfuin]){
                        return;
                    }
                    console.log('monitoring mater state');
                    var lastMasterHeartbeat = this.storage.get(MASTER_HEARTBEATS) || 0,
                        gap = now() - parseInt(lastMasterHeartbeat);
                    console.log('gap of master is ' + gap);
                    if(gap > 3 * MASTER_HEATBEAT_GAP){
                        this.recoverMaster();
                    }
                },
                recoverMaster: function(){
                    masters[this.kfuin] = new Master(this.kfuin, this.pvid, this.config);

                    console.log('recover master by slave ' + this.id);
                },
                inviteMonitor: function(){
                    if(this.isInvited()){
                        this.kill();
                    } else if(this.isInviting()){
                        if(this.isActive()){
                            this.invite();
                        }
                    }

                    console.log('slave ' + this.id + ' monitoring invite state');
                },
                kill: function(){
                    //stop tasks
                    this.monitors.invite.drop();
                    this.heartBeat.drop();

                    //recycle storage
                    var storage = this.storage,
                        keys = [this.id];
                    for(var i=0, key; key=keys[i++];){
                        storage.del(key);
                    }

                    console.log('slave ' + this.id + ' killed');
                },
                invite: function(){
                    var kfext = this.storage.get(INVITE_KFEXT);
                    //create invite view
                    var params = {
                        wty: WPA_TYPE_NORMAL,
                        kfuin: this.kfuin,
                        type: WPA_STYLE_TYPE_INVITE,
                        aty: kfext ? (kfext === INVITE_KFEXT_AUTO ? APPOINTED_TYPE_AUTO_INVITE : APPOINTED_TYPE_INVITE) : APPOINTED_TYPE_AUTO_INVITE,
                        a: kfext || '',
                        iv: IS_INVITE_WPA_TRUE,
                        fsty: WPA_FLOAT_TYPE_FIXED,
                        fposX: WPA_FLOAT_POSITION_X_CENTER,
                        fposY: WPA_FLOAT_POSITION_Y_CENTER,
                        sv: SESSION_VERSION_TA,
                        sp: this.pvid,
                        dm: topDomain,
                        msg: this.storage.get(INVITE_MSG)
                    };

                    WPAManager.invite(this.config.di, params);

                    this.storage.set(INVITE_SIGNAL, INVITE_SIGNAL_INVITED);

                    console.log('invited by slave ' + this.id);
                },
                heartBeatProcess: function(){
                    var storage = this.storage,
                        ids = storage.get(SLAVE_IDS);

                    if(!ids){
                        storage.set(SLAVE_IDS, this.id + '|');
                    } else if( ids.indexOf(this.id + '|') === -1){
                        storage.set(SLAVE_IDS, this.id + '|' + ids);
                    }

                    storage.set(this.id, now());
                    console.log('update slave heartbeat ' + this.id);
                },
                setActive: function(){
                    var storage = this.storage,
                        ids = storage.get(SLAVE_IDS) || '',
                        sign = this.id + DATA_SEPERATOR;

                    if(ids.indexOf(this.id) > -1){
                        ids = ids.replace(sign, '');
                    }
                    ids += sign;

                    storage.set(SLAVE_IDS, ids);
                },
                isActive: function(){
                    var slaves = this.storage.get(SLAVE_IDS);
                    if(!slaves){
                        return false;
                    }
                    return slaves.substr(0, slaves.length-1).split(DATA_SEPERATOR).pop() === this.id;
                },
                isInvited: function(){
                    return this.storage.get(INVITE_SIGNAL) === INVITE_SIGNAL_INVITED;
                },
                isInviting: function(){
                    return this.storage.get(INVITE_SIGNAL) === INVITE_SIGNAL_INVITE;
                }
            };
        })();

        var Master;
        (function(){
            Master = function(kfuin, pvid, cfg){
                //Master initiation
                this.kfuin = kfuin;
                this.pvid = pvid;
                this.config = cfg;
                this.storage = new Storage(kfuin);
                this.genID();
                this.sleep = false;

                //report master heart beat
                this.storage.set(MASTER_ID, this.id);
                this.heartBeatProcess();
                this.heartBeat = TaskManager.newTask(proxy(this, this.heartBeatProcess), MASTER_HEATBEAT_GAP).run();

                //get config & start monitor
                this.initWithConfig();

                console.log('master launched!');
            };

            Master.prototype = {
                genID: function(){
                    this.id = now()%1000 + '_' + Math.round(Math.random() * 100);
                },
                setInviteState: function(signal, kfext, msg){
                    if(signal === INVITE_SIGNAL_INVITE){
                        this.storage.set(INVITE_KFEXT, kfext);
                        this.storage.set(INVITE_MSG, msg);
                    }

                    this.storage.set(INVITE_SIGNAL, signal);
                },
                isInvited: function(){
                    var invited = this.storage.get(INVITE_SIGNAL) === INVITE_SIGNAL_INVITED;
                    if(invited){
                        this.recycle();
                        this.isInvited = function(){
                            return true;
                        }
                    }
                    return invited;
                },
                initWithConfig: function(){
                    /*
                     r	错误码，0-成功，其他-失败
                     isAuto	是否开启自动邀请的开关，0-关、1-开
                     autoTime	自动邀请的时间，超过该时间且开关开的情况下，发起邀请
                     gap	下次心跳的时间间隔，如果为空使用默认时间
                     inviteState	是否有主动邀请， 0-未邀请、1-发起邀请、2-已邀请
                     */
                    var cfg = this.config;

                    //fail getting config data
                    if(cfg.r !== RESULT_SUCCESS){ //shouldn't retry, in case of avalanche effect
                        this.storage.set(MASTER_HEARTBEATS, MASTER_HEARTBEATS_ERROR);
                        return;
                    }

                    //set auto invite
                    if(cfg.isAuto === AUTO_INVITE_TRUE){
                        this.storage.set(INVITE_MSG, cfg.autoMsg);
                        this.autoInviteTimer = setTimeout(proxy(this, function(){
                            this.autoInvite();
                        }), cfg.autoTime * 1000);
                    }

                    //launch server & slave monitors
                    this.monitors = {
                        slave: TaskManager.newTask(proxy(this, this.slaveMonitor), SLAVE_HEARTBEAT_GAP).run(),
                        server: TaskManager.newTask(proxy(this, this.serverMonitor), SERVER_MONITOR_GAP_MIN).run(),
                        sleep: TaskManager.newTask(proxy(this, this.sleepMonitor), SERVER_MONITOR_SLEEPCHECK_GAP).run()
                    };

                    console.log('master inited with config');
                },
                autoInvite: function(){
                    //confirm auto invite
                    //local confirm
                    if(this.isInvited()){
                        return;
                    }

                    //remote confirm
                    var opt = {
                            kfuin: this.kfuin,
                            //kfext: this.kfext,
                            uid: this.pvid
                        };

                    // pause heartbeat in case of overwriting invite state while auto-inviting
                    // if heartbeat before a slave get invite state, it will miss the auto-invite
                    var serverMonitor = this.monitors.server;
                    serverMonitor.pause();

                    getJSONP(CONFIRM_AUTO_INVITE_URL, opt, proxy(this, function(rs){
                        if(rs.r !== RESULT_SUCCESS){
                            // auto-invite ends, recover heartbeat
                            serverMonitor.run();
                            return;
                        }

                        if(!this.isInvited()){
                            this.setInviteState(INVITE_SIGNAL_INVITE, INVITE_KFEXT_AUTO, this.storage.get(INVITE_MSG));

                            // delay 5s to recover heartbeat, make sure auto-invite ends
                            TaskManager.once(function(){
                                serverMonitor.run();
                            }, 5000).run();
                        }
                    }));
                },
                ajustServerMonitorGap: function(time){
                    this.monitors.server.setGap(Math.min(Math.max(SERVER_MONITOR_GAP_MIN, time), SERVER_MONITOR_GAP_MAX));
                },
                serverMonitor: function(){
                    var inviteSignal = this.storage.get(INVITE_SIGNAL),
                        url = this.config.hbDomain ? decodeURIComponent(this.config.hbDomain) : HEARTBEAT_URL;

                    if(this.sleep){
                        return false;
                    }

                    var opt = {
                        kfuin: this.kfuin,
                        //kfext: this.kfext,
                        uid: this.pvid
                    };

                    //if inviting or invited, tell server to do less
                    if(inviteSignal === INVITE_SIGNAL_INVITE){
                        opt['inviteState'] = INVITE_STATE_INVITE;
                    }

                    if(inviteSignal === INVITE_SIGNAL_INVITED){
                        opt['inviteState'] = INVITE_STATE_INVITED;
                    }

                    getJSONP(url, opt, proxy(this, function(rs){
                        if(rs.r !== RESULT_SUCCESS){
                            return false;
                        }

                        //automatictly ajust server monitor gap
                        if(rs.gap){
                            this.ajustServerMonitorGap(rs.gap * 1000);
                        }

                        if(rs.inviteState === INVITE_STATE_UNINVITED){
                            return false;
                        }

                        if(rs.inviteState === INVITE_STATE_INVITE){
                            this.setInviteState(INVITE_SIGNAL_INVITE, rs.kfext, rs.inviteMsg);
                            return false;
                        }

                        if(rs.inviteState === INVITE_STATE_INVITED){
                            this.setInviteState(INVITE_SIGNAL_INVITED);
                        }
                    }));

                    console.log(this.kfuin + ' is monitoring server');
                },
                slaveMonitor: function(){
                    if(this.isInvited()){
                        this.monitors.slave.drop();
                    }

                    var storage = this.storage,
                        slaves = storage.get(SLAVE_IDS);
                    if(!slaves) {
                        return;
                    }

                    slaves = slaves.split(DATA_SEPERATOR);
                    var aliveSlaves = '',
                        time = now(),
                        lastSlaveHeartbeat, slave, gap;
                    //check all slaves' state
                    for(var i=0; slave=slaves[i++];){
                        console.log('monitoring slave ' + slave + ' state');
                        lastSlaveHeartbeat = storage.get(slave) || 0;
                        gap = time - parseInt(lastSlaveHeartbeat);
                        console.log('gap of slave ' + slave + ' is ' + gap);
                        if(gap > 5 * SLAVE_HEARTBEAT_GAP){
                            //remove dead slave
                            storage.del(slave);
                            console.log('clear slave ' + slave + ' in storage');
                        } else {
                            aliveSlaves += slave + DATA_SEPERATOR;
                        }
                    }

                    storage.set(SLAVE_IDS, aliveSlaves);
                },
                sleepMonitor: function(){
                    var slaves = this.storage.get(SLAVE_IDS),
                        activeSlave = slaves.substr(0, slaves.length-1).split(DATA_SEPERATOR).pop();
                    if(this.sleep){
                        //when sleeping
                        //if new slave appears, wake up
                        if(this.activeSlave !== activeSlave){
                            this.activeSlave = activeSlave;
                            this.sleep = false;
                            this.monitors.sleep.setGap(SERVER_MONITOR_SLEEPCHECK_GAP);
                        }
                    } else {
                        //when sleeping
                        //if no new slave appear, sleep
                        if(this.activeSlave === activeSlave){
                            this.sleep = true;
                            this.monitors.sleep.setGap(SERVER_MONITOR_SLEEPING_GAP);
                        } else {
                            this.activeSlave = activeSlave;
                        }
                    }
                },
                kill: function(){
                    masters[this.kfuin] = undefined;

                    //stop tasks
                    this.monitors.server.drop();
                    this.monitors.slave.drop();
                    this.heartBeat.drop();
                    clearTimeout(this.autoInviteTimer);

                    console.log('master killed');
                },
                recycle: function(){
                    //recycle storage
                    var storage = this.storage,
                        keys = [INVITE_KFEXT, INVITE_MSG];
                    for(var i=0, key; key=keys[i++];){
                        storage.del(key);
                    }

                    console.log('storage recycled');
                },
                heartBeatProcess: function(){
                    var storage = this.storage;

                    if(storage.get(MASTER_ID) !== this.id){
                        this.kill();
                        return false;
                    }
                    this.storage.set(MASTER_HEARTBEATS, now());
                }
            };
        })();

        var uid = Storage.get(UID) || '';
        var TA = function(){
            var loaded = false;
            return function(nameAccount, callback){
                var isTriggered = false;
                if(uid){
                    callback(uid);
                    isTriggered = true;
                }

                if(!loaded){
                    var url = 'http://tajs.qq.com/crmqq.php?uid=' + nameAccount + '&dm=' + topDomain;

                    loadScript(url, {
                        callback: function(){
                            loaded = true;

                            if(isTriggered){
                                return;
                            }

                            uid = Storage.get(UID);
                            if(uid){
                                callback(uid);
                            } else {
                                setTimeout(arguments.callee, 30);
                            }
                        }
                    });
                }
            }
        }();

        var masters = {};
        //load process
        window.BQQWPALOAD = function(){
            var params = WPAManager.getParams();

            if(!params){
                return;
            }

            var kfuin = params.kfuin;

            if(!kfuin || typeof kfuin === 'undefined'){
                return;
            }

            var foundInPage = WPAManager.findInPage(kfuin);

            //set wpa params
            //add session version
            //add session param(pvid)
            params.sv = SESSION_VERSION_TA;
            if(params.wty === WPA_TYPE_NORMAL || !params.wty){
                WPAManager.newWPA(params);
            }

            //if the kfuin has been added in wpas, return;
            if(foundInPage){
                return;
            }

            //check if in this page, the kfuin's been loaded
            //if not loaded yet, launch slave, launch a ta
            if(!TAFilter){
                console.log('can\'t pass TAFilter');
                return;
            }

            var uid, cfg,
                launch = function(){
                    if(!uid || !cfg){
                        return;
                    }

                    console.log(kfuin + ' has launched process');

                    if(cfg.block === CRM_BLOCK_ON_SERVERSIDE){
                        return;
                    }

                    if(CRMFilter){
                        console.log(kfuin + ' has started slave');
                        cfg.di = params.di;
                        new Slave(kfuin, uid, cfg);
                    }
                };

            TA(kfuin, function(data){
                uid = data;
                launch();
            });

            //get config
            var opt = {
                kfuin: kfuin,
                dm: topDomain,
                title: document.title,
                url: window.location.href.split('://')[1].split('?')[0] //no protocol
            };

            getJSONP(GET_CONFIG_URL, opt, function(data){
                cfg = data;
                launch();
            });
        };

        // async processes
        setTimeout(function(){
            // speed report
            speedReport.pushPoint().send();

            // version check & clean cache when updated
            getJSONP('http://crm2.qq.com/cgi/wpacgi/get_version.php', function(rs){
                if(VERSION === rs.data.version){
                    return;
                }

                // reload wpa.js to clean cache
                loadScript('http://combo.b.qq.com/account/bizqq/js/wpa.js?reset=1&v=' + rs.data.version + '&t=' + +new Date());
            });
        }, 1);
    })(window);
}

//load wpa process
window.BQQWPALOAD();

/**
 *
 * 1.增加browser工具
 * 2.改善点击
 * 3.修复wpa_i01.js的XSS漏洞
 * 4.展示逻辑重构
 * 5.点击聊天逻辑重构
 * 6.定制接口实现修改
 * 7.增加VERSION、DEBUG和GREY常量
 * 8.增加版本检查和自动清除缓存
 * 9.修改WPA页面测速代码
 *
 */