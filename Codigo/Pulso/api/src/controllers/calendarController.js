const calendarService = require('../services/calendarService');

const googleCalendarService = require('../services/googleCalendarService');
const googleCalendarSync = require('../services/googleCalendarSyncService');

const env = require('../config/env');



const obterMes = async (req, res, next) => {

    try {

        const dados = await calendarService.obterVisaoMes(req.user.id, req.query);

        res.status(200).json(dados);

    } catch (error) {

        next(error);

    }

};



const obterDia = async (req, res, next) => {

    try {

        const dados = await calendarService.obterDetalheDia(req.user.id, req.query);

        res.status(200).json(dados);

    } catch (error) {

        next(error);

    }

};



const obterStatusGoogle = async (req, res, next) => {

    try {

        const status = await googleCalendarService.obterStatus(req.user.id);

        res.status(200).json(status);

    } catch (error) {

        next(error);

    }

};



const obterUrlGoogle = async (req, res, next) => {

    try {

        const dados = await googleCalendarService.obterUrlConexao(req.user.id, req);

        res.status(200).json(dados);

    } catch (error) {

        next(error);

    }

};



const callbackGoogle = async (req, res, next) => {

    try {

        const { code, state: usuarioId } = req.query;

        const redirectUri = googleCalendarService.buildRedirectUri(req);

        await googleCalendarService.processarCallback(code, usuarioId, redirectUri);

        res.redirect(`${env.FRONTEND_URL}/calendar?google=connected`);

    } catch (error) {

        next(error);

    }

};



const desconectarGoogle = async (req, res, next) => {

    try {

        await googleCalendarService.desconectar(req.user.id);

        res.status(204).send();

    } catch (error) {

        next(error);

    }

};



const obterPendentesSyncGoogle = async (req, res, next) => {

    try {

        const pendentes = await googleCalendarSync.contarPendentesSync(req.user.id);

        res.status(200).json(pendentes);

    } catch (error) {

        next(error);

    }

};



const sincronizarPendentesGoogle = async (req, res, next) => {

    try {

        const resultado = await googleCalendarSync.sincronizarPendentes(

            req.user.id,

            req.body.escopo ?? 'futuros'

        );

        res.status(200).json(resultado);

    } catch (error) {

        next(error);

    }

};



module.exports = {

    obterMes,

    obterDia,

    obterStatusGoogle,

    obterUrlGoogle,

    callbackGoogle,

    desconectarGoogle,

    obterPendentesSyncGoogle,

    sincronizarPendentesGoogle,

};

