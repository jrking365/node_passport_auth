const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

//User Model
const User = require('../models/User');

//Login page
router.get('/login', (req, res) => res.render('login'));

//register page
router.get('/register', (req, res) => res.render('register'));

//Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill  in all fields ' })
    }

    // Check Password match 
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be atleast 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // user exist
                    errors.push({ msg: 'email is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // hashing password 
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //Set password to hash
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'you are now registered and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }))

                }
            })
    }
})

module.exports = router;