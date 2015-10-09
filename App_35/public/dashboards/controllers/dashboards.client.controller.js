// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'Dashboards' controller
angular.module('dashboards').controller('DashboardsController', ['$scope', '$routeParams', '$location', 'Authentication', 'Dashboards','Powers','Devices','SmartPlugs','ngDialog','$interval', 'roundProgressService',
    function($scope, $routeParams, $location, Authentication, Dashboards,Powers,Devices,SmartPlugs,ngDialog,$interval, roundProgressService) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;
        
        
        
        var dashboardList ={};
        
        dashboardList._id='';
        dashboardList.creator ='';
        dashboardList.devices='';
        dashboardList.smartplugs='';
        dashboardList.consumption='';
        dashboardList.pid='';
        dashboardList.created='';
        
        $scope.dashboards= dashboardList;
        $scope.search_date_range='';
        
        $scope.init = function(){
            
            
        
        };
        

        // Create a new controller method for creating new Dashboards
        $scope.create = function() {
        	// Use the form fields to create a new Dashboard $resource object
            
            var Dashboard = new Dashboards({
                pid: this.pid,
                name: this.name,
                consumption: this.consumption,
                devices: this.devices,
                smartplugs: this.smartplugs
            });

            // Use the Dashboard '$save' method to send an appropriate POST request
            Dashboard.$save(function(response) {
            	// If an Dashboard was created successfully, redirect the user to the Dashboard's page 
                $location.path('dashboards/' + response._id);
                console.log("Saved Dashboard");
                console.log(response);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of Dashboards
        $scope.find = function() {
        	// Use the Dashboard 'query' method to send an appropriate GET request
            var dashboards=[];
            $scope.dashboards = Dashboards.query({}, function() {
                    
                  var count=0;
                  angular.forEach($scope.dashboards, function(dashboard, key) {
                            
                      
                      var idevice = Devices.get({deviceId:dashboard.devices},function(){
                            
                           dashboard.devices=idevice.name;
                      });
                      var ismartplug = SmartPlugs.get({smartplugId:dashboard.smartplugs},function(){
                      
                           dashboard.smartplugs=ismartplug.name;  
                      });
                                                    
                      
                      count++;
                  });//end of loop

                dashboards = $scope.dashboards;
            });//end of query
            
          return   dashboards;
        };
        

        // Create a new controller method for retrieving a single Dashboard
        $scope.findOne = function() {
        	// Use the Dashboard 'get' method to send an appropriate GET request
            $scope.dashboard = Dashboards.get({dashboardId: $routeParams.dashboardId});
        };
        
        

        // Create a new controller method for updating a single Dashboard
        $scope.update = function() {
        	// Use the device '$update' method to send an appropriate PUT request
            $scope.dashboard.$update(function() {
            	// If an device was updated successfully, redirect the user to the device's page 
                $location.path('dashboards/' + $scope.dashboard._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single Dashboard
        $scope.delete = function(dashboard) {
        	// If an Dashboard was sent to the method, delete it
            if (dashboard) {
            	// Use the Dashboard '$remove' method to delete the Dashboard
                Dashboard.$remove(function() {
                	// Remove the Dashboard from the Dashboards list
                    for (var i in $scope.dashboards) {
                        if ($scope.dashboards[i] === dashboard) {
                            $scope.dashboards.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the Dashboard '$remove' method to delete the Dashboard
                $scope.dashboard.$remove(function() {
                    $location.path('dashboards');
                });
            }
        };
        
        
        //retrieving all the Smart Plugs currently created
        
        $scope.findDevices = function() {
        	// Use the Dashboard 'query' method to send an appropriate GET request
            $scope.deviceList = Devices.query();
            $scope.devices = $scope.deviceList[1];
            
        };
        
       $scope.findDevices();
        
        $scope.findSmartPlugs = function() {
        	// Use the device 'query' method to send an appropriate GET request
            $scope.smartplugList = SmartPlugs.query();
            $scope.smartplugs = $scope.smartplugList[1];
            
        };
        
        
        
      
       $scope.findSmartPlugs();
        
//ngDialog Controlling Section Start        
        
        
        $scope.jsonData = '{"foo": "bar"}';
        $scope.theme = 'ngdialog-theme-default';
        
        
        
        
        $scope.clickToOpen = function () {
        ngDialog.open(
            { template: 'templateId' ,
              className: 'ngdialog-theme-flat',
              plain: false,
              showClose: true,
              closeByDocument: true,
              closeByEscape: true
            
            
            });
    }; 
        
        
        
        //power calculation functions start
        
        $scope.power_per_device =0;
        
        
         $scope.getTotalPowerConsumedPerDevice = function(deviceId){
               
             var powersPerDevice=[];
             var totalPower=0;
             var deviceList = Powers.query({devices:deviceId},function(){
           
             angular.forEach(deviceList,function(power,key){
                 
                 var date = new Date(power.created);
                 var consumption = power.consumption;
                 var consumSplit = consumption.split('W');
                 var consN = parseInt(consumSplit[0]);
                 var milli = date.getTime(); 
                 totalPower+=(consN*10/3600);
                 //console.log(deviceId);
             });//end of foreach
              
                 
            
                 
              
              
               totalPower = parseFloat(totalPower).toFixed(2);  
               $scope.power_per_device=totalPower; 
               console.log("Total Power Per Device: "+totalPower+" KWh");
                 
                 $scope.setDataForNgDialog1();
                 
             
         });//end of query
            
         return totalPower;
            
        };
        
         $scope.total_power_consumption=0;
        
        
        //get power consumption for all devices
        
        $scope.getTotalPowerConsumptionFromEachDevice =function(){
            var power=0;
            var powers=[];
            Devices.query({},function(data){
                 var totalPower=0;
               angular.forEach(data, function(device,key){
                   
                   
                   
                   //retrieve power for each device start
                   
             var powerList = Powers.query({devices:device._id},function(){
            
             angular.forEach(powerList,function(power,key){
                 
                 var date = new Date(power.created);
                 var consumption = power.consumption;
                 var consumSplit = consumption.split('W');
                 var consN = parseInt(consumSplit[0]);
                 var milli = date.getTime(); 
                 totalPower+=(consN*10/3600);
               //  console.log(device._id);
             });//end of foreach powerList
       
             console.log("Power :"+totalPower);
                
                 $scope.total_power_consumption=parseFloat(totalPower).toFixed(2);
             
         });//end of query powerList
            
                   //retrieve power for each device start
         console.log("Power All: "+power);
               });   //end of angular foreach        
         
            });//end of query
          
  
        };
        
        
         $scope.getTotalPowerConsumptionFromEachDevice();
        
  
        
        //power calculation functions end
        
        
        
        
        //get results
        
        $scope.getPowerByDevice = function(){
            
            $scope.getTotalPowerConsumedPerDevice($scope.devices);
            
            
        };
        
        
        //date range power calculation
        
        $scope.total_power_consumption_per_date_range=0;
        
        
        $scope.getTotalPowerConsumptionFromEachDeviceByDayRange =function(start_date,end_date){
            var powerData=[];
             var mm1 = start_date.split('-')[1];
            var dd1 = start_date.split('-')[2];
            var yy1 = start_date.split('-')[0];
          
           
            
            var mm2 = end_date.split('-')[1];
            var dd2 = end_date.split('-')[2];
            var yy2 = end_date.split('-')[0];
          
           
            
            Devices.query({},function(data){
                
               angular.forEach(data, function(device,key){
             //retrieve power for each device start
                   
             var powerList = Powers.query({devices:device._id},function(){
             var totalPower=0;
             angular.forEach(powerList,function(power,key){
                 
                 var date = new Date(power.created);
                 var consumption = power.consumption;
                 var consumSplit = consumption.split('W');
                 var consN = parseFloat(consumSplit[0]);
                 var milli = date.getTime(); 
                 
                // console.log("Time: "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());
               //  console.log("Day : "+date.getDay()+"/ Year: "+date.getFullYear()+" / Month : "+date.getMonth()+"");
                var condition1 = (date.getFullYear()>=yy1 && date.getFullYear()<=yy2 );
                var condition2 = ((date.getMonth()+1>=mm1) && (date.getMonth()+1<=mm2)) ; 
                var condition3 = (date.getMonth()>=dd1 && date.getMonth()<=dd2) ;  
                 
               // console.log(condition1+" "+condition2+" "+condition3);
                 
                 if( condition1==true && condition2==true && condition3==true ){
                     
                     totalPower+=(consN*10/3600);
                     totalPower = parseFloat(totalPower).toFixed(2);  
                 }
                 
               //  console.log(device._id);
             });//end of foreach powerList
              
                 
            //console.log("Total Power Per Device: "+totalPower+" KWh Based On: Day Range:  "+yy1+"/"+mm1+"/"+dd1+" - "+yy2+"/"+mm2+"/"+dd2);
                 
              
              
               
              powerData.push(totalPower);
                 
               console.log("device : "+device.name);   
               console.log("total power: "+totalPower);
                 
                 console.log(powerData.length+"/"+data.length);
                 if(powerData.length==data.length){
                    var power1=0; 
                     angular.forEach(powerData,function(value,key){
                         
                         power1+=parseFloat(value);
                         
                     });
                    
                     
                      $scope.total_power_consumption_per_date_range=power1;
                      $scope.search_date_range=start_date+"-"+end_date;
                      console.log("Power Of All Devices: "+ $scope.total_power_consumption_per_date_range);
                      $scope.dialogModel1 = {
                            message : power1
                      };
                     
                      $scope.setDataForNgDialog();
                     
                 }
               
             
         });//end of query powerList
          
                   //retrieve power for each device start
                  // console.log("total power c: "+power);
               
                   
               });   //end of angular foreach             
                
               
            });//end of query
        };
        
        
        
        
        //ngDialog code
        
        $scope.dialogModel = {
                message : 'message from passed scope'
            };
            
            $scope.openSecond = function () {
                ngDialog.open({
                    template: '<h3><a href="" ng-click="closeSecond()">Close all by click here!</a></h3>',
                    plain: true,
                    closeByEscape: false,
                    controller: 'SecondModalCtrl',
                    data: $scope.total_power_consumption_per_date_range,
                    scope:$scope
                });
            };
        
        $scope.openFirst = function () {
            console.log("Power : "+$scope.total_power_consumption_per_date_range);
             $scope.jsonData1 = {foo: $scope.total_power_consumption_per_date_range};
             console.log('Form Json data: ')
             console.log( $scope.jsonData1.foo);
                ngDialog.open({
                    template: '<h2>Value: <code>{{total_power_consumption_per_date_range}}</code></h2>',
                    plain: true,
                    closeByEscape: false,
                    controller: 'DashboardsController',
                    data: $scope.jsonData1,
                    scope:$scope
                });
         
           
            };
        
        $scope.setDataForNgDialog = function(){
            
        $scope.jsonData1 = {power: $scope.total_power_consumption_per_date_range,daterange: $scope.search_date_range};
        }
       
        $scope.setDataForNgDialog1 = function(){
            
        $scope.jsonData2 = {power: $scope.power_per_device,totalpower: $scope.total_power_consumption};
        }
        
        ///////////////////////////////////////////////////////////////////////////////
        
        
        
                   $scope.current =        27;
            $scope.max =            50;
            $scope.timerCurrent =   0;
            $scope.uploadCurrent =  0;
            $scope.stroke =         15;
            $scope.radius =         60;
            $scope.isSemi =         false;
            $scope.rounded =        false;
            $scope.responsive =     false;
            $scope.clockwise =      true;
            $scope.currentColor =   '#45ccce';
            $scope.bgColor =        '#eaeaea';
            $scope.duration =       800;
            $scope.currentAnimation = 'easeOutCubic';

            $scope.increment = function(amount){
                $scope.current+=(amount || 1);
            };

            $scope.decrement = function(amount){
                $scope.current-=(amount || 1);
            };

            $scope.animations = [];

            angular.forEach(roundProgressService.animations, function(value, key){
                $scope.animations.push(key);
            });

            $scope.getStyle = function(){
                var transform = ($scope.isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';

                return {
                    'top': $scope.isSemi ? 'auto' : '50%',
                    'bottom': $scope.isSemi ? '5%' : 'auto',
                    'left': '50%',
                    'transform': transform,
                    '-moz-transform': transform,
                    '-webkit-transform': transform,
                    'font-size': $scope.radius/3.5 + 'px'
                };
            };

            $scope.getColor = function(){
                return $scope.gradient ? 'url(#gradient)' : $scope.currentColor;
            };

            var getPadded = function(val){
                return val < 10 ? ('0' + val) : val;
            };

            $interval(function(){
                var date = new Date();
                var secs = date.getSeconds();

                $scope.timerCurrent = secs;
                $scope.time = getPadded(date.getHours()) + ':' + getPadded(date.getMinutes()) + ':' + getPadded(secs);
            }, 1000);
        
        
        
        
        /////////////////////////////////////////////////////////////////////////////////
        
       
    }
]);




angular.module('dashboards').controller('InsideCtrl', function ($scope, ngDialog) {
            $scope.dialogModel = {
                message : 'message from passed scope'
            };
            
            $scope.openSecond = function () {
                ngDialog.open({
                    template: '<h3><a href="" ng-click="closeSecond()">Close all by click here!</a></h3>',
                    plain: true,
                    closeByEscape: false,
                    controller: 'SecondModalCtrl'
                });
            };
        });



angular.module('dashboards').controller('InsideCtrlAs', function () {
            this.value = 'value from controller';
        });


angular.module('dashboards').controller('SecondModalCtrl', function ($scope, ngDialog) {
            $scope.closeSecond = function () {
                ngDialog.close();
            };
        });

//ngDialog Controlling Section End        