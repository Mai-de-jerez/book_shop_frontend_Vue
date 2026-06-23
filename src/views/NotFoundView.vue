<template>
  <main class="pagina-404">
    <div class="contenido-404">
      <h1 class="numero-404">404</h1>
      <h2>Página no encontrada</h2>
      <p>La página que buscas no existe o ha sido movida.</p>
      <a href="/" class="btn-volver">Volver al inicio</a>
    </div>
  </main>
</template>

<style scoped>
.pagina-404 {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px - 100px);
  text-align: center;
}

.contenido-404 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.numero-404 {
  font-size: 8rem;
  font-weight: bold;
  color: #333;
  line-height: 1;
  letter-spacing: 10px;
  border-bottom: 4px solid #3ca243;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

h2 {
  font-size: 1.8rem;
  color: #333;
}

p {
  color: #888;
  font-size: 1.1rem;
}
</style>
