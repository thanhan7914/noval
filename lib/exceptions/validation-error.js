class ValidationError extends Error {
    constructor (...oths) {
        super(...oths);

        this.name = 'ValidationError';
    }
}

module.exports = ValidationError;
