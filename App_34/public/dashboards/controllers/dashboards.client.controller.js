// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'Dashboards' controller
angular.module('dashboards').controller('DashboardsController', ['$scope', '$routeParams', '$location', 'Authentication', 'Dashboards','Powers','Devices','SmartPlugs','ngDialog',
    function($scope, $routeParams, $location, Authentication, Dashboards,Powers,Devices,SmartPlugs,ngDialog) {
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
            
            
        }
        
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