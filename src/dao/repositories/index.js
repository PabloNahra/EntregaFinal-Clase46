import { Products } from "../factory/productFactory.js";
import { Carts } from "../factory/cartFactory.js";
import { Tickets } from "../factory/ticketFactory.js";
import { Mocks } from "../factory/mockFactory.js";

import ProductRepository from "./products.repository.js";
import CartRepository from "./carts.repository.js";
import TicketRepository from "./tickets.repository.js";
import MockRepository from "./mock.repository.js";

export const productsServicesRep = new ProductRepository(new Products())
export const cartsServicesRep = new CartRepository(new Carts())
export const ticketsServicesRep = new TicketRepository(new Tickets())
export const mocksServicesRep = new MockRepository(new Mocks())
