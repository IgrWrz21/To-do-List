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

// document
//   .getElementById("authorize_button")
//   .addEventListener("click", handleAuthClick);
// document
//   .getElementById("signout_button")
//   .addEventListener("click", handleSignoutClick);

// document.getElementById("api").addEventListener("load", gapiLoaded);
// document.getElementById("client").addEventListener("load", gisLoaded);

document.getElementById("authorize_button").style.visibility = "hidden";
document.getElementById("signout_button").style.visibility = "hidden";

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
    document.getElementById("authorize_button").style.visibility = "visible";
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
    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("authorize_button").innerText = "Refresh";
    await listUpcomingEvents();
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
    document.getElementById("content").innerText = "";
    document.getElementById("authorize_button").innerText = "Authorize";
    document.getElementById("signout_button").style.visibility = "hidden";
  }
}

const addCalendarEvent = (title, desc, date) => {
  // const title = document.getElementById("title").value;
  // const desc = document.getElementById("desc").value;
  // const date = document.getElementById("date").value;
  //const start = document.getElementById("st").value;
  //const end = document.getElementById("et").value;

  // const startTime = new Date(date + "," + start).toISOString();
  // const endTime = new Date(date + "," + end).toISOString();

  // var event = {
  //   summary: title,
  //   location: "Google Meet",
  //   description: desc,
  //   end: {
  //     date: date,
  //   },
  //   reminders: {
  //     useDefault: false,
  //     overrides: [{ method: "email", minutes: 24 * 60 }],
  //   },
  // };

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

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
async function listUpcomingEvents() {
  let response;
  try {
    const request = {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    };
    response = await gapi.client.calendar.events.list(request);
  } catch (err) {
    console.log(err.message);
    return;
  }

  const events = response.result.items;
  if (!events || events.length == 0) {
    //document.getElementById("content").innerText = "No events found.";
    console.log("No events found.");
    return;
  }
  // Flatten to string to display
  console.dir(events);
  const output = events.reduce(
    (str, event) =>
      `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
    "Events:\n"
  );
  //document.getElementById("content").innerText = output;
  console.log(output);
}
