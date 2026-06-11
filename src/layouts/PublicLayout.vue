<template>
  <div>
    <!-- Header -->
    <header>
      <div class="header-content">
        <div class="logo-container">
          <router-link to="/">
            <img src="/src/assets/logo.png" alt="Logo de Editorial Camaleón" />
          </router-link>
        </div>
        <h1>Llibrería La Iguana</h1>
      </div>
      <NavBar />
    </header>

    <main id="contenedor-principal">
      <RouterView />
    </main>

    <footer>
      <p>&copy; 2026 Grupo Atrium - María del Carmen Martín Rodríguez.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
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
}

header h1 {
  color: white;
}

.logo-container img {
  height: 80px;
}

footer {
  text-align: center;
  align-content: center;
  background-color: #333;
  color: white;
  height: 100px;
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

  footer {
    font-size: 14px;
    padding: 10px;
  }
}
</style>
