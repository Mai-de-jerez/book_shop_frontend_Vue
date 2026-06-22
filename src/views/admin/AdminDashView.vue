<template>
  <main>
    <h2 class="titulo-seccion-admin">PANEL DE ADMIN</h2>
    <section class="admin-panel">
      <ul class="admin-list">
        <li>
          <router-link to="/admin/libros" class="btn-admin">
            <span class="icon">&#x1F4DA;</span> Gestionar Libros
          </router-link>
        </li>
        <li>
          <router-link to="#" class="btn-admin">
            <span class="icon">&#x1F465;</span> Gestionar Usuarios
          </router-link>
        </li>
        <li>
          <router-link to="#" class="btn-admin">
            <span class="icon">&#x1F6D2;</span> Gestionar Pedidos
          </router-link>
        </li>
        <li>
          <router-link to="/admin/categorias" class="btn-admin">
            <span class="icon">&#x1F3F7;</span> Gestionar Categorías
          </router-link>
        </li>
      </ul>
    </section>
  </main>
</template>
<script setup lang="ts"></script>
<style scoped>
.admin-panel {
  max-width: 600px;
  margin: 40px auto;
  background-color: #f4f4f4;
  padding: 30px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.admin-list {
  list-style: none;
  padding: 0;
}

.admin-list li {
  margin-bottom: 20px;
}

.btn-admin {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: white;
  color: #333;
  text-decoration: none;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-weight: bold;
  transition: 0.3s;
}

.btn-admin:hover {
  background-color: #eee;
  border-color: #333;
  transform: translateX(10px);
}

.icon {
  margin-right: 15px;
  font-size: 20px;
}
</style>
