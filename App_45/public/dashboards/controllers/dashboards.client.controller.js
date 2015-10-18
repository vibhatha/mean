// Invoke 'strict' JavaScript mode
'use strict';
var app = angular.module('dashboards', ['ngMaterial']);
// Create the 'Dashboards' controller
angular.module('dashboards').controller('DashboardsController', ['$scope','$q','$mdDialog','$window','$timeout' ,'$routeParams', '$location', 'Authentication', 'Dashboards','Powers','Devices','SmartPlugs','ngDialog','$interval', 'roundProgressService',
    function($scope,$q,$mdDialog,$window,$timeout, $routeParams, $location, Authentication, Dashboards,Powers,Devices,SmartPlugs,ngDialog,$interval, roundProgressService) {
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
        
        ///////////////////////////////////////////////
       //device list and functions
        
         $scope.switchdata = {
            cb1: true,
            cb4: true,
            cb5: false
          };
        
   
        
        
        
        ///////////////////////////////////////////////
        
        
        
        
        
        ///////////////////////////////////////////////////
        //angular material table
        $scope.data = {
          selectedIndex: 0,
          secondLocked:  false,
          secondLabel:   "Item Two",
          bottom:        false
        };
    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };
    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };
     
        
        
        ////////////////////////////////////////////////
        
        //table 2 template start
        
      
  //angular material alert box start
      $scope.status = '  ';   
        $scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,//DialogController
      templateUrl: 'dialog1.tmpl.html',
      //scope:$scope,    
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };

$scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
  
  //angular material alert box ends 
  $scope.isDeviceSelected =false;      
  
        
        //table 2 template ends
        
        /////////////////////////////////////////////////////
        
        
       
        var mainList =[{id:0,name:'Yesterday'},{id:1,name:'Today'},{id:2,name:'Current Month'},{id:3,name:'Last Month'},{id:4,name:'Overall'}];
        $scope.filterOption = mainList[4].id;
        $scope.mainListItems = mainList;
        
        
        //setting main views on and off start
        $scope.costOfOneKWh = parseFloat(2.50);
        
        $scope.basic = true;
        $scope.analytics =true;
        $scope.analytics_name='Analytics';
        $scope.todayGraph=true;
        $scope.yesterdayGraph = true;
        $scope.lastMonthGraph = true;
        
        $scope.setAnalyticView = function(){
           $scope.setStreamLineChartData(); 
            if($scope.analytics==false){
                
                $scope.analytics=true;
                $scope.basic=false;
                $scope.analytics_name='Basic';
                
                console.log($scope.attrs);
                console.log($scope.categories);
                console.log($scope.dataset)
                
                
            }else{
                
                $scope.analytics=false;
                $scope.basic=true;
                $scope.analytics_name='Analytics';
            }
            
        };
        
        $scope.getMonthGraph = function(){
         //$scope.setThisMonthGraphData();  
          $scope.getPowerPerDayGraph('2015-07-18');
            if($scope.analytics==true){
                $scope.analytics=false;
                $scope.lastMonthGraph=true;
                $scope.todayGraph=true;
                $scope.yesterdayGraph=true;
            }else{
                $scope.analytics=true;
                $scope.lastMonthGraph=true;
                $scope.todayGraph=true;
                $scope.yesterdayGraph=true;
            }
            
            
        };
        
        
        $scope.getLastMonthGraph = function(){
            $scope.getPowerPerDayGraph('2015-07-18');
            if($scope.lastMonthGraph==true){
                $scope.lastMonthGraph=false;
                $scope.analytics=true;
                $scope.todayGraph=true;
                $scope.yesterdayGraph=true;
            }else{
                $scope.lastMonthGraph=true;
                $scope.analytics=true;
                $scope.todayGraph=true;
                $scope.yesterdayGraph=true;
            }
            
            
        };
        
        $scope.getTodayGraph = function(){
           $scope.getPowerPerHourGraph('2015-07-18'); 
            if($scope.todayGraph==true){
                $scope.todayGraph=false;
                $scope.yesterdayGraph=true;
                $scope.lastMonthGraph=true;
                $scope.analytics=true;
            }else{
                $scope.todayGraph=true;
                $scope.yesterdayGraph=true;
                $scope.lastMonthGraph=true;
                $scope.analytics=true;
            }
            
            
        };
        $scope.getYesterdayGraph = function(){
           $scope.getPowerPerHourGraph('2015-07-18');   
            if($scope.yesterdayGraph==true){
                $scope.yesterdayGraph=false;
                $scope.todayGraph=true;
                $scope.lastMonthGraph=true;
                $scope.analytics=true;
            }else{
                $scope.yesterdayGraph=true;
                $scope.todayGraph=true;
                $scope.lastMonthGraph=true;
                $scope.analytics=true;
            }
            
            
        };
        
        
        
        $scope.setGraphViews = function(){
          
          //  $scope.getMonthGraph();
          //  $scope.getLastMonthGraph();
          //  $scope.getTodayGraph();
          //  $scope.getYesterdayGraph();
            
        };
        
        //setting main views on and off end
       
        
        //set graph data holding variables start
        //this month power
        $scope.categories2=[];       
        $scope.attrs2={};
        $scope.dataset2=[];
        //this month cost
        $scope.categories3=[];       
        $scope.attrs3={};
        $scope.dataset3=[];
        //last month power
        $scope.categories4=[];       
        $scope.attrs4={};
        $scope.dataset4=[];
        //last month cost
        $scope.categories5=[];       
        $scope.attrs5={};
        $scope.dataset5=[];
        //today power
        $scope.categories6=[];       
        $scope.attrs6={};
        $scope.dataset6=[];
        
        //yesterday power
        $scope.categories7=[];       
        $scope.attrs7={};
        $scope.dataset7=[];
        
        
        //today cost
        $scope.categories8=[];       
        $scope.attrs8={};
        $scope.dataset8=[];
        
        
        //yesterday cost
        $scope.categories9=[];       
        $scope.attrs9={};
        $scope.dataset9=[];
        
        
        //set graph data holding variables end
        
        
        $scope.setGraphAttributes = function(){
            
         //for this month graph 
             $scope.attrs2 = {
                "caption": "",
                "numberprefix": " KWh ",
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
            
            
            
              $scope.categories2 = [
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
            
            
            //for cost section
            
             $scope.attrs3 = {
                "caption": "",
                "numberprefix": " LKR ",
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
            
            
            
              $scope.categories3 = [
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
            
            //last month cost and power section
            
            
              $scope.attrs4 = {
                "caption": "",
                "numberprefix": " KWh ",
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
            
            
            
              $scope.categories4 = [
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
            
            
            //for cost section
            
             $scope.attrs5 = {
                "caption": "",
                "numberprefix": " LKR ",
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
            
            
            
              $scope.categories5 = [
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
            
     //today and yesterday
            
            
             $scope.attrs6 = {
                "caption": "",
                "numberprefix": " KWh ",
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
            
                $scope.categories6 = [
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
            }
        ]
    }
];
            
            
               $scope.attrs8 = {
                "caption": "",
                "numberprefix": " LKR ",
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
            
                $scope.categories8 = [
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
            }
        ]
    }
];
            
            
            //for yesterday
            
              
             $scope.attrs7 = {
                "caption": "",
                "numberprefix": " KWh ",
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
            
                $scope.categories7 = [
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
            }
        ]
    }
];
            
            
              $scope.attrs9 = {
                "caption": "",
                "numberprefix": " LKR ",
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
            
                $scope.categories9 = [
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
            }
        ]
    }
];
            
            
            
            
            
        };
        
        $scope.setGraphAttributes();
        //calculation constants for power consumption cost end
        
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
         $scope.no_of_days_for_total_power=0;
        
        
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
        
        $scope.date_range_device_wise_power_list=[];
        
        $scope.dateRangesummaryOnMaximumPowerUsagePerDevice =[];
        $scope.dateRangemaxPowerUserInfo=[];
        $scope.dateRangeminPowerUserInfo=[];
        $scope.dateRangeDateInfo=[];
        
        
        
        $scope.getTotalPowerConsumptionFromEachDeviceByDayRange =function(start_date,end_date){
            var powerData=[];
            
            $scope.dateRangesummaryOnMaximumPowerUsagePerDevice=[];
            $scope.date_range_device_wise_power_list=[];
            $scope.dateRangemaxPowerUserInfo=[];
            $scope.dateRangeminPowerUserInfo=[];
            $scope.dateRangeDateInfo=[];
            
            var mm1 = start_date.split('-')[1];
            var dd1 = start_date.split('-')[2];
            var yy1 = start_date.split('-')[0];
          
           $scope.dateRangeDateInfo.push({start_date:start_date,end_date:end_date});
            
            var mm2 = end_date.split('-')[1];
            var dd2 = end_date.split('-')[2];
            var yy2 = end_date.split('-')[0];
          
           
             
            Devices.query({},function(data){
                
                 
                 var max=0;
                 var maxDevice='';
                 var min=10000000000000;
                 var minDevice='';    
               
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
                 
            //calculate max and min power summary starts     
                 
                 if(max<totalPower){
                            $scope.dateRangemaxPowerUserInfo.splice(0,1);
                            max=totalPower.toFixed(2);
                            maxDevice=device.name;
                            $scope.dateRangemaxPowerUserInfo.push({maxDevice:maxDevice,max:max});
                             console.log(max+" <max> "+totalPower)
                        }
                        
                        //min power using device
                        if(min>totalPower){
                            $scope.dateRangeminPowerUserInfo.splice(0,1);
                            min=totalPower.toFixed(2);
                            minDevice=device.name;
                            $scope.dateRangeminPowerUserInfo.push({minDevice:minDevice,min:min});
                            console.log(min+" <min> "+totalPower)
                        }
                 
                 
                 //calculate the cost for power consumption start
                 
                 
                   var start= new Date($scope.start_date);
                  var end= new Date($scope.end_date);
        
          
            
                 var diff = Math.round((end-start)/(1000*60*60*24));
            
           // console.log('no of days : '+diff);
            var cost=[];
            cost= $scope.calculateCostPerMonth(totalPower.toFixed(2),diff,0);
            //console.log('Cost Array')
            //console.log(cost);     
                 
                 
                 
                 //calculate the cost for power consumption end
                        
                        
 $scope.dateRangesummaryOnMaximumPowerUsagePerDevice.push({device:device.name, power:totalPower.toFixed(2),cost:cost[0].energy_cost});
                 
                 
            //calculate max and min power summary ends     
                 
               $scope.date_range_device_wise_power_list.push({device:device.name,power:totalPower});
                 
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
            
            var start= new Date($scope.start_date);
            var end= new Date($scope.end_date);
        
            //console.log('start: '+start);
           // console.log('end: '+end);
            
            var diff = Math.round((end-start)/(1000*60*60*24));
            
           // console.log('no of days : '+diff);
            
             $scope.calculateCostPerMonth($scope.total_power_consumption_per_date_range,diff,0);
            
            var cost = $scope.costOfConsumptionPerDateRange;
        
            
            $scope.jsonData1 = {power: $scope.total_power_consumption_per_date_range,daterange: $scope.search_date_range,               moreinfo:$scope.date_range_device_wise_power_list,summary:$scope.dateRangesummaryOnMaximumPowerUsagePerDevice,maxInfo: $scope.dateRangemaxPowerUserInfo,minInfo:$scope.dateRangeminPowerUserInfo,dateRange:$scope.dateRangeDateInfo,totalCost:cost};
            
            
           
            
            
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
        
        
        
        
        $scope.setDataForNgDialogActivationTime = function(){
           
           var active_time= $scope.processAcivationDeviceTime($scope.deviceActivateTime);
           var deviceInfo =  $scope.deviceProfile_SelectedDevice;   
            $scope.jsonData4 = {list: $scope.deviceActivateTime,len:            $scope.deviceActivateTime.length,active:active_time,deviceInfo:deviceInfo};
            
             
            
        };
        
        
         $scope.setDataForNgDialogGraphDetails = function(){
            $scope.setAnalyticChartInfo();
            console.log('My Data Source');
            console.log($scope.myDataSource);
            $scope.jsonData8 = {dataSource:$scope.myDataSource};
            
             
            
        };
        
        
        
        //get the time ranges and make prediction start
        
        $scope.processAcivationDeviceTime = function(list){
            
            //data
            var on_off_set=[];
            var block=[];
            console.log('===========Activation Time Process==========');
            for(var i=list.length-1;i>0;i--){
              
               var t1 = list[i].time;
               var t2 = list[i-1].time;
               var t = t2-t1;
                if(t<=180000 ){
                  console.log(i+"->"+t1);
                   block.push({index:i,date:t1});
                    //this condition detects if the last data set contains a block or not
                    if(block.length>0 && i==1){
                        //console.log("block:");
                        //console.log(block);   
                        on_off_set.push(block);  
                        block=[];  
                    }
                    
                }
                else{
                   
                   if(block.length>0){
                     //console.log("block:");
                    // console.log(block);   
                     on_off_set.push(block);  
                     block=[];   
                   }
                    
                   
                   
                }
             //  console.log("diff :"+t+" ==>"+t1+"---"+t2);    
            }
            console.log("array length blcok: "+on_off_set.length)
            for(var k=0;k<on_off_set.length;k++){
                console.log(on_off_set[k]);
            }
            
            return on_off_set;
        
        };
        
        
        
        //get the time ranges and make prediction end
        
        
        
        
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



        //////////////////////////////////////////////////////////////
        
        //calculate the on of times of a device start
        
        $scope.deviceActivateTime =[];
        $scope.deviceProfile_SelectedDevice='';
        
        
        $scope.getActivationDetails = function(device){
            
            if($scope.isDeviceSelected==false){
                $scope.isDeviceSelected=true;
            }
             $scope.getActivatedTimeOfDevice(device);
        };
       
        
        $scope.getActivatedTimeOfDevice = function(device){
          var i=0;
        
         $scope.deviceActivateTime =[];
         $scope.deviceProfile_SelectedDevice=device;   
        var powerlist = Powers.query({devices:device._id},function(){//start of power loop
        
          
            
          angular.forEach(powerlist,function(power,key){
                 
                    var date = new Date(power.created);
                    var consumption = power.consumption;
                    var consumSplit = consumption.split('W');
                    var consN = parseFloat(consumSplit[0]);
                    
                    $scope.deviceActivateTime.push({id:i,time:date});
                    
                   i++;
               });
            
                if($scope.deviceActivateTime.length>0){
                    console.log("Length of activate time : "+$scope.deviceActivateTime.length)
                    
                   $scope.dialogModelActivationTime = {
                      
                       message : $scope.deviceActivateTime.length
                       
                   };
                     
                   $scope.setDataForNgDialogActivationTime(); 
                    
                    
                    
                }  
            
            
            
            
            
        });//end of power loop
        
          
       
        
        };
        
        //calculate the on of times of device end
        /////////////////////////////////
        
 /////////////////////////////////////////////////////////////////////////////////////////////////////////       
        
        //create the summary starts
        
        $scope.summaryOnMaximumPowerUsagePerDevice =[];
        $scope.maxPowerUserInfo=[];
        $scope.minPowerUserInfo=[];
        
        
        $scope.getSummaryOnMaximumPowerUsagePerDevice = function(){//function start
          
            var infoList=[];
            
            var deviceList = Devices.query({},function(){//start device list
                
                 var powerPerDevice=0;
                 var max=0;
                 var maxDevice='';
                 var min=10000000000000;
                 var minDevice='';
               
                angular.forEach(deviceList,function(device,key){//devicelist for loop start
                    
                  
                    
                    var powerList = Powers.query({devices:device._id},function(){//powerlist for loop start
                        powerPerDevice=0;
                      
                        
                       angular.forEach(powerList,function(power,key){//power for loop start
                           
                           
                            var date = new Date(power.created);
                            var consumption = power.consumption;
                            var consumSplit = consumption.split('W');
                            var consN = parseFloat(consumSplit[0]);
                           
                           powerPerDevice+=(consN*10/3600);
                           
                           
                       }); //power for loop end
                        
                        console.log("Device: "+device.name+" , Power Consumption : "+powerPerDevice.toFixed(2));
                        //max power using device
                        if(max<powerPerDevice){
                            $scope.maxPowerUserInfo.splice(0,1);
                            max=powerPerDevice.toFixed(2);
                            maxDevice=device.name;
                            $scope.maxPowerUserInfo.push({maxDevice:maxDevice,max:max});
                             console.log(max+" <max> "+powerPerDevice)
                        }
                        
                        //min power using device
                        if(min>powerPerDevice){
                            $scope.minPowerUserInfo.splice(0,1);
                            min=powerPerDevice.toFixed(2);
                            minDevice=device.name;
                            $scope.minPowerUserInfo.push({minDevice:minDevice,min:min});
                            console.log(min+" <min> "+powerPerDevice)
                        }
                        
                        
                        $scope.summaryOnMaximumPowerUsagePerDevice.push({device:device.name, power:powerPerDevice.toFixed(2)});
                        
                        
                    });//powerlist for loop end
                    
                      //get max power usage device
                    
                        
                    
                });//devicelist for loop ends
                
            });//end device list
            
            
        };//function ends
        
         $scope.getSummaryOnMaximumPowerUsagePerDevice();
        
        //summary ends
        
        
        
        //cost calculation algorithm start
        
         //calculation constants for power consumption cost start
        //information url:
        //http://leco.lk/?page_id=549
        $scope.price_per_kwh=parseFloat(5.00);
        var domesticCalculationBelow60={};
        
        domesticCalculationBelow60.level=60;
        domesticCalculationBelow60.range1_low=0;
        domesticCalculationBelow60.range1_high=30;
        domesticCalculationBelow60.range2_low=31;
        domesticCalculationBelow60.range2_high=60;
        domesticCalculationBelow60.range1_energy_charge=parseFloat(2.50);
        domesticCalculationBelow60.range1_fixed_charge=parseFloat(30.00);
        domesticCalculationBelow60.range2_energy_charge=parseFloat(4.85);
        domesticCalculationBelow60.range2_fixed_charge=parseFloat(60.00);
        domesticCalculationBelow60.ranges_energy_charge=[2.50,4.85,0,0,0];
        domesticCalculationBelow60.ranges_fixed_charge=[30,60,0,0,0];
        
        
       // 61-90	    10.00	90
       // 91-120	27.75	480
       // 121-180	32.00	480
       // >180	    45.00	540
        
        
        var domesticCalculationOver60={};
        
        domesticCalculationOver60.level=60;
        domesticCalculationOver60.range1_low=61;
        domesticCalculationOver60.range1_high=90;
        domesticCalculationOver60.range2_low=91;
        domesticCalculationOver60.range2_high=120;
        domesticCalculationOver60.range3_low=121;
        domesticCalculationOver60.range3_high=180;
        domesticCalculationOver60.range4_low=181;
        domesticCalculationOver60.range4_high=100000;
        domesticCalculationOver60.range1_energy_charge=parseFloat(10.00);
        domesticCalculationOver60.range1_fixed_charge=parseFloat(90.00);
        domesticCalculationOver60.range2_energy_charge=parseFloat(27.75);
        domesticCalculationOver60.range2_fixed_charge=parseFloat(480.00);
        domesticCalculationOver60.range3_energy_charge=parseFloat(32);
        domesticCalculationOver60.range3_fixed_charge=parseFloat(480.00);
        domesticCalculationOver60.range4_energy_charge=parseFloat(45.00);
        domesticCalculationOver60.range4_fixed_charge=parseFloat(540.00);
        domesticCalculationOver60.ranges_energy_charge=[7.85,10.00,27.75,32.00,45.00];
        domesticCalculationOver60.ranges_fixed_charge=[0,90,480,480,540];
        domesticCalculationOver60.ranges_fixed_charge_cut_off=[60,90,120,180,181];
        
        
        
        $scope.costOfConsumptionPerDateRange = 0;
        
        
        //calculating cost per month start
        $scope.calculateCostPerMonth = function(units,days,type){
          console.log('Bill Calculating');  
          console.log('=========================================');  
           var cost=0; 
           var costs=[];      
            //domestic type =0;
            if(type==0){
                console.log('This is domestic billing...');
                if(units<=domesticCalculationBelow60.level){
                    
                    var blocksize = days *2;
                    var currentUnit=units;
                    var block=[];
                         if(days<units){//block check if start
                        
                        
                         var no_of_blocks = Math.floor(units/days) ;
                        
                        for(var i=0;i<5;i++){
                            
                           if(currentUnit>=0 && i<4){
                               
                               if(i==0 && currentUnit-blocksize>0){
                                    block.push({id:i,val:blocksize});
                                    currentUnit-=blocksize;
                                }else{
                                    if(i==3 && currentUnit-blocksize>=0){
                                        block.push({id:i,val:blocksize});
                                        currentUnit-=blocksize;
                                    }else{
                                        if(currentUnit-days<=0){
                                           block.push({id:i,val:currentUnit});
                                            currentUnit-=currentUnit;   
                                        }else{
                                            block.push({id:i,val:days});
                                            currentUnit-=days;  
                                        }
                                        
                                    }
                                     
                                }
                               
                           }else if(currentUnit>=0 && i==4){
                               block.push({id:i,val:currentUnit});
                               currentUnit-=currentUnit;  
                           }
                            
                            
                            
                        }
                        
                        console.log('no of blocks :'+no_of_blocks);
                        var cost=0;
                        for(var i=0;i<5;i++){
                            
                            console.log(block[i].id+' - '+block[i].val);
                            cost+= block[i].val * domesticCalculationBelow60.ranges_energy_charge[i];
                        }
                             
                        costs.push({id:'energy_cost',energy_cost:cost});     
                             
                        
                        if(units>domesticCalculationBelow60.ranges_fixed_charge[0] ){
                            cost+=domesticCalculationBelow60.ranges_fixed_charge[1];
                        }else{
                            cost+=domesticCalculationBelow60.ranges_fixed_charge[0];
                        }     
                        console.log('Cost : '+cost);
                        costs.push({id:'fixed_cost',fixed_cost:cost});          
                        
                        
                    }else{
                        costs.push({id:'energy_cost',energy_cost:(units*parseFloat(2.50)).toFixed(2)});  
                        cost=((units*parseFloat(2.50) +parseFloat(30.00)).toFixed(2));
                        console.log('Cost : '+cost); 
                        costs.push({id:'fixed_cost',fixed_cost:cost});   
                    }
                    
                    
                }
                
                if(units>domesticCalculationOver60.level){
                    
                    
                    var blocksize = days *2;
                    var currentUnit=units;
                    var block=[];
                   
                    
                    if(days<units){//block check if start
                        
                        
                         var no_of_blocks = Math.floor(units/days) ;
                        
                        for(var i=0;i<5;i++){
                            
                           if(currentUnit>=0 && i<4){
                               
                               if(i==0 && currentUnit-blocksize>0){
                                    block.push({id:i,val:blocksize});
                                    currentUnit-=blocksize;
                                }else{
                                    if(i==3 && currentUnit-blocksize>=0){
                                        block.push({id:i,val:blocksize});
                                        currentUnit-=blocksize;
                                    }else{
                                        if(currentUnit-days<=0){
                                           block.push({id:i,val:currentUnit});
                                            currentUnit-=currentUnit;   
                                        }else{
                                            block.push({id:i,val:days});
                                            currentUnit-=days;  
                                        }
                                        
                                    }
                                     
                                }
                               
                           }else if(currentUnit>=0 && i==4){
                               block.push({id:i,val:currentUnit});
                               currentUnit-=currentUnit;  
                           }
                            
                            
                            
                        }
                        
                        console.log('no of blocks :'+no_of_blocks);
                        
                       
                        for(var i=0;i<5;i++){
                            
                            console.log(block[i].id+' - '+block[i].val);
                            cost+= block[i].val * domesticCalculationOver60.ranges_energy_charge[i];
                        }
                        console.log('Cost : '+cost); 
                        
                        costs.push({id:'energy_cost',energy_cost:cost});    
                        
                        if(units<domesticCalculationOver60.ranges_fixed_charge_cut_off[0] ){
                            cost+=domesticCalculationOver60.ranges_fixed_charge[0];
                        }else if(units<domesticCalculationOver60.ranges_fixed_charge_cut_off[1] ){
                            cost+=domesticCalculationOver60.ranges_fixed_charge[1];
                        }
                        else if(units<domesticCalculationOver60.ranges_fixed_charge_cut_off[2] ){
                            cost+=domesticCalculationOver60.ranges_fixed_charge[2];
                        }  
                        else if(units<domesticCalculationOver60.ranges_fixed_charge_cut_off[3] ){
                            cost+=domesticCalculationOver60.ranges_fixed_charge[3];
                        }  
                        else if(units>domesticCalculationOver60.ranges_fixed_charge_cut_off[4] ){
                            cost+=domesticCalculationOver60.ranges_fixed_charge[4];
                        }  
                        console.log('Cost : '+cost);     
                        
                        costs.push({id:'fixed_cost',energy_cost:cost});    
                    }
                    
                }
                
            }//type 0 ends domestic
            
            if(type='religious'){
                
            }
            
            if(type='hotel'){
                
            }
            
            if(type='industrial'){
                
            }
            
           console.log('=========================================');   
            $scope.costOfConsumptionPerDateRange=cost;
            
            return costs;
        };
        
        
        
        
        
        //calculating cost per month end
        
        //calculating cost per month start
        $scope.calculateCostPerDay = function(units,days){
            
            
            
        };
        
        //calculating cost per month end
        
        
        //calculating cost per month start
        $scope.calculateCostPerYear = function(units,days){
            
            
            
        };
        
        //calculating cost per month end
        
        
        
        
        //cost calculation algorithm ends
        
        
        
        //get main list selected item and process data start
        $scope.mainTodayOverallPower=[];
        $scope.mainTodayTotalPower=0;
        $scope.mainTodayTotalPowerCost=0;
        $scope.mainTodayCostOfKWH= parseFloat(2.50);
        $scope.isToday=false;
        
        $scope.mainYesterdayOverallPower=[];
        $scope.mainYesterdayTotalPower=0;
        $scope.mainYesterdayTotalPowerCost=0;
        $scope.mainYesterdayCostOfKWH= parseFloat(2.50);
        $scope.isYesterday=false;
        
        
        $scope.mainThisMonthOverallPower=[];
        $scope.mainThisMonthTotalPower=0;
        $scope.mainThisMonthTotalPowerCost=0;
        $scope.mainThisMonthCostOfKWH= parseFloat(2.50);
        $scope.isThisMonth=false;
        
        $scope.mainLastMonthOverallPower=[];
        $scope.mainLastMonthTotalPower=0;
        $scope.mainLastMonthTotalPowerCost=0;
        $scope.mainLastMonthCostOfKWH= parseFloat(2.50);
        $scope.isLastMonth=false;
        
        
        
        $scope.getMainListSearch = function(item){
            
       
            
            if($scope.mainListItems[item].id==0){
                
                //yesterday
                $scope.isYesterday=true;
                $scope.isToday=false;
                $scope.isThisMonth=false;
                $scope.isLastMonth=false;
                
                
                $scope.mainYesterdayOverallPower=[];
                $scope.mainYesterdayTotalPower=0;
                $scope.mainYesterdayTotalPowerCost=0;
                $scope.mainYesterdayCostOfKWH= parseFloat(2.50);
                
                
                
                var date = new Date();
                var dd = date.getDate();
                var mm = date.getMonth();
                var yy = date.getFullYear();
                
                var dateString = yy+"-"+mm+"-"+dd;
              
                
                
                var tempDateString ="2015-07-18";
                
                $scope.getTotalPowerConsumptionFromEachDeviceByDay(tempDateString);
                
            }
            
            if($scope.mainListItems[item].id==1){
                
                //today
                $scope.isToday=true;
                $scope.isYesterday=false;
                $scope.isThisMonth=false;
                $scope.isLastMonth=false;
                var date = new Date();
                var dd = date.getDate();
                var mm = date.getMonth();
                var yy = date.getFullYear();
                
                var dateString = yy+"-"+mm+"-"+dd;
              
               // $window.alert($scope.mainListItems[item].name+"**"+'today :'+date);
                
                var tempDateString ="2015-07-18";
                
                $scope.getTotalPowerConsumptionFromEachDeviceByDay(tempDateString);
                
              
                
            }
            
            if($scope.mainListItems[item].id==2){
                //current month
                
                $scope.isThisMonth=true;
                $scope.isLastMonth=false;
                $scope.isToday=false;
                $scope.isYesterday=false;
                
                
                $scope.mainThisMonthOverallPower=[];
                $scope.mainThisMonthTotalPower=0;
                $scope.mainThisMonthTotalPowerCost=0;
                $scope.mainThisMonthCostOfKWH= parseFloat(2.50);
                
                
                var date = new Date();
                var dd = date.getDate();
                var mm = date.getMonth();
                var yy = date.getFullYear();
                
                var dateString = yy+"-"+mm+"-"+dd;
              
                
                
                var tempDateString ="2015-07-18";
                
                $scope.getTotalPowerConsumptionFromEachDeviceByDay(tempDateString);
                
            }
            
            if($scope.mainListItems[item].id==3){
                //last month
                
                
                $scope.isThisMonth=false;
                $scope.isLastMonth=true;
                $scope.isToday=false;
                $scope.isYesterday=false;
                
                var date = new Date();
                var dd = date.getDate();
                var mm = date.getMonth();
                var yy = date.getFullYear();
                
                var dateString = yy+"-"+mm+"-"+dd;
              
                
                
                var tempDateString ="2015-07-18";
                
                $scope.getTotalPowerConsumptionFromEachDeviceByDay(tempDateString);
                
                
            }
            
            if($scope.mainListItems[item].id==4){
                //overall
                $scope.isToday=true;
                $scope.isYesterday=true;
                $scope.isThisMonth=true;
                $scope.isLastMonth=true;
                
                 var date = new Date();
                var dd = date.getDate();
                var mm = date.getMonth();
                var yy = date.getFullYear();
                
                var dateString = yy+"-"+mm+"-"+dd;
              
                
                
                var tempDateString ="2015-07-18";
                
                $scope.getTotalPowerConsumptionFromEachDeviceByDay(tempDateString);
            }
            
            
            
            
        }
        
         //get main list selected item and process data end
        
        //
        
           //get total power consumption per device per day
        $scope.getTotalPowerConsumptionFromEachDeviceByDay =function(start_date){
            
            $scope.mainTodayOverallPower=[];
            $scope.mainTodayTotalPower=0;
            $scope.mainTodayTotalPowerCost=0;
            $scope.mainTodayCostOfKWH= parseFloat(2.50);
            $scope.mainTodayOverallPowerCost=[];
            
            
            
            $scope.mainYesterdayOverallPower=[];
            $scope.mainYesterdayTotalPower=0;
            $scope.mainYesterdayTotalPowerCost=0;
            $scope.mainYesterdayCostOfKWH= parseFloat(2.50);
            $scope.mainYesterdayOverallPowerCost=[];

            $scope.mainThisMonthOverallPower=[];
            $scope.mainThisMonthTotalPower=0;
            $scope.mainThisMonthTotalPowerCost=0;
            $scope.mainThisMonthCostOfKWH= parseFloat(2.50);
            $scope.mainThisMonthOverallPowerCost=[];
          
            $scope.mainLastMonthOverallPower=[];
            $scope.mainLastMonthTotalPower=0;
            $scope.mainLastMonthTotalPowerCost=0;
            $scope.mainLastMonthCostOfKWH= parseFloat(2.50);
            $scope.mainLastMonthOverallPowerCost=[];
          
            
            var mm = start_date.split('-')[1];
            var dd = start_date.split('-')[2];
            var yy = start_date.split('-')[0];
            
            var powerOfAllDevices=0;
            
            console.log(yy+"-"+mm+"-"+dd);
       
            Devices.query({},function(data){
                
               angular.forEach(data, function(device,key){
         
                   //retrieve power for each device start
                   
             var powerList = Powers.query({devices:device._id},function(){
             var totalPower=0;
             var totalPowerYesterday=0;
             var totalPowerThisMonth=0;
             var totalPowerLastMonth=0;
             angular.forEach(powerList,function(power,key){
                 
                 var date = new Date(power.created);
                 var consumption = power.consumption;
                 var consumSplit = consumption.split('W');
                 var consN = parseInt(consumSplit[0]);
                 var milli = date.getTime(); 
                 
                // console.log(device.name+'-'+date);
               //  console.log("Time: "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());
               console.log("Day : "+date.getDate()+"/ Year: "+date.getFullYear()+" / Month : "+(date.getMonth()+1)+"");
               
                 //get today power
                 if(mm==(date.getMonth()+1) && dd==date.getDate() && yy==date.getFullYear()){
                    
                     totalPower+=(consN*10/3600);
                    
                 }
                 
                 //get yesterday power
                 
                 if(mm==(date.getMonth()+1) && (dd-1)==(date.getDate()) && yy==date.getFullYear()){
                     
                     totalPowerYesterday+=(consN*10/3600);
                 }
                 
                 
                 //get this month power
                 if(mm==(date.getMonth()+1) && yy==date.getFullYear()){
                     
                     totalPowerThisMonth+=(consN*10/3600);
                 }
                 
                 
                 //get last month power
                 if(mm==(date.getMonth()) && yy==date.getFullYear()){
                     
                     totalPowerLastMonth+=(consN*10/3600);
                 }
                 
                 
                // console.log(device._id);
             });//end of foreach powerList
              
                 
                 
            console.log(device.name+" : "+totalPower+" KWh Based On: "+mm+"/"+dd+"/"+yy);
                 powerOfAllDevices+=totalPower;
                 $scope.mainTodayOverallPower.push({device:device.name,power:totalPower});
                 $scope.mainTodayTotalPower +=totalPower;
                 var costOfTodayPower = $scope.mainTodayCostOfKWH * totalPower;
                 $scope.mainTodayOverallPowerCost.push({device:device.name,cost:costOfTodayPower});
                 console.log($scope.mainTodayOverallPowerCost);
                 
                 $scope.mainYesterdayOverallPower.push({device:device.name,power:totalPowerYesterday});
                 $scope.mainYesterdayTotalPower +=totalPowerYesterday;
                 var costOfYesterdayPower = $scope.mainYesterdayCostOfKWH * totalPowerYesterday;
                 $scope.mainYesterdayOverallPowerCost.push({device:device.name,cost:costOfYesterdayPower});
                 
                 $scope.mainThisMonthOverallPower.push({device:device.name,power:totalPowerThisMonth});
                 $scope.mainThisMonthTotalPower +=totalPowerThisMonth;
                 var costsThisMonth= $scope.calculateCostPerMonth(totalPowerThisMonth,30,0);
                 $scope.mainThisMonthOverallPowerCost.push({device:device.name,cost:costsThisMonth});
                 
                 
                 $scope.mainLastMonthOverallPower.push({device:device.name,power:totalPowerLastMonth});
                 $scope.mainLastMonthTotalPower +=totalPowerLastMonth;
                 var costsLastMonth= $scope.calculateCostPerMonth(totalPowerLastMonth,30,0);
                 $scope.mainLastMonthOverallPowerCost.push({device:device.name,cost:costsLastMonth});
          
                if(data.length==$scope.mainTodayOverallPower.length){
                    var val =  ($scope.mainTodayTotalPower * $scope.mainTodayCostOfKWH);
                    //val = parseFloat(val).toFixed(2);
                    $scope.mainTodayTotalPowerCost=val;
                }
                 
                 if(data.length==$scope.mainYesterdayOverallPower.length){
                      var val =  ($scope.mainYesterdayTotalPower * $scope.mainYesterdayCostOfKWH);
                    //val = parseFloat(val).toFixed(2);
                     $scope.mainYesterdayTotalPowerCost=val;
                 }
                 
                 
                 if(data.length==$scope.mainThisMonthOverallPower.length){
                      var val =  ($scope.mainThisMonthTotalPower);
                     
                     var costs= $scope.calculateCostPerMonth($scope.mainThisMonthTotalPower,30,0);
                     var energy_cost = costs[0].energy_cost;
                     var fixed_cost = costs[1].fixed_cost;
                     console.log('this month fixed cost: '+fixed_cost);
                     console.log('this month energy cost: '+energy_cost);
                     $scope.mainThisMonthTotalPowerCost=energy_cost;
                     console.log($scope.mainThisMonthTotalPowerCost);
                 }
                 
                  if(data.length==$scope.mainLastMonthOverallPower.length){
                      
                      if(totalPowerLastMonth==0){
                     
                        $scope.mainLastMonthTotalPower=parseFloat(0.00);
                      }
                    
                     var costs= $scope.calculateCostPerMonth($scope.mainLastMonthTotalPower,30,0);
                     var energy_cost = costs[0].energy_cost;
                     var fixed_cost = costs[1].fixed_cost;
                     console.log('last month fixed cost: '+fixed_cost);
                     console.log('last month energy cost: '+energy_cost);
                     $scope.mainLastMonthTotalPowerCost=energy_cost;
                     console.log($scope.mainLastMonthTotalPowerCost);
                     
                 }
              
             
             
         });//end of query powerList
            
                   //retrieve power for each device start
                   
               
                   
               });   //end of angular foreach             
                
               
            });//end of query
        };
        ///////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////
        
        
       //draw chart
             
        $scope.myDataSource={};
             
        
        $scope.setAnalyticChartInfo = function(){
            
                         

        
        };
        
         $scope.myDataSource = {
    chart: {
        caption: "Harry's SuperMart",
        subCaption: "Top 5 stores in last month by revenue",
        numberPrefix: "$",
        theme: "fint"
    },
    data: [{
        label: "Bakersfield Central",
        value: "880000"
    }, {
        label: "Garden Groove harbour",
        value: "730000"
    }, {
        label: "Los Angeles Topanga",
        value: "590000"
    }, {
        label: "Compton-Rancho Dom",
        value: "520000"
    }, {
        label: "Daly City Serramonte",
        value: "330000"
    }]
};
        
        $scope.myDataSourcePie = {
    chart: {
        caption: "Age profile of website visitors",
        subcaption: "Last Year",
        startingangle: "120",
        showlabels: "0",
        showlegend: "1",
        enablemultislicing: "0",
        slicingdistance: "15",
        showpercentvalues: "1",
        showpercentintooltip: "0",
        plottooltext: "Age group : $label Total visit : $datavalue",
        theme: "fint"
    },
    data: [
        {
            label: "Teenage",
            value: "1250400"
        },
        {
            label: "Adult",
            value: "1463300"
        },
        {
            label: "Mid-age",
            value: "1050700"
        },
        {
            label: "Senior",
            value: "491000"
        }
    ]
};
        
   /* $scope.attrs={}; 
    $scope.categories=[];
    $scope.dataset=[];*/
        //stream line char data
        
     $scope.setStreamLineChartData = function(){
     
            $scope.attrs = {

    "caption": "Sales Comparison: 2013 versus 2014",
    "subCaption": "Harry's SuperMart",
    "numberprefix": "$",
    "plotgradientcolor": "",
    "bgcolor": "FFFFFF",
    "showalternatehgridcolor": "0",
    "divlinecolor": "CCCCCC",
    "showvalues": "0",
    "showcanvasborder": "0",
    "canvasborderalpha": "0",
    "canvasbordercolor": "CCCCCC",
    "canvasborderthickness": "1",
    "yaxismaxvalue": "30000",
    "captionpadding": "30",
    "linethickness": "3",
    "yaxisvaluespadding": "15",
    "legendshadow": "0",
    "legendborderalpha": "0",
    "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
    "showborder": "0"
};

$scope.categories = [{
    "category": [{
        "label": "Jan"
    }, {
        "label": "Feb"
    }, {
        "label": "Mar"
    }, {
        "label": "Apr"
    }, {
        "label": "May"
    }, {
        "label": "Jun"
    }, {
        "label": "Jul"
    }, {
        "label": "Aug"
    }, {
        "label": "Sep"
    }, {
        "label": "Oct"
    }, {
        "label": "Nov"
    }, {
        "label": "Dec"
    }]
}];

$scope.dataset = [{
        "seriesname": "2013",
        "data": [{
            "value": "22400"
        }, {
            "value": "24800"
        }, {
            "value": "21800"
        }, {
            "value": "21800"
        }, {
            "value": "24600"
        }, {
            "value": "27600"
        }, {
            "value": "26800"
        }, {
            "value": "27700"
        }, {
            "value": "23700"
        }, {
            "value": "25900"
        }, {
            "value": "26800"
        }, {
            "value": "24800"
        }]
    },

    {
        "seriesname": "2012",
        "data": [{
            "value": "10000"
        }, {
            "value": "11500"
        }, {
            "value": "12500"
        }, {
            "value": "15000"
        }, {
            "value": "16000"
        }, {
            "value": "17600"
        }, {
            "value": "18800"
        }, {
            "value": "19700"
        }, {
            "value": "21700"
        }, {
            "value": "21900"
        }, {
            "value": "22900"
        }, {
            "value": "20800"
        }]
    }
];
        
     
     
     };
        
        
        
        //this month Graph Data Set
        
    $scope.setThisMonthGraphData = function(){
        
      
        
     
            $scope.attrsThisMonth = {

    "caption": "This Month",
    "subCaption": "Gasta Homes ",
    "numberprefix": "$",
    "plotgradientcolor": "",
    "bgcolor": "FFFFFF",
    "showalternatehgridcolor": "0",
    "divlinecolor": "CCCCCC",
    "showvalues": "0",
    "showcanvasborder": "0",
    "canvasborderalpha": "0",
    "canvasbordercolor": "CCCCCC",
    "canvasborderthickness": "1",
    "yaxismaxvalue": "30000",
    "captionpadding": "30",
    "linethickness": "3",
    "yaxisvaluespadding": "15",
    "legendshadow": "0",
    "legendborderalpha": "0",
    "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
    "showborder": "0"
};

$scope.categoriesThisMonth = [{
    "category": [{
        "label": "Jan"
    }, {
        "label": "Feb"
    }, {
        "label": "Mar"
    }, {
        "label": "Apr"
    }, {
        "label": "May"
    }, {
        "label": "Jun"
    }, {
        "label": "Jul"
    }, {
        "label": "Aug"
    }, {
        "label": "Sep"
    }, {
        "label": "Oct"
    }, {
        "label": "Nov"
    }, {
        "label": "Dec"
    }]
}];

$scope.datasetThisMonth = [{
        "seriesname": "2013",
        "data": [{
            "value": "22400"
        }, {
            "value": "24800"
        }, {
            "value": "1800"
        }, {
            "value": "21800"
        }, {
            "value": "24600"
        }, {
            "value": "600"
        }, {
            "value": "26800"
        }, {
            "value": "20700"
        }, {
            "value": "23700"
        }, {
            "value": "25900"
        }, {
            "value": "26800"
        }, {
            "value": "24800"
        }]
    },

    {
        "seriesname": "2012",
        "data": [{
            "value": "10000"
        }, {
            "value": "11500"
        }, {
            "value": "12500"
        }, {
            "value": "15000"
        }, {
            "value": "16000"
        }, {
            "value": "17600"
        }, {
            "value": "18800"
        }, {
            "value": "19700"
        }, {
            "value": "21700"
        }, {
            "value": "21900"
        }, {
            "value": "22900"
        }, {
            "value": "20800"
        }]
    }
];
        
     
     
     };
        
        
        //set last month graph data
        
        $scope.setLastMonthGraphData =function(){
            
             $scope.attrsLastMonth = {

    "caption": "Last Month",
    "subCaption": "Gasta Homes ",
    "numberprefix": "$",
    "plotgradientcolor": "",
    "bgcolor": "FFFFFF",
    "showalternatehgridcolor": "0",
    "divlinecolor": "CCCCCC",
    "showvalues": "0",
    "showcanvasborder": "0",
    "canvasborderalpha": "0",
    "canvasbordercolor": "CCCCCC",
    "canvasborderthickness": "1",
    "yaxismaxvalue": "30000",
    "captionpadding": "30",
    "linethickness": "3",
    "yaxisvaluespadding": "15",
    "legendshadow": "0",
    "legendborderalpha": "0",
    "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
    "showborder": "0"
};

$scope.categoriesLastMonth = [{
    "category": [{
        "label": "Jan"
    }, {
        "label": "Feb"
    }, {
        "label": "Mar"
    }, {
        "label": "Apr"
    }, {
        "label": "May"
    }, {
        "label": "Jun"
    }, {
        "label": "Jul"
    }, {
        "label": "Aug"
    }, {
        "label": "Sep"
    }, {
        "label": "Oct"
    }, {
        "label": "Nov"
    }, {
        "label": "Dec"
    }]
}];

$scope.datasetLastMonth = [{
        "seriesname": "2013",
        "data": [{
            "value": "22400"
        }, {
            "value": "24800"
        }, {
            "value": "1800"
        }, {
            "value": "21800"
        }, {
            "value": "24600"
        }, {
            "value": "600"
        }, {
            "value": "26800"
        }, {
            "value": "20700"
        }, {
            "value": "23700"
        }, {
            "value": "25900"
        }, {
            "value": "26800"
        }, {
            "value": "24800"
        }]
    },

    {
        "seriesname": "2012",
        "data": [{
            "value": "10000"
        }, {
            "value": "11500"
        }, {
            "value": "12500"
        }, {
            "value": "15000"
        }, {
            "value": "16000"
        }, {
            "value": "17600"
        }, {
            "value": "18800"
        }, {
            "value": "19700"
        }, {
            "value": "21700"
        }, {
            "value": "21900"
        }, {
            "value": "22900"
        }, {
            "value": "20800"
        }]
    }
];
        
            
            
        };
        
        
        $scope.setTodayGraphData = function(){
            
               $scope.attrsToday = {

    "caption": "Today",
    "subCaption": "Gasta Homes ",
    "numberprefix": "$",
    "plotgradientcolor": "",
    "bgcolor": "FFFFFF",
    "showalternatehgridcolor": "0",
    "divlinecolor": "CCCCCC",
    "showvalues": "0",
    "showcanvasborder": "0",
    "canvasborderalpha": "0",
    "canvasbordercolor": "CCCCCC",
    "canvasborderthickness": "1",
    "yaxismaxvalue": "30000",
    "captionpadding": "30",
    "linethickness": "3",
    "yaxisvaluespadding": "15",
    "legendshadow": "0",
    "legendborderalpha": "0",
    "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
    "showborder": "0"
};

$scope.categoriesToday = [{
    "category": [{
        "label": "Jan"
    }, {
        "label": "Feb"
    }, {
        "label": "Mar"
    }, {
        "label": "Apr"
    }, {
        "label": "May"
    }, {
        "label": "Jun"
    }, {
        "label": "Jul"
    }, {
        "label": "Aug"
    }, {
        "label": "Sep"
    }, {
        "label": "Oct"
    }, {
        "label": "Nov"
    }, {
        "label": "Dec"
    }]
}];

$scope.datasetToday = [{
        "seriesname": "2013",
        "data": [{
            "value": "22400"
        }, {
            "value": "24800"
        }, {
            "value": "1800"
        }, {
            "value": "21800"
        }, {
            "value": "24600"
        }, {
            "value": "600"
        }, {
            "value": "26800"
        }, {
            "value": "20700"
        }, {
            "value": "23700"
        }, {
            "value": "25900"
        }, {
            "value": "26800"
        }, {
            "value": "24800"
        }]
    },

    {
        "seriesname": "2012",
        "data": [{
            "value": "10000"
        }, {
            "value": "11500"
        }, {
            "value": "12500"
        }, {
            "value": "15000"
        }, {
            "value": "16000"
        }, {
            "value": "17600"
        }, {
            "value": "18800"
        }, {
            "value": "19700"
        }, {
            "value": "21700"
        }, {
            "value": "21900"
        }, {
            "value": "22900"
        }, {
            "value": "20800"
        }]
    }
];
        
          
            
        };
        
        $scope.setYesterdayGraphData = function(){
          
                    $scope.attrsYesterday = {

    "caption": "Yesterday",
    "subCaption": "Gasta Homes ",
    "numberprefix": "$",
    "plotgradientcolor": "",
    "bgcolor": "FFFFFF",
    "showalternatehgridcolor": "0",
    "divlinecolor": "CCCCCC",
    "showvalues": "0",
    "showcanvasborder": "0",
    "canvasborderalpha": "0",
    "canvasbordercolor": "CCCCCC",
    "canvasborderthickness": "1",
    "yaxismaxvalue": "30000",
    "captionpadding": "30",
    "linethickness": "3",
    "yaxisvaluespadding": "15",
    "legendshadow": "0",
    "legendborderalpha": "0",
    "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
    "showborder": "0"
};

$scope.categoriesYesterday = [{
    "category": [{
        "label": "Jan"
    }, {
        "label": "Feb"
    }, {
        "label": "Mar"
    }, {
        "label": "Apr"
    }, {
        "label": "May"
    }, {
        "label": "Jun"
    }, {
        "label": "Jul"
    }, {
        "label": "Aug"
    }, {
        "label": "Sep"
    }, {
        "label": "Oct"
    }, {
        "label": "Nov"
    }, {
        "label": "Dec"
    }]
}];

$scope.datasetYesterday = [{
        "seriesname": "2013",
        "data": [{
            "value": "22400"
        }, {
            "value": "24800"
        }, {
            "value": "1800"
        }, {
            "value": "21800"
        }, {
            "value": "24600"
        }, {
            "value": "600"
        }, {
            "value": "26800"
        }, {
            "value": "20700"
        }, {
            "value": "23700"
        }, {
            "value": "25900"
        }, {
            "value": "26800"
        }, {
            "value": "24800"
        }]
    },

    {
        "seriesname": "2012",
        "data": [{
            "value": "10000"
        }, {
            "value": "11500"
        }, {
            "value": "12500"
        }, {
            "value": "15000"
        }, {
            "value": "16000"
        }, {
            "value": "17600"
        }, {
            "value": "18800"
        }, {
            "value": "19700"
        }, {
            "value": "21700"
        }, {
            "value": "21900"
        }, {
            "value": "22900"
        }, {
            "value": "20800"
        }]
    }
];
        
  
        };
        
        
         $scope.setStreamLineChartData();
         $scope.setThisMonthGraphData();
         $scope.setLastMonthGraphData();
         $scope.setTodayGraphData();
         $scope.setYesterdayGraphData();
        
        
        //generate data dynamically for graphs
        
        $scope.getPowerPerDayGraph = function(start_date){
           
            var mm = start_date.split('-')[1];
            var dd = start_date.split('-')[2];
            var yy = start_date.split('-')[0];
            var selectedMonth ;
            $scope.dataset2=[];
            $scope.dataset3=[];
            $scope.dataset4=[];
            $scope.dataset5=[];
            var maxPar =0;
            var maxParLastMonth=0;
            var days = [];
            for (var i=1; i<=31; i++) {
                  days.push({day:i});  
            }
          
            
          
            var data=[];
            var dataLastMonth=[];
            var monthlist = [{key:'1',month:'1',days:31},{key:'2',month:'2',days:31},{key:'3',month:'3',days:31},{key:'4',month:'4',days:31},{key:'5',month:'5',days:31},{key:'6',month:'6',days:31},{key:'7',month:'7',days:31},{key:'8',month:'8',days:31},{key:'9',month:'9',days:31},{key:'10',month:'10',days:31},{key:'11',month:'11',days:31},{key:'12',month:'12',days:31}];
           var powerOfAllDevices=0;
             Devices.query({},function(devicesData){
                
                   angular.forEach(devicesData, function(device,key){

                    var plotData = [];
                    var plotDataLastMonth=[];   
                    var plotObject=[];
                    var plotObjectLastMonth=[];
                       //retrieve power for each device start

                     var powerList = Powers.query({devices:device._id},function(){
                     
                        // console.log(device._id)
                     
                            
                           //  console.log(device._id+" "+(key+1))
                            angular.forEach(days,function(val1,key){//days loop start
                                
                                var totalPower=0;
                                var totalPowerLastMonth=0;
                                 angular.forEach(powerList,function(power,key){

                                 var date = new Date(power.created);
                                 var consumption = power.consumption;
                                 var consumSplit = consumption.split('W');
                                 var consN = parseInt(consumSplit[0]);
                                 var milli = date.getTime(); 
                              
                          //  console.log(date);
                                     
                //   console.log(date+"===>"+date.getFullYear()+"-"+((date.getMonth())+1)+"-"+date.getDate())  
                        //calculation for this month             
                           if( mm==((date.getMonth())+1) && yy==date.getFullYear() && (val1.day)==date.getDate() ){
                            
                               totalPower+=(consN*10/3600);
                               powerOfAllDevices+=(consN*10/3600);
                               selectedMonth=date;
                           }
                        //calculation for last month
                            if( mm==((date.getMonth())) && yy==date.getFullYear() && (val1.day)==date.getDate() ){
                            
                               totalPowerLastMonth+=(consN*10/3600);
                             
                               selectedMonth=date;
                           }          

                           
                            });//end of foreach powerList
                            plotData.push({value:totalPower});
                            plotDataLastMonth.push({value:totalPowerLastMonth});    
                             if(maxPar==0){
                                 maxPar=totalPower;
                             }else if(totalPower>maxPar){
                                 maxPar=totalPower;
                             }else{
                                 maxPar=maxPar;
                             }     
                                
                                
                            if(maxParLastMonth==0){
                                 maxParLastMonth=totalPowerLastMonth;
                             }else if(totalPowerLastMonth>maxParLastMonth){
                                 maxParLastMonth=totalPowerLastMonth;
                             }else{
                                 maxParLastMonth=maxParLastMonth;
                             }         
                                
                                
                            });//days loop end
                           //  var month = selectedMonth.toString().split(' ')[1];
                               
                             plotObject.push({seriesname:device.name,data:plotData});
                             plotObjectLastMonth.push({seriesname:device.name,data:plotDataLastMonth});
                                data.push(plotObject);
                                dataLastMonth.push(plotObjectLastMonth);
                               /* $scope.dataset2.push({seriesname:device.name,data:plotData});
                                $scope.attrs2.caption='Power Consumption of Month - '+mm;
                            //    console.log("maxPar: "+maxPar)
                                $scope.attrs2.yaxismaxvalue = Math.ceil(maxPar);*/
                         
                         
                         if(data.length==devicesData.length){
                               // console.log(' :Total power of all devices: '+powerOfAllDevices);
                               // console.log('Plot data analysis:');
                               // console.log('Plot data length : '+data.length);
                               // console.log(data[0][0].data);
                              var monthdata=[];
                              var monthdataCost=[];
                             
                                
                                 for(var j=0;j<data[data.length-1][0].data.length;j++){
                                     var val=0;
                                     var cost=0;
                                     for(var i=0;i<data.length;i++){ 
                                    // console.log(data[i][0].seriesname+" - "+data[i][0].data[j].value);
                                         val+=data[i][0].data[j].value;
                                         
                                    }
                                     cost = val * $scope.costOfOneKWh;
                                     monthdataCost.push({value:cost});
                                     monthdata.push({value:val});
                                 
                                 }
                             
                                $scope.dataset2.push({seriesname:'Current Month ',data:monthdata});
                                $scope.dataset3.push({seriesname:'Current Month ',data:monthdataCost});
                                $scope.attrs2.caption='Power Consumption of Month - '+mm;
                                $scope.attrs3.caption='Cost of Consumption on Month - '+mm;
                            //    console.log("maxPar: "+maxPar)
                                $scope.attrs2.yaxismaxvalue = Math.ceil(maxPar);
                                $scope.attrs3.yaxismaxvalue = Math.ceil(maxPar*$scope.costOfOneKWh);
                             
                             
                        }
                        
                        if(dataLastMonth.length==devicesData.length){
                               // console.log(' :Total power of all devices: '+powerOfAllDevices);
                               // console.log('Plot data analysis:');
                               // console.log('Plot data length : '+data.length);
                               // console.log(data[0][0].data);
                              var monthdataLastMonth=[];
                              var monthdataCostLastMonth=[];
                             
                                
                                 for(var j=0;j<dataLastMonth[dataLastMonth.length-1][0].data.length;j++){
                                     var valLastMonth=0;
                                     var costLastMonth=0;
                                     for(var i=0;i<dataLastMonth.length;i++){ 
                                    // console.log(data[i][0].seriesname+" - "+data[i][0].data[j].value);
                                         valLastMonth+=dataLastMonth[i][0].data[j].value;
                                         
                                    }
                                     costLastMonth = valLastMonth * $scope.costOfOneKWh;
                                     monthdataCostLastMonth.push({value:costLastMonth});
                                     monthdataLastMonth.push({value:valLastMonth});
                                 
                                 }
                             
                                $scope.dataset4.push({seriesname:'Last Month ',data:monthdataLastMonth});
                                $scope.dataset5.push({seriesname:'Last Month ',data:monthdataCostLastMonth});
                                $scope.attrs4.caption='Power Consumption of Month - '+(parseInt(mm)-1);
                                $scope.attrs5.caption='Cost of Consumption on Month - '+(parseInt(mm)-1);
                            //    console.log("maxPar: "+maxPar)
                                $scope.attrs4.yaxismaxvalue = Math.ceil(maxParLastMonth);
                                $scope.attrs5.yaxismaxvalue = Math.ceil(maxParLastMonth*$scope.costOfOneKWh);
                             
                             
                        } 
                     
             });//end of query powerList
            
                   //retrieve power for each device start
          
           
                   
                   });   //end of angular foreach         
                  
                              
            });//end of query   
            
        };
        
        
        //////////////////////////////////////////////////////////////////////////////////
      //  generating graphs for today and yesterday
        
        $scope.getPowerPerHourGraph = function(start_date){
           
            
            var mm = start_date.split('-')[1];
            var dd = start_date.split('-')[2];
            var yy = start_date.split('-')[0];
          //  var str    = start_time.toString().split(' ')[4];
           // var time   = str.split(':');
          //  var hour   = time[0];
         //   var minute = time[1];
         //   var second = time[2];
            var selectedMonth ;
            $scope.dataset6=[];//today
            $scope.dataset7=[];//tommorrow
            $scope.dataset8=[];//today
            $scope.dataset9=[];//tommorrow
            
            var maxPar =0;
            var maxParYesterday=0;
            
            var hours =[];
           
          
            for(var j=0; j<=23 ; j++){
                hours.push({hour:j});
            }
            
          
var data=[];
var dataYesterday=[];            
var monthlist = [{key:'1',month:'1',days:31},{key:'2',month:'2',days:31},{key:'3',month:'3',days:31},{key:'4',month:'4',days:31},{key:'5',month:'5',days:31},{key:'6',month:'6',days:31},{key:'7',month:'7',days:31},{key:'8',month:'8',days:31},{key:'9',month:'9',days:31},{key:'10',month:'10',days:31},{key:'11',month:'11',days:31},{key:'12',month:'12',days:31}];
          
             Devices.query({},function(deviceData){
                
                   angular.forEach(deviceData, function(device,key){

                    var plotData = [];
                    var plotObject=[];
                    var plotDataYesterday = [];
                    var plotObjectYesterday=[];
                       
                       //retrieve power for each device start

                    var powerList = Powers.query({devices:device._id},function(){
                     
                      //   console.log(device._id)
                     
                            angular.forEach(hours,function(val1,key){//days loop start
                                
                                var totalPower=0;
                                var totalPowerYesterday=0;
                                 angular.forEach(powerList,function(power,key){

                                 var date = new Date(power.created);
                                 var consumption = power.consumption;
                                 var consumSplit = consumption.split('W');
                                 var consN = parseInt(consumSplit[0]);
                                 var milli = date.getTime(); 
                                     
                                  var str1    = date.toString().split(' ')[4];
                                var time1   = str1.split(':');
                                var hour1   = time1[0];
                                var minute1 = time1[1];
                                var second1 = time1[2];   
                                    // console.log(str);
                                   //  console.log(hour1+" "+minute1+" "+second1);
                                     
  var condition1 =(mm==((date.getMonth())+1) && yy==date.getFullYear() && dd==date.getDate()); 
  var condition2 = (hour1==val1.hour);
  var condition3 = (mm==((date.getMonth())+1) && yy==date.getFullYear() && ((dd-1)==(date.getDate())));                                     
           // console.log(hour1+"--"+val1.hour)                         
                //   console.log(date+"===>"+date.getFullYear()+"-"+((date.getMonth())+1)+"-"+date.getDate())  
                           if( condition1==true && condition2==true){
                            
                               totalPower+=(consN*10/3600);
                               selectedMonth=date;
                           }
                                     
                           if( condition3==true && condition2==true){
                            
                               totalPowerYesterday+=(consN*10/3600);
                               selectedMonth=date;
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
                                
                            plotDataYesterday.push({value:totalPowerYesterday});
                             if(maxParYesterday==0){
                                 maxParYesterday=totalPowerYesterday;
                             }else if(totalPowerYesterday>maxParYesterday){
                                 maxParYesterday=totalPowerYesterday;
                             }else{
                                 maxParYesterday=maxParYesterday;
                             }         
                                
                                
                            });//days loop end
                          //   var month = selectedMonth.toString().split(' ')[1];
                               
                             plotObject.push({seriesname:device.name,data:plotData});
                             plotObjectYesterday.push({seriesname:device.name,data:plotDataYesterday});
                                data.push(plotObject);
                                dataYesterday.push(plotObjectYesterday);
                               /* $scope.dataset6.push({seriesname:device.name,data:plotData});
                                $scope.attrs6.caption='Power Consumption of Day - '+start_date;
                               // console.log("maxPar: "+maxPar)
                                $scope.attrs6.yaxismaxvalue = Math.ceil(maxPar);
                                $scope.dataset7.push({seriesname:device.name,data:plotDataYesterday});
                                $scope.attrs7.caption='Power Consumption of Day - '+start_date;
                               // console.log("maxPar: "+maxPar)
                                $scope.attrs7.yaxismaxvalue = Math.ceil(maxParYesterday);*/
                        
                        
                         if(data.length==deviceData.length){
                               // console.log(' :Total power of all devices: '+powerOfAllDevices);
                               // console.log('Plot data analysis:');
                               // console.log('Plot data length : '+data.length);
                               // console.log(data[0][0].data);
                              var todaydata=[];
                              var todaydataCost=[];
                             
                                
                                 for(var j=0;j<data[data.length-1][0].data.length;j++){
                                     var val=0;
                                     var cost=0;
                                     for(var i=0;i<data.length;i++){ 
                                    // console.log(data[i][0].seriesname+" - "+data[i][0].data[j].value);
                                         val+=data[i][0].data[j].value;
                                         
                                    }
                                     cost = val * $scope.costOfOneKWh;
                                     todaydataCost.push({value:cost});
                                     todaydata.push({value:val});
                                 
                                 }
                             
                                $scope.dataset6.push({seriesname:'Today ',data:todaydata});
                                $scope.dataset8.push({seriesname:'Today ',data:todaydataCost});
                                $scope.attrs6.caption='Power Consumption of Today - '+dd;
                                $scope.attrs8.caption='Cost of Consumption on Today - '+dd;
                            //    console.log("maxPar: "+maxPar)
                                $scope.attrs6.yaxismaxvalue = Math.ceil(maxPar);
                                $scope.attrs8.yaxismaxvalue = Math.ceil(maxPar*$scope.costOfOneKWh);
                             
                             
                        }
                        
                        if(dataYesterday.length==deviceData.length){
                               // console.log(' :Total power of all devices: '+powerOfAllDevices);
                               // console.log('Plot data analysis:');
                               // console.log('Plot data length : '+data.length);
                               // console.log(data[0][0].data);
                              var yesterdaydata=[];
                              var yesterdaydatacost=[];
                             
                                
                                 for(var j=0;j<dataYesterday[dataYesterday.length-1][0].data.length;j++){
                                     var valYesterday=0;
                                     var costYesterday=0;
                                     for(var i=0;i<dataYesterday.length;i++){ 
                                    // console.log(data[i][0].seriesname+" - "+data[i][0].data[j].value);
                                         valYesterday+=dataYesterday[i][0].data[j].value;
                                         
                                    }
                                     costYesterday = valYesterday * $scope.costOfOneKWh;
                                     yesterdaydatacost.push({value:costYesterday});
                                     yesterdaydata.push({value:valYesterday});
                                 
                                 }
                             
                                $scope.dataset7.push({seriesname:'Yesterday ',data:yesterdaydata});
                                $scope.dataset9.push({seriesname:'Yesterday ',data:yesterdaydatacost});
                                $scope.attrs7.caption='Power Consumption of Yesterday - '+(parseInt(dd)-1);
                                $scope.attrs9.caption='Cost of Consumption on Yesterday - '+(parseInt(dd)-1);
                            //    console.log("maxPar: "+maxPar)
                                $scope.attrs7.yaxismaxvalue = Math.ceil(maxParYesterday);
                                $scope.attrs9.yaxismaxvalue = Math.ceil(maxParYesterday*$scope.costOfOneKWh);
                             
                             
                        } 
                        
                        
                        
                        
                        
                        

             });//end of query powerList
            
                   //retrieve power for each device start
    
                   });   //end of angular foreach         
                  
                              
            });//end of query   
            
        };
    
     //call daily, monthly past and current data and load data to scope
        var demodata="2015-07-18";
      $scope.getTotalPowerConsumptionFromEachDeviceByDay(demodata)  
        
        
        //$scope.setAnalyticChartInfo();
      
        ////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////                                        
      }
    
]).config( function($mdThemingProvider){
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
});




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


////////////////////////////////////////////

//angular tables

app.directive('mdTable', function () {
  return {
    restrict: 'E',
    scope: { 
      headers: '=', 
      content: '=', 
      sortable: '=', 
      filters: '=',
      customClass: '=customClass',
      thumbs:'=', 
      count: '=' 
    },
    controller: function ($scope,$filter,$window) {
      var orderBy = $filter('orderBy');
      $scope.tablePage = 0;
      $scope.nbOfPages = function () {
        return Math.ceil($scope.content.length / $scope.count);
      },
      	$scope.handleSort = function (field) {
          if ($scope.sortable.indexOf(field) > -1) { return true; } else { return false; }
      };
      $scope.order = function(predicate, reverse) {
          $scope.content = orderBy($scope.content, predicate, reverse);
          $scope.predicate = predicate;
      };
      $scope.order($scope.sortable[0],false);
      $scope.getNumber = function (num) {
      			    return new Array(num);
      };
      $scope.goToPage = function (page) {
        $scope.tablePage = page;
      };
    },
    template: angular.element(document.querySelector('#md-table-template')).html()
  }
});

/*app.directive('mdColresize', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$evalAsync(function () {
        $timeout(function(){ $(element).colResizable({
          liveDrag: true,
          fixed: true
          
        });},100);
      });
    }
  }
});*/

app.filter('startFrom', function() {
    return function(input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
    }
});


function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
    
 $scope.devicename="Name of the device";    
    
    $scope.deviceDetails= $scope.deviceProfile_SelectedDevice;
}

