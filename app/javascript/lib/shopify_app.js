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

const getSessionToken = window['app-bridge-utils'].getSessionToken

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


document.addEventListener("turbo:load", function (event) {
  redirectThroughTurbolinks();
  const app = window.app;
  app.getState('context').then(function(context) {
    if(context !== AppBridge.Context.Modal) {
      AppBridge.actions.History.create(app).dispatch(AppBridge.actions.History.Action.REPLACE, window.location.pathname);
    }
  });
});


document.addEventListener("turbo:before-fetch-request", async (event) => {
  event.preventDefault();
  const token = await getSessionToken(app);
  event.detail.fetchOptions.headers["Authorization"] =  `Bearer ${token}`;
  event.detail.url.searchParams.set("shop", data.shopOrigin);
  event.detail.url.searchParams.set("host", data.host);
  event.detail.resume();
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
