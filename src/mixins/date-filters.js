// filters that get raw dates from backend
// and transform them to String
const dateFiltersMixin = {
  filters: {
    monthDay(date){
      let d = new Date(date.replace(/-/g, "/"))
      return d.getDate();
    },
    courseStartDate(d){
      if (!d) return "";
      let date = new Date(Date.parse(d.replace(/ /g,"T")));
      if (!date) return "";
      let dateText = date.toLocaleDateString('ru-RU', {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).split(' ');
      return `${dateText[1]} ${dateText[2]}`;
    },
    weekDayAndTime(date){
      let d = new Date(date.replace(/-/g, "/"));
      let weekDays = {
        0: "Вс",
        1: "Пн",
        2: "Вт",
        3: "Ср",
        4: "Чт",
        5: "Пт",
        6: "Сб",
      };
      let hours = ('0' + d.getHours()).slice(-2) // prepend 0 if length<2
      let minutes = ('0' + d.getMinutes()).slice(-2) // prepend 0 if length<2
      let output = "В " + weekDays[d.getDay()] + ", " + hours + ':' + minutes;
      return output;
    },
    daysUntil(date, now){
      if (!date) return ''
      const oneDay = 24 * 60 * 60 * 1000;
      const until = new Date(date.replace(/-/g, "/"))
      const today = new Date(now);
      // console.log(date)
      // console.log(until);
      // console.log(today)
      let days = Math.floor((until - today) / oneDay);
      // console.log(days)
      if ( days > 0) {
        if (days === 1) {
          return 'Завтра'
        } else if ((days > 1) && (days < 5)){
          return 'Через ' + days + ' дня';
        } else {
          return 'Через ' + days + ' дней'
        }
      } else if ( days === 0) {
        return 'Скоро'
      } else {
        return ''
      }
    },
    monthDaysUntil(date, now){
      if (!date) return ''
      // TODO FIX THIS
      const oneDay = 24 * 60 * 60 * 1000;
      const until = new Date(Date.parse(date.replace(/ /g, "T")));
      const today = new Date(now);
      // console.log('today: ', today, '\nuntil', until, '\ndate', date)
      if (!date) {
        return ''
      }
      let output = "Осталось: "
      let months = 0;
      months+= (until.getFullYear() - today.getFullYear()) * 12;
      months+= (until.getMonth() - today.getMonth());
      // console.log("mon:", months)
      if (until.getDate() < today.getDate()) {
        months-=1;
      }
      if (months > 1){
        output+=months+'месяца'
      }
      else {
        let days = Math.floor((until - today) / oneDay);
        // console.log('days', days)
        if (days <= 0) {
          return 'Завершен'
        }
        output+= days;
        output+= ' дней.'
      }
      return output;
    }
  },
}

export default dateFiltersMixin;
