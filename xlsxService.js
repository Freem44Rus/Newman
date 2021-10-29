const xlsx = require('xlsx');
const path = require('path');


const exportExcel = (data, workSheetColumnName, workSheetName, filePath) => {
const workBook = xlsx.utils.book_new();
const workSheetData = [
    workSheetColumnName,
    ... data
];
const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
xlsx.writeFile(workBook, path.resolve(filePath));
}


const exportPoliciestoExcel = (policies, workSheetColumnName, workSheetName, filePath) => {
    const data = policies.map(policies => {
        return [policies.series, policies.number, policies.time]
    });
    exportExcel(data, workSheetColumnName, workSheetName, filePath);
}

module.exports = exportPoliciestoExcel;