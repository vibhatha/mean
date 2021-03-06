// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'graphs' controller
angular.module('graphs').controller('GraphsController', ['$scope', '$routeParams', '$location', 'Authentication', 'Graphs','Powers','Devices',
    function($scope, $routeParams, $location, Authentication, Graphs,Powers,Devices) {
    	// Expose the Authentication service
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
        
        $scope.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
               x: function(d){return new Date(d.x);},//x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ms)'/*,
                     xTickFormat: function(d) {
                    return d3.format('.02f')(d)
                     }*/,
                     tickFormat: function(d) {
                        return d3.time.format('%x')(new Date(d));
                    },
                },
                yAxis: {
                    axisLabel: 'Voltage (v)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 10
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Title for Line Chart'
            },
            subtitle: {
                enable: true,
                text: '<h2>Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.</h2>',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: 'Sinosoidal Graphs',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };

        $scope.data = sinAndCos();

        /*Random Data Generator */
        function sinAndCos() {
            var sin = [],sin2 = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
          /*  for (var i = 0; i < 100; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
                cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
            }*/
            
          sin2 =getPowerFilteredByDevice1('55a83c09b930289016cba6a9');
         //  cos =getPowerFilteredByDevice('Heater');    
            //cos= getPowerByDevice('Device 1');
            //sin2 =getPowerByDevice('Heater');
            //cos=  getPowerByDevice('Device 1');
           // cos =getPowerFilteredByDevice1('559e0c048dfa11781552c9c6');
          //  sin2=getPowerFilteredByDevice1('55a83c09b930289016cba6a9');
           // console.log("Device by Power");
           // console.log(cos.length+"---"+sin2.length);

            //Line chart data should be sent as an array of series objects.
            return [
                {
                    values: sin,      //values - represents the array of {x,y} data points
                    key: 'All', //key  - the name of the series.
                    color: '#ff7f0e'  //color - optional: choose your own line color.
                },
                {
                    values: cos,
                    key: 'Device 1',
                    color: '#2ca02c'
                },
                {
                    values: sin2,
                    key: 'Heater',
                    color: '#7777ff',
                    area: true      //area - set to true if you want this line to turn into a filled area chart.
                }
            ];
        };
        
        
        
        $scope.data1 = "man";
        
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
                transitionDuration: 500,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        return d3.time.format('%x')(new Date(d))
                    },
                    rotateLabels: 50,
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: 35,
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
        
        
        ////////////////
        
         $scope.optionsLineWithFocus = {
            chart: {
                type: 'lineWithFocusChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 40
                },
                transitionDuration: 500,
                xAxis: {
                    axisLabel: 'X Axis of Line With Focus',
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }, rotateLabels: 50,
                    showMaxMin: false
                },
                x2Axis: {
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis of Line With Focus',
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    },
                    rotateYLabel: false
                },
                y2Axis: {
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    }
                }
                

            }
        };

        $scope.dataLineWithFocus = generateData();
        
        /* Random Data Generator (took from nvd3.org) */
        function generateData() {
            return stream_layers(3,10+Math.random()*200,.1).map(function(data, i) {
                return {
                    key: 'Stream' + i,
                    values: data
                };
            });
        }

        /* Inspired by Lee Byron's test data generator. */
        function stream_layers(n, m, o) {
            if (arguments.length < 3) o = 0;
            function bump(a) {
                var x = 1 / (.1 + Math.random()),
                    y = 2 * Math.random() - .5,
                    z = 10 / (.1 + Math.random());
                for (var i = 0; i < m; i++) {
                    var w = (i / m - y) * z;
                    a[i] += x * Math.exp(-w * w);
                }
            }
            return d3.range(n).map(function() {
                var a = [], i;
                for (i = 0; i < m; i++) a[i] = o + o * Math.random();
                for (i = 0; i < 5; i++) bump(a);
                return a.map(stream_index);
            });
        }

        /* Another layer generator using gamma distributions. */
        function stream_waves(n, m) {
            return d3.range(n).map(function(i) {
                return d3.range(m).map(function(j) {
                    var x = 20 * j / m - i / 3;
                    return 2 * x * Math.exp(-.5 * x);
                }).map(stream_index);
            });
        }

        function stream_index(d, i) {
            return {x: i, y: Math.max(0, d)};
        }
        /////////////////////////////////////////////////////////////
        
        
        
        
        
        
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
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        ///////////////////////////////////////////////////////////////////
        
        
        
        ////////////////////////////////////////////////////////////
        
        
         $scope.optionsSparklinPlus = {
            chart: {
                type: 'sparklinePlus',
                height: 450,
                x: function(d, i){return i;},
                xTickFormat: function(d) {
                    return d3.time.format('%x')(new Date($scope.dataSparklinPlus[d].x))
                },
                transitionDuration: 250,
                xAxis: {
                    axisLabel: 'X Axis'
                   
                },
                yAxis: {
                    axisLabel: 'Y Axis'
                }
            }
             
             
             
             
        };

        //$scope.data = sine();
        //$scope.dataSparklinPlus = volatileChart(130.0, 0.02);
        //$scope.data = volatileChart(25.0, 0.09,30);
         $scope.dataSparklinPlus = getPowerFilteredByDevice1('55a83c09b930289016cba6a9');

        /* Random Data Generator (took from nvd3.org) */
        function sine() {
            var sin = [];
            var now =+new Date();

            for (var i = 0; i < 100; i++) {
                sin.push({x: now + i * 1000 * 60 * 60 * 24, y: Math.sin(i/10)});
            }

            return sin;
        }

        function volatileChart(startPrice, volatility, numPoints) {
            var rval =  [];
            var now =+new Date();
            numPoints = numPoints || 100;
            
            var powerList = Powers.query({},function(){
            
                //console.log('Powers in Graph: '+powerList.length);
                angular.forEach(powerList,function(power,key){
                            
                    var date = new Date(power.created);
                    var milli = date.getTime();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();
                    var consumption = power.consumption;
                    var consumSplit = consumption.split('W');
                    var consN = consumSplit[0];
                    
                    
                    var timestamp = hours+":"+minutes+":"+seconds;
                    var day = date.getDate();
                    rval.push({x: milli, y: consN});
                 // console.log(day);
               //   console.log(timestamp);
                 // console.log(consN);
                                
                });
            });
            
           /* for(var i = 1; i < numPoints; i++) {

                rval.push({x: now + i * 1000 * 60 * 60 * 24, y: startPrice});
                var rnd = Math.random();
                var changePct = 2 * volatility * rnd;
                if ( changePct > volatility) {
                    changePct -= (2*volatility);
                }
                startPrice = startPrice + startPrice * changePct;
            }*/
            return rval;
        }
        
        
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
                 count++;
             });
             console.log("Filtered Device Length:"+deviceList.length);
             
         });
            
        
         return powers  ; 
        };
          
        
     //getPowerFilteredByDevice1();
        
    }
]);