const socket = io();

window.eliminarProducto = function(id) {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    socket.emit('eliminarProducto', id);
  }
};


document.getElementById('addProductForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const producto = {
    title: document.getElementById('title').value.trim(),
    price: parseFloat(document.getElementById('price').value),
    description: document.getElementById('description').value.trim() || "Sin descripción",
    stock: parseInt(document.getElementById('stock').value) || 10,
    category: document.getElementById('category').value.trim() || "general",
    code: document.getElementById('code').value.trim() || undefined
  };


  if (!producto.title || isNaN(producto.price)) {
    return alert('Nombre y precio son campos obligatorios');
  }

  socket.emit('agregarProducto', producto);
  e.target.reset();
});


socket.on('productosActualizados', (products) => {
  const list = document.getElementById('productsList');
  list.innerHTML = products.map(p => `
    <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${p.id}">
      <div>
        <h6 class="mb-1">${p.title}</h6>
        <p class="mb-1 text-muted">${p.description || "Sin descripción"}</p>
        <div class="d-flex gap-3">
          <small><strong>Precio:</strong> $${p.price.toFixed(2)}</small>
          <small><strong>Stock:</strong> ${p.stock}</small>
          <small><strong>Categoría:</strong> ${p.category}</small>
          ${p.code ? `<small><strong>Código:</strong> ${p.code}</small>` : ''}
        </div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${p.id}')">
        Eliminar
      </button>
    </li>
  `).join('');
});


socket.on('error', (error) => {
  alert(`Error: ${error}`);
});