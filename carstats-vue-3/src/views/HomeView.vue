<script lang="ts" setup>
</script>

<template>
  <!-- <%- include('components/header.ejs', { _pageTitle_: 'Home' , _pageIdentifier_: 'page-home' }) %> -->

  <nav class="nav">
    <div class="container">
      <a class="logo" href="/">
        <img :src="require('@/assets/images/icon-512x512.png')" alt="">
        Carstats
      </a>
      <a class="btn" href="/auth/sign-in">Sign in</a>
    </div>
  </nav>

  <section class="hero">
    <div class="container">
      <span>Carstats</span>
      <h1>The new driving experience!</h1>
      <p>We offer our users the possibility to travel with their friends while enjoying the ride.</p>
      <a class="btn hero-btn">Install the app</a>
    </div>
  </section>

  <div class="add-app">
    <p>Tap <img :src="require('@/assets/images/icon-share.png')" /> and then add to homescreen to install the app</p>
  </div>

  <div class="home-img">
    <div class="container">
      <img :src="require('@/assets/images/home.png')" />
    </div>
  </div>

  <!-- <%- include('components/footer.ejs', { _endpoints_: [
    ['home', 'standaloneDetection' ],
    ['home', 'pwaInstaller' ]
  ]
}) %> -->

</template>

<style lang="scss" scoped>

</style>
