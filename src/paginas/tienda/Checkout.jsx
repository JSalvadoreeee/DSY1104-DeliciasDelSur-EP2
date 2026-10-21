// src/paginas/tienda/Checkout.jsx
import { useState } from "react";
import { useCarrito } from "../../contexto/CarritoContexto";
import { useNavigate } from "react-router-dom";

// Validar correo según las reglas del profesor (mínimo 4 caracteres antes del @, formato correcto y dominio/extensión válidos)
function esCorreoValido(correo) {
  const regex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
  if (!regex.test(correo)) return false;

  const partes = correo.split("@");
  const usuario = partes[0];
  const dominio = partes[1];

  if (usuario.length < 4) return false;

  const partesDominio = dominio.split(".");
  if (partesDominio.some((p) => p.length < 2)) return false;

  return true;
}

// Validar nombre completo (solo letras, exige al menos nombre y apellido con mínimo 2 letras cada uno)
function esNombreCompletoValido(nombre) {
  const regexSoloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!regexSoloLetras.test(nombre)) return false;

  const palabras = nombre.trim().split(/\s+/);
  if (palabras.length < 2) return false;

  return palabras.every((palabra) => palabra.length >= 2);
}

export default function Checkout() {
  const { total, limpiarCarrito } = useCarrito();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: ""
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errores[name]) {
      setErrores({ ...errores, [name]: "" });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar Nombre
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else if (!esNombreCompletoValido(formData.nombre.trim())) {
      nuevosErrores.nombre = "Ingresa nombre y apellido válidos (ej: Gonzalo Cuevas).";
    }

    // Validar Correo
    if (!formData.email.trim()) {
      nuevosErrores.email = "El correo es obligatorio.";
    } else if (!esCorreoValido(formData.email.trim())) {
      nuevosErrores.email = "Ingresa un correo válido (mínimo 4 caracteres antes del @ y dominio correcto).";
    }

    // Validar Teléfono
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    } else if (formData.telefono.trim().length < 8 || isNaN(formData.telefono.trim())) {
      nuevosErrores.telefono = "Ingresa un teléfono válido de al menos 8 dígitos.";
    }

    // Validar Dirección
    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = "La dirección de envío es obligatoria.";
    } else if (formData.direccion.trim().length < 5) {
      nuevosErrores.direccion = "Ingresa una dirección de envío más detallada.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handlePagoExitoso = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      limpiarCarrito();
      navigate("/pago-exitoso");
    }
  };

  const handlePagoError = () => {
    navigate("/pago-error");
  };

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4 text-center text-danger fw-bold">Finalizar Compra</h2>
      <div className="card p-4 shadow-sm border-0">
        <h5 className="mb-3">
          Monto Total: <span className="text-danger fw-bold">${total.toLocaleString("es-CL")} CLP</span>
        </h5>

        <form onSubmit={handlePagoExitoso} noValidate>
          {/* Nombre */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre Completo</label>
            <input
              type="text"
              name="nombre"
              className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Gonzalo Cuevas"
            />
            {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errores.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej: g.cuevas@alumnos.duoc.cl"
            />
            {errores.email && <div className="invalid-feedback">{errores.email}</div>}
          </div>

          {/* Teléfono */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Teléfono de Contacto</label>
            <input
              type="tel"
              name="telefono"
              className={`form-control ${errores.telefono ? "is-invalid" : ""}`}
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 987654321"
            />
            {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
          </div>

          {/* Dirección */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Dirección de Envío</label>
            <input
              type="text"
              name="direccion"
              className={`form-control ${errores.direccion ? "is-invalid" : ""}`}
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Ej: Av. España 1234"
            />
            {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
          </div>

          <div className="d-grid gap-2 mt-4">
            <button type="submit" className="btn btn-success btn-lg fw-semibold">
              Simular Pago Exitoso
            </button>
            <button
              type="button"
              onClick={handlePagoError}
              className="btn btn-outline-danger"
            >
              Simular Error de Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}