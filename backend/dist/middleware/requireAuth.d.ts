import { Response, Request, NextFunction } from "express";
declare const requireAuth: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default requireAuth;
//# sourceMappingURL=requireAuth.d.ts.map