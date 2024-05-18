import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      required: false,
      ref: "users",
      default: null,
    },
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: "products",
          },
          quantity: Number,
        },
      ],
      default: [],
    },
    status: {
      type: String,
      required: false,
      enum: ["VACIO", "EN PROCESO", "EN PROCESO DE PAGO", "CANCELADO", "FINALIZADO"],
      default: "VACIO",
    },
  },
  {
    timestamps: {
      createdAt: "create_date",
      updatedAt: "last_update",
    },
  }
);

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
