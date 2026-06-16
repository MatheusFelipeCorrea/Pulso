const { buildTripBrazilDestinations } = require('./tripDestinationsCatalog');

/** @deprecated use tripDestinationsCatalog / tripDestinations.brazil data */
const TRIP_BRAZIL_DESTINATIONS = buildTripBrazilDestinations();

module.exports = { TRIP_BRAZIL_DESTINATIONS };
