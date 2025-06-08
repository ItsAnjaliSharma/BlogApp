const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            console.error("Error:", error);
            res.status(500).json({
                message: error instanceof Error ? error.message : "Internal Server Error"
            });
        }
    };
};
export default TryCatch;
