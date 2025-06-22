import { Request, Response } from "express";
import { ProductClient } from "../clients/product.client";
import { ValidationError } from "../errors/validation.errors";
import { NotFoundError } from "../errors/not-found.errors";
import { productSchema } from "../validators/product.validators";

export class ProductController {
  public static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductClient.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getProductById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const product = await ProductClient.getProductById(id);
      if (!product) {
        throw new NotFoundError("Product not found");
      }
      res.json(product);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  public static async createProduct(req: Request, res: Response) {
    try {
      const { error, value } = productSchema.validate(req.body);
      if (error) {
        throw new ValidationError("Validation Error", error.details);
      }

      const newProduct = await ProductClient.createProduct(value);

      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message, details: error.details });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  public static async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const { error, value } = productSchema.validate(req.body);
      if (error) {
        throw new ValidationError("Validation Error", error.details);
      }

      const updatedProduct = await ProductClient.updateProduct({
        id,
        ...value,
      });
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message, details: error.details });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  public static async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const success = await ProductClient.deleteProduct(id);
      if (!success) {
        throw new NotFoundError("Product not found");
      }
      res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  public static async getProductSizes(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const sizes = await ProductClient.getProductSizes(id);
      res.json(sizes);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
