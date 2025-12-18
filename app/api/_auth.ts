import jwt from "jsonwebtoken";

export function verifyAuth(req: Request) {
  const header = req.headers.get("authorization");
  if (!header) return null;

  const token = header.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch {
    return null;
  }
}
