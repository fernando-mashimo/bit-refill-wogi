export class Parser {
    public static parseAPIGatewayBody<T>(body: string, isBase64Encoded: boolean): T {
        try {
            if (!isBase64Encoded) return JSON.parse(body);

            return JSON.parse(Buffer.from(body, "base64").toString());
        } catch (error) {
            console.error(`Cannot parse API Gateway body with value ${body}`, error);
            throw new Error("Invalid body shape provided");
        }
    }
}
