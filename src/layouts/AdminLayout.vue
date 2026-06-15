<template>
  <div>
    <!-- Header -->
    <header>
      <div class="header-content">
        <h1 class="icono-admin" @click="irAlDashboard">Admin panel</h1>
      </div>
      <NavBar />
    </header>

    <main id="contenedor-principal">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function irAlDashboard() {
  router.push('/admin')
}
</script>

<style scoped>
header {
  background-color: #333;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
}

header h1 {
  color: white;
}

.icono-admin::before {
  content: '\1F464\FE0E';
  margin-right: 15px;
  font-size: 2rem;
  color: white;
}

@media (max-width: 480px) {
  header h1 {
    font-size: 26px;
  }

  .header-content {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
}
</style>
