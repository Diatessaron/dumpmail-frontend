import * as Sentry from "@sentry/react";
import {backendUrl} from "./utils/config";

export function initSentry() {
    Sentry.init({
        dsn: "https://b4263800bfa10eb0f82af814b878e04a@o4508614981451776.ingest.de.sentry.io/4508614991609936",
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration(),
        ],
        tracesSampleRate: 1.0,
        tracePropagationTargets: ["localhost", new RegExp(backendUrl)],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
    });
}
