import React from "react";
import { Route, DefaultRoute, Redirect, NotFoundRoute } from "react-router/build/npm/lib";

import UserLayout from "../app/layouts/UserLayout";
import AnonymousLayout from "../app/layouts/AnonymousLayout";

import IndexPage from "../app/pages/IndexPage";
import ContactPage from "../app/pages/ContactPage";
import DescriptionPage from "../app/pages/DescriptionPage"
import ProfilePage from "../app/pages/ProfilePage";
import FAQPage from "../app/pages/FAQPage";
import SponsorshipPage from "../app/pages/SponsorshipPage";
import GuidesPage from "../app/pages/GuidesPage";
import SignInPage from "../app/pages/SignInPage";
import SignOutPage from "../app/pages/SignOutPage";
import NotFoundPage from "../app/pages/NotFoundPage";
import UserListPage from "../app/pages/UserListPage";
import ApplicationsPage from "../app/pages/ApplicationsPage";
import MainApplication from "../app/apps/MainApplication";

const routes = (
  <Route handler={MainApplication}>
    <Route name="home" path="/" handler={UserLayout}>
      <DefaultRoute name="index" handler={IndexPage} />
      <Route name="description" path="description" handler={DescriptionPage} />
      <Route name="contact" path="contact" handler={ContactPage} />
      <Route name="profile" path="profile" handler={ProfilePage} />
      <Route name="faq" path="faq" handler={FAQPage} />
      <Route name="sponsorship" path="sponsorship" handler={SponsorshipPage} />
      <Route name="guides" path="guides" handler={GuidesPage} />
      <Route name="applications" path="applications" handler={ApplicationsPage} />
      <Route name="students" path="students" handler={UserListPage} />
    </Route>
    <Route name="auth" path="/a" handler={AnonymousLayout}>
      <Route name="signin" path="login" handler={SignInPage} />
      <Redirect from="/" to="signin" />
      <Route name="a-faq" path="faq" handler={FAQPage} />
    </Route>
    <Route name="logout" path="logout" handler={SignOutPage} />
    <Route name="signout" path="signout" handler={SignOutPage} />
    <NotFoundRoute handler={NotFoundPage} />
  </Route>
);

export default routes;
