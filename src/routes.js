var Router = require("koa-router");

var viewsController = require("../src/controllers/views");
var userController = require("../src/controllers/user");
var eventController = require("../src/controllers/event");
var applicationController = require("../src/controllers/application");
var scheduleController = require("../src/controllers/schedule");
var authController = require("../src/controllers/auth");

var accessRights = require("../lib/access-rights");

module.exports = function (app, passport) {
  // register functions
  var router = new Router();
  var securedRouter = new Router();
  var adminRouter = new Router();

  app.use(securedRouter.routes());
  app.use(adminRouter.routes());
  app.use(router.routes());
  app.use(router.allowedMethods());

  router.get("/auth/cas", passport.authenticate("cas"));
  router.all("/auth/cas/callback", passport.authenticate("cas", {
    successRedirect: "/",
    failureRedirect: "/a/login?error=cas"
  }));
  router.post("/signin", authController.signIn);
  router.post("/signout", authController.signOut);


  /******** secured routes ********/
  securedRouter.use(accessRights.isConnected);
  securedRouter.get("/users", userController.readAll);
  securedRouter.get("/users/me", authController.getCurrentUser);
  securedRouter.post("/users/me/password", userController.changePassword);
  securedRouter.post("/users/me/ringSize", userController.setRingSize);
  securedRouter.get("/users/me/applications", applicationController.readForUser);

  securedRouter.get("/events" , eventController.readAll);
  securedRouter.get("/events/all", accessRights.isAuthorized, eventController.readAll);
  securedRouter.get("/events/upcoming", accessRights.isAuthorized, eventController.getUpcomingEvents);
  securedRouter.post("/events/openEvent/:id", accessRights.isAuthorized, eventController.openEvent);  
  securedRouter.post("/events/closeEvent/:id", accessRights.isAuthorized, eventController.closeEvent);

  securedRouter.get("/events/:id", accessRights.isAuthorized, eventController.read);

  securedRouter.post("/application", accessRights.isAuthorized, applicationController.create);
  securedRouter.put("/application/:id", accessRights.isAuthorized, applicationController.update);
  securedRouter.del("/application/:id", accessRights.isAuthorized, applicationController.delete);  

  securedRouter.get("/schedules/:eventId", scheduleController.getForEvent);

  /******** admin routes ********/
  adminRouter.use(accessRights.isConnected, accessRights.isAdmin);
  adminRouter.post("/users/awardpoints", userController.batchAwardPoints);
  adminRouter.post("/users/:id/makeadmin", userController.makeAdmin);
  adminRouter.post("/users/:id/awardpoints", userController.awardPoints);
  adminRouter.post("/users/:id/fetchprofile", userController.fetchInfoFromLDAP);

  adminRouter.post("/authorization/:cip", userController.assignAuthorization);

  adminRouter.post("/adduser/newuser", userController.createUser);
  adminRouter.post("/adduser/addemail/:id", userController.addEmail);

  adminRouter.get("/events", eventController.readAll);
  adminRouter.post("/events", eventController.create);
  adminRouter.get("/events/:id/applications", applicationController.readForEvent);

  adminRouter.put("/events/:id", eventController.update);
  adminRouter.post("/schedules/:eventId", scheduleController.allocateTasks);
  adminRouter.del("/schedules/:eventId", scheduleController.deleteSchedule);
  adminRouter.get("/schedules/:eventId", scheduleController.getForEvent);


  /******** ui routes ********/
  router.get("/admin", function *() {
    if (!this.isAuthenticated()) {
      this.redirect("/a/login");
    } else if (!this.passport.user.meta.isAdmin) {
      this.throw("Vous n'avez pas les droits pour accéder à cette page", 403);
    } else {
      yield viewsController.admin.apply(this);
    }
  });

  router.get(/(|^$)/, function *() {
    yield viewsController.index.apply(this);
  });

};
