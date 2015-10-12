// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'Dashboards' controller
angular.module('dashboards').controller('DashboardsController', ['$scope','$timeout' ,'$routeParams', '$location', 'Authentication', 'Dashboards','Powers','Devices','SmartPlugs','ngDialog','$interval', 'roundProgressService',
    function($scope,$timeout, $routeParams, $location, Authentication, Dashboards,Powers,Devices,SmartPlugs,ngDialog,$interval, roundProgressService) {
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
               $scope.power_per_device = parseFloat($scope.power_per_device);     
               console.log("Total Power Per Device: "+totalPower+" KWh");
              
                 
                 
                 $scope.setDataForNgDialog1();
                 console.log("Power of Device :"+ $scope.power_per_device)
                 
                $scope.setGaugeMeterForDevice();
                 
                 
             
         });//end of query
            
         return totalPower;
            
        };
        
        
        
         // power per smartplug start
        
        $scope.power_per_smartplug =0;
        
        
         $scope.getTotalPowerConsumedPerSmartPlug = function(smartplugId){
             console.log("smartplug Id: "+smartplugId);
             var powersPerSmartPlug=[];
             var totalPowerSmartPlug=0;
             var smartplugList = Powers.query({smartplugs:smartplugId},function(){
           
             angular.forEach(smartplugList,function(power,key){
                 
                 var date = new Date(power.created);
                 var consumption = power.consumption;
                 var consumSplit = consumption.split('W');
                 var consN = parseInt(consumSplit[0]);
                 var milli = date.getTime(); 
                 totalPowerSmartPlug+=(consN*10/3600);
                 console.log(smartplugId);
             });//end of foreach
              
                 
            
                 
              
              
               totalPowerSmartPlug = parseFloat(totalPowerSmartPlug).toFixed(2);  
               $scope.power_per_smartplug=totalPowerSmartPlug; 
               $scope.power_per_smartplug = parseFloat($scope.power_per_smartplug);     
               console.log("Total Power Per Smartplug: "+totalPowerSmartPlug+" KWh");
              
                 
                 
                 $scope.setDataForNgDialog2();
                 console.log("Power of SmartPlug :"+ $scope.power_per_smartplug)
                 
                $scope.setGaugeMeterForSmartPlug();
                 
                 
             
         });//end of query
            
         return totalPowerSmartPlug;
            
        };
        
        //power per smart plug end 
        
        
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
                 
                  $scope.setGuageMeterForOverall();
                  $scope.setGaugeMeterForDevice();
                  $scope.setGaugeMeterForSmartPlug();
             
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
        
        
        $scope.getPowerBySmartPlug = function(){
            
            $scope.getTotalPowerConsumedPerSmartPlug($scope.smartplugs);
            
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
                 var totalPower=0;  
             var powerList = Powers.query({devices:device._id},function(){
             
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
                     
                 }
                 
               //  console.log(device._id);
             });//end of foreach powerList
              
                 
            //console.log("Total Power Per Device: "+totalPower+" KWh Based On: Day Range:  "+yy1+"/"+mm1+"/"+dd1+" - "+yy2+"/"+mm2+"/"+dd2);
                 
              
              totalPower = parseFloat(totalPower);  
               
              powerData.push(totalPower);
                 
               console.log("device : "+device.name);   
               console.log("total power: "+totalPower);
                 
                 console.log(powerData.length+"/"+data.length);
                 if(powerData.length==data.length){
                    var power1=0; 
                     angular.forEach(powerData,function(value,key){
                         
                         power1+=parseFloat(value);
                         
                     });
                    
                    power1= parseFloat(power1).toFixed(2)
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
            
        };
       
        $scope.setDataForNgDialog1 = function(){
            
        $scope.jsonData2 = {power: $scope.power_per_device,totalpower: $scope.total_power_consumption};
            
        console.log("jsondata2.power : "+$scope.jsonData2.power)
       
        $scope.setGaugeMeterForDevice();  
         
        };
        
        
        $scope.setDataForNgDialog2 = function(){
            
        $scope.jsonData3 = {power: $scope.power_per_smartplug,totalpower: $scope.total_power_consumption};
            
        console.log("jsondata2.power : "+$scope.jsonData3.power)
       
        $scope.setGaugeMeterForSmartPlug();  
         
        };
        
        
        //gauge meter per device start
        
        $scope.setGaugeMeterForDevice = function(){
            
            
            //ng Guage Meter Start - For Device Overall Consumption
        var meter_reading_device = parseFloat($scope.power_per_device);
        console.log("meter reading devices: "+meter_reading_device);
        $scope.value1 = meter_reading_device ;
        $scope.upperLimit1 = Math.ceil($scope.total_power_consumption);
        $scope.lowerLimit1 = 0;
        $scope.unit1= "kWh";
        $scope.precision1 = 2;
        $scope.ranges1 = [
            {
                min: 0,
                max: $scope.upperLimit1/5,
                color: '#DEDEDE'
            },
            {
                min: $scope.upperLimit1/5,
                max: 2*$scope.upperLimit1/5,
                color: '#8DCA2F'
            },
            {
                min: 2*$scope.upperLimit1/5,
                max: 3*$scope.upperLimit1/5,
                color: '#FDC702'
            },
            {
                min: 3*$scope.upperLimit1/5,
                max: 4*$scope.upperLimit1/5,
                color: '#FF7700'
            },
            {
                min: 4*$scope.upperLimit1/5,
                max: $scope.upperLimit1,
                color: '#C50200'
            }
        ];

        

 

//ng Gauge Meter For Overall Device Consumption End         
            console.log("setGaugeMeterForDevice");
            
        };
        
        
        
        
                //gauge meter per smartplug start
        
        $scope.setGaugeMeterForSmartPlug = function(){
            
            
            //ng Guage Meter Start - For Device Overall Consumption
        var meter_reading_smartplug = parseFloat($scope.power_per_smartplug);
        console.log("meter reading devices: "+meter_reading_smartplug);
        $scope.value2 = meter_reading_smartplug ;
        $scope.upperLimit2 = Math.ceil($scope.total_power_consumption);
        $scope.lowerLimit2 = 0;
        $scope.unit2= "kWh";
        $scope.precision2 = 2;
        $scope.ranges2 = [
            {
                min: 0,
                max: $scope.upperLimit2/5,
                color: '#DEDEDE'
            },
            {
                min: $scope.upperLimit2/5,
                max: 2*$scope.upperLimit2/5,
                color: '#8DCA2F'
            },
            {
                min: 2*$scope.upperLimit2/5,
                max: 3*$scope.upperLimit2/5,
                color: '#FDC702'
            },
            {
                min: 3*$scope.upperLimit2/5,
                max: 4*$scope.upperLimit2/5,
                color: '#FF7700'
            },
            {
                min: 4*$scope.upperLimit2/5,
                max: $scope.upperLimit2,
                color: '#C50200'
            }
        ];

        

 

//ng Gauge Meter For Overall Device Consumption End         
            console.log("setGaugeMeterForSmartPlug");
            
        };
        
        
     
        
       //for device update gauge start
        function update1() {
            $timeout(function() {
                if($scope.power_per_device!=0){
                    
                    $scope.value1=  $scope.power_per_device;
                    $scope.upperLimit1= $scope.power_per_device + 10;
                    console.log("Upper limit: "+$scope.upperLimit1);
                    console.log($scope.value1+"**"+$scope.upperLimit1+"##"+$scope.power_per_device);
                if ($scope.value1 > $scope.upperLimit1) {
                    $scope.value1=$scope.lowerLimit1;
                }
                }
                
                
                update1();
            }, 1000);
        }
       
       
       update1();
        
        //device update gauge ends
        
        
        //smartplug update gauge start
        
        function update2() {
            $timeout(function() {
                if($scope.power_per_smartplug!=0){
                    
                    $scope.value2=  $scope.power_per_smartplug;
                    $scope.upperLimit2= $scope.power_per_smartplug + 10;
                    console.log("Upper limit: "+$scope.upperLimit1);
                    console.log($scope.value2+"**"+$scope.upperLimit2+"##"+$scope.power_per_smartplug);
                if ($scope.value2 > $scope.upperLimit2) {
                    $scope.value2=$scope.lowerLimit2;
                }
                }
                
                
                update2();
            }, 1000);
        }
       
       
       update2();
        
        //smartplug update gauge ends
        
        
        
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
        
        
        
        
        
        /////////////////////////////////////////////////////////////////////////////////
        //angular gauge meter panels
        
         $scope.openGauages = function () {
          
                ngDialog.open({
                    template: 'views/popupTmpl.html',
                    plain: true,
                    closeByEscape: false,
                    controller: 'DashboardsController',
                    scope:$scope
                });
         
           
            };
        
        
        
        
        //angular gauge meter code start
        
        
//ng Guage Meter Start - For Overall Consumption

       $scope.setGuageMeterForOverall = function(){
        var meter_reading = parseFloat($scope.total_power_consumption);  
        console.log("meter reading: "+meter_reading)   
        var meter_reading1 = 3;   
        $scope.value = meter_reading;
        $scope.upperLimit = meter_reading + 20.00;
        $scope.lowerLimit = 0;
        $scope.unit = "kWh";
        $scope.precision = 2;
        $scope.ranges = [
            {
                min: 0,
                max: $scope.upperLimit/5,
                color: '#DEDEDE'
            },
            {
                min: $scope.upperLimit/5,
                max: 2*$scope.upperLimit/5,
                color: '#8DCA2F'
            },
            {
                min: 2*$scope.upperLimit/5,
                max: 3*$scope.upperLimit/5,
                color: '#FDC702'
            },
            {
                min: 3*$scope.upperLimit/5,
                max: 4*$scope.upperLimit/5,
                color: '#FF7700'
            },
            {
                min: 4*$scope.upperLimit/5,
                max: $scope.upperLimit,
                color: '#C50200'
            }
        ];


       };
        
     
        
        function update() {
            $timeout(function() {
               
                $scope.value= $scope.value;
                //console.log($scope.value+" "+$scope.upperLimit);
                if ($scope.value > $scope.upperLimit) {
                    $scope.value=$scope.lowerLimit;
                }
                update();
            }, 1000);
        }
        update();



//ng Gauge Meter For Overall Consumption End
        
        
 
        
        
        
        
        
        
        
        
        
        
        
        //angular gauge meter code end
        
        
        
       
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




