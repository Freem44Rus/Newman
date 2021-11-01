var path = require('path'),
async = require('async'),
fs = require('fs'),
newman = require('newman'),
moment = require('moment')
exportPoliciestoExcel = require('./xlsxService')
const PolicyExport = []


parametersForTestRun = {
  collection: path.join(__dirname, '5000.postman_collection.json'),
  environment: path.join(__dirname, 'ENV.json'),
  iterationCount: 1, // Число итераций
  reporters: 'cli',
};

parallelCollectionRun = function (done) {
  newman.run(parametersForTestRun, done).on('request', (error, data) => {
    if (error) {
      console.log(error);
    }
    if (data.item.name === 'Issue') {

      const response = JSON.parse(data.response.stream)

      if (response.BusinessData.SubmissionServiceResponse != null) {
        var Series = response.BusinessData.SubmissionServiceResponse.Series
        var Number = response.BusinessData.SubmissionServiceResponse.Number
        var Time = moment().format('DD-MM-YYYY : h:mm:ss').toString()
      
        var DataMain = 
        {
            series : Series,
            number : Number,
            time : Time
        }
        PolicyExport.push(DataMain)
    }

  const workSheetColumnName = 
      [
        'Series',
        'Number',
        'Time'
      ]
  const workSheetName = 'Policies'
  const filepath = './PoliciesForLoad.xlsx'
  exportPoliciestoExcel(PolicyExport,workSheetColumnName,workSheetName,filepath);
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
    });
});