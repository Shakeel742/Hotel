const mongoose = require("mongoose");
const Room = require("./models/room");
const User = require("./models/user");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hotel", {
  useNewUrlParser: true,
  useFindAndModify: false
});

Room.deleteMany({})
  .then(() => {
    return Room.create({
      floor: 1,
      roomNumber: 1,
      price: 100,
      checkInDate: "2020-01-01",
      checkOutDate: "2020-01-07"
    });
  })
  .then(room => console.log(room))
  .then(() => {
    return Room.create({
      floor: 1,
      roomNumber: 2,
      price: 101,
      checkInDate: "2020-01-04",
      checkOutDate: "2020-01-06"
    });
  })
  .then(room => console.log(room))
  .then(() => {
    return Room.create({
      floor: 1,
      roomNumber: 3,
      price: 102,
      checkInDate: "2020-01-22",
      checkOutDate: "2020-01-24"
    });
  })
  .then(room => console.log(room))
  .then(() => {
    return Room.create({
      floor: 2,
      roomNumber: 1,
      price: 103,
      checkInDate: "2020-02-21",
      checkOutDate: "2020-02-24"
    });
  })
  .then(room => console.log(room))
  .then(() => {
    return Room.create({
      floor: 2,
      roomNumber: 2,
      price: 104,
      checkInDate: "2020-03-5",
      checkOutDate: "2020-03-15"
    });
  })
  .then(room => console.log(room))
  .then(() => {
    return Room.create({
      floor: 2,
      roomNumber: 3,
      price: 105,
      checkInDate: "2020-04-22",
      checkOutDate: "2020-04-27"
    });
  })
  .then(room => console.log(room))
  .catch(error => console.log(error.message))
  .then(() => {
    console.log("DONE");
    mongoose.connection.close();
  });
