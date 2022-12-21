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


function doInitialRedirect() {
  var data = document.getElementById("shopify-app-init").dataset;
  var loadPath = data && data.returnTo || data.homePath;
  if (loadPath) Turbo.visit(loadPath);
}


document.addEventListener("turbo:load", function (event) {
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
doInitialRedirect();

(function(xhr) {
  async function addSessionToken(xhrInstance) { // Example
    var sessionToken = await getSessionToken(app)
    xhrInstance.setRequestHeader("Authorization", `Bearer ${sessionToken}`)
    console.log('we should add session token here', xhrInstance, sessionToken);
  }
  // Capture request before any network activity occurs:
  var send = xhr.send;
  // TODO: STOP MAKING THIS ASYNC OR GET SOME CONFIDENCE THAT THIS ISN'T BREAKING SHIT
  xhr.send = async function(data) {
    await addSessionToken(this)
    return send.apply(this, arguments);
  };
})(XMLHttpRequest.prototype);
