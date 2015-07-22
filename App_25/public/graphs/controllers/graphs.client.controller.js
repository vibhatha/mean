// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'graphs' controller
angular.module('graphs').controller('GraphsController', ['$scope', '$routeParams', '$location', 'Authentication', 'Graphs','Powers','Devices','SmartPlugs',
    function($scope, $routeParams, $location, Authentication, Graphs,Powers,Devices,SmartPlugs) {
    	// Expose the Authentication service
        var powerTimeConstant=10;
        
        $scope.authentication = Authentication;

        // Create a new controller method for creating new graphs
        $scope.create = function() {
        	// Use the form fields to create a new graph $resource object
            var graph = new Graphs({
                title: this.title,
                content: this.content
            });

            // Use the graph '$save' method to send an appropriate POST request
            graph.$save(function(response) {
            	// If an graph was created successfully, redirect the user to the graph's page 
                $location.path('graphs/' + response._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of graphs
        $scope.find = function() {
        	// Use the graph 'query' method to send an appropriate GET request
            $scope.graphs = Graphs.query();
        };

        // Create a new controller method for retrieving a single graph
        $scope.findOne = function() {
        	// Use the graph 'get' method to send an appropriate GET request
            $scope.graph = Graphs.get({
                graphId: $routeParams.graphId
            });
        };

        // Create a new controller method for updating a single graph
        $scope.update = function() {
        	// Use the graph '$update' method to send an appropriate PUT request
            $scope.graph.$update(function() {
            	// If an graph was updated successfully, redirect the user to the graph's page 
                $location.path('graphs/' + $scope.graph._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single graph
        $scope.delete = function(graph) {
        	// If an graph was sent to the method, delete it
            if (graph) {
            	// Use the graph '$remove' method to delete the graph
                graph.$remove(function() {
                	// Remove the graph from the graphs list
                    for (var i in $scope.graphs) {
                        if ($scope.graphs[i] === graph) {
                            $scope.graphs.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the graph '$remove' method to delete the graph
                $scope.graph.$remove(function() {
                    $location.path('graphs');
                });
            }
        };
        
        /////////////////////////////////////////////////////////////////////////////////
        //////////     ____   ___     __    ____              ///////////////////////////
        //////////     || __ ||__|| //__\\ ||___|| ||___||    //////////////////////////
        //////////     ||___|||  \\ ||  || ||      ||   ||    //////////////////////////
        /////////                                             //////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        //code segment to get data to graph
        
    
        
        
        
        $scope.data1 = "man";
        var pieChartData =[];
        //Historical Graphs
        
         $scope.dataoptionsHistorical=[];
        var dataSetBar1 =[];
        
        $scope.setDateAndPower= function(){
       
       
           var dataSet = [];
                   var powerList = Powers.query({},function(){
            
            //    console.log('Powers in Graph: '+powerList.length);
                angular.forEach(powerList,function(power,key){
                            
                    var date = new Date(power.created);
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();
                    var consumption = power.consumption;
                    var consumSplit = consumption.split('W');
                    var consN = consumSplit[0];
                    
                    
                    var timestamp = hours+":"+minutes+":"+seconds;
                    var day = date.getDate();
                    var milliseconds = date.getTime();
                    dataSet.push({dates:milliseconds,powers:consN});
                    dataSetBar1.push([milliseconds,consN])
                                
                });
                       
                console.log(dataSet.length); 
                console.log(dataSetBar1[0]);
            });
       
     
           
           return dataSet;
       
       }; 
        
        //storing data in the array for the bar chart
      $scope.setDateAndPower();
        
        
        
        $scope.optionsHistorical = {
            chart: {
                type: 'historicalBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 50
                },
                x: function(d){return d[0];},
                y: function(d){return d[1];},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.1f')(d);
                },
                transitionDuration: 30,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        return d3.time.format('%x')(new Date(d))
                    },
                    rotateLabels: 10,
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: 10,
                    tickFormat: function(d){
                        return d3.format(',.1f')(d);
                    }
                }
            }
        };
        
        var dataSetBar = [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]];

        $scope.dataoptionsHistorical = [
            {
                "key" : "Quantity" ,
                "bar": true,
                "values" : dataSetBar1
            }];
        
   
        
        $scope.optionsPieChart = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                transitionDuration: 500,
                labelThreshold: 0.01,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.dataPieChart = [
            {
                key: "One",
                y: 60
            },
            {
                key: "Two",
                y: 60
            },
            {
                key: "Three",
                y: 60
            },
            {
                key: "Four",
                y: 60
            },
            {
                key: "Five",
                y: 60
            },
            {
                key: "Six",
                y: 60
            }
        ];
        
        
        
       
        //method loads data to the pie chart dynamically
        $scope.setDataToPieChart = function (){
            
            
            
        };
        
        
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
                 console.log(deviceId);
             });//end of foreach
              
                 
             console.log("Total Power Per Device: "+totalPower+" KWh");
                 
              
              
               totalPower = parseInt(totalPower);  
                 
             
         });//end of query
            
         return totalPower;
            
        };
        
        ///////////////////////////////////////////////////////////////////
        $scope.getTotalPowerConsumptionFromEachDevice =function(){
            
            Devices.query({},function(data){
                
               angular.forEach(data, function(device,key){
                   
                   
                   
                   //retrieve power for each device start
                   
             var powerList = Powers.query({devices:device._id},function(){
             var totalPower=0;
             angular.forEach(powerList,function(power,key){
                 
                 var date = new Date(power.created);
                 var consumption = power.consumption;
                 var consumSplit = consumption.split('W');
                 var consN = parseInt(consumSplit[0]);
                 var milli = date.getTime(); 
                 totalPower+=(consN*10/3600);
                 console.log(device._id);
             });//end of foreach powerList
              
                 
             console.log("Total Power Per Device: "+totalPower+" KWh");
                 
              
              
               totalPower = Math.ceil(totalPower);  
                
               console.log(device.name);     
               pieChartData.push({key:device.name,y:totalPower});
                  $scope.dataPieChart1 = pieChartData;  
                console.log("Pie data:");
                console.log($scope.dataPieChart1); 
             
         });//end of query powerList
            
                   //retrieve power for each device start
                   
               
                   
               });   //end of angular foreach             
                
               
            });//end of query
        };
        
        
      //  $scope.getTotalPowerConsumedPerDevice('559e0c048dfa11781552c9c6');
        
        ////////////////////////////////////////////////////////////
        
         $scope.getTotalPowerConsumptionFromEachDevice();
       
         $scope.getDates = genDates();
             
             
           
            
         function genDates(){
        
            var dates=[];
             var powerList = Powers.query({},function(){
            
              //  console.log('Powers in Graph: '+powerList.length);
                angular.forEach(powerList,function(power,key){
                            
                    var date = new Date(power.created);
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();
                    var consumption = power.consumption;
                    var consumSplit = consumption.split('W');
                    var consN = consumSplit[0];
                    
                    
                    var timestamp = hours+":"+minutes+":"+seconds;
                    var day = date.getDate();
                    var milliseconds = date.getTime();
                    dates.push(milliseconds);
                    
                                
                });
            });
                  return dates;
                  
        }
                                           
       $scope.getPowers = genPowers();
                                           
         function genPowers(){
              
              var powers=[];
             var powerList = Powers.query({},function(){
            
            //    console.log('Powers in Graph: '+powerList.length);
                angular.forEach(powerList,function(power,key){
                            
                    var date = new Date(power.created);
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();
                    var consumption = power.consumption;
                    var consumSplit = consumption.split('W');
                    var consN = consumSplit[0];
                    
                    
                    var timestamp = hours+":"+minutes+":"+seconds;
                    var day = date.getDate();
                    var milliseconds = date.getTime();
                    powers.push(consN);
                 
                                
                });
            });
                  return powers;
                  
           
       }
        
          
        
       $scope.getDeviceById=function(id){
             var deviceInfo = [];       
             var id =0;
            
             var keepGoing = true;
             var deviceList = Devices.query({},function(){
            
            
                    angular.forEach(deviceList,function(device,key){


                        if(keepGoing){

                              if(device._id==id){
                                   id = device.id;
                                   deviceInfo[0]=id;
                                   deviceInfo[1]=device.name;
                                   keepGoing=false;    
                               }//end if
                        }//end if


                    });//end of for each

                });//end of query

               return deviceInfo;
        
        }
        
        
        function getPowerByDevice (name){
        
       
         //var device = $scope.getDeviceByName(name);
         //console.log("Name of Device: "+name);
         var deviceInfo =[];   
         var powers=[];
         var keepGoing = true;
         var powerList = Powers.query({},function(){

        //    console.log('Powers in Graph: '+powerList.length);
            angular.forEach(powerList,function(power,key){

              
               

   
                //querying the devices START
              if(true){

                 var deviceList = Devices.query({},function(){

                 
                    angular.forEach(deviceList,function(device,key){
                        
                      //  console.log("device length:"+deviceList.length);
                        if(true){

                              if(angular.equals(device.name,name)){
                                    var date = new Date(power.created);
                                    var consumption = power.consumption;
                                    var consumSplit = consumption.split('W');
                                    var consN = consumSplit[0];
                                    var milliseconds = date.getTime();
                
                                   var  id = device._id;
                                   deviceInfo[0]=id;
                                   deviceInfo[1]=device.name;
                                   keepGoing=false;    
                                 // console.log(device.name+" "+name);
                                   //  console.log(power.devices+" -- "+deviceInfo[0]);
                                    if(angular.equals(power.devices,deviceInfo[0])){
                                         powers.push({x: milliseconds, y: consN});
                                       
                                     //   console.log("Relevant Power: "+consN);
                                    }//end if angular power equal
                               }//end if
                        }//end if


                 });//end of for each

                    
            });//end of query
          } //end if keep going   
             
                 
    
                    
                });//end angular for each
            
            });// end Power Query
            
        
            return powers;
        
        
        }
        
        
        
        //Advanced Query Testing
        
        //optimized query 1
        function getPowerFilteredByDevice (name){
            
            
          var powers=[];
           $scope.powers = Powers.query({}, function() {
                   var deviceId=0; 
                  var count=0;
               
                  angular.forEach($scope.powers, function(power, key) {
                            
                      
                      
                      var idevice = Devices.get({deviceId:power.devices},function(){
                            
                           power.devices=idevice.name;
                          if(angular.equals(name,idevice.name)){
                              deviceId= idevice._id;
                                    var date = new Date(power.created);
                                    var consumption = power.consumption;
                                    var consumSplit = consumption.split('W');
                                    var consN = consumSplit[0];
                                    var milliseconds = date.getTime();
                              
                                powers.push({x: date, y: consN});
                               
                          }
                        
                          
                      });//end of Devices query
                  
                             console.log("Filtered by Device Name: "+powers.length)                        
                      
                      count++;
                  });// end of foreach loop
                 
            });
            return powers;
            
        };
        
         //optimized query 2
        function getPowerFilteredByDevice1 (deviceId){
           //
            var powers =[];
            dataSetBar1=[];
             var count=0; 
         var deviceList = Powers.query({devices:deviceId},function(){
           
             angular.forEach(deviceList,function(power,key){
                 
                 var date = new Date(power.created);
                 var consumption = power.consumption;
                 var consumSplit = consumption.split('W');
                 var consN = consumSplit[0];
                 var milli = date.getTime(); 
                // var minute =date.getMinutes();
                
                 powers.push({x: milli, y: consN});
                  dataSetBar1.push([milli,consN])
                 count++;
             });
             console.log("Filtered Device Length:"+deviceList.length);
             
         });
            
        
         return powers  ; 
        };
          
        
     //getPowerFilteredByDevice1();
        
        
        
        //Data Filtering 
        
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
                          
        
        
        $scope.getSelectedDeviceForPower = function(){
          
          if($scope.devices){
               console.log($scope.devices._id);
              getPowerFilteredByDevice1($scope.devices._id);
               $scope.dataoptionsHistorical = [
            {
                "key" : "Quantity" ,
                "bar": true,
                "values" : dataSetBar1
            }];
              
          }  
         
            
            
        };
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    }
      //////////////////////////////////////////////////////////////////////////////////
                                                         
     //Data Filtering 
                                                         
                                    
                                                         
                                                         
]);