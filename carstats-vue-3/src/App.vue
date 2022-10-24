<template>
  <nav>
    <router-link to="/">Home</router-link>
    <br>
    <router-link to="/app/navigation">Navigation</router-link> |
    <router-link to="/app/statistics">Statistics</router-link> |
    <router-link to="/app/driving">Driving</router-link> |
    <router-link to="/app/profile">Profile</router-link>
    <br>
    <router-link to="/auth/forgot-password">Forgot Password</router-link> |
    <router-link to="/auth/reset-password">Reset Password</router-link> |
    <router-link to="/auth/sign-in">Sign in</router-link> |
    <router-link to="/auth/sign-up">Sign up</router-link>
  </nav>
  <router-view />
</template>

<script lang="ts" setup>
</script>

<style lang="scss">
@import '@/styles/index.scss';
</style>
