/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("offline", this.checkConnection, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        document.addEventListener("backbutton", onBackKeyDown, false);
        function onBackKeyDown(e) {
            e.preventDefault();
            navigator.notification.confirm("Are you sure you want to exit ?", onConfirm, "Confirmation", "Yes,No");
            // Prompt the user with the choice
        }

        function onConfirm(button) {
            if (button == 2) {//If User selected No, then we just do nothing
                return;
            } else {
                navigator.app.exitApp();// Otherwise we quit the app.
            }
        }

        $('#btnRegister').click(function (e) {
            // This Section for request OTP
            if ($('#txtMobile').val().length === 10) {
                mobile = $('#txtMobile').val();
                localStorage.setItem('user', mobile);
                $('#main_btn').prop('disabled', true).text('Sending OTP...');
                $.ajax({ url: "http://platterexoticfood.com/pladmin/manage_api/do_login_employee", type: "post", dataType: "JSON", data: { mobile: mobile } }).done(function (reply) {
                    OTP = reply.otp;
                    localStorage.setItem('otp', OTP);
					localStorage.setItem('BOY', reply.boy);
					
                    if(OTP==""){
                        window.plugins.toast.showLongBottom('Mobile not register with us');
                        // popup.close();
                        // $('#mobile-popup').open();
                        window.location.href ="register.html";						
                    }
					else{						
						window.location.href ="register.html#otp-popup";
					}
                    
                }).fail(function (err) {
                    window.plugins.toast.showLongBottom('Enter a valid mobile number');
                    window.location.href = "register.html";
                })
            }
        });

        // This Section For OTP Verification
        $('#btnLogin').click(function () {
            // alert($('#txtOTP').val());
			OTP = localStorage.getItem('otp');
            if (OTP == $('#txtOTP').val()) {
                localStorage.setItem('islogin', 1);
                window.location.href="home.html";
            }
            else{
                window.plugins.toast.showLongBottom('Enter a valid OTP');
            }
        });
    }
};

// This Function For Check Internet Connection
function checkConnection() {
    window.plugins.toast.showLongBottom('No internet connection detected', function () {
        navigator.app.exitApp();
    });
}
