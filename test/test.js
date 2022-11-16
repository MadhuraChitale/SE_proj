let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
const { replaceOne } = require("../models/bmi_data");

chai.use(chaiHttp);
let should = chai.should();
var expect = chai.expect;

describe("BMI data for chart", () => {
  it("Test Case : Should enter data into the database with no null fields", (done) => {
    const data1 = [
      "Tue Nov 08 2022 23:12:12 GMT+0530 (India Standard Time)",
      16,
    ];
    success = server.data_entry(data1);
    expect(data1.length).to.equal(2);
    done();
  });
  it("Test Case : Should not enter data into the database with null fields", (done) => {
    const data2 = ["", 45];
    isnull = server.data_entry(data2);
    expect(data2.length).to.equal(2);
    expect(isnull).to.equal(null);
    done();
  });
  it("Test Case : Should reject invalid data entries ", (done) => {
    const data2 = [45];
    isnull = server.data_entry(data2);
    expect(isnull).to.equal(null);
    done();
  });
});

describe("Reminders", () => {
  test_result = "November 13, 2022 18:00:00";
  const eventStartTime = new Date(test_result);
  const eventEndTime = new Date(test_result);
  eventEndTime.setMinutes(eventEndTime.getMinutes() + 40);

  it("Test Case : Should only set reminder for valid event", (done) => {
    const event = {
      summary: "This is a test event.",
      description: "This is a test description",
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

    isvalid = server.Set_reminders(event);
    expect(isvalid).to.equal(true);

    done();
  });

  it("Test Case : Should delete reminder if it exists", (done) => {
    does_exist = server.Del_reminders(eventStartTime, eventEndTime);
    expect(does_exist).to.equal(true);
    done();
  });
});

describe("Medicines", () => {
  it("Test Case : Should automatically calculate date of exhaustion of medicines", (done) => {
    const len_of_time_array = 3;
    const tablets_per_strip = 10;
    result = "November 13, 2022 18:00:00";
    const StartTime = new Date(result);
    server.calculate_doe(
      len_of_time_array,
      tablets_per_strip,
      result,
      StartTime
    );
    done();
  });
});
