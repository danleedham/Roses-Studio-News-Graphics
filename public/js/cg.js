var app = angular.module('cgApp', ['ngAnimate', 'socket-io']);

app.controller('archeryCtrl', ['$scope', 'socket',
    function($scope, socket){
        socket.on("archery", function (msg) {
            $scope.archery = msg;
        });
    }
]);

app.controller('topRightCtrl', ['$scope', '$timeout', 'socket',
    function($scope, $timeout, socket){
        $scope.tickInterval = 1000; //ms

        socket.on("topRight", function (msg) {
            $scope.topRight = msg;
        });
        
        var tick = function () {
            $scope.clock = Date.now(); // get the current time
            $timeout(tick, $scope.tickInterval); // reset the timer
        };
        
        // Start the timer
        $timeout(tick, $scope.tickInterval);
    }
]);


app.controller('bugCtrl', ['$scope', '$timeout', 'socket',
    function($scope, $timeout, socket){
        $scope.tickInterval = 1000; //ms

        socket.on("bug", function (state) {
            $scope.state = state;
        });
        
        $scope.$watch('bug', function() {
            if (!$scope.bug) {
                getBugData();
            }
        }, true);
		
		socket.on("bug", function (msg) {
            $scope.bug = msg;
        });
        
        function getBugData() {
            socket.emit("bug:get");
        };
        
        var tick = function () {
            $scope.clock = Date.now(); // get the current time
            $timeout(tick, $scope.tickInterval); // reset the timer
        };

        // Start the timer
        $timeout(tick, $scope.tickInterval);
    }
]);

app.controller('bottomRightCtrl', ['$scope', 'socket',
    function($scope, socket){
        $scope.tickInterval = 15000; //ms      
        
        socket.on("bottomRight", function (msg) {
            $scope.bottomRight = msg;
            if ($scope.bottomRight) {
                if($scope.bottomRight.location) {
                    var location = $scope.bottomRight.location;
                } else {
                    var location = "";
                }
                if($scope.bottomRight.sport) {
                    var sport = $scope.bottomRight.sport;
                } else {
                    var sport = "";
                }if($scope.bottomRight.group) {
                    var group = $scope.bottomRight.group;
                } else {
                    var group = "";
                }if($scope.bottomRight.broadcast) {
                    var broadcast = $scope.bottomRight.broadcast;
                } else {
                    var boardcast = "";
                }
                updateFixtures(location,sport,group,broadcast);
            }
        }, true);
        
        
        var updateFixtures = function(location,sport,group,broadcast) {
          	
            var fetchData = function () {
                var config = { headers:  {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                }
            };
            
            $http.get('/data/fixtures.json', config).then(function (response) {
                    console.log('Updating fixtures');
                    $scope.bottomRight.livebottomRight = response.data;
                    
                    var daysOfWeek = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
                    for(var i = 0; i < $scope.bottomRight.livebottomRight.length; i++){
                        var buildArray = {};  
                    
                    // If dates, sports or locations are selected
                        
                        if((location == $scope.bottomRight.livebottomRight[i].location || location == "All" || location == "") && (sport == $scope.bottomRight.livebottomRight[i].sport || sport == "All" || sport == "") && (group == $scope.bottomRight.livebottomRight[i].group || group == "All" || group == "") && (broadcast == $scope.bottomRight.livebottomRight[i].broadcast || $scope.bottomRight.chosenBroadcast == "All" || broadcast == "")){
                            
                            if($scope.bottomRight.livebottomRight[i].score.lancs !== "" && whichGraphic !== "nextup"){
                                var lancScore = $scope.bottomRight.livebottomRight[i].score.lancs;
                                var yorkScore = $scope.bottomRight.livebottomRight[i].score.york;
                                
                                // Home team shows first. To be changed in future years!
                                var strScore = lancScore + ' - ' + yorkScore;
                                $scope.bottomRight.livebottomRight[i].time = strScore;
                            } else {
                                dateTimeString = $scope.bottomRight.livebottomRight[i].date + "T" + $scope.bottomRight.livebottomRight[i].time;
                                dateTime = new Date(dateTimeString);
                                  var day = daysOfWeek[dateTime.getDay()];
                                  var hours = dateTime.getHours();
                                  var minutes = dateTime.getMinutes();
                                  var ampm = hours >= 12 ? 'pm' : 'am';
                                  hours = hours % 12;
                                  hours = hours ? hours : 12; // the hour '0' should be '12'
                                  minutes = minutes < 10 ? '0'+minutes : minutes;
                                  var strTime = day + ' ' + hours + ':' + minutes + ' ' + ampm;
                                if(whichGraphic == "nextup"){
                                	$scope.bottomRight.livebottomRight[i].time = dateTime;
                                } else {
                                	$scope.bottomRight.livebottomRight[i].time = strTime;
                                }
                            }                       
                            buildArray["one"] = $scope.bottomRight.livebottomRight[i][$scope.bottomRight.colone];
                            buildArray["two"] = $scope.bottomRight.livebottomRight[i][$scope.bottomRight.coltwo];  
                            buildArray["three"] = $scope.bottomRight.livebottomRight[i][$scope.bottomRight.colthree];
                            buildArray["four"] = $scope.bottomRight.livebottomRight[i][$scope.bottomRight.colfour];
                            newLivebottomRight["rows"].push(buildArray);
                            var numberofbottomRight = numberofbottomRight + 1;
                        }                            
                        if ($scope.bottomRight.numberofbottomRight == numberofbottomRight){
                            break;
                        }
                    }
                    console.log(newLivebottomRight);
                    $scope.bottomRight.nextonSport = newLivebottomRight["nextup"][0]["sport"];
                    $scope.bottomRight.nextonGroup = newLivebottomRight["nextup"][0]["group"];
                    $scope.bottomRight.nextonPoints = newLivebottomRight["nextup"][0]["points"];
                    $scope.bottomRight.nextonBroadcast = newLivebottomRight["nextup"][0]["broadcast"];
                    $scope.bottomRight.nextonTime = newLivebottomRight["nextup"][0]["time"];

                 });    
            };
            
            fetchData();	         		     						
        };
        
        

    }    
]);

app.controller('bottomLeftCtrl', ['$scope', 'socket',
    function($scope, socket){
        socket.on("bottomLeft", function (msg) {
            $scope.bottomLeft = msg;
        });
    }
]);

app.controller('bottomCenterCtrl', ['$scope', 'socket',
    function($scope, socket){
        socket.on("bottomCenter", function (msg) {
            $scope.bottomCenter = msg;
        });
    }
]);

app.controller('tickerCtrl', ['$scope', 'socket',
    function($scope, socket){
        socket.on("ticker", function (msg) {
            $scope.ticker = msg;
        });
    }
]);
