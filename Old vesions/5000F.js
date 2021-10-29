var path = require('path'),
async = require('async'),
fs = require('fs'),
newman = require('newman'),
moment = require('moment')

fs.unlink("results.json", function (err) {
  console.log('results File deleted!');
});
fs.unlink("resultsEdited.json", function (err) {
  console.log('resultsEdited File deleted!');
});

parametersForTestRun = {
  collection: path.join(__dirname, '5000.postman_collection.json'),
  environment: path.join(__dirname, 'ENV.json'),
  iterationCount: 2, // Число итераций
  reporters: 'cli',
};

parallelCollectionRun = function (done) {
  newman.run(parametersForTestRun, done).on('request', (error, data) => {
    if (error) {
     
      console.log(error);
    }
    if (data.item.name === 'Отправка расчета на оформление') {

      const response = JSON.parse(data.response.stream)

      if (response.BusinessData.SubmissionServiceResponse != null) {
        var Series = response.BusinessData.SubmissionServiceResponse.Series
        var Number = response.BusinessData.SubmissionServiceResponse.Number
      
        var jsonformattotest = [{
          "Series": Series,
          "Number": Number,
          "Time": moment().add(3, 'Hours')
      }]

       let filesave = JSON.stringify(jsonformattotest)

        var options = { flag: 'a' };
        
        fs.writeFileSync("results.json", filesave, options, function (error) {
          if (error) {
            console.error(error)
          }
        })
      }
    }
  })
}

const runs = Array(2).fill(parallelCollectionRun)  // Array(Число запусков параллельно)

async.parallel(runs,
  function (err, results) {
    err && console.error(err);

    results.forEach(function (result) {
      var failures = result.run.failures;
      console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
        `${result.collection.name} run successfully.`);

        fs.readFile("results.json", 'utf8', function (err,data) {
          if (err) {
            return console.log("It is open file error  !!!  " + err);
          }
          var result = data.replace(/]\[/g, ',');
        
          fs.writeFile("resultsEdited.json", result, 'utf8', function (err) {
             if (err) return console.log("It is write file error  !!!  " + err);
          });
        });
    });
});
