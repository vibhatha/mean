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
          $scope.getSelectedDays(); 
            var schedule = new Schedules({
                schid: this.schid,
                name: this.name,
                type: this.type,
                start: this.start,
                end:  this.end,
                start1:this.start1,//string represenation of time
                end1:this.end1,// string representation of time
                description: this.description,
                switchon: this.switchon,
                devices:this.devices,
                daily:this.daily,
                week: this.week,
                smartplugs: this.smartplugs
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
            },function(data){
                //$scope.findSmartPlugs();
                // $scope.schedule = {smartplugs : $scope.smartplugList[0]};
              //  console.log("Schedule Edit:")
                //console.log(data)
                $scope.convertSelectedDaysToReadableForm(data.week)
                //console.log(data.week)
            });
        };
        
        

        // Create a new controller method for updating a single schedule
        $scope.update = function() {
        	// Use the schedule '$update' method to send an appropriate PUT request
            $scope.getSelectedDaysEdit();
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
        	
            $scope.deviceList = Devices.query();
            $scope.devices1 = $scope.deviceList[1];
            
        };
        
       $scope.findDevices();
        
        $scope.findSmartPlugs = function() {
        	
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
            $scope.week='';
          angular.forEach($scope.daysSelected,function(day,key){
              
             $scope.week+= day+' ';
              console.log("Selected Day: "+day);
              
          });
            
            console.log( $scope.week);
            
            return  $scope.daysSelected;
        };
       
        //for edit function
        
        $scope.daysSelectedEdit =[];
        
        $scope.getSelectedDaysEdit = function (){
            
             $scope.daysSelectedEdit =[];
            
            if($scope.schedule.day1){
                 $scope.daysSelectedEdit.push(1);
            }
            if($scope.schedule.day2){
                  $scope.daysSelectedEdit.push(2);
            }
            
            if($scope.schedule.day3){
                  $scope.daysSelectedEdit.push(3);
            }
            
            if($scope.schedule.day4){
                  $scope.daysSelectedEdit.push(4);
            }
           
            if($scope.schedule.day5){
                   $scope.daysSelectedEdit.push(5);
            }
            
            if($scope.schedule.day6){
                  $scope.daysSelectedEdit.push(6);
            }
           
            if($scope.schedule.day7){
                  $scope.daysSelectedEdit.push(7);
            }
            $scope.schedule.week='';
          angular.forEach($scope.daysSelectedEdit,function(day,key){
              
              $scope.schedule.week+= day+' ';
              console.log("Selected Day: "+day);
              
          });
            
            console.log( $scope.schedule.week);
            
            return  $scope.daysSelectedEdit;
        };
        
        
        $scope.convertSelectedDaysToReadableForm = function(data){
          
            console.log("Convert days")
            var days = data.split(' ');
            angular.forEach(days,function(day,key){
                console.log(day)
                if(day==1){
                    $scope.schedule.day1 = true;
                   
                }
                if(day==2){
                    $scope.schedule.day2 = true;
                   
                }
                if(day==3){
                    $scope.schedule.day3 =true;
                   
                }
                if(day==4){
                    $scope.schedule.day4 = true;
                   
                }
                if(day==5){
                    $scope.schedule.day5 = true;
                   
                }
                if(day==6){
                    $scope.schedule.day6 = true;
                   
                }
                if(day==7){
                    $scope.schedule.day7 = true;
                   
                }
                
             
            })
            //console.log(days)
        };
        
    }
]);