import { CronDate } from "./date.js";

/**
 * @callback CatchCallbackFn
 * @param {unknown} e
 */

/**
 * @typedef {Object} CronOptions - Cron scheduler options
 * @property {string} [name] - Name of a job
 * @property {boolean} [paused] - Job is paused
 * @property {boolean} [kill] - Job is about to be killed or killed
 * @property {boolean | CatchCallbackFn} [catch] - Continue exection even if a unhandled error is thrown by triggered function
 * 										  - If set to a function, execute function on catching the error.
 * @property {boolean} [unref] - Abort job instantly if nothing else keeps the event loop running.
 * @property {number} [maxRuns] - Maximum nuber of executions
 * @property {number} [interval] - Minimum interval between executions, in seconds
 * @property {string | Date} [startAt] - When to start running
 * @property {string | Date} [stopAt] - When to stop running
 * @property {string} [timezone] - Time zone in Europe/Stockholm format
 * @property {boolean} [legacyMode] - Combine day-of-month and day-of-week using true = OR, false = AND. Default is OR.
 * @property {?} [context] - Used to pass any object to scheduled function
 */

/**
 * Internal function that validates options, and sets defaults
 * @private
 * 
 * @param {CronOptions} options 
 * @returns {CronOptions}
 */
function CronOptions(options) {
	
	// If no options are passed, create empty object
	if (options === void 0) {
		options = {};
	}
	
	// Don't duplicate the 'name' property
	delete options.name;

	// Keep options, or set defaults
	options.legacyMode = (options.legacyMode === void 0) ? true : options.legacyMode;
	options.paused = (options.paused === void 0) ? false : options.paused;
	options.maxRuns = (options.maxRuns === void 0) ? Infinity : options.maxRuns;
	options.catch = (options.catch === void 0) ? false : options.catch;
	options.interval = (options.interval === void 0) ? 0 : parseInt(options.interval, 10);
	options.unref = (options.unref === void 0) ? false : options.unref;
	options.kill = false;
	
	// startAt is set, validate it
	if( options.startAt ) {
		options.startAt = new CronDate(options.startAt, options.timezone);
	} 
	if( options.stopAt ) {
		options.stopAt = new CronDate(options.stopAt, options.timezone);
	}

	// Validate interval
	if (options.interval !== null) {
		if (isNaN(options.interval)) {
			throw new Error("CronOptions: Supplied value for interval is not a number");
		} else if (options.interval < 0) {
			throw new Error("CronOptions: Supplied value for interval can not be negative");
		}
	}

	// Unref should be true, false or undefined
	if (options.unref !== true && options.unref !== false) {
		throw new Error("CronOptions: Unref should be either true, false or undefined(false).");
	}

	return options;

}

export { CronOptions };