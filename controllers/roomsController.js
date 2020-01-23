const Room = require("../models/room");
const User = require("../models/user");

const getRoomParams = body => {
  return {
    floor: body.floor,
    roomNumber: body.roomNumber,
    price: body.price,
    checkInDate: body.checkInDate,
    checkOutDate: body.checkOutDate
  };
};

module.exports = {
  index: (req, res, next) => {
    Room.find()
      .then(rooms => {
        res.locals.rooms = rooms;
        next();
      })
      .catch(error => {
        console.log(`Error fetching rooms: ${error.message}`);
        next(error);
      });
  },

  create: (req, res, next) => {
    let roomParams = getRoomParams(req.body);
    Room.create(roomParams)
      .then(room => {
        res.locals.redirect = "/rooms";
        res.locals.room = room;
        req.flash("success", "Room Created");
        next();
      })
      .catch(error => {
        console.log(`Error saving room: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let roomId = req.params.id;
    Room.findById(roomId)
      .then(room => {
        res.locals.room = room;
        next();
      })
      .catch(error => {
        console.log(`Error fetching room by ID: ${error.message}`);
        next(error);
      });
  },

  edit: (req, res, next) => {
    let roomId = req.params.id;
    Room.findById(roomId)
      .then(room => {
        res.render("rooms/edit", { room });
      })
      .catch(error => {
        console.log(`Error fetching room by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let roomId = req.params.id,
      roomParams = getRoomParams(req.body);

    Room.findByIdAndUpdate(roomId, {
      $set: roomParams
    })
      .then(room => {
        res.locals.redirect = `/rooms/${roomId}`;
        res.locals.room = room;
        req.flash("success", "Room Updated");
        next();
      })
      .catch(error => {
        console.log(`Error updating room by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let roomId = req.params.id;
    Room.findByIdAndRemove(roomId)
      .then(() => {
        User.find()
          .then(users => {
            users.forEach(user => {
              let filteredArray = user.rooms.filter(room => {
                return room.toString() !== roomId;
              });
              User.findByIdAndUpdate(user._id, {
                $set: { rooms: filteredArray }
              }).catch(error => {
                console.log(`Error updating user ${error.message}`);
                next(error);
              });
            });
          })
          .catch(error => {
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);
          });
        req.flash("success", "Room Deleted");
        res.locals.redirect = "/rooms";
        next();
      })
      .catch(error => {
        console.log(`Error deleting room by ID: ${error.message}`);
        next();
      });
  },

  book: (req, res, next) => {
    let roomId = req.params.id;
    let currentUser = req.user;
    Room.findById(roomId)
      .then(room => {
        if (room.user) {
          res.locals.success = false;
          req.flash("error", "Room booked already");
          res.redirect("/rooms");
        } else {
          if (currentUser) {
            User.findByIdAndUpdate(currentUser, {
              $addToSet: {
                rooms: roomId
              }
            })
              .then(() => {
                Room.findByIdAndUpdate(roomId, {
                  $set: { user: currentUser._id }
                })
                  .then(() => {
                    res.locals.success = true;
                    req.flash("success", "Room booked");
                    res.redirect(`/users/${currentUser._id}`);
                  })
                  .catch(error => {
                    next(error);
                  });
              })
              .catch(error => {
                next(error);
              });
          } else {
            req.flash("error", "User must log in.");
            res.redirect("/users/login");
          }
        }
      })
      .catch(error => {
        console.log(error);
        next();
      });
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

  isUser: (req, res, next) => {
    if (req.user) {
      return next();
    } else {
      req.flash("error", "User must log in.");
      if (req.user) {
        res.redirect("/");
      } else {
        res.redirect("/users/login");
      }
    }
  },

  indexView: (req, res) => {
    res.render("rooms/index");
  },

  new: (req, res) => {
    res.render("rooms/new");
  },

  showView: (req, res) => {
    res.render("rooms/show");
  }
};
