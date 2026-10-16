<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <a class="brand footer-brand" href="/#top"><span class="brand-mark" aria-hidden="true"><img src="/assets/minsport-chr-logo.png" alt="" /></span><span class="brand-copy"><strong>Республиканская школа самбо</strong><small>Развитие самбо в Чеченской Республике</small></span></a>
      <div><h3>Навигация</h3><a href="/#top">Главная</a><a href="/#information">О школе</a><RouterLink to="/documents">Документы</RouterLink><RouterLink to="/news">Новости</RouterLink></div>
      <div><h3>Информация</h3><RouterLink to="/gallery">Галерея</RouterLink><a href="/#information">Основные сведения</a><a href="/#leadership">Руководство</a><a href="/#contacts">Контакты</a></div>
      <a class="back-top" href="/#top" aria-label="Наверх">↑</a>
    </div>
    <div class="container footer-bottom"><span>© {{ new Date().getFullYear() }} ГБУ ДО «Республиканская школа самбо»</span><span>Официальный информационный сайт</span></div>
  </footer>
</template>
