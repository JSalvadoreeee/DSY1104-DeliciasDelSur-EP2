// Pruebas de renderizado, estado de los filtros y evento de agregar al carrito
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Productos from '../paginas/tienda/Productos'
import { CarritoProvider, useCarrito } from '../contexto/CarritoContexto'
import { obtenerProductos } from '../datos/productosdb'

function CantidadEnCarrito() {
  const { cantidadTotal } = useCarrito()
  return <span data-testid="cantidad">{cantidadTotal}</span>
}

function montar() {
  return render(
    <MemoryRouter>
      <CarritoProvider>
        <CantidadEnCarrito />
        <Productos />
      </CarritoProvider>
    </MemoryRouter>
  )
}

describe('Componente Productos', () => {
  afterEach(cleanup)

  it('renderiza una tarjeta por cada producto del catálogo', () => {
    montar()
    expect(screen.getAllByText('Ver Detalle').length).toBe(obtenerProductos().length)
  })

  it('filtra los productos al escribir en el buscador', () => {
    montar()
    fireEvent.change(screen.getByPlaceholderText(/Buscar por nombre/), {
      target: { value: 'Salsa' },
    })
    expect(screen.getAllByText('Ver Detalle').length).toBe(1)
    expect(screen.getByText(/Salsa de Tomate/)).not.toBeNull()
  })

  it('muestra un mensaje cuando la búsqueda no tiene resultados', () => {
    montar()
    fireEvent.change(screen.getByPlaceholderText(/Buscar por nombre/), {
      target: { value: 'zzzz' },
    })
    expect(screen.queryByText('Ver Detalle')).toBeNull()
    expect(screen.getByText(/No se encontraron productos/)).not.toBeNull()
  })

  it('suma al carrito al hacer clic en Añadir al Carrito', () => {
    montar()
    expect(screen.getByTestId('cantidad').textContent).toBe('0')
    fireEvent.click(screen.getAllByText('Añadir al Carrito')[0])
    expect(screen.getByTestId('cantidad').textContent).toBe('1')
  })
})