var data = document.getElementById('shopify-app-init').dataset;
var AppBridge = window['app-bridge'];
var createApp = AppBridge.default;
window.app = createApp({
  apiKey: data.apiKey,
  host: data.host,
});

var actions = AppBridge.actions;
var TitleBar = actions.TitleBar;
TitleBar.create(app, {
  title: data.page,
});

const SESSION_TOKEN_REFRESH_INTERVAL = 2000; // Request a new token every 2s

const getSessionToken = window['app-bridge-utils'].getSessionToken

async function retrieveToken(app) {
  window.sessionToken = await getSessionToken(app);
}
function keepRetrievingToken(app) {
  setInterval(() => {
    retrieveToken(app);
  }, SESSION_TOKEN_REFRESH_INTERVAL);
}

function redirectThroughTurbolinks(isInitialRedirect = false) {
  var data = document.getElementById("shopify-app-init").dataset;
  var validLoadPath = data && data.loadPath;
  var shouldRedirect = false;

  switch (isInitialRedirect) {
    case true:
      shouldRedirect = validLoadPath;
      break;
    case false:
      shouldRedirect = validLoadPath && data.loadPath !== "/home";
      break;
  }
  if (shouldRedirect) Turbo.visit(data.loadPath);
}

// Wait for a session token before trying to load an authenticated page
await retrieveToken(app);

// Keep retrieving a session token periodically
keepRetrievingToken(app);


document.addEventListener("turbo:load", function (event) {
  redirectThroughTurbolinks();
  const app = window.app;
  app.getState('context').then(function(context) {
    if(context !== AppBridge.Context.Modal) {
      AppBridge.actions.History.create(app).dispatch(AppBridge.actions.History.Action.REPLACE, window.location.pathname);
    }
  });
});


document.addEventListener("turbo:before-fetch-request", function (event) {
    event.detail.fetchOptions.headers["Authorization"] =  "Bearer " + window.sessionToken;
    event.detail.url.searchParams.set("shop", data.shopOrigin);
    event.detail.url.searchParams.set("host", data.host);
    // event.preventDefault();
    // async function foo() {
    //   const sessionToken = await getSessionToken(app);
    //   event.detail.fetchOptions.headers["Authorization"] =  "Bearer " + sessionToken;
    //   event.detail.url.searchParams.set("shop", data.shopOrigin);
    //   event.detail.url.searchParams.set("host", data.host);
    //   event.detail.resume();
    // }
    // foo()
});

// document.addEventListener("turbo:render", function () {
//   $("form, a[data-method=delete]").on("ajax:beforeSend", function (event) {
//     const xhr = event.detail[0];
//     xhr.setRequestHeader("Authorization", "Bearer " + window.sessionToken);
//   });
// });


// Redirect to the requested page when DOM loads
var isInitialRedirect = true;
redirectThroughTurbolinks(isInitialRedirect);
