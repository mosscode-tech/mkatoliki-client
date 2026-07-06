import ReactGA from "react-ga4";

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function initAnalytics() {
  if (!MEASUREMENT_ID) return;

  ReactGA.initialize(MEASUREMENT_ID);

  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
  });
}

export function trackPageView() {
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
  });
}