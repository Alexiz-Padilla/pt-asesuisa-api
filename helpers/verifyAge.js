const moment = require('moment');

const verifyAgeAutomatic = (date) => {
    console.log('date: ', date);
  return moment().diff(moment(date, 'YYYY-MM-DD'), 'years');
}

const verifyAgeManual = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
      
    const yearsDifference = today.getFullYear() - birthDate.getFullYear();
      
    if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
        return yearsDifference - 1;
    }
      
    return yearsDifference;  
}

module.exports = { verifyAgeAutomatic, verifyAgeManual };
