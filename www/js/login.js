var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        FastClick.attach(document.body);
    },
    slideTo: function (page, direction, delayInMS) {
        var options = {
            "direction": direction, // 'left|right|up|down', default 'left' (which is like 'next')
            "duration": 500, // in milliseconds (ms), default 400
            "slowdownfactor": 3, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
            "slidePixels": 20, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
            "iosdelay": 100, // ms to wait for the iOS webview to update before animation kicks in, default 60
            "androiddelay": 150, // same as above but for Android, default 70
            "winphonedelay": 250, // same as above but for Windows Phone, default 200,
            "fixedPixelsTop": 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
            "fixedPixelsBottom": 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
            "href": page
        };
        setTimeout(function () {
            window.plugins.nativepagetransitions.slide(
                options,
                function (msg) {
                    console.log("success: " + msg)
                }, // called when the animation has finished
                function (msg) {
                    console.log("error: " + msg)
                } // called in case you pass in weird values
            );
        }, delayInMS);
    },
    fadeTo: function (page, delayInMS) {
        var options = {
            "duration": 500, // in milliseconds (ms), default 400
            "iosdelay": 50, // ms to wait for the iOS webview to update before animation kicks in, default 60
            "androiddelay": 100,
            "href": page
        };
        setTimeout(function () {
            window.plugins.nativepagetransitions.fade(
                options,
                function (msg) {
                    console.log("success: " + msg)
                }, // called when the animation has finished
                function (msg) {
                    console.log("error: " + msg)
                } // called in case you pass in weird values
            );
        }, delayInMS);
    },
    flipTo: function (page, direction, delayInMS) {
        var options = {
            "direction": direction, // 'left|right|up|down', default 'right' (Android currently only supports left and right)
            "duration": 500, // in milliseconds (ms), default 400
            "iosdelay": 50, // ms to wait for the iOS webview to update before animation kicks in, default 60
            "androiddelay": 100,  // same as above but for Android, default 70
            "winphonedelay": 150, // same as above but for Windows Phone, default 200
            "href": page
        };
        setTimeout(function () {
            window.plugins.nativepagetransitions.flip(
                options,
                function (msg) {
                    console.log("success: " + msg)
                }, // called when the animation has finished
                function (msg) {
                    console.log("error: " + msg)
                } // called in case you pass in weird values
            );
        }, delayInMS);
    },
    requestOTP: function () {
        if($('#main_inp').val().length === 10) {
            mobile = $('#main_inp').val();
			localStorage.setItem('mobile', mobile);
            $('#main_btn').prop('disabled', true).text('Sending OTP...');
            $.ajax({url:"http://platterexoticfood.com/pladmin/manage_api/request_otp",type:"post",dataType:"JSON",data:{mobile:mobile}}).done(function (reply) {
                OTP = reply.otp;
                $('#main_inp').attr('placeholder', 'Enter OTP').val('');
                $('#main_btn').prop('disabled', false).text('Verify OTP').attr('onclick', "app.verifyOTP()");
            }).fail(function (err) {
                window.plugins.toast.show('Please enter a valid mobile number!', 'long', 'bottom', function(a){
                    console.log('toast success: ' + a)}, function(b){console.log('toast error: ' + b)
                });
                $('#main_btn').prop('disabled', false);
            })
        }
    },
    verifyOTP: function () {
        console.log(mobile);
        console.log(OTP);
        $('#main_btn').prop('disabled', true).text('Verifying OTP...');
        if($('#main_inp').val() == OTP) {
            $('#main_btn').prop('disabled', true).text('Logging in...');
            $.ajax({url:"http://platterexoticfood.com/pladmin/manage_api/do_login_employee",type:"post",dataType:"JSON",data:{mobile:mobile}}).done(function (reply) {
                console.log(reply);
                if(reply.success) {
                    localStorage.setItem('mobile', reply.mobile);
                    localStorage.setItem('delivery_name',reply.boy);
                    app.fadeTo('home.html', 300);
                } else {
                    if (navigator.app) {
                        navigator.app.exitApp();
                    }
                    else if (navigator.device) {
                        navigator.device.exitApp();
                    }
                }

            }).fail(function (err) {
                console.log(err);
            });
        }
    }
};
