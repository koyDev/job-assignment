angular.module('app')
    .factory('UserDashboardService', function ($http) {
        const users = $http.get('https://api.example.com/users')
        .then(response => {
            return response?.data && Array.isArray(response.data)
                ? response.data
                : []
            ;
        }).catch(err => {
            console.log(err)
            return { message: 'Unexpected Error Occur' }
        });

        return {
            getUsers: function () {
                return users;
            },
            getUser: function (id) {
                if (!id) {
                    return { message: 'Request failed' }
                }
                const user = users.find(i => i.id == id)
                if (!user) {
                    return { message: 'User not found.' };
                }
                return user;
            },
            updateUser: function (id, changes) {
                if (!id || !changes) {
                    return { message: 'Update failed' };
                }
                const updatedUser = $http.put('https://api.example.com/users/' + id, changes).then(response => {
                    return response?.data
                }).catch(err => {
                    console.log(err);
                    return users
                })
                return users.map(user => user.id === id ? updatedUser : user)
            },
            searchUsers: function (query) {
                if (!query) {
                    return users
                }
                let input = query.trim()
                return users.filter(user => {
                    const username = user.name.toLowerCase()
                    const useremail = user.email.toLowerCase()
                    return username.indexOf(input) !== -1 || useremail.indexOf(input) !== -1
                })
            }
        };
    });