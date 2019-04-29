describe("Whether the Weather App", function() {
  const mockLocation = {
    coords: {
      latitude: 12.34,
      longitude: 12.12
    }
  };
  const apiUrl = "https://weather-the-weather-proxy.glitch.me/";

  context("when everything works fine", function() {
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
            apparentTemperature: yesterday
          }
        }
      ]);
    }

    beforeEach(function() {
      cy.visit("/", {
        onBeforeLoad(win) {
          cy.stub(win.navigator.geolocation, "getCurrentPosition", cb => {
            cb(mockLocation);
          }).as("mockGeolocation");
        }
      });
    });

    it("shows if today is colder than yesterday", function() {
      mockWeather(40, 41);

      cy.contains("Getting Location");
      cy.contains("Getting Weather");
      cy.get("#logo")
        .should("have.attr", "src")
        .and("match", /noun_cloudy day.*\.svg/);
      cy.get(".info").should("contain", "colder");
      cy.get("footer").should("be.visible");
    });

    it("shows if today is hotter than yesterday", function() {
      mockWeather(42, 41);

      cy.contains("Getting Location");
      cy.contains("Getting Weather");
      cy.get("#logo")
        .should("have.attr", "src")
        .and("match", /noun_cloudy day.*\.svg/);
      cy.get(".info").should("contain", "hotter");
    });
  });

  context("when geolocation is not available", function() {
    it("shows error when geolocation is not supported in browser", function() {
      cy.visit("/", {
        onBeforeLoad(win) {
          cy.stub(win.navigator, "geolocation", null);
        }
      });

      cy.get(".info")
        .should("contain", "Geolocation is not supported")
        .and("have.class", "error");
    });

    it("shows error when geolocation is denied", function() {
      cy.visit("/", {
        onBeforeLoad(win) {
          cy.stub(win.navigator.geolocation, "getCurrentPosition", (_, cb) => {
            cb({
              code: 1, // PERMISSION_DENIED
              message: "Not available"
            });
          });
        }
      });

      cy.get(".info")
        .should("have.text", "Not available")
        .and("have.class", "error");
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

      cy.get(".info")
        .should("have.text", "Geolocation timeout")
        .and("have.class", "error");
    });
  });

  context("when weather api is not working correctly", function() {
    it("shows error when api is unavailable", function() {
      cy.server();
      cy.route({
        url: apiUrl,
        method: "POST",
        status: 500,
        response: { error: "Error" }
      });

      cy.visit("/")
        .get(".info")
        .should("contain", "Error")
        .and("have.class", "error");
    });

    it("shows error when api returns incompatible data", function() {
      cy.server();
      cy.route({
        url: apiUrl,
        method: "POST",
        status: 200,
        response: { foo: "bar" }
      });

      cy.visit("/")
        .get(".info")
        .should("contain", "cannot parse data")
        .and("have.class", "error");
    });
  });

  context("when offline", function() {
    it("should work");
  });
});
