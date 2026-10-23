const dashboardService = require('../services/dashboardService');

const obterDashboard = async (req, res, next) => {
    try {
        const data = await dashboardService.obterDashboard(req.user.id, req.query);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obterDashboard,
};
