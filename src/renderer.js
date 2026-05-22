import Swal from 'sweetalert2';

const formAddProduct = document.getElementById("addProduct");
const formUpdateProduct = document.getElementById("updateProduct");

let table; 

// mostrar productos
$(document).ready(async function () {
    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().destroy();
    }
    const products = await window.api.getProduct();

    table = $('#dataTable').DataTable({
        data: products,
        columns: [
            { data: 'fechaVencProduct' },
            { data: 'nameProduct' },
            { data: 'cantProduct' },
            { data: 'estadoProduct' },
            {
                data: null,
                render: function (data) {
                    return `
                        <button class="btn btn-success btn-sm edit-btn"
                            data-id="${data.idProduct}"
                            data-name="${data.nameProduct}"
                            data-cant="${data.cantProduct}"
                            data-fecha="${data.fechaVencProduct}"
                            data-estado="${data.estadoProduct}">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-btn"
                            data-id="${data.idProduct}">
                            <i class="fa fa-trash"></i>
                        </button>
                    `;
                }
            }
        ]
    });
});

async function reloadTable() {
    const products = await window.api.getProduct();
    table.clear();
    table.rows.add(products);
    table.draw();
}

//agregar producto
formAddProduct.addEventListener("submit", async (e) => {
    e.preventDefault();

    const product = {
        fechaVencProduct: document.getElementById("dateExpiry").value,
        nameProduct: document.getElementById("nameProduct").value,
        cantProduct: document.getElementById("amountProduct").value
    };

    try {
        await window.api.addProduct(product.nameProduct,
              product.cantProduct,
              product.fechaVencProduct);

        await Swal.fire({
            icon: "success",
            title: "Producto agregado",
            text: "Se guardó correctamente",
            timer: 1000,
            showConfirmButton: false
        });

        $('#createProduct').modal('hide');
        formAddProduct.reset();
        await reloadTable(); 

    } catch (error) {
        console.error("ERROR REAL:", error);
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar" });
    }
});

// abre modal editar
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".edit-btn");
    if (btn) {
        document.getElementById("idProductUpdate").value = btn.dataset.id;
        document.getElementById("nameProductUpdate").value = btn.dataset.name;
        document.getElementById("amountProductUpdate").value = btn.dataset.cant;
        document.getElementById("dateExpiryUpdate").value = btn.dataset.fecha;
        document.getElementById("estadoProductUpdate").value = btn.dataset.estado;
        $('#dataProductUpdate').modal('show');
    }
});

// actualizar productos
formUpdateProduct.addEventListener("submit", async (e) => {
    e.preventDefault();

    const product = {
        idProduct: document.getElementById("idProductUpdate").value,
        nameProduct: document.getElementById("nameProductUpdate").value,
        cantProduct: document.getElementById("amountProductUpdate").value,
        fechaVencProduct: document.getElementById("dateExpiryUpdate").value, 
        estadoProduct: document.getElementById("estadoProductUpdate").value
    };

    try {
        await window.api.updateProduct(product.idProduct, product.nameProduct,
                                       product.cantProduct, product.fechaVencProduct, product.estadoProduct);

        await Swal.fire({
            icon: "success",
            title: "Producto actualizado",
            text: "Se actualizó correctamente",
            timer: 1000,
            showConfirmButton: false
        });

        $('#dataProductUpdate').modal('hide');
        await reloadTable(); 

    } catch (error) {
        console.error("ERROR REAL:", error);
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar" });
    }
});

//elimninar producto
document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".delete-btn");
    if (!btn) return;

    const idProduct = btn.dataset.id;

    const result = await Swal.fire({
        title: "¿Eliminar producto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return;

    try {
        await window.api.deleteProduct(idProduct);

        await Swal.fire({
            icon: "success",
            title: "Producto eliminado",
            timer: 1000,
            showConfirmButton: false
        });

        await reloadTable();

    } catch (error) {
        console.error("ERROR REAL:", error);
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar" });
    }
});