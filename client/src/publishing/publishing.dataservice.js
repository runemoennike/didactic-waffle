(function() {
    angular
        .module('publishing')
        .factory('publishingData', dataservice);

    dataservice.$inject = ['$http'];

    function dataservice($http, logger) {
        return {
            list: list,
            create: create,
            read: read,
            update: update,
            remove: remove
        };

        function list() {
            return $http.get('/service/publishing')
                .then(complete);

            function complete(response) {
                return response.data;
            }
        }

        function create() {
            var item = {
                content: {
                    message: 'Unnamed Publishing',
                    network: 'facebook'
                },
                scheduled: (new Date()).toISOString()
            };

            return $http.post('/service/publishing', item)
                .then(complete);

            function complete(response) {
                return response.data;
            }
        }

        function read(id) {
            return $http.get('/service/publishing/' + id)
                .then(complete);

            function complete(response) {
                return response.data;
            }
        }

        function update(item) {
            return $http.put('/service/publishing/' + item.id, item)
                .then(complete);

            function complete(response) {
                console.log("Saved.");
            }
        }

        function remove(item) {
            return $http.delete('/service/publishing/' + item.id)
                .then(complete);

            function complete(response) {
                return response.data;
            }
        }
    }
})();