export default class TencentAIError extends Error {
    code: number;
    constructor(message?: string, code?: number, ...args: any[]);
}
