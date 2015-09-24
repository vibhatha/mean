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
        var fusionDataSetBar=[];
        $scope.categories=[];
        $scope.dataset=[]; 
        $scope.attrs={};
        $scope.dataset1=[];
        
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
                 //console.log(deviceId);
             });//end of foreach
              
                 
          //   console.log("Total Power Per Device: "+totalPower+" KWh");
                 
              
              
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
               //  console.log(device._id);
             });//end of foreach powerList
              
                 
           //  console.log("Total Power Per Device: "+totalPower+" KWh");
                 
              
              
             //  totalPower = Math.ceil(totalPower);  
                
               console.log(device.name);     
               pieChartData.push({key:device.name,y:totalPower});
                  $scope.dataPieChart1 = pieChartData;  
              //  console.log("Pie data:");
             //   console.log($scope.dataPieChart1); 
             
         });//end of query powerList
            
                   //retrieve power for each device start
                   
               
                   
               });   //end of angular foreach             
                
               
            });//end of query
        };
        
        
        
        
        
        
        
      //  $scope.getTotalPowerConsumedPerDevice('559e0c048dfa11781552c9c6');
        
        ////////////////////////////////////////////////////////////
        
        
        //get total power consumption per device per day
        $scope.getTotalPowerConsumptionFromEachDeviceByDay =function(start_date){
            
             var mm = start_date.split('-')[1];
            var dd = start_date.split('-')[2];
            var yy = start_date.split('-')[0];
          
           
            
          
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
                 
               //  console.log("Time: "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());
                // console.log("Day : "+date.getDay()+"/ Year: "+date.getFullYear()+" / Month : "+date.getMonth()+"");
                 if(mm==date.getMonth() && dd==date.getDay() && yy==date.getFullYear()){
                     totalPower+=(consN*10/3600);
                 }
                 
                // console.log(device._id);
             });//end of foreach powerList
              
                 
          //   console.log("Total Power Per Device: "+totalPower+" KWh Based On: "+mm+"/"+dd+"/"+yy);
                 
              
              
             //  totalPower = Math.ceil(totalPower);  
                
               console.log(device.name);     
             
             
         });//end of query powerList
            
                   //retrieve power for each device start
                   
               
                   
               });   //end of angular foreach             
                
               
            });//end of query
        };
        
        
        
            
        
        ///////////////////////////////////////////////////////////////
        
       // get power consumption by year
         $scope.getTotalPowerConsumptionFromEachDeviceByYear =function(start_date){
           
              var mm = start_date.split('-')[1];
            var dd = start_date.split('-')[2];
            var yy = start_date.split('-')[0];
          
           
            
          
             
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
                 
               //  console.log("Time: "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());
              //   console.log("Day : "+date.getDay()+"/ Year: "+date.getFullYear()+" / Month : "+date.getMonth()+"");
                 if( yy==date.getFullYear()){
                     totalPower+=(consN*10/3600);
                 }
                 
               //  console.log(device._id);
             });//end of foreach powerList
              
                 
         //    console.log("Total Power Per Device: "+totalPower+" KWh Based On: Year"+yy);
                 
              
              
             //  totalPower = Math.ceil(totalPower);  
                
              // console.log(device.name);     
             
             
         });//end of query powerList
            
                   //retrieve power for each device start
                   
               
                   
               });   //end of angular foreach             
                
               
            });//end of query
        };
        
        
       ///////////////////////////////////////////////////////////////////
        
        
         $scope.getTotalPowerConsumptionFromEachDeviceByMonth =function(start_date){
            
            var mm = start_date.split('-')[1];
            var dd = start_date.split('-')[2];
            var yy = start_date.split('-')[0];
          
           
            
           
             
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

                 
                     if( mm==date.getMonth() && yy==date.getFullYear() ){
                         totalPower+=(consN*10/3600);
                     }

                 //    console.log(device._id);
                 });//end of foreach powerList
              
                 
          //   console.log("Total Power Per Device: "+totalPower+" KWh Based On: Month:  "+yy+"/"+mm);
                 
              
              
             //  totalPower = Math.ceil(totalPower);  
                
            //   console.log(device.name);     
             
             
         });//end of query powerList
            
                   //retrieve power for each device start
                   
               
                   
               });   //end of angular foreach             
                
               
            });//end of query
        };
        
        
        
       /////////////////////////////////////////
        // yy2 > yy1 and mm1 > mm2
        $scope.getTotalPowerConsumptionFromEachDeviceByMonthRange =function(start_date,end_date){
            
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
                 var consN = parseInt(consumSplit[0]);
                 var milli = date.getTime(); 
                 
               //  console.log("Time: "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());
              //   console.log("Day : "+date.getDay()+"/ Year: "+date.getFullYear()+" / Month : "+date.getMonth()+"");
                var condition1 = (date.getFullYear()>=yy1 && date.getFullYear()<=yy2) ;
                var condition2 = (date.getMonth()>=mm1 && date.getMonth()<=mm2) ; 
                 
                 if( condition1==true && condition2==true ){
                     totalPower+=(consN*10/3600);
                 }
                 
                // console.log(device._id);
             });//end of foreach powerList
              
                 
            // console.log("Total Power Per Device: "+totalPower+" KWh Based On: Month:  "+yy1+"/"+mm1+" - "+yy2+"/"+mm2);
                 
              
              
             //  totalPower = Math.ceil(totalPower);  
                
             //  console.log(device.name);     
             
             
         });//end of query powerList
            
                   //retrieve power for each device start
                   
               
                   
               });   //end of angular foreach             
                
               
            });//end of query
        };
        
        
        
        ///////////////////////////////////////////////////////////////////////////
        
         /////////////////////////////////////////
        // yy2 > yy1 
        $scope.getTotalPowerConsumptionFromEachDeviceByYearRange =function(start_date,end_date){
            
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
                 var consN = parseInt(consumSplit[0]);
                 var milli = date.getTime(); 
                 
               //  console.log("Time: "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());
              //   console.log("Day : "+date.getDay()+"/ Year: "+date.getFullYear()+" / Month : "+date.getMonth()+"");
                var condition1 = (date.getFullYear()>=yy1 && date.getFullYear()<=yy2) ;
           
                 
                 if( condition1==true ){
                     totalPower+=(consN*10/3600);
                 }
                 
               //  console.log(device._id);
             });//end of foreach powerList
              
                 
          //   console.log("Total Power Per Device: "+totalPower+" KWh Based On: Year:  "+yy1+" - "+yy2);
                 
              
              
             //  totalPower = Math.ceil(totalPower);  
                
            //   console.log(device.name);     
             
             
         });//end of query powerList
            
                   //retrieve power for each device start
                   
               
                   
               });   //end of angular foreach             
                
               
            });//end of query
        };
        
        
        
         /////////////////////////////////////////
        // yy2 > yy1 and mm1 > mm2
        $scope.getTotalPowerConsumptionFromEachDeviceByDayRange =function(start_date,end_date){
            
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
                 var consN = parseInt(consumSplit[0]);
                 var milli = date.getTime(); 
                 
               //  console.log("Time: "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());
              //   console.log("Day : "+date.getDay()+"/ Year: "+date.getFullYear()+" / Month : "+date.getMonth()+"");
                var condition1 = (date.getFullYear()>=yy1 && date.getFullYear()<=yy2 );
                var condition2 = (date.getMonth()>=mm1 && date.getMonth()<=mm2) ; 
                var condition3 = (date.getMonth()>=dd1 && date.getMonth()<=dd2) ;  
                 
                 if( condition1==true && condition2==true && condition3==true ){
                     totalPower+=(consN*10/3600);
                 }
                 
               //  console.log(device._id);
             });//end of foreach powerList
              
                 
           //  console.log("Total Power Per Device: "+totalPower+" KWh Based On: Day Range:  "+yy1+"/"+mm1+"/"+dd1+" - "+yy2+"/"+mm2+"/"+dd2);
                 
              
              
             //  totalPower = Math.ceil(totalPower);  
                
               console.log(device.name);     
               
             
         });//end of query powerList
            
                   //retrieve power for each device start
                   
               
                   
               });   //end of angular foreach             
                
               
            });//end of query
        };
        
        
        
        ///////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////
        
        
        
        
        
        
        /////////////////////////////////////////////
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
                  
                        //     console.log("Filtered by Device Name: "+powers.length)                        
                      
                      count++;
                  });// end of foreach loop
                 
            });
            return powers;
            
        };
        
         //optimized query 2 provides overall power consumption through out whole period
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
                   //  console.log("Filtered Device Length:"+deviceList.length);

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
        
        $scope.setGraphDynamically = function(){
            
             $scope.getSearchData();
            if($scope.dataset1.length>0){
                console.log("Graph Data")
                console.log($scope.dataset1)
            }
            
              $scope.attrs = {
                "caption": "",
                "numberprefix": "W",
                "plotgradientcolor": "",
                "bgcolor": "FFFFFF",
                "showalternatehgridcolor": "0",
                "divlinecolor": "CCCCCC",
                "showvalues": "0",
                "showcanvasborder": "0",
                "canvasborderalpha": "0",
                "canvasbordercolor": "CCCCCC",
                "canvasborderthickness": "1",
                "yaxismaxvalue": "",
                "captionpadding": "30",
                "linethickness": "3",
                "yaxisvaluespadding": "1",
                "legendshadow": "0",
                "legendborderalpha": "0",
                "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
                "showborder": "0"
            };
            
            
            $scope.categories = [
    {
        "category": [
            {
                "label": "Jan"
            },
            {
                "label": "Feb"
            },
            {
                "label": "Mar"
            },
            {
                "label": "Apr"
            },
            {
                "label": "May"
            },
            {
                "label": "Jun"
            },
            {
                "label": "Jul"
            },
            {
                "label": "Aug"
            },
            {
                "label": "Sep"
            },
            {
                "label": "Oct"
            },
            {
                "label": "Nov"
            },
            {
                "label": "Dec"
            }
        ]
    }
];
            
            
              $scope.categories1 = [
    {
        "category": [
            {
                "label": "1"
            },
            {
                "label": "2"
            },
            {
                "label": "3"
            },
            {
                "label": "4"
            },
            {
                "label": "5"
            },
            {
                "label": "6"
            },
            {
                "label": "7"
            },
            {
                "label": "8"
            },
            {
                "label": "9"
            },
            {
                "label": "10"
            },
            {
                "label": "11"
            },
            {
                "label": "12"
            },{
                "label": "13"
            },
            {
                "label": "14"
            },
            {
                "label": "15"
            },
            {
                "label": "16"
            },
            {
                "label": "17"
            },
            {
                "label": "18"
            },
            {
                "label": "19"
            },
            {
                "label": "20"
            },
            {
                "label": "21"
            },
            {
                "label": "22"
            },
            {
                "label": "23"
            },
            {
                "label": "24"
            },{
                "label": "25"
            },
            {
                "label": "26"
            },
            {
                "label": "27"
            },
            {
                "label": "28"
            },
            {
                "label": "29"
            },
            {
                "label": "30"
            },
            {
                "label": "31"
            }
           
        ]
    }
];

$scope.dataset = [
    {
        "seriesname": "2013",
        "data": [
            {
                "value": "22400"
            },
            {
                "value": "24800"
            },
            {
                "value": "21800"
            },
            {
                "value": "21800"
            },
            {
                "value": "24600"
            },
            {
                "value": "27600"
            },
            {
                "value": "26800"
            },
            {
                "value": "27700"
            },
            {
                "value": "23700"
            },
            {
                "value": "25900"
            },
            {
                "value": "26800"
            },
            {
                "value": "24800"
            }
        ]
    },
    {
        "seriesname": "2012",
        "data": [
            {
                "value": "10000"
            },
            {
                "value": "11500"
            },
            {
                "value": "12500"
            },
            {
                "value": "15000"
            },
            {
                "value": "16000"
            },
            {
                "value": "17600"
            },
            {
                "value": "18800"
            },
            {
                "value": "19700"
            },
            {
                "value": "21700"
            },
            {
                "value": "21900"
            },
            {
                "value": "22900"
            },
            {
                "value": "20800"
            }
        ]
    }
];
     
              
            
           console.log($scope.dataset1); 
           console.log($scope.categories); 
           
            
        };
        
        
        
        
        
        //dummy graph data///////////////////
        
            
        
        
        
        
        
        
        
        
        //////////////////////////////////////////////
        
        
        $scope.getSearchData= function(){
            
            var start_date = $scope.start_date;
            var end_date = $scope.end_date;
            //var start_time = new Date($scope.start_time);
           // var end_time = new Date($scope.end_time);
          
        //    console.log(start_date);
        //    console.log(end_date);
             
            var mm1 = start_date.split('-')[1].toString();
            var dd1 = start_date.split('-')[2].toString();
            var yy1 = start_date.split('-')[0].toString();
          
        //    console.log(yy1+"-"+mm1+"-"+dd1)
            
            var mm2 = end_date.split('-')[1].toString();
            var dd2 = end_date.split('-')[2].toString();
            var yy2 = end_date.split('-')[0].toString();
          
       //     console.log(yy2+"-"+mm2+"-"+dd2)
            
      //  $scope.getTotalPowerConsumptionFromEachDeviceByDay(start_date);

      //  $scope.getTotalPowerConsumptionFromEachDeviceByYear(yy1);
            
        $scope.getPowerPerMonthGraph(start_date);        

       $scope.getTotalPowerConsumptionFromEachDeviceByMonth(start_date);


      //  $scope.getTotalPowerConsumptionFromEachDeviceByMonthRange(start_date,end_date);
      //  $scope.getTotalPowerConsumptionFromEachDeviceByYearRange(yy1,yy2);
       // $scope.getTotalPowerConsumptionFromEachDeviceByDayRange(start_date,end_date);
     //   $scope.getPowerPerDayGraph(start_date);
       
            
        };
        
        
      
        
        //fusion chart dummy data source
        
     


       
        
        //plot graph for a year
        
        $scope.getPowerPerMonthGraph = function(start_date){
           
            var mm = start_date.split('-')[1];
            var dd = start_date.split('-')[2];
            var yy = start_date.split('-')[0];
            $scope.dataset1=[];
            var maxPar =0;
          
            var data=[];
            var monthlist = [{key:'1',month:'1'},{key:'2',month:'2'},{key:'3',month:'3'},{key:'4',month:'4'},
                            {key:'5',month:'5'},{key:'6',month:'6'},{key:'7',month:'7'},{key:'8',month:'8'},                                {key:'9',month:'9'},{key:'10',month:'10'},{key:'11',month:'11'},{key:'12',month:'12'}];
          
             Devices.query({},function(data){
                
                   angular.forEach(data, function(device,key){

                    var plotData = [];
                    var plotObject=[];       
                       //retrieve power for each device start

                     var powerList = Powers.query({devices:device._id},function(){
                     
                         console.log(device._id)
                         angular.forEach(monthlist,function(val,key){
                             var totalPower=0;
                           //  console.log(device._id+" "+(key+1))
                            
                             
                             angular.forEach(powerList,function(power,key){

                                 var date = new Date(power.created);
                                 var consumption = power.consumption;
                                 var consumSplit = consumption.split('W');
                                 var consN = parseInt(consumSplit[0]);
                                 var milli = date.getTime(); 

                                 
                                 if( (val.month)==date.getMonth() && yy==date.getFullYear() ){
                                     totalPower+=(consN*10/3600);
                                 }

                           
                         });//end of foreach powerList

                             //   console.log("Power of Month "+(val.month)+" : "+totalPower)
                                plotData.push({value:totalPower});
                             if(maxPar==0){
                                 maxPar=totalPower;
                             }else if(totalPower>maxPar){
                                 maxPar=totalPower;
                             }else{
                                 maxPar=maxPar;
                             }                           
                         });//end of month base for loop
                            //    console.log(device._id+"--"+plotData.length) 
                                plotObject.push({seriesname:device.name,data:plotData});
                                data.push(plotObject);
                                $scope.dataset1.push({seriesname:device.name,data:plotData});
                                $scope.attrs.caption='Power Consumption - '+yy;
                                console.log("maxPar: "+maxPar)
                                $scope.attrs.yaxismaxvalue = Math.ceil(maxPar);
                            //    console.log($scope.dataset1);
                         
                         
                     
             });//end of query powerList
            
                   //retrieve power for each device start
          
            
                   
                   });   //end of angular foreach         
                  
                              
            });//end of query   
            
        };
        
        
        
        /////////////////////////////////////////////////////////////////////////////////////
        
        //get power consumption per month
        
        $scope.getPowerPerDayGraph = function(start_date){
           
            var mm = start_date.split('-')[1];
            var dd = start_date.split('-')[2];
            var yy = start_date.split('-')[0];
            $scope.dataset1=[];
            var maxPar =0;
            var days = [];
            for (var i=1; i<=31; i++) {
                  days.push({day:i});  
            }
            console.log('Days: ')
            console.log(days)
            
          
            var data=[];
            var monthlist = [{key:'1',month:'1',days:31},{key:'2',month:'2',days:31},{key:'3',month:'3',days:31},{key:'4',month:'4',days:31},{key:'5',month:'5',days:31},{key:'6',month:'6',days:31},{key:'7',month:'7',days:31},{key:'8',month:'8',days:31},{key:'9',month:'9',days:31},{key:'10',month:'10',days:31},{key:'11',month:'11',days:31},{key:'12',month:'12',days:31}];
          
             Devices.query({},function(data){
                
                   angular.forEach(data, function(device,key){

                    var plotData = [];
                    var plotObject=[];       
                       //retrieve power for each device start

                     var powerList = Powers.query({devices:device._id},function(){
                     
                         console.log(device._id)
                         angular.forEach(monthlist,function(val,key){
                             var totalPower=0;
                           //  console.log(device._id+" "+(key+1))
                            angular.forEach(days,function(val1,key){//days loop start
                                
                                
                                 angular.forEach(powerList,function(power,key){

                                 var date = new Date(power.created);
                                 var consumption = power.consumption;
                                 var consumSplit = consumption.split('W');
                                 var consN = parseInt(consumSplit[0]);
                                 var milli = date.getTime(); 

                                 
                           if( (val.month)==date.getMonth() && yy==date.getFullYear() && val1.day==date.getDay() ){
                                     totalPower+=(consN*10/3600);
                                 }

                           
                            });//end of foreach powerList
                            plotData.push({value:totalPower});
                             if(maxPar==0){
                                 maxPar=totalPower;
                             }else if(totalPower>maxPar){
                                 maxPar=totalPower;
                             }else{
                                 maxPar=maxPar;
                             }     
                                
                                 plotObject.push({seriesname:device.name,data:plotData});
                                data.push(plotObject);
                                $scope.dataset1.push({seriesname:device.name,data:plotData});
                                $scope.attrs.caption='Power Consumption - '+yy;
                                console.log("maxPar: "+maxPar)
                                $scope.attrs.yaxismaxvalue = Math.ceil(maxPar);

                                console.log("Power of Month "+(val1.day)+" : "+totalPower)
                                
                            });//days loop end
                             
                               
                            
                         });//end of month base for loop
                           
                            
                           
                         
                         
                     
             });//end of query powerList
            
                   //retrieve power for each device start
          
            
                   
                   });   //end of angular foreach         
                  
                              
            });//end of query   
            
        };
        
        
        
        
        
        
        
        
        
        
        
        
        
        
            
    }
      //////////////////////////////////////////////////////////////////////////////////
                                                         
     //Data Filtering 
                                                         
                                    
                                                         
                                                         
]);