angular.module('app')
    .controller('UserDashboardController', function ($scope, UserDashboardService) {
        $scope.filteredUsers = UserDashboardService.searchUsers('');
        $scope.onSearch = function () {
            var query = $scope.searchQuery;
            $scope.filteredUsers = UserDashboardService.searchUsers(query);
        };
        $scope.makeAdmin = function (user) {
            UserDashboardService.updateUser(user.id, { role: 'admin' });
        };
    });