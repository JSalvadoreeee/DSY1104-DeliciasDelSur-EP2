// Pruebas del componente Carrito: renderizado condicional, total y eliminación de productos
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Carrito from '../paginas/tienda/Carrito'
import { CarritoProvider, useCarrito } from '../contexto/CarritoContexto'

const producto = { id: 1, codigo: 'PR001', nombre: 'Mermelada de Frutilla', precio: 2500 }

function Sembrador() {
  const { agregarAlCarrito } = useCarrito()
  return <button onClick={() => agregarAlCarrito(producto)}>sembrar</button>
}

function montar() {
  return render(
    <MemoryRouter>
      <CarritoProvider>
        <Sembrador />
        <Carrito />
      </CarritoProvider>
    </MemoryRouter>
  )
}

describe('Componente Carrito', () => {
  afterEach(cleanup)

  it('muestra el mensaje de carrito vacío cuando no hay productos', () => {
    montar()
    expect(screen.getByText('Tu carrito está vacío')).not.toBeNull()
  })

  it('muestra el producto y calcula el total al agregar dos veces', () => {
    montar()
    fireEvent.click(screen.getByText('sembrar'))
    fireEvent.click(screen.getByText('sembrar'))
    expect(screen.getByText(/Mermelada de Frutilla/)).not.toBeNull()
    expect(screen.getByText(/5\.000 CLP/)).not.toBeNull()
  })

  it('elimina el producto y vuelve a mostrar el carrito vacío', () => {
    montar()
    fireEvent.click(screen.getByText('sembrar'))
    fireEvent.click(screen.getByText('Eliminar'))
    expect(screen.getByText('Tu carrito está vacío')).not.toBeNull()
  })
})