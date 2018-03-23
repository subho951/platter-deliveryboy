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
function handleOpenURL(url) {
    alert("received url: " + url);
}
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
        //document.addEventListener('DOMContentLoaded', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        // $('ul.tabs').tabs({swipeable:true});
        // app.receivedEvent('deviceready');
        
        mobile = localStorage.getItem('user');
        $('#deliv-name').html(localStorage.getItem('BOY'));
        app.updateOrderListings();
        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 10,
            distanceFilter: 10,
            notificationTitle: 'Background tracking',
            notificationText: 'enabled',
            debug: false,
            startOnBoot: false,
            stopOnTerminate: false,
            locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
            interval: 10000,
            fastestInterval: 5000,
            activitiesInterval: 10000,
            url: 'http://platterexoticfood.com/pladmin/manage_api/set_deliveryboy_location',
            postTemplate: {
                latitude: '@latitude',
                longitude: '@longitude',
                mobile: mobile
            }
        });
        
		BackgroundGeolocation.on('location', function(location) {
            // handle your locations here
            // to perform long running operation on iOS
            // you need to create background task
            console.log(location);
            $.ajax({url:"http://platterexoticfood.com/pladmin/manage_api/set_deliveryboy_location",type:"post",dataType:"JSON",data:{mobile:mobile, longitude:location.longitude, latitude: location.latitude}}).done(function (res) {
                console.log('Ajax Success');
                console.log(res);
            }).fail(function (res) {
                console.log('Ajax Failed');
                console.log(res);
            });
            BackgroundGeolocation.startTask(function(taskKey) {
            // execute long running task
            // eg. ajax post location
            // IMPORTANT: task has to be ended by endTask
            BackgroundGeolocation.endTask(taskKey);
        });
    });

        BackgroundGeolocation.on('stationary', function(stationaryLocation) {
            // handle stationary locations here
            console.log('Stationary Location Detected');
            console.log(stationaryLocation);
            $.ajax({url:"http://platterexoticfood.com/pladmin/manage_api/set_deliveryboy_location",type:"post",dataType:"JSON",data:{mobile:mobile, longitude:stationaryLocation.longitude, latitude: stationaryLocation.latitude}}).done(function (res) {
                console.log('Ajax Success for Stationary Location');
                console.log(res);
            }).fail(function (res) {
                console.log('Ajax Failed for Stationary Location');
                console.log(res);
            });
        });

        BackgroundGeolocation.on('error', function(error) {
            console.log('[ERROR] BackgroundGeolocation error:', error.code, error.message);
    });

        BackgroundGeolocation.on('start', function() {
            console.log('[INFO] BackgroundGeolocation service has been started');
    });

        BackgroundGeolocation.on('stop', function() {
            console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

        BackgroundGeolocation.on('authorization', function(status) {
            console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
        if (status !== BackgroundGeolocation.AUTHORIZED) {
            Alert.alert(
                'Location services are disabled',
                'Would you like to open location settings?',
                [
                    {
                        text: 'Yes',
                        onPress: function() {BackgroundGeolocation.showLocationSettings()}
                    },
                    {
                        text: 'No',
                        onPress: function() {console.log('No Pressed')}
                        , style: 'cancel'
                    }
                ]
            );
        }
    });

        BackgroundGeolocation.on('background', function() {
            console.log('[INFO] App is in background');
        // you can also reconfigure service (changes will be applied immediately)
        // BackgroundGeolocation.configure({ debug: true });
    });

        BackgroundGeolocation.on('foreground', function() {
            console.log('[INFO] App is in foreground');
        // BackgroundGeolocation.configure({ debug: false });
    });

        BackgroundGeolocation.checkStatus(function(status) {
            console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
            console.log('[INFO] BackgroundGeolocation service has permissions', status.hasPermissions);
            console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

        // you don't need to check status before start (this is just the example)
        if (!status.isRunning) {
            BackgroundGeolocation.start(); //triggers start on start event
        }
    });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        FastClick.attach(document.body);
    },
    navigateTo: function (lat, lng) {
        launchnavigator.navigate([lat, lng], {
            app: launchnavigator.APP.GOOGLE_MAPS,
            transportMode: launchnavigator.TRANSPORT_MODE.DRIVING,
            launchModeGoogleMaps: launchnavigator.LAUNCH_MODE.TURN_BY_TURN
        });
    },
    exportXLS: function() {
        var uri = encodeURI("https://platterexoticfood.com/pladmin/uploads/report.xls");

        cordova.plugins.DownloadManager.download(uri, function (data) {
            console.log(data);
            window.plugins.toast.showLongBottom('Excel Report has been downloaded successfully.', function(a){console.log('toast success: ' + a)}, function(b){console.log('toast error: ' + b)})
        }, function (message) {
            alert(message);
        });
    },
    exportPDF: function () {
        var uri = encodeURI("https://platterexoticfood.com/pladmin/uploads/report.pdf");

        cordova.plugins.DownloadManager.download(uri, function (data) {
            console.log(data);
            window.plugins.toast.showLongBottom('PDF Report has been downloaded successfully.', function(a){console.log('toast success: ' + a)}, function(b){console.log('toast error: ' + b)})
        }, function (message) {
            alert(message);
        });
    },
    updateOrderListings: function () {
        $.ajax({
            method: 'post',
            dataType: 'json',
            url: 'https://platterexoticfood.com/pladmin/manage_api/delivery_order_list',
            data: {mobile:mobile}
        }).done(function (reply) {
            var ord = '';
            var hst = '';
			console.log(reply);
			$('#cust-name').text(reply.open_order[0].customer.customer_name);
			$('#cust-mobile').text(reply.open_order[0].customer.customer_mobile);
			$('#cust-shipping-address').text(reply.open_order[0].customer.customer_address);			
			$('#cust-tel').attr('href',"Tel:"+reply.open_order[0].customer.customer_mobile);
            /* for (orderIndex in reply.open_order) {
                ord += '<div class="card-panel no-padding">\n' +
                    '<table class="striped">\n' +
                    '<thead>\n' +
                    '<tr>\n' +
                    '<th colspan="3" class="light-green lighten-4">ORDER ID: '+reply.open_order[orderIndex].order_no+' <span class="time"><i class="material-icons">alarm</i>'+reply.open_order[orderIndex].order_time+'</span></th>\n' +
                    '</tr>\n' +
                    '<tr>\n' +
                    '<th>Sl.</th>\n' +
                    '<th>Menu Item</th>\n' +
                    '<th>Qty</th>\n' +
                    '</tr>\n' +
                    '</thead>\n' +
                    '<tbody>\n';
                for (menuIndex in reply.open_order[orderIndex].menu) {
                    ord += '<tr>\n' +
                        '<td>'+(parseInt(menuIndex)+1)+'</td>\n' +
                        '<td>'+reply.open_order[orderIndex].menu[menuIndex].menuname+'</td>\n' +
                        '<td>'+reply.open_order[orderIndex].menu[menuIndex].qty+'</td>\n' +
                        '</tr>\n';
                }

                    ord += '</tbody>\n' +
                    '<tfoot>\n' +
                    '<tr>\n' +
                    '<td colspan="3"><strong>From:</strong> '+reply.open_order[orderIndex].restaurant.restaurant_name+' <br />\n' +
                        reply.open_order[orderIndex].restaurant_address+'\n' +
                    '</td>\n' +
                    '</tr>\n' +
                    '<tr>\n' +
                    '<td colspan="3">\n' +
                    '<strong>To:</strong> '+reply.open_order[orderIndex].customer.customer_name+' <br />\n' +
                        reply.open_order[orderIndex].shipping_address+'\n' +
                    '</td>\n' +
                    '</tr>\n';

                if(reply.open_order[orderIndex].step===1) {
                    ord += '<tr>\n' +
                        '<td colspan="3">\n' +
                        'Ready to pickup? <a class="waves-effect waves-green btn-flat" href="javascript:app.acceptDeliveryRequest(' + reply.open_order[orderIndex].restaurant.lattitude + ',' + reply.open_order[orderIndex].restaurant.longitude + ',' + reply.open_order[orderIndex].order_id + ')">Drive to Restaurant</a>\n' +
                        '</td>\n' +
                        '</tr>\n';
                } else if(reply.open_order[orderIndex].step===2) {
                    ord += '<tr>\n' +
                        '<td colspan="3">\n' +
                        'Ready to deliver? <a class="waves-effect waves-green btn-flat" href="javascript:app.startDelivery('+reply.open_order[orderIndex].latitude+','+reply.open_order[orderIndex].longitude+','+reply.open_order[orderIndex].order_id+')">Drive to Customer</a> <a class="waves-effect waves-green btn-flat" href="javascript:app.navigateTo('+reply.open_order[orderIndex].latitude+','+reply.open_order[orderIndex].longitude+')">Drive to Restaurant</a>\n' +
                        '</td>\n' +
                        '</tr>\n';
                } else if(reply.open_order[orderIndex].step===3) {
                    if(reply.open_order[orderIndex].payment_mode==='cod'){
                        ord += '<tr>\n' +
                            '<td colspan="3">\n' +
                            'Cash to be collected : INR '+reply.open_order[orderIndex].subtotal+'\n' +
                            '</td>\n' +
                            '</tr>\n';
                    }
                    ord += '<tr>\n' +
                        '<td colspan="3">\n' +
                        'Contact Customer? <a class="waves-effect waves-green btn-flat" href="tel:'+reply.open_order[orderIndex].customer.customer_mobile+'">Call Customer</a>\n' +
                        '</td>\n' +
                        '</tr>\n' +
                        '<tr>\n' +
                        '<td colspan="3">\n' +
                        'Delivery complete? <a class="waves-effect waves-green btn-flat" href="javascript:app.finishDelivery('+reply.open_order[orderIndex].order_id+')">Yes</a> <a class="waves-effect waves-green btn-flat" href="javascript:app.navigateTo('+reply.open_order[orderIndex].latitude+','+reply.open_order[orderIndex].longitude+')">Drive to Customer</a>\n' +
                        '</td>\n' +
                        '</tr>\n';
                }
                ord += '</tfoot>\n' +
                    '</table>\n' +
                    '</div>';
            } */
            $('#orders').html(ord);
            $('#history').html(hst);
        });
        setTimeout(function () {
            app.updateOrderListings();
        }, 7000);
    },
    acceptDeliveryRequest: function(lat, lng, order_id) {
        $.ajax({
            method: 'post',
            dataType: 'json',
            url: 'https://platterexoticfood.com/pladmin/manage_api/delivery_order_accept',
            data: {id:order_id}
        }).done(function (reply) {
            app.navigateTo(lat, lng);
        });
    },
    startDelivery: function(lat, lng, order_id) {
        $.ajax({
            method: 'post',
            dataType: 'json',
            url: 'https://platterexoticfood.com/pladmin/manage_api/delivery_start',
            data: {id:order_id}
        }).done(function (reply) {
            app.navigateTo(lat, lng);
        });
    },
    finishDelivery: function(order_id) {
        $.ajax({
            method: 'post',
            dataType: 'json',
            url: 'https://platterexoticfood.com/pladmin/manage_api/delivery_complete',
            data: {id:order_id}
        }).done(function (reply) {
            
        });
    }
};
