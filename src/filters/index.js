const longFormat = (d) => {
  if(!d) return '-'
  let date = new Date(Date.parse(d.replace(/ /g,"T")));
  if (!date) return ''
  let dayAndMonth = date.toLocaleDateString('ru-RU', {
    day: "2-digit",
    month: "short",
  });
  let weekday = date.toLocaleDateString('ru-RU', {
    weekday: 'short'
  });
  let dateText = date.toLocaleTimeString('ru-RU', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
  weekday = weekday[0].toUpperCase() + weekday.slice(1)
  dayAndMonth = dayAndMonth.replace('.', ',')
  return dayAndMonth + ' ' + weekday + " " + dateText;
}

const deadlineFormat = (d) => {
  if(!d) return ''
  let date = new Date(Date.parse(d.replace(/ /g,"T")));
  if (!date) return "";
  let dateText = date.toLocaleDateString('ru-RU', {
    day: "2-digit",
    month: "long",
  });
  let dateTime = date.toLocaleTimeString('ru-RU', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  })
  return dateText + ' ' + dateTime;
}

const shortFormat = (d) => {
  if (!d) return "";
  let date = new Date(Date.parse(d.replace(/ /g,"T")));
  if (!date) return "";
  let dateText = date.toLocaleDateString('ru-RU', {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return dateText.slice(0,-2);
}

const withoutYear = (d) => {
  if (!d) return "";
  let date = new Date(Date.parse(d.replace(/ /g,"T")));
  if (!date) return "";
  let dateText = date.toLocaleDateString('ru-RU', {
    day: "2-digit",
    month: "long",
  });
  return dateText;
}

const monthName = (date) => {
  const d = new Date(date.replace(/-/g, "/"));  
  const month = d.toLocaleString('default', { month: 'long' });
  return month;
}


export {
  longFormat,
  shortFormat,
  deadlineFormat,
  withoutYear,
  monthName
};
