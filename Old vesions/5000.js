var path = require('path'),
  async = require('async'),
  newman = require('newman'),

parametersForTestRun = {
    collection: path.join(__dirname, '5000.postman_collection.json'),
    environment: path.join(__dirname, 'ENV.json'),
    iterationCount: 50,
    reporters: 'cli',
  };

parallelCollectionRun = function(done) {
  newman.run(parametersForTestRun, done);
};

const runs = Array(30).fill(parallelCollectionRun) 

async.parallel(runs,
  function(err, results) {
    err && console.error(err);

    results.forEach(function(result) {
      var failures = result.run.failures;
      console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
        `${result.collection.name} run successfully.`);
    });
  });