var path = require('path'),
async = require('async'),
fs = require('fs'),
newman = require('newman'),
moment = require('moment')
exportPoliciestoExcel = require('./xlsxService')
const PolicyExport = []

fs.unlink("results.json", function (err) {
  console.log('results File deleted!');
});
fs.unlink("resultsEdited.json", function (err) {
  console.log('resultsEdited File deleted!');
});

parametersForTestRun = {
  collection: path.join(__dirname, '5000.postman_collection.json'),
  environment: path.join(__dirname, 'ENV.json'),
  iterationCount: 10, // Число итераций
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
  const filepath = 'C:\\Users\\ikalinin\\Desktop\\5000\\PoliciesForLoad.xlsx'
  exportPoliciestoExcel(PolicyExport,workSheetColumnName,workSheetName,filepath);
    }
  })
}


const runs = Array(30).fill(parallelCollectionRun)  // Array(Число запусков параллельно)

async.parallel(runs,
  function (err, results) {
    err && console.error(err);

    results.forEach(function (result) {
      var failures = result.run.failures;
      console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
        `${result.collection.name} run successfully.`);
    });
});