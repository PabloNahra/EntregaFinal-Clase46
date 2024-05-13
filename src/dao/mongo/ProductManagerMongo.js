import { productsModel } from "../../models/products.model.js";
import { userModel } from "../../models/user.model.js";
import MailingService from "../../services/mailing.js";

export class ProdManager {
  constructor(path) {
    this.path = path;
  }

  async get(limit = 10, page = 1, query = "", sort = "") {
    try {
      const [code, value] = query.split(":");
      const parseProducts = await productsModel.paginate(
        { [code]: value },
        {
          limit,
          page,
          sort: sort ? { price: sort } : {},
        }
      );
      parseProducts.payload = parseProducts.docs;
      delete parseProducts.docs;
      return { message: "OK", ...parseProducts };
    } catch (error) {
      return { message: "ERROR", rdo: "No hay productos" };
    }
  }

  async addProduct(product) {
    try {
      const added = await productsModel.create(product);
      if (added) {
        return { message: "Producto añadido DAO" };
      }
    } catch (error) {
      return { message: `No se pudo añadir el producto DAO - ${error}` };
    }
  }

  async getProductById(id) {
    const product = await productsModel.findOne({ _id: id });
    if (!product) {
      return console.error("Prod NO encontrado");
    }
    return product;
  }

  async deleteProduct(id, user) {
    try {
      let productDeleted = null;
      const prodToDel = await productsModel.findOne({ _id: id });

      // Validar si el usuario es premium que el producto le pertenezca
      if (user.role.toUpperCase() === "PREMIUM") {
        if (prodToDel && prodToDel.owner && prodToDel.owner === user.email) {
          productDeleted = await productsModel.deleteOne({ _id: id });
        } else {
          return {
            message: `Producto NO se puede eliminar porque no le perenece al Usuario (Owner): ${id}`,
          };
        }
      } else {
        productDeleted = await productsModel.deleteOne({ _id: id });
      }

      if (productDeleted.deletedCount > 0) {
        // Si lo eliminamos y el producto pertenecia a un user PREMIUM le enviamos un mail
        // Buscamos el role del user owner del producto
        const userOwner = await userModel.findOne({ email: prodToDel.owner });
        if (userOwner && userOwner.role.toUpperCase() === "PREMIUM") {
          //Enviar mail de aviso de eliminación
          const mailingService = new MailingService();
          await mailingService.sendSimpleMail({
            from: "Coderhouse",
            to: userOwner.email,
            subject: "CoderHouse - BackEnd - Producto Eliminado",
            html: `
                        <h1>Coder e-commerce</h1>
                        <h2>El siguiente producto ha sido eliminado</h2>
                        <p>ID: ${prodToDel._id}</p>
                        <p>Title: ${prodToDel.title}</p>
                        <p>Description: ${prodToDel.description}</p>
                    `,
          });
        }

        return { message: `Producto eliminado correctamente - Id: ${id}` };
      } else {
        return { message: `Producto NO encontrado - Id: ${id}` };
      }
    } catch (error) {
      console.error(error);
      return { message: `No se pudo eliminar el producto - ${error}` };
    }
  }

  async updateProduct(id, productToUpdate) {
    try {
      const update = await productsModel.updateOne(
        { _id: id },
        productToUpdate
      );
      if (update.modifiedCount > 0) {
        return { message: `Producto modificado exitosamente - Id: ${id}` };
      } else {
        return { message: `Producto NO modificado - Id: ${id}` };
      }
    } catch (error) {
      console.error(error);
      return { message: `No se pudo modificar el producto - ${error}` };
    }
  }
}

export default ProdManager;
