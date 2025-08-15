const socket = io();


document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    if (confirm('¿Eliminar este producto?')) {
      socket.emit('eliminarProducto', e.target.dataset.id);
    }
  }
});


document.getElementById('addProductForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

  const producto = {
    title: form.title.value.trim(),
    price: parseFloat(form.price.value),
    description: form.description.value.trim() || "Sin descripción",
    stock: parseInt(form.stock.value) || 10,
    category: form.category.value.trim() || "general",
    code: form.code.value.trim() || undefined
  };

  if (!producto.title || isNaN(producto.price)) {
    alert('Nombre y precio son obligatorios');
    btn.disabled = false;
    btn.textContent = 'Agregar Producto';
    return;
  }

  socket.emit('agregarProducto', producto);
  form.reset();
  btn.disabled = false;
  btn.textContent = 'Agregar Producto';
});


socket.on('productosActualizados', (products) => {
  const list = document.getElementById('productsList');
  list.innerHTML = products.map(p => `
    <div class="card mb-3">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <div>
            <h5>${p.title}</h5>
            <p class="text-muted">${p.description || "Sin descripción"}</p>
            <div class="d-flex gap-3">
              <span class="badge bg-primary">$${p.price.toFixed(2)}</span>
              <span class="badge bg-secondary">Stock: ${p.stock}</span>
            </div>
          </div>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${p._id}">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `).join('');
});


socket.on('error', (error) => {
  const alert = document.createElement('div');
  alert.className = 'alert alert-danger position-fixed top-0 end-0 m-3';
  alert.textContent = error;
  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 5000);
});