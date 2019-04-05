import express = require('express');
import { Response, Request } from '../../types';
import { Drinks, Ingredients } from '../../drinks';
const router = express.Router();

router.get("/drinks", (req: Request<any>, res: Response<Drinks>) => {
    res.send(req.drinks);
})

router.get("/ingredients", (req: Request<any>, res: Response<Ingredients>) => {
    res.send(req.ingredients)
})

export default router;