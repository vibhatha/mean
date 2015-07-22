// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'schedules' controller
angular.module('schedules').controller('SchedulesController', ['$scope', '$routeParams', '$location', 'Authentication', 'Schedules','Devices','SmartPlugs',
    function($scope, $routeParams, $location, Authentication, Schedules,SmartPlugs,Devices) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;

        // Create a new controller method for creating new schedules
        $scope.create = function() {
        	// Use the form fields to create a new schedule $resource object
           
            var schedule = new Schedules({
                schid: this.schid,
                name: this.name,
                type: this.type,
                start: new Date(),
                end:  new Date(),
                description: this.description,
                switchon: this.switchon,
                devices:this.devices._id,
                daily:this.daily,
                week: this.week,
                smartplugs: this.smartplugs._id
            });
            
            console.log(schedule);

            // Use the schedule '$save' method to send an appropriate POST request
            schedule.$save(function(response) {
            	// If an schedule was created successfully, redirect the user to the schedule's page 
                $location.path('schedules/' + response._id);
              
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of schedules
        $scope.find = function() {
        	// Use the schedule 'query' method to send an appropriate GET request
            $scope.schedules = Schedules.query();
        };

        // Create a new controller method for retrieving a single schedule
        $scope.findOne = function() {
        	// Use the schedule 'get' method to send an appropriate GET request
            $scope.schedule = Schedules.get({
                scheduleId: $routeParams.scheduleId
            });
        };
        
        

        // Create a new controller method for updating a single schedule
        $scope.update = function() {
        	// Use the schedule '$update' method to send an appropriate PUT request
            $scope.schedule.$update(function() {
            	// If an schedule was updated successfully, redirect the user to the schedule's page 
                $location.path('schedules/' + $scope.schedule._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single schedule
        $scope.delete = function(schedule) {
        	// If an schedule was sent to the method, delete it
            if (schedule) {
            	// Use the schedule '$remove' method to delete the schedule
                schedule.$remove(function() {
                	// Remove the schedule from the schedules list
                    for (var i in $scope.schedules) {
                        if ($scope.schedules[i] === schedule) {
                            $scope.schedules.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the schedule '$remove' method to delete the schedule
                $scope.schedule.$remove(function() {
                    $location.path('schedules');
                });
            }
        };
        
        
        //retrieving all the Smart Plugs currently created
        
       
        $scope.findDevices = function() {
        	// Use the Power 'query' method to send an appropriate GET request
            $scope.deviceList = Devices.query();
            $scope.devices1 = $scope.deviceList[1];
            
        };
        
       $scope.findDevices();
        
        $scope.findSmartPlugs = function() {
        	// Use the device 'query' method to send an appropriate GET request
            $scope.smartplugList = SmartPlugs.query();
            $scope.smartplugs1 = $scope.smartplugList[1];
            
        };
        
        
        
      
       $scope.findSmartPlugs();
        
        $scope.switchSetting = function(){
            
            var switchTriggers = [{feature:'On',value:true},{feature:'Off',value:false}];
            $scope.switch = switchTriggers;
            console.log($scope.switch[0].feature);
            
        };
        
        $scope.switchSetting();
        
            //set the visibility of the clocks
        $scope.clockVisible1 = false;
        $scope.clockVisible2 = false;
        $scope.getClock1 = function(){
            
          if( $scope.clockVisible1==false){
               $scope.clockVisible1=true;
          }
        else{

            $scope.clockVisible1=false;

        }
           
            
            
        };
        
        $scope.getClock2 = function(){
            
          if( $scope.clockVisible2==false){
               $scope.clockVisible2=true;
          }
          else{

            $scope.clockVisible2=false;

        }
           
            
            
        };
        
        //set the days of the week from selection
        $scope.daysSelected =[];
        
        $scope.getSelectedDays = function (){
            
             $scope.daysSelected =[];
            
            if($scope.day1){
                 $scope.daysSelected.push(1);
            }
            if($scope.day2){
                  $scope.daysSelected.push(2);
            }
            
            if($scope.day3){
                  $scope.daysSelected.push(3);
            }
            
            if($scope.day4){
                  $scope.daysSelected.push(4);
            }
           
            if($scope.day5){
                   $scope.daysSelected.push(5);
            }
            
            if($scope.day6){
                  $scope.daysSelected.push(6);
            }
           
            if($scope.day7){
                  $scope.daysSelected.push(7);
            }
           
          angular.forEach($scope.daysSelected,function(day,key){
              
//            /  $scope.week=
              
          });
            
            console.log("Selected Days:"+$scope.daysSelected);
            
            return  $scope.daysSelected;
        };
        
        
    }
]);