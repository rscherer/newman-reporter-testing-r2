var _ = require('lodash');

/**
 * Custom reporter that dumps a MUCH lighter JSON report out
 * Built using the original JSON reporter as a template
 *
 * @param {Object} newman - The collection run object, with event hooks for reporting run details.
 * @param {Object} options - A set of collection run options.
 * @param {String} options.export - The path to which the summary object must be written.
 * @returns {*}
 */

function createLightSummary(summary) {
  summary = _.pick(summary, ['collection', 'run', 'environment', 'skippedTests', 'totalSkipped']);

  var failures = [];
  summary.run.failures.forEach(function (failureReport) {
    failures.push({
      'source': {
        'name': failureReport.source.name,
        'request': {
          'method': failureReport.source.request.method
        }
      },
      'error': {
        'test': failureReport.error.test,
        'message': failureReport.error.message
      }
    });
  });

  var lightSummary = {}
  Object.assign(lightSummary, {
    'environment': summary.environment,
    'collection': {
      'info': {
        'name': summary.collection.name
      }
    },
    'run': {
      'stats': summary.run.stats,
      'failures': failures
    },
    'skippedTests': summary.skippedTests,
    'totalSkipped': summary.totalSkipped,
  });
  return lightSummary
}

module.exports = function (newman, options) {
  newman.on('beforeDone', function (err, o) {
    newman.exports.push({
      name: 'newman-reporter-testing-r',
      default: 'newman-run-report.json',
      path: options.jsonExport,
      content: JSON.stringify(createLightSummary(o.summary))
    });
  });
};
