const userSyncService = require('../services/userSyncService');

const sync = async (req, res, next) => {
    try {
        const resultado = await userSyncService.syncPendingJobsForUser(req.user.id);
        res.status(200).json({ status: 'ok', ...resultado });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sync,
};
