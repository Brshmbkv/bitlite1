<template>
  <div class="payment-page">
    <h1 class="payment-page__title">Айдос, здравствуйте еще раз! 👋😃</h1>
    <div class="payment-page__greeter">
      <p>Мы рады что вы хотите примкнуть в ряды программистов! Это очень круто! Мы забронировали вам место в нашей группе. Чтобы  подтвердить свое участие, нужно внести оплату за обучение:)</p>
      <v-chip
        :color="'rgba(11, 195, 184, 0.12)'"
        :text-color="'#0BC3B8'"
        label
      >
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.70182" cy="8.49968" r="6.66667" stroke="#0BC3B8" stroke-width="1.5"/><path d="M8.70312 4.83301V8.49967L10.7031 10.4997" stroke="#0BC3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="ml-3">Осталось времени: 20:35</span>
      </v-chip>
    </div>
    <div class="payment-page__course-info">
      <div class="payment-page__course-info__main-info">
        <div>
          <span class="main-info__pretitle">Выбранный вами курс:</span>
          <span class="main-info__title">Java Standart Edition</span>
          <span class="main-info__subtitle">Основы программирования на Java</span>
        </div>
        <div>
          <span class="main-info__section">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.87928 11.5353C5.17218 13.6566 2.34375 13.6566 2.34375 13.6566C2.34375 13.6566 2.34375 10.8282 4.46507 10.1211" stroke="#5A6275" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12.2429 6.58625L8.0003 10.8289L5.17188 8.00046L9.41451 3.75782C11.021 2.15131 12.6275 2.16698 13.3127 2.2692C13.4182 2.28493 13.5158 2.33412 13.5912 2.40954C13.6666 2.48496 13.7158 2.58261 13.7316 2.68809C13.8338 3.37323 13.8494 4.97974 12.2429 6.58625Z" stroke="#5A6275" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M11.5355 7.29297V11.3285C11.5355 11.3942 11.5226 11.4592 11.4975 11.5198C11.4723 11.5805 11.4355 11.6356 11.3891 11.6821L9.36773 13.7034C9.30373 13.7674 9.22357 13.8128 9.13579 13.8348C9.04801 13.8569 8.9559 13.8546 8.86928 13.8284C8.78267 13.8022 8.70479 13.7529 8.64396 13.6859C8.58313 13.6189 8.54163 13.5367 8.52388 13.4479L8 10.8285" stroke="#5A6275" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.70533 4.46484H4.6698C4.60414 4.46484 4.53912 4.47778 4.47846 4.5029C4.41779 4.52803 4.36267 4.56486 4.31624 4.61129L2.29488 6.63265C2.23089 6.69664 2.18547 6.77681 2.16345 6.86459C2.14144 6.95237 2.14367 7.04448 2.16989 7.1311C2.19612 7.21771 2.24536 7.29559 2.31237 7.35642C2.37938 7.41724 2.46164 7.45875 2.55038 7.47649L5.1698 8.00038" stroke="#5A6275" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            7 апреля 2021
          </span>
          <span class="main-info__section">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7.70182" cy="7.99968" r="6.66667" stroke="#5A6275" stroke-width="1.5"/>
              <path d="M7.70312 4.33301V7.99967L9.70313 9.99968" stroke="#5A6275" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Пн-Ср-Пт 19:00-21:00
          </span>
          <div class="main-info__teacher">
            <v-img 
              height="36"
              width="36"
              max-height="36"
              max-width="36"
              aspect-ratio="1"
              src="nosrc:("
              :lazy-src="require('@/assets/user_placeholder_sm.png')"
              class="mr-4 rounded-circle"
            >
            </v-img>
            <div>
              <span class="main-info__teacher__name">Асылхан Алданазар</span>
              <span class="main-info__teacher__job-title">Тренер</span>
            </div>
          </div>
        </div>
      </div>
      <div class="payment-page__course-info__description">
        <div class="payment-page__course-info__description-text">
          <h4 class="mb-2">Подробное описание курса</h4>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and 
          <br>scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged wwssigin</p>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and 
          <br>scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged wwssigin</p>
        </div>
      </div>
    </div>
    <div class="payment-page__payment-links">
      <div class="payment-page__payment-links__label-container">
        <div class="payment-page__payment-links__label">
          <span>Осталось оплатить курс</span>
        </div>
      </div>
      <div class="payment-page__payment-links__proposal">
        <span class="proposal__price">40 000 ₸ в месяц</span>
        <span class="proposal__description">внести оплату за первый месяц</span>
        <a class="proposal__link" href="#">Оплатить</a>
      </div>
      <div class="payment-page__payment-links__proposal payment-page__payment-links__proposal--blue">
        <span class="proposal__price">35 000 ₸ в месяц</span>
        <span class="proposal__description">оплатить за 2 месяца и получить 10% скидку</span>
        <a class="proposal__link" href="#">Оплатить курс</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
$medium: 900px;
.payment-page{
  padding: 30px;
  .payment-page__title{
    text-align: center;
    font-weight: bold;
    font-size: 30px;
    line-height: 150%;
    letter-spacing: 0.02em;   
    margin-bottom: 12px;
  }
  .payment-page__greeter{
    text-align: center;
    max-width: 550px;
    width: 100%;
    margin: 0 auto;
    p {
      font-size: 16px;
      line-height: 150%;
      letter-spacing: 0.02em;
      margin-bottom: 12px;
    }
  }
  .payment-page__course-info{
    margin: 1rem auto 2rem;
    display: flex;
    max-width: 789px;
    border: 2px solid rgba(23, 23, 41, 0.08);
    border-radius: 4px;
    @media screen and (max-width: $medium) {
      flex-wrap: wrap;
    }
    .payment-page__course-info__main-info{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1 0 50%;
      padding: 32px;
      border-right: 2px solid rgba(23, 23, 41, 0.08);
      @media screen and (max-width: $medium) {
        border-right: none;
        flex: 1 0 100%;
      }
      .main-info__pretitle{
        display: block;
        margin-bottom: 4px;
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        line-height: 150%;
        letter-spacing: 0.02em;
        color: #0BC3B8;
      }
      .main-info__title{
        display: block;
        margin-bottom: 4px;
        font-weight: bold;
        font-size: 24px;
        line-height: 150%;
        letter-spacing: 0.02em;
        color: #171729;
      }
      .main-info__subtitle{
        display: block;
        margin-bottom: 4px;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #171729;
      }
      .main-info__section{
        display: block;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.02em;
        color: #5A6275;
        display: flex; 
        align-items: center;
        margin-bottom: 20px;
        svg{
          margin-right: 12px;
        }
      }
      .main-info__teacher{
        display: flex;
        align-items: center;
        .main-info__teacher__name{
          display: block;
          font-size: 14px;
          line-height: 20px;
        }
        .main-info__teacher__job-title{
          display: block;
          font-size: 12px;
          line-height: 20px;
        }
      }
    }

    .payment-page__course-info__description{
      flex: 1 0 50%;
      padding: 15px 10px;
      background: #F8F8F8;
      max-height: 302px;
      @media screen and (max-width: $medium) {
        flex: 1 0 100%;
      }
      .payment-page__course-info__description-text{
        overflow-y: scroll;
        padding: 0.5rem 1.5rem;
        height: 100%;
        &::-webkit-scrollbar {
          width: 5px;
        }
        &::-webkit-scrollbar-track {
          background: rgba(23, 23, 41, 0.08);
          border-radius: 100px;
        }

        /* Handle */
        &::-webkit-scrollbar-thumb {
          background: #9FA4B1;
          border-radius: 100px;
        }

        /* Handle on hover */
        &::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      }
    }
    }
  .payment-page__payment-links{
    margin: 0 auto;
    position: relative;
    display: flex;
    max-width: 789px;
    min-height: 236px;
    border: 1px solid rgba(23, 23, 41, 0.08);
    box-sizing: border-box;
    border-radius: 4px;
    @media screen and (max-width: $medium) {
      flex-wrap: wrap;
    }
    .payment-page__payment-links__label-container{
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: 1;
    }
    .payment-page__payment-links__label{
      background: #F8F8F8;
      border-radius: 0px 0px 10px 10px;
      font-weight: bold;
      font-size: 14px;
      line-height: 170%;
      letter-spacing: 0.02em;
      color: #171729;
      padding: 0.5rem 0.625rem; 
    }
    .payment-page__payment-links__proposal{
      flex: 1 1 50%;
      text-align: center;
      color: #000;
      padding: 4rem 3rem 2rem;
      @media screen and (max-width: $medium) {
        flex: 1 0 100%;
      }
      .proposal__price{
        display: block;
        font-weight: 900;
        font-size: 20px;
        line-height: 170%;
      }
      .proposal__description{
        display: block;
        font-weight: 500;
        font-size: 14px;
        line-height: 140%;
      }
      .proposal__link{
        display: inline-block;
        margin-top: 1.5rem;
        padding: 0.875rem 1.5rem;
        border-radius: 4px;
        color: #FFF;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        background: #0BC4B8;
      }
    }
    .payment-page__payment-links__proposal--blue{
      color: #FFF;
      background: linear-gradient(180deg, #2E39BD 4.8%, #4644C8 48.81%, #7155DB 100%);
      border-radius: 0px 3px 3px 0px;
      @media screen and (max-width: $medium) {
        color: #000;
        background: none;
        border-top: 1px solid rgba(23, 23, 41, 0.08);
        padding-top: 2.5rem;
        .proposal__description{
          color: #F16635;
        }
      }
    }
  }
}
</style>