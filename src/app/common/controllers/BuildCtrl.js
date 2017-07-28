trackerOwlsApp.controller('BuildCtrl', function (Config) {
    var vm = this;

    /**
     * Determines if build config can be shown
     */
    vm.canShowBuildConfig = function () {
        return !Config.isProduction();
    };

    /**
     * Returns literal value of build environment
     */
    vm.getEnv = function () {
        return Config.getEnvVariable();
    };

    /**
     * Returns the date when project was build
     */
    vm.getBuildDate = function () {
        return Config.getBuildDate();
    };
});
