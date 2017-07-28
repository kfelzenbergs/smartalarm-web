trackerOwlsApp.service('Session', function ($cookies) {
    this.access_token = $cookies.get('access_token') || null;

    /**
     * Remove all session data
     */
    this.delete = function () {
        // Reset session data
        this.access_token = null;

        // Remove access token and user data
        $cookies.remove('access_token');

    };

    /**
     * Set user data on session
     * @param access_token
     * @param user_id
     * @param user_type
     * @param remember
     */
    this.set = function (access_token, user_id, user_type, remember) {
        var options = getCookieOptions(remember);

        $cookies.put('access_token', access_token, options);

        this.access_token = access_token;
    };

    /**
     * This method is explicitly used when only access token has to be set on session
     * @param access_token
     */
    this.setAccessToken = function (access_token) {
        this.access_token = access_token;
    };

    /**
     * Get cookie options
     * @param keep_alive
     */
    function getCookieOptions(keep_alive) {
        var options = {};

        // Set date how long to keep cookie alive
        if (keep_alive) {
            var expire_date = new Date();
            expire_date.setDate(expire_date.getDate() + 7);

            options.expires = expire_date;
        }

        return options;
    }
});
