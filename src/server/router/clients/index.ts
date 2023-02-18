import { mergeRouters } from "../../trpc";
import { getClientsRouter } from "./getClients";
import { addClientRouter } from "./addClient";
import { getClientByIdRouter } from "./getClientById";
import { deleteClientByIdRouter } from "./deleteClientById";
import { updateClientByIdRouter } from "./updateClientById";

export const clientsRouter = mergeRouters(
  getClientsRouter,
  addClientRouter,
  getClientByIdRouter,
  deleteClientByIdRouter,
  updateClientByIdRouter
);
