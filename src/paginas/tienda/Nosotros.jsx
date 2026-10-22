
function Nosotros() {
  return (
    <div className="mx-auto" style={{ maxWidth: '800px' }}>
      <h1 className="text-success mb-4">Nosotros</h1>
      <p className="lead">
        Delicias del Sur es una fábrica de conservas del sur de Chile que combina
        tradición artesanal con control de calidad en cada lote.
      </p>

      <div className="row g-3 mt-3">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Misión</h5>
              <p className="card-text">
                Entregar productos de calidad, seguros y con sabor casero, cuidando cada etapa del proceso.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Visión</h5>
              <p className="card-text">
                Ser una marca reconocida del sur de Chile por la confianza y la trazabilidad de sus productos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nosotros