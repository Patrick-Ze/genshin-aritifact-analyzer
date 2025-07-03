import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import "./index.css";
import "./i18n";
import { store, persistor } from "./store";

if (import.meta.env.DEV) {
  Sentry.init({
    dsn: "https://1f47a2d0ca37dbf9aa906e865bc1dc66@o4509604769234944.ingest.us.sentry.io/4509604780310528",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.1,

    replaysSessionSampleRate: 0.1,

    replaysOnErrorSampleRate: 1.0,

    integrations: [new BrowserTracing(), new Sentry.Replay()],

    beforeSend(event, hint) {
      console.log(hint.originalException);
      const error = hint.originalException;
      if (
        error &&
        error.message &&
        (error.message.match(
          /Failed to fetch dynamically imported module/i
        ) ||
          error.message.match(
            /error loading dynamically imported module/i
          ))
      ) {
        return null;
      }
      return event;
    },
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
