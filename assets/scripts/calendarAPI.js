/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID =
  "688997223000-3ojj83efqdaog9oqqq23vbsterprb0lt.apps.googleusercontent.com";
const API_KEY = "AIzaSyBhQ9_Ozc92Hf8Z9AQ73LTni0YxsIphUx8";

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar";

let tokenClient;
let gapiInited = false;
let gisInited = false;

const SVGSpanElement = document.querySelector(".authIcon");
const autorizeButton = document.getElementById("authorize_button");
const signtOutButton = document.getElementById("signout_button");
autorizeButton.style.visibility = "hidden";
signtOutButton.style.visibility = "hidden";
signtOutButton.style.display = "none";

// calendarAPI.js
let isLoggedIn = false;
function loginUser() {
  // Your login logic here
  isLoggedIn = true;
  console.log("User logged in");
}

function logoutUser() {
  // Your logout logic here
  isLoggedIn = false;
  console.log("User logged out");
}

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    autorizeButton.style.visibility = "visible";
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    console.log("logged");
    loginUser();
    toggleAddEventButton();
    signtOutButton.style.visibility = "visible";
    signtOutButton.style.display = "block";

    autorizeButton.querySelector(".textInAtrBtn").textContent = "Refresh";
    SVGSpanElement.style.backgroundImage =
      "url('/To-do-List/icons/refreashLogo.svg')";
    // await listUpcomingEvents();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    logoutUser();
    //document.getElementById("content").innerText = "";
    toggleAddEventButton();
    autorizeButton.querySelector(".textInAtrBtn").textContent = "Authorize";
    SVGSpanElement.style.backgroundImage =
      "url('/To-do-List/icons/calendarLogo.svg')";
    signtOutButton.style.visibility = "hidden";
    signtOutButton.style.display = "none";
  }
}

const toggleAddEventButton = () => {
  const calendarIcons = mainSectionNode.querySelectorAll(".fa-calendar");
  calendarIcons.forEach((calendarIcon) =>
    calendarIcon.classList.toggle("disabled")
  );
};

const addCalendarEvent = (title, desc, date) => {
  const event = {
    summary: title,
    description: desc,
    start: {
      date: date,
    },
    end: {
      date: date,
    },
    attendees: [{ email: "lpage@example.com" }, { email: "sbrin@example.com" }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  console.log(event);
  const request = gapi.client.calendar.events.insert({
    calendarId: "primary",
    resource: event,
  });

  request.execute(function (event) {
    console.log(event.htmlLink);
  });
};
