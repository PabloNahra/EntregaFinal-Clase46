import { Router } from "express";
import { userModel } from "../models/user.model.js";
import { createHash } from "../utils/bcrypt.js";
import passport from "passport";
import {
  getSessionEmail,
  userRecoverPassByMail,
  userRecoverNewPass,
} from "../controllers/sessions.controller.js";
import { checkRolAdmin } from "../middlewares/auth.js";
import MailingService from "../services/mailing.js";
import SessionDTO from "../dtos/session.dto.js";

const sessionRoutes = Router();

// Entornos
const program = new Command()
program.option('--mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()
const { API_URL } = getVariables(options)

sessionRoutes.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
      documents: req.body.documents || [],
    };
    res.redirect("/");
  }
);

sessionRoutes.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).send({ message: "Error en las credenciales" });
    }
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
    };
    // Aviso por mail de sesión iniciada
    const mailingService = new MailingService();
    await mailingService.sendSimpleMail({
      from: "Coderhouse",
      to: req.user.email,
      subject: "CoderHouse - BackEnd - Inicio de Sesión",
      html: `
                <h1>Inicio de sesión exitoso</h1>
                <h2>Bienvenido a nuestro e-commerce</h2>
            `,
    });
    res.redirect("/");
  }
);

sessionRoutes.post("/logout", async (req, res) => {
  try {
    // Actualizar last_connection antes de que el logout sea exitoso
    const dateConnection = new Date();
    await userModel.updateOne(
      { email: req.session.user.email },
      { $set: { last_connection: dateConnection } }
    );

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Fallo al realizar Logout" });
      }
      res.send({ redirect: `${API_URL}/login` });
    });
  } catch (error) {
    res.status(400).send({ error });
  }
});

// cambiar la contraseña por la que indique el usuarios en la pagina
sessionRoutes.post("/restore", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).send({ message: "Error" });
  }
  user.password = createHash(password);
  user.save();
  res.send({ message: "Password changed" });
});

// Enviar un mail para indicar una nueva contraseña
sessionRoutes.post("/recover", userRecoverPassByMail);

// Confirmar la nueva contraseña
sessionRoutes.post("/recoverpass/:rId", userRecoverNewPass);

sessionRoutes.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {}
);

sessionRoutes.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

sessionRoutes.get("/current", getSessionEmail);

export default sessionRoutes;
