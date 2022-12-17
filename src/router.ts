import { Request, Response, NextFunction,  Router } from "express";
import { body, oneOf, validationResult } from "express-validator";
import { handelInputError } from "./modules/middleware";
import type { Update } from "@prisma/client";
import prisma from "./db";

const router = Router();

/**
 * Product
 */
router.post("/product", body('name').isString(), handelInputError, async (req: Request, res: Response) => {
    // @ts-ignore
    await prisma.product.create({
        data: {
            name: req.body.name,
            updatedAt: new Date(),
            // @ts-ignore
            userId: req.user.id,
        }
    });
    res.status(200).json({
        message: "Product Created",
    });

}); // `C` Create a new product

router.get("/product", async (req: Request, res: Response) => {
    // @ts-ignore
    const products = await prisma.product.findMany({
        where: {
            // @ts-ignore
            userId: req.user.id
        }
    });
    res.status(200).json({
        data: products
    })
});  // 'R` Get all product
router.get("/product/:id", async (req: Request, res: Response) => {
    const product = await prisma.product.findFirst({
        where: {
            id: req.params.id,
            // @ts-ignore
            userId: req.user.id
        }
    });

    if (product) {
        res.status(200).json({
            data: product
        })
    } else {
        res.status(400).json({
            error: "Bad Request",
        })
    }
}); // `R` Get product with id `id`

router.put("/product/:id", body('name').isString(), handelInputError,  async (req: Request, res: Response) => {
    try {
        const product = await prisma.product.update({
            where: {
                id_userId: {
                    id: req.params.id,
                    // @ts-ignore
                    userId: req.user.id
                }
            },
            data: {
                name: req.body.name,
                updatedAt: new Date()
            }
        });
        res.status(200).json({
            "message": "Product Updated",
            "data": product
        });
    }
    catch (error) {
        res.status(400).json({
            "message": "Bad Request",
            // @ts-ignore
            "error": error.meta.cause
        })
    }
}); // 'U' Update product with id `id`
router.delete("/product/:id",async (req: Request, res: Response) => {
    try {
        const product = await prisma.product.delete({
            where: {
                id_userId: {
                    id: req.params.id,
                    // @ts-ignore
                    userId: req.user.id
                }
            }
        });
        res.status(200).json({
            "message": "Update Deleted",
            "data": product
        });
    } catch (error) {
        res.status(400).json({
            "message": "Bad Request",
            // @ts-ignore
            "error": error.meta.cause
        });
    }
}); // 'D' Delete product with id `id`

/**
 * Update
 */
router.post("/update", body('productId').isString(), body('title').isString(), body('body').isString(), body('productId').isString(), async (req: Request, res: Response) => {

    const product = await prisma.product.findUnique({
        where: {
            id: req.body.productId,
        }
    });

    if (!product){
        res.status(404).json({
            "error": "Product Not Found"
        })
        return;
    }

    const update = await prisma.update.create({
        data: {
            updatedAt: new Date(),
            ...req.body
        }
    });
    res.status(200).json({
        "message": "Update Created",
        "data": update
    });
}); // `C` Create a new update
router.get("/update", async (req: Request, res: Response) => {

    const products = await prisma.product.findMany({
        where: {
            // @ts-ignore
            userId: req.user.id
        },
        select: {
            updates: true
        }
    });

    const updates = products.reduce((allUpdates: Update[], product) => {
        return [...allUpdates, ...product.updates];
    }, []);

    res.status(200).json({
        "data": updates
    });

    // const updates = await prisma.update.find
});  // 'R` Get all update
router.get("/update/:id", async (req: Request, res: Response) => {
    const update = await prisma.update.findUnique({
        where: {
            id: req.params.id,
        }
    });
    res.status(200).json({
        "data": update,
    });
}); // `R` Get  update with id `id`

router.put("/update/:id",
    body('title').optional().isString(),
    body('body').optional().isString(),
    body('status').isIn(['IN_PROGRESS', 'SHIPPED', 'DEPRECATED']).optional(),
    body('version').optional().isString(),
    body('asset').optional().isString(),
    async (req: Request, res: Response) => {
        // product is owned by user && it has an update with id = req.params.id
        const products = await prisma.product.findMany({
            where: {
                // @ts-ignore
                userId: req.user.id
            },
            select: {
                updates: true
            }
        });

        const updates = products.reduce((allUpdates: Update[], product) => {
            return [...allUpdates, ...product.updates];
        }, []);

        const match = updates.find(update => {
            return update.id === req.params.id;
        });

        if (!match){
            return res.status(404).json({
                error: "Not Found"
            });
        }

        const updatedUpdate = await prisma.update.update({
            where: {
                id: req.params.id
            },
            data: req.body
        });

        res.status(200).json({
            "data": updatedUpdate
        });


}); // 'U' Update  update with id `id`
router.delete("/update/:id", async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
        where: {
            // @ts-ignore
            userId: req.user.id
        },
        select: {
            updates: true
        }
    });

    const updates = products.reduce((allUpdates: Update[], product) => {
        return [...allUpdates, ...product.updates];
    }, []);

    const match = updates.find(update => {
        return update.id === req.params.id;
    });

    if (!match){
        return res.status(404).json({
            error: "Not Found"
        });
    }

    const deletedUpdate = await prisma.update.delete({
        where: {
            id: req.params.id
        }
    });

    res.status(200).json({
        data: deletedUpdate
    });

}); // 'D' Delete  update with id `id`

/**
 * Update Point
 */
router.post("/updatepoint", body('name').isString(), body('description').isString(), () => {}); // `C` Create a new updatepoint
router.get("/updatepoint", () => {});  // 'R` Get all updatepoint
router.get("/updatepoint/:id", () => {}); // `R` Get  updatepoint with id `id`
router.put("/updatepoint/:id", body('name').optional().isString(), body('description').optional, () => {}); // 'U' Update  updatepoint with id `id`
router.delete("/updatepoint/:id", () => {}); // 'D' Delete  updatepoint with id `id`

export default router;