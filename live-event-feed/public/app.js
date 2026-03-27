const app = angular.module('eventFeedApp', []);

app.controller('FeedCtrl', function($scope, $http, $interval) {
  $scope.events = [];
  $scope.newEvent = {type: '', message: '', priority: 'normal'};
  $scope.error = '';
  // WebSocket`
  const ws = new WebSocket('ws://' + window.location.host);

  ws.onmessage = function(msg) {
    const m = JSON.parse(msg.data);
    if (m.type === 'init') {
      $scope.$apply(() => $scope.events = m.data.sort((a, b) => b.timestamp - a.timestamp));
    } else if (m.type === 'new_event') {
      $scope.$apply(() => $scope.events.unshift(m.data));
    }
  };

  // Submit new event
  $scope.submitEvent = function() {
    $http.post('/events', $scope.newEvent)
      .then(function() {
        $scope.newEvent = {type: '', message: '', priority: 'normal'};
        $scope.error = '';
      })
      .catch(function(err) {
        if (err.status === 429) $scope.error = err.data.error;
        else $scope.error = 'Error submitting event.';
      });
  };

  $scope.countByPriority = function(prio) {
    return $scope.events.filter(e => e.priority === prio).length;
  };
});
