<script lang="ts" setup>
</script>

<template>
  <nav id="debug-menu">
    <center>Debug Menu</center>
    <hr>
    <router-link to="/">Home</router-link>
    <br>
    <router-link to="/app/navigation">Navigation</router-link>
    <router-link to="/app/statistics">Statistics</router-link>
    <router-link to="/app/driving">Driving</router-link>
    <router-link to="/app/profile">Profile</router-link>
    <br>
    <router-link to="/auth/forgot-password">Forgot Password</router-link>
    <router-link to="/auth/reset-password">Reset Password</router-link>
    <router-link to="/auth/sign-in">Sign in</router-link>
    <router-link to="/auth/sign-up">Sign up</router-link>
  </nav>
</template>

<style lang="scss" scoped>
nav#debug-menu {
  position: fixed;
  top: 0;
  border: 1px solid #666;
  background: rgb(#666, 20%);
  padding: 1rem;
  backdrop-filter: blur(4px);
  border-radius: 10px;
  margin: 1rem .5rem;

  a {
    display: block;
    margin-top: .3rem;
  }
}
</style>
