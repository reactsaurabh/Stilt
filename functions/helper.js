const formattedNoticePeriod = days => {
  const a = days.split(' ');
  return `${a[0]} ( ${NumInWords(a[0])}) days`;
};

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const dateFormatter = dateToBeFormat => {
  const currentDateISO = new Date(dateToBeFormat ? dateToBeFormat : new Date());
  const year = currentDateISO.getFullYear();
  const monthNumeric = currentDateISO.getMonth();
  const date = currentDateISO.getDate();
  const monthAlpha = months[monthNumeric];
  // eg: 09 oct 2019 formate
  const fullDate = `${date} ${months[monthNumeric]} ${year}`;
  const fullDate_alpha = `${dateOrdinal(date)} day of ${
    MONTHS[monthNumeric]
  } ${year}`;
  const fullDate_alpha_two = `${MONTHS[monthNumeric]} ${date}, ${year}`;
  const dateObject = {
    date,
    fullDate,
    monthNumeric,
    monthAlpha,
    months,
    year,
    fullDate_alpha,
    fullDate_alpha_two,
  };

  return dateObject;
};

// export const capitalize = str => str.slice(0, 1).toUpperCase() + str.slice(1);

function dateOrdinal(d) {
  return (
    d +
    (31 == d || 21 == d || 1 == d
      ? 'st'
      : 22 == d || 2 == d
      ? 'nd'
      : 23 == d || 3 == d
      ? 'rd'
      : 'th')
  );
}

const address = ({addLine1, addLine2, addLine3, city, state, pin}) =>
  `${addLine1}, ${addLine2}, ${addLine3 ? addLine3 : ''}, ${city}, ${state}`;
var a = [
  '',
  'one ',
  'two ',
  'three ',
  'four ',
  'five ',
  'six ',
  'seven ',
  'eight ',
  'nine ',
  'ten ',
  'eleven ',
  'twelve ',
  'thirteen ',
  'fourteen ',
  'fifteen ',
  'sixteen ',
  'seventeen ',
  'eighteen ',
  'nineteen ',
];
var b = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];

const NumInWords = num => {
  if ((num = num.toString()).length > 9) return 'overflow';
  let n = ('000000000' + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  var str = '';
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore '
      : '';
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh '
      : '';
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand '
      : '';
  str +=
    n[4] != 0
      ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred '
      : '';
  str +=
    n[5] != 0
      ? (str != '' ? 'and ' : '') +
        (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) +
        ''
      : '';
  return str;
};

module.exports = {
  NumInWords,
  formattedNoticePeriod,
  address,
  dateFormatter,
};
