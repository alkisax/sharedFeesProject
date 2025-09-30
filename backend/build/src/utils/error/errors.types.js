"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingError = exports.DatabaseError = exports.ValidationError = exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}
exports.ValidationError = ValidationError;
class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseError';
        this.statusCode = 500;
    }
}
exports.DatabaseError = DatabaseError;
// not still used
class EmbeddingError extends Error {
    constructor(message) {
        super(message);
        this.status = 502; // Bad gateway
        this.name = 'EmbeddingError';
    }
}
exports.EmbeddingError = EmbeddingError;
//# sourceMappingURL=errors.types.js.map