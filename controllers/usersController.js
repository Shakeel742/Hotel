const User = require("../models/user");
const Room = require("../models/room");
const passport = require("passport");

const getUserParams = body => {
  return {
    name: body.name,
    email: body.email,
    password: body.password
  };
};

module.exports = {
  index: (req, res, next) => {
    User.find()
      .then(users => {
        res.locals.users = users;
        next();
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },

  create: (req, res, next) => {
    if (req.skip) {
      next();
    } else {
      let newUser = new User(getUserParams(req.body));
      User.register(newUser, req.body.password, (e, user) => {
        if (user) {
          req.flash("success", `${user.name}'s account created successfully!`);
          res.locals.redirect = "/users";
          next();
        } else {
          req.flash(
            "error",
            `Failed to create user account because: ${e.message}.`
          );
          res.locals.redirect = "/users/new";
          next();
        }
      });
    }
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.locals.user = user;
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
    User.findById(userId)
      .populate("rooms")
      .exec((err, rooms) => {
        if (err) req.flash("error", "error getting booked rooms");
        res.locals.rooms = rooms;
        next();
      });
  },

  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.render("users/edit", {
          user: user
        });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let userId = req.params.id;
    let userParams = getUserParams(req.body);
    User.findByIdAndUpdate(userId, {
      $set: userParams
    })
      .then(user => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },

  deleteBooking: (req, res, next) => {
    let roomId = req.body.roomId;
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        let roomsArray = user.rooms.filter(room => {
          return room.toString() !== roomId;
        });
        User.findByIdAndUpdate(userId, {
          $set: { rooms: roomsArray }
        }).catch(error => {
          console.log(`Error updating user ${error.message}`);
          next(error);
        });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
    Room.findByIdAndUpdate(roomId, {
      $unset: { user: "" }
    }).catch(error => {
      console.log(`Error updating room ${error.message}`);
      next(error);
    });
    req.flash("success", "deleted booking");
    res.locals.redirect = `/users/${userId}`;
    next();
  },

  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        Room.find()
          .then(rooms => {
            rooms.forEach(room => {
              if (room.user && room.user.toString() === userId) {
                Room.findByIdAndUpdate(room._id, {
                  $unset: { user: "" }
                }).catch(error => {
                  console.log(`Error updating room ${error.message}`);
                  next(error);
                });
              }
            });
            req.flash("success", "deleted user");
            res.locals.redirect = "/users";
            next();
          })
          .catch(error => {
            console.log(`Error fetching users: ${error.message}`);
            next(error);
          });
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },

  validate: (req, res, next) => {
    req
      .check("name", "Name is invalid")
      .notEmpty()
      .trim();
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true
      })
      .trim();
    req.check("email", "Email is invalid").isEmail();
    req.check("password", "Password cannot be empty").notEmpty();
    req.getValidationResult().then(error => {
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    });
  },

  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
    successFlash: "Logged in!"
  }),

  logout: (req, res, next) => {
    req.logout();
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
  },

  isAdmin: (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      req.flash("error", "Admin must log in.");
      if (req.user) {
        res.redirect("/");
      } else {
        res.redirect("/users/login");
      }
    }
  },

  isUsersAccount: (req, res, next) => {
    if (req.user && req.user._id.toString() === req.params.id) {
      return next();
    } else {
      req.flash("error", "Not users account.");
      if (req.user) {
        res.redirect("/");
      } else {
        res.redirect("/users/login");
      }
    }
  },

  isLoggedIn: (req, res, next) => {
    if (req.user) {
      res.redirect("/");
    } else {
      next();
    }
  },

  indexView: (req, res) => {
    res.render("users/index");
  },

  showView: (req, res) => {
    res.render("users/show");
  },

  new: (req, res) => {
    res.render("users/new");
  },

  login: (req, res) => {
    res.render("users/login");
  }
};
