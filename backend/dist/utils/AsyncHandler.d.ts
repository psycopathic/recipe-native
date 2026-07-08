import { Request, Response, NextFunction } from "express";
declare const asyncHandler: (requestHandler: Function) => (req: Request, res: Response, next: NextFunction) => void;
export default asyncHandler;
//# sourceMappingURL=AsyncHandler.d.ts.map