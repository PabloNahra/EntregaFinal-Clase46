import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ticketsCollection = "tickets";

const ticketsSchema = mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
      default: generateRandomCode, // Usamos una función para generar el código aleatorio por defecto
    },
    purchase_datetime: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    purcharser: {
      type: String,
      required: true,
    },
    paymentMethods: {
      type: [String], 
      default: [], 
    },
  },
  {
    timestamps: {
      createdAt: "create_date",
      updatedAt: "last_update",
    },
  }
);

// Función para generar un código aleatorio de 15 caracteres alfanuméricos
function generateRandomCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 15; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

ticketsSchema.plugin(mongoosePaginate);

export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);
