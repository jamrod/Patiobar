var app = angular.module('patiobarApp', []);

app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});


function StationController($scope, socket) {
	socket.on('stations', function(msg) {
		msg.stations.pop();
		var s = [];

		for (i in msg.stations) {
			var array = msg.stations[i].split(":");
			var id = array[0];
			var name = array[1].replace("Radio", "");

			s.push({name: name, id: id});
		}

		$scope.stations = s;
	});

	$scope.changeStation = function(stationId) {
		socket.emit('changeStation', { stationId: stationId });
	}
}

function SongController($scope, socket) {
	socket.on('start', function(msg) {
		var aa = 'on ' + msg.album + ' by ' + msg.artist;
		$scope.albumartist = aa;
		$scope.src = msg.coverArt;
		$scope.alt = msg.album;
		$scope.title = msg.title;
		$scope.rating = msg.rating;

		if (msg.rating == 1) {
			document.getElementById("love").className = "btn btn-success pull-left";
		} else {
			document.getElementById("love").className = "btn btn-default pull-left";

		}
	});

	$scope.sendCommand = function(action) {
		socket.emit('action', { action: action });
	}

	$("#pauseplay").click(function() {
		$(this).children().toggleClass('glyphicon-pause glyphicon-play');
	});

	socket.on('lovehate', function(msg) {
		if (msg.rating == 1) {
			document.getElementById("love").className = "btn btn-success pull-left";
		}
	});
   
   $scope.controlPB = function(call) {
      //alert("controlPB called");
      socket.emit('scriptCall', { call: call });
   }


}

function NewButtonController($scope, $http) {
  /*New buttons code
 $scope.controlPB = function(t){
   $http.post('http://localhost:8080/scriptCall',{t:t});
   $console.log('controlPB: ' + t);
 }/*.success(function(data){
  console.log(data);
 })*/;
}
