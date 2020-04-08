const express = require("express");
const path = require("path");
const UsersService = require("./users-service");
const usersRouter = express.Router();
const CompanyService = require("../company/company-service");
const AuthService = require("../auth/auth-service");
const jsonBodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

usersRouter
  .route("/c/:companyid")
  .all(requireAuth)
  .get((req, res, next) => {
    const { companyid } = req.params;
    UsersService.getEmployees(req.app.get("db"), companyid)
      .then((users) => {
        if (!users) {
          logger.error(`Company with id ${companyid} not found.`);
          return res.status(404).json({
            error: { message: `Users Not Found` },
          });
        }
        res.json(users);
      })
      .catch(next);
  });

usersRouter.post("/", jsonBodyParser, (req, res, next) => {
  const { password, email, full_name, company_name, isadmin } = req.body;

  for (const field of ["full_name", "email", "password", "company_name"])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`,
      });

  if (email.startsWith(" ") || email.endsWith(" ")) {
    return res.status(400).json({
      error: `User name cannot start or end with a space!`,
    });
  }

  const passwordError = UsersService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  UsersService.hasUserWithUserName(req.app.get("db"), email)
    .then((hasUserWithUserName) => {
      if (hasUserWithUserName)
        return res.status(400).json({ error: `Username already taken` });

      CompanyService.hasCompanyWithCompanyName(
        req.app.get("db"),
        company_name
      ).then(async (hasCompanyWithCompanyName) => {
        if (!hasCompanyWithCompanyName)
          return res.status(400).json({ error: "Company does not exist" });
        const companyid = await CompanyService.getIdByName(
          req.app.get("db"),
          company_name
        );
        return UsersService.hashPassword(password).then((hashedPassword) => {
          const newUser = {
            email,
            password: hashedPassword,
            full_name,
            isadmin: isadmin,
            companyid: companyid,
          };

          return UsersService.insertUser(req.app.get("db"), newUser).then(
            (user) => {
              const sub = user.email;
              const payload = {
                user_id: user.id,
                companyid: user.companyid,
                isadmin: user.isadmin,
                full_name: user.full_name,
              };

              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json({
                  authToken: AuthService.createJwt(sub, payload),
                  user: UsersService.serializeUser(user),
                });
            }
          );
        });
      });
    })
    .catch(next);
});

module.exports = usersRouter;
