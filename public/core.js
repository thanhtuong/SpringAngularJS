var todoApp = angular.module('todoApp',['ui.router']);

todoApp.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('/home'); // any request mismatch will get into /home
	$stateProvider
		.state('listTodo',{
			url: '/listTodo',
			templateUrl: 'listTodoDetail.html',
			controller: 'listTodoController',
			resolve:{
				formData: function(TodoService){
					return TodoService.formData;
				},
				addButonLabel: function(TodoService){
					return TodoService.addButonLabel;
				},
				isEdit: function(TodoService){
					return TodoService.isEdit;
				}
			}
		})
		.state('home',{
			url:'/home',
			templateUrl: 'createTodo.html',
			controller: 'mainController',
			resolve:{
				formData: function(TodoService){
					return TodoService.formData;
				},
				addButonLabel: function(TodoService){
					return TodoService.addButonLabel;
				},
				isEdit: function(TodoService){
					return TodoService.isEdit;
				}
			}
		});
});
todoApp.service('TodoService',function(){
	this.formData = {
		_id: '',
		text: '',
		assigned_by: '',
		priority: ''
		};
	this.addButonLabel ={
			text: 'Add'
		};
	this.isEdit ={
			value: false
		};
});

todoApp.controller('listTodoController',function($scope,$http,TodoService){
	$scope.addButon = TodoService.addButonLabel;
	$http.get('/api/todos')
		.success(function(data){
			$scope.todos = data;
			console.log(data);
		})
		.error(function(data){
			console.log('Error: ' + data);
		});

	$scope.deleteTodo = function(id){
		var result = confirm("want to delete?");
		if(result){
			$http.delete('/api/todos/' + id)
				.success(function(data){
					$scope.todos = data;
					console.log(data);
				})
				.error(function(data){
					console.log('Error: '+ data);
				});
			};
	};
	$scope.edit = function(todo){
		$scope.formData = {
			_id: todo._id,
			text: todo.text,
			assigned_by: todo.assigned_by,
			priority: todo.priority
		};
		$scope.addButon ={
			text: 'update'
		};
		$scope.isEdit = {
			value: true
		};
		TodoService.isEdit = $scope.isEdit;
		TodoService.formData = $scope.formData;
		TodoService.addButonLabel = $scope.addButon;
		console.log($scope.formData);
	};
});

todoApp.controller('mainController', function($scope, $http, TodoService){
	$scope.formData = TodoService.formData;
	console.log(TodoService.formData);
	$scope.addButon = TodoService.addButonLabel;
	$scope.isEdit = TodoService.isEdit;

	$scope.createTodo = function(){
		$http.post('/api/todos',$scope.formData)
			.success(function(data){
				$scope.formData = {};
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data){
				console.log('Error: '+data);
			});
	};

	// delete
	
	$scope.updateTodo = function(todoUpdate){
		$http.put('/api/todos/'+ todoUpdate._id, todoUpdate)
			.success(function(data){
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data){
				console.log('Error: '+ data);
			});
	};

	$scope.createOrUpdate = function(){
		if($scope.isEdit.value){
			$scope.updateTodo($scope.formData);
			console.log($scope.formData._id);
			TodoService.formData={};
		}else {
			$scope.createTodo();
		}
	};

	
});