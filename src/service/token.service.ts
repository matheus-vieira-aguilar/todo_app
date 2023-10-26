import jwt from "jsonwebtoken";

export default class TokenService {
  static generate(userId: string): string {
    return jwt.sign({ id: userId }, this.getSecret(), {
      expiresIn: "1d",
    });
  }

  static verify(token: string): boolean {
    try {
      jwt.verify(token, this.getSecret());
      return true;
    } catch {
      return false;
    }
  }

  static getSecret(): string {
    const secret = process.env.TOKEN_SECRET;

    if (!secret) {
      throw new Error("Please provide a secret to generate a token");
    }

    return secret
  }
}
