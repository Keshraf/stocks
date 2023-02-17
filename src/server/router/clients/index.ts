import { mergeRouters } from "../../trpc";
import { getClientsRouter } from "./getClients";
import { addClientRouter } from "./addClient";

export const clientsRouter = mergeRouters(getClientsRouter, addClientRouter);
