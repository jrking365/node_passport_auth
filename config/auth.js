module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
        req.flash('error_msg', 'Please login to view this ressource');
        res.redirect('/users/login');
    }
}