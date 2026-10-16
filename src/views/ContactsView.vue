<script setup>
import { onMounted, ref } from 'vue'
import { fallback } from '../data/fallback.js'
import { loadContactsPage } from '../services/directus.js'
import { applySeo, conciseDescription } from '../seo.js'

const contacts = ref(fallback.contacts)
const loading = ref(true)
const formNotice = ref(false)

const phoneLink = (phone) => `tel:${phone.replace(/[^+\d]/g, '').replace(/^8/, '+7')}`

onMounted(async () => {
  contacts.value = await loadContactsPage()
  loading.value = false
  applySeo({
    title: 'Контакты школы самбо в Шали | Республиканская школа самбо',
    description: conciseDescription(
      contacts.value.page_description,
      'Телефоны администрации, электронная почта и режим работы ГБУ ДО «Республиканская школа самбо» в Шали.',
    ),
    path: '/contacts',
  })
})

function submitPreview() {
  formNotice.value = true
}
</script>

<template>
  <main id="main" :aria-busy="loading">
    <section class="inner-hero contacts-page-hero">
      <div class="container">
        <span class="eyebrow light"><i></i>СВЯЗАТЬСЯ СО ШКОЛОЙ</span>
        <h1>{{ contacts.page_title || 'Контакты' }}</h1>
        <p>{{ contacts.page_description }}</p>
      </div>
    </section>

    <section class="section contacts-page-section">
      <div class="container contacts-page-grid">
        <div class="contacts-directory">
          <span class="section-kicker">КОНТАКТНЫЕ ТЕЛЕФОНЫ</span>
          <h2>{{ contacts.directory_title || 'Администрация школы' }}</h2>

          <div class="phone-directory">
            <article v-for="person in contacts.phones || []" :key="person.id" class="phone-card">
              <span>{{ person.position }}</span>
              <h3>{{ person.name }}</h3>
              <a :href="phoneLink(person.phone)">{{ person.phone }} <b>↗</b></a>
            </article>
          </div>

          <div class="contact-facts">
            <article>
              <span>ЭЛЕКТРОННАЯ ПОЧТА</span>
              <a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a>
            </article>
            <article>
              <span>РЕЖИМ РАБОТЫ</span>
              <p>{{ contacts.working_hours }}</p>
            </article>
          </div>
        </div>

        <div class="feedback-panel">
          <span class="section-kicker light-kicker">ОБРАТНАЯ СВЯЗЬ</span>
          <h2>Напишите нам</h2>
          <p>Заполните форму, чтобы направить вопрос администрации школы.</p>

          <form class="feedback-page-form" @submit.prevent="submitPreview">
            <label><span>ФИО</span><input type="text" name="name" autocomplete="name" placeholder="Ваше имя" required /></label>
            <label><span>Электронная почта</span><input type="email" name="email" autocomplete="email" placeholder="name@example.ru" required /></label>
            <label><span>Телефон</span><input type="tel" name="phone" autocomplete="tel" placeholder="+7 (___) ___-__-__" /></label>
            <label><span>Тема обращения</span><select name="subject" required><option value="" disabled selected>Выберите тему</option><option>Обучение и зачисление</option><option>Спортивные мероприятия</option><option>Документы</option><option>Другое</option></select></label>
            <label class="feedback-message"><span>Сообщение</span><textarea name="message" rows="6" placeholder="Напишите ваш вопрос" required></textarea></label>
            <label class="feedback-consent"><input type="checkbox" required /><span>Я согласен на обработку персональных данных</span></label>
            <button type="submit">Отправить обращение <b>→</b></button>
            <p v-if="formNotice" class="form-preview-notice" role="status">Форма подготовлена. Отправку обращения подключим после настройки почты организации.</p>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>
