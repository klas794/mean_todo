var app = angular.module('app', []);
app.controller('todosCtrl', function($scope) {
    $scope.todos = {};
	$scope.addTodo = function(e) {
		$scope.todos.push(e.target.value);
	}
});