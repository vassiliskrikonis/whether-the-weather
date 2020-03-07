describe("Whether the Weather App", function() {
  const dummyLocation = {
    coords: {
      latitude: 12.34,
      longitude: 12.12
    }
  };
  const apiUrl = "https://weather-the-weather-proxy.glitch.me/";

  context("when everything works fine", function() {
    beforeEach(function() {
      cy.on("window:before:load", win => {
        cy.stub(win.navigator.geolocation, "getCurrentPosition", cb => {
          cb(dummyLocation);
        }).as("mockGeolocation");
      });
    });

    function mockWeather(today, yesterday, icon = "partly-cloudy-day") {
      cy.server();
      cy.route("POST", apiUrl, [
        {
          currently: {
            apparentTemperature: today,
            icon: icon
          }
        },
        {
          currently: {
            apparentTemperature: yesterday,
            icon: icon
          }
        }
      ]).as("postWeather");
    }

    it("shows if today is colder than yesterday", function() {
      mockWeather(40, 41);
      cy.visit("/");

      cy.contains("Loading...");
      cy.get(".icon")
        .should("have.attr", "src")
        .and("match", /noun_cloudy day.*\.svg/);
      cy.get(".what").should("contain", "colder");
      cy.get("footer").should("be.visible");
    });

    it("shows if today is hotter than yesterday", function() {
      mockWeather(42, 41);
      cy.visit("/");

      cy.contains("Loading...");
      cy.get(".icon")
        .should("have.attr", "src")
        .and("match", /noun_cloudy day.*\.svg/);
      cy.get(".what").should("contain", "hotter");
    });
  });

  context("when geolocation is not available", function() {
    beforeEach(function() {
      cy.on("uncaught:exception", () => {
        return false;
      });
    });

    it("shows error when geolocation is not supported in browser", function() {
      cy.visit("/", {
        onBeforeLoad(win) {
          cy.stub(win.navigator, "geolocation", null);
        }
      });

      cy.contains("Geolocation not supported");
    });

    it("shows error when geolocation is denied", function() {
      cy.visit("/", {
        onBeforeLoad(win) {
          cy.stub(win.navigator.geolocation, "getCurrentPosition", (_, cb) => {
            cb({
              code: 1, // PERMISSION_DENIED
              message: "Denied"
            });
          });
        }
      });

      cy.contains("Denied");
    });

    it("shows error when geolocation times out", function() {
      cy.visit("/", {
        onBeforeLoad(win) {
          cy.stub(win.navigator.geolocation, "getCurrentPosition", (_, cb) => {
            cb({
              code: 3, // TIMEOUT
              message: "Geolocation timeout"
            });
          });
        }
      });

      cy.contains("Geolocation timeout");
    });
  });

  context("when weather api is not working correctly", function() {
    beforeEach(function() {
      cy.on("uncaught:exception", () => {
        return false;
      });
      cy.on("window:before:load", win => {
        cy.stub(win.navigator.geolocation, "getCurrentPosition", cb => {
          cb(dummyLocation);
        }).as("mockGeolocation");
      });
    });

    it("shows error when api is unavailable", function() {
      cy.server();
      cy.route({
        url: apiUrl,
        method: "POST",
        status: 500,
        response: { error: "Some error" }
      });
      cy.visit("/");

      cy.contains("Some error");
    });

    it("shows error when api returns incompatible data", function() {
      cy.server();
      cy.route({
        url: apiUrl,
        method: "POST",
        status: 200,
        response: { foo: "bar" }
      });
      cy.visit("/");

      cy.contains("Could not parse weather data");
    });
  });

  context("when offline", function() {
    it("should work");
  });
});
