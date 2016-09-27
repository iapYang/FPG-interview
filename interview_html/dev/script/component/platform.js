(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		module.exports = factory();
	} else {
		// Browser global
		factory();
	}
}(this, function() {
    //////////
    // Name //
    //////////

    var COMPONENT_NAME = 'Platform';

    ///////////////
    // Component //
    ///////////////

    var ua = window.navigator.userAgent.toLowerCase();
    var html = document.getElementsByTagName('html')[0];

    var Component = {
        isiPad: ua.match(/ipad/i) !== null,
        isNexus7: ua.match(/Nexus 7/gi) !== null,
        isMobile: ua.match(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile/i) !== null && ua.match(/Mobile/i) !== null,
        isiPhone: ua.match(/iphone/i) !== null,
        isAndroid: ua.match(/android/i) !== null,
        isS4: ua.match(/(gt\-i95)|(sph\-l720)/i) !== null,
        isS5: ua.match(/sm\-g900/i) !== null,
        isS6: ua.match(/sm\-g9250/i) !== null,
        isS7: (ua.match(/sm\-g930p/i) !== null) || (ua.match(/sm\-g9300/i) !== null),
        isIE: ua.match(/(msie|trident)/i) !==null, // /(msie|trident)/i.test(navigator.userAgent),
        isIE11: ua.match(/Trident\/7\.0/i) !== null,
        isEdge: ua.match(/edge/i) !== null,
        isChrome: ua.match(/Chrome/gi) !== null,
        isFirefox: ua.match(/firefox/gi) !== null,
        hasTouch: ('ontouchstart' in window),
        isMac: ua.match('mac') !== null,
        isWindows: ua.match('windows') !== null,
    };

    Component.isAndroidPad = Component.isAndroid && !Component.isMobile;
    Component.isTablet = Component.isiPad || Component.isAndroidPad;
    Component.isDesktop = !(Component.isMobile || Component.isTablet);
    Component.isIOS = Component.isiPad || Component.isiPhone;
    Component.isSafari = Component.isDesktop && (!Component.isIE) && (!Component.isChrome) && (!Component.isFirefox);



    Object.keys(Component).forEach(function(key){
        // value: Component[key]

        var className = key.toLowerCase().replace('is','');

        if(className.indexOf('has') === 0){
            className = className.replace('has', 'has-');
        }

        if(!Component[key]){
            if(className.indexOf('has') === 0){
                className = className.replace('has', 'no');
            }else{
                className = 'not-' + className;
            }
        }

        html.classList.add(className);
    });


    window[COMPONENT_NAME] = Component;

    return Component;
}));
