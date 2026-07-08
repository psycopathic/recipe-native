import { verifyAccessToken } from "../utils/token.js";
import { db } from "../lib/db.js";
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "You are not auth user! you cant enter the building" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = verifyAccessToken(token);
        const user = await db.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
        };
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
export default requireAuth;
//# sourceMappingURL=requireAuth.js.map