test48App.factory('Config', function ($rootScope) {
    var Config = {};

    /**
     * Returns literal value of build environment
     */
    Config.getEnvVariable = function () {
        return $rootScope.env_config['env'];
    };

    /**
     * Returns the date when project was build
     */
    Config.getBuildDate = function () {
        return $rootScope.env_config['build_date'];
    };

    /**
     * Determines if this is production environment
     */
    Config.isProduction = function () {
        return $rootScope.env_config['env'] == 'prod';
    };

    /**
     * Determines if this is development environment
     */
    Config.isDevelopment = function () {
        return $rootScope.env_config['env'] == 'dev';
    };

    /**
     * Determines if project is served on HTTPS by analyzing API endpoint
     */
    Config.isHTTPS = function () {
        return $rootScope.env_config['endpoint'].indexOf('https') > -1;
    };

    /**
     * Determines if project is served on HTTP by analyzing API endpoint
     */
    Config.isHTTP = function () {
        return !Config.isHTTPS();
    };

    return Config;
});
