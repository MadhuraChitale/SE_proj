// "scripts": {
//   "test": "echo \"Error: no test specified\" && exit 1"
// },
const express = require("express"); //all the node modules
const bodyParser = require("body-parser");
const request = require("request");
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const bmi_datab = require("./models/bmi_data");

const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static", express.static("./static/"));

//connect to database
const connectDb = () => {
  mongoose.connect(
    "mongodb+srv://MadhuraCh:Rbcarcmm$9@cluster0.hjneezc.mongodb.net/test",
    { useNewUrlParser: true }
  );
  console.log("Connected to the database ");
};

connectDb();

//establish connection
var database = mongoose.connection;

app.listen(8000, function () {
  console.log("Server is running on port 8000");
});

//cal api
// Require google from googleapis package.
const { google } = require("googleapis");
const e = require("express");
const { response } = require("express");

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth;

// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google calendar API settings
const SCOPES = "https://www.googleapis.com/auth/calendar";
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);
var status = "Enter details";
///
//classes
var check_flag = 1;

//class reminders
class reminders {
  //function to set reminders
  set_reminders(event) {
    const insertEvent = async (event) => {
      try {
        let response = await calendar.events.insert({
          auth: auth,
          calendarId: calendarId,
          resource: event,
        });

        if (response["status"] == 200 && response["statusText"] === "OK") {
          return 1;
        } else {
          return 0;
        }
      } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
      }
    };
    insertEvent(event);
    // console.log("event inserter form class");
  }

  //function to delete reminders based on eventID
  del_reminders(eventStartTime, eventEndTime) {
    const getEvents = async (eventStartTime, eventEndTime) => {
      try {
        let response = await calendar.events.list({
          auth: auth,
          calendarId: calendarId,
          timeMin: eventStartTime,
          timeMax: eventEndTime,
          timeZone: "IST",
        });

        let items = response["data"]["items"];
        // console.log(items);
        //this gets the event id
        // console.log(items[0]["id"]);

        return items[0]["id"];
      } catch (error) {
        console.log(`Error at getEvents --> ${error}`);
        return 0;
      }
    };

    const deleteEvent = async (eventId) => {
      console.log("inside delete event");
      try {
        let response = await calendar.events.delete({
          auth: auth,
          calendarId: calendarId,
          eventId: eventId,
        });

        if (response.data === "") {
          return 1;
        } else {
          return 0;
        }
      } catch (error) {
        console.log(`Error at deleteEvent --> ${error}`);
        return 0;
      }
    };

    //get event id if it exists
    var eventid = getEvents(eventStartTime, eventEndTime);

    //set flag and remder success or failure message accordingly
    eventid.then(function (result) {
      console.log("id:" + result); // prints eventid
      // //DELETE AN EXISTING EVENT
      if (result == 0) {
        console.log("checking result inside if result==0 " + result);
        check_flag = 0;
        console.log(check_flag);
        status = "Event does not exist";
        console.log(status);
        // console.log("calling e");
      } else {
        check_flag = 1;
        console.log("deleting event and printing result");
        deleteEvent(result)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });

        // res.redirect("/msg");
      }
    });
  }
}

//class medicines
class medicines {
  //set the medicine details
  set_medicines(event) {
    const insertEvent = async (event) => {
      console.log("event inserted");
      try {
        let response = await calendar.events.insert({
          auth: auth,
          calendarId: calendarId,
          resource: event,
        });

        if (response["status"] == 200 && response["statusText"] === "OK") {
          return 1;
        } else {
          return 0;
        }
      } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
      }
    };
    insertEvent(event);
  }

  //set stock details
  set_stock(event) {
    const insertEvent = async (event) => {
      console.log("event inserted");
      try {
        let response = await calendar.events.insert({
          auth: auth,
          calendarId: calendarId,
          resource: event,
        });

        if (response["status"] == 200 && response["statusText"] === "OK") {
          return 1;
        } else {
          return 0;
        }
      } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
      }
    };
    insertEvent(event);
  }
}
///
app.get("/", function (req, res) {
  res.render("homepage");
  // res.render("msg");
});
app.get("/homepage", function (req, res) {
  // res.render("homepage");
  res.render("homepage");
});

app.get("/msg", function (req, res) {
  // console.log("rendering msg");
  res.render("msg");
  // console.log("msg rendered");
});
app.get("/bmi", function (req, res) {
  res.render("bmi");
});
app.get("/reminder_landing", function (req, res) {
  res.render("reminder_landing");
});

const tasks = [
  {
    id: 1,
    name: "Task 1",
  },
  {
    id: 2,
    name: "Task 2",
  },
];
app.get("/calendar_SET", function (req, res) {
  // res.status(200).json(tasks);
  res.render("calendar_SET");
});
app.get("/medicine", function (req, res) {
  res.render("medicine");
});
app.get("/charts", function (req, res) {
  res.render("charts");
});

app.get("/calendar_DEL", function (req, res) {
  status = "Enter details";
  res.render("calendar_DEL", { flag: status });
});

app.post("/calendar_SET", function (req, res) {
  //extract details from form
  var month = req.body.month;
  var day = req.body.day;
  var year = req.body.year;
  var time = req.body.time;
  var des = req.body.description;
  var sum = req.body.summary;
  console.log(month);

  // res.writeHead(200, { "Content-Type": "text/plain" });
  // res.send("November");

  // if (month == "November") {
  //   return res.status(200).send("chosen November");
  // }

  var result = month.concat(" ", day, ", ", year, " ", time);
  console.log(result);

  const eventStartTime = new Date(result);
  const eventEndTime = new Date(result);

  eventEndTime.setMinutes(eventEndTime.getMinutes() + 40);

  //create an event
  const event = {
    summary: sum,
    description: des,
    colorId: 3,
    start: {
      dateTime: eventStartTime,
      timeZone: "IST",
    },
    end: {
      dateTime: eventEndTime,
      timeZone: "IST",
    },
  };

  //create object
  const obj = new reminders();
  //call function
  obj.set_reminders(event);

  res.redirect("/msg");
});

app.post("/calendar_DEL", function (req, res) {
  var month = req.body.month;
  var day = req.body.day;
  var year = req.body.year;
  var time = req.body.time;

  var result = month.concat(" ", day, ", ", year, " ", time);

  const eventStartTime = new Date(result);
  const eventEndTime = new Date(result);
  eventEndTime.setMinutes(eventEndTime.getMinutes() + 40);

  Del_reminders(eventStartTime, eventEndTime);

  // const getEvents = async (eventStartTime, eventEndTime) => {
  //   try {
  //     let response = await calendar.events.list({
  //       auth: auth,
  //       calendarId: calendarId,
  //       timeMin: eventStartTime,
  //       timeMax: eventEndTime,
  //       timeZone: "IST",
  //     });

  //     let items = response["data"]["items"];
  //     // console.log(items);
  //     //this gets the event id
  //     // console.log(items[0]["id"]);

  //     return items[0]["id"];
  //   } catch (error) {
  //     console.log(`Error at getEvents --> ${error}`);
  //     return 0;
  //   }
  // };

  // const deleteEvent = async (eventId) => {
  //   console.log("inside delete event");
  //   try {
  //     let response = await calendar.events.delete({
  //       auth: auth,
  //       calendarId: calendarId,
  //       eventId: eventId,
  //     });

  //     if (response.data === "") {
  //       return 1;
  //     } else {
  //       return 0;
  //     }
  //   } catch (error) {
  //     console.log(`Error at deleteEvent --> ${error}`);
  //     return 0;
  //   }
  // };

  // insertEvent(event);
  // var eventid = getEvents(eventStartTime, eventEndTime);

  // eventid.then(function (result) {
  //   console.log(result); // prints eventid
  //   // //DELETE AN EXISTING EVENT
  //   if (result == 0) {
  //     console.log("event does not exist");
  //     status = "Event does not exist";
  //     // res.redirect("/calendar_DEL");
  //     res.render("calendar_DEL", { flag: status });
  //   } else {
  //     deleteEvent(result)
  //       .then((res) => {
  //         console.log(res);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });

  //     res.redirect("/msg");
  //   }
  // });
  res.redirect("/msg");
});

function data_entry(data) {
  var test_entry = new bmi_datab();
  test_entry.date = data[0];
  test_entry.bmi = data[1];

  if (data.length != 2) {
    return null;
  }
  if (test_entry.date != "" && test_entry.bmi != null) {
    database.collection("bmis").insertOne(test_entry, (err, collection) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log("Record inserted successfully");
    });
  } else {
    return null;
  }
}

app.post("/bmi", function (req, res) {
  var date = new Date();

  var height = req.body.height;
  var weight = req.body.weight;
  var result = weight / (height * height);
  console.log(result);
  var data = new bmi_datab();
  data.date = date;
  data.bmi = result;

  data_entry(data);

  console.log("fetching from datab");
  var two_d;
  bmi_datab.find({}, function (err, bmis) {
    if (err) console.log(err);

    const arr_of_dates = [];
    const BMIs = [];
    for (i = 0; i < bmis.length; i++) {
      arr_of_dates[i] = bmis[i].date;
      BMIs[i] = bmis[i].bmi;
    }

    two_d = [["Dates", "BMI"]];
    for (i = 1; i <= arr_of_dates.length; i++) {
      two_d[i] = [arr_of_dates[i - 1], BMIs[i - 1]];
    }
    return res.status(200).json({ names: two_d });

    console.log(two_d);
  });
});

app.post("/medicine", function (req, res) {
  var month = req.body.month;
  var day = req.body.day;
  var year = req.body.year;
  var no_of_days = req.body.no_of_days;
  console.log(no_of_days);
  no_of_days = parseInt(no_of_days);
  var tab_per_strip = req.body.tablets_per_strip; //strips
  var tab_per_dose = req.body.tab_per_dose;
  var timings = req.body.timings;
  const myArray = timings.split(",");

  var i;
  for (i = 0; i < myArray.length; i++) {
    var result = month.concat(" ", day, ", ", year, " ", myArray[i]);
    console.log(result);

    const eventStartTime = new Date(result);
    const eventEndTime = new Date(result);

    eventEndTime.setDate(eventEndTime.getDate() + no_of_days);

    eventEndTime.setMinutes(eventEndTime.getMinutes() + 40);

    des = req.body.description;
    sum = "Take " + tab_per_dose + " tablets of " + des;

    // eventEndTime.setDate(eventEndTime.getDate() + 4);
    const event = {
      summary: sum,
      description: des,
      colorId: 5,
      start: {
        dateTime: eventStartTime,
        timeZone: "IST",
      },
      end: {
        dateTime: eventEndTime,
        timeZone: "IST",
      },
    };

    const object = new medicines();
    object.set_medicines(event);

    // insertEvent(event);
    console.log(event);
  }

  // x = tab_per_strip / myArray.length + 1;
  // x = parseInt(x);
  // console.log(x);
  // var start_date = new Date(result);
  // console.log(start_date);
  result = month.concat(" ", day, ", ", year, " ", "00:00:00");
  const StartTime = new Date(result);
  len = myArray.length;
  calculate_doe(tab_per_strip, len, result, StartTime);

  // result = month.concat(" ", day, ", ", year, " ", "00:00:00");
  // const StartTime = new Date(result);
  var notify = new Date(result);
  notify.setDate(StartTime.getDate() + x - 2);
  var EndTime = new Date();
  EndTime = notify;
  EndTime.setMinutes(EndTime.getMinutes());
  console.log(notify);

  sum = "Restock " + des;
  // var tomorrow = new Date();
  // tomorrow.setDate(today.getDate() + 1);
  const EVENT = {
    summary: sum,
    description: des,
    colorId: 10,
    start: {
      dateTime: notify,
      timeZone: "IST",
    },
    end: {
      dateTime: EndTime,
      timeZone: "IST",
    },
  };
  console.log(EVENT);

  const obj = new medicines();
  obj.set_stock(EVENT);

  res.redirect("/msg");

  //remind to restock : on nth day : x= (tab_per_strip / (events/day))+1
  //remind on ntn day
});

function Set_reminders(event) {
  const insertEvent = async (event) => {
    try {
      let response = await calendar.events.insert({
        auth: auth,
        calendarId: calendarId,
        resource: event,
      });

      if (response["status"] == 200 && response["statusText"] === "OK") {
        return 1;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(`Error at insertEvent --> ${error}`);
      return 0;
    }
  };
  insertEvent(event);
  return true;
}

function Del_reminders(eventStartTime, eventEndTime) {
  const getEvents = async (eventStartTime, eventEndTime) => {
    try {
      let response = await calendar.events.list({
        auth: auth,
        calendarId: calendarId,
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        timeZone: "IST",
      });

      let items = response["data"]["items"];

      //this returns event id of event, else if event does not exist, it returns 0 in catch
      console.log("inside get events" + items[0]["id"]);
      return items[0]["id"];
    } catch (error) {
      console.log(`Error at getEvents --> ${error}`);
      return 0;
    }
  };

  const deleteEvent = async (eventId) => {
    console.log("inside delete event");
    try {
      let response = await calendar.events.delete({
        auth: auth,
        calendarId: calendarId,
        eventId: eventId,
      });

      if (response.data === "") {
        return 1;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(`Error at deleteEvent --> ${error}`);
      return 0;
    }
  };

  var does_exist = true;
  var test_eventid = getEvents(eventStartTime, eventEndTime);
  test_eventid.then(function (result) {
    //DELETE AN EXISTING EVENT
    if (result == 0) {
      console.log("Event does not exist");
      // return false;
      does_exist = false;
    } else {
      deleteEvent(result)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log("event successfully deleted");
      does_exist = true;
    }
  });
  return does_exist;
}

function calculate_doe(tab_per_strip, len, result, StartTime) {
  x = tab_per_strip / len + 1;
  x = parseInt(x);
  var notify = new Date(result);
  notify.setDate(StartTime.getDate() + x - 2);
}

module.exports = {
  app,
  data_entry,
  Set_reminders,
  Del_reminders,
  calculate_doe,
};
