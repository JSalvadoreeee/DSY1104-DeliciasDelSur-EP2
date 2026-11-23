// Pruebas de renderizado, estado de los filtros y evento de agregar al carrito
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Productos from '../paginas/tienda/Productos'
import { CarritoProvider, useCarrito } from '../contexto/CarritoContexto'
import { SesionProvider } from '../contexto/SesionContexto'
import { productosServicio } from '../servicios/productosServicio'
import { categoriasServicio } from '../servicios/categoriasServicio'

const CATALOGO_MOCK = [
  {
    id: 1,
    codigo: 'PR001',
    nombre: 'Salsa de Tomate Artesanal',
    descripcion: 'Salsa natural',
    precio: 2500,
    stock: 10,
    oferta: 0,
    precioOferta: null,
    precioFinal: 2500,
    imagen: 'salsa.jpg',
    categoria: 'Conservas',
    categoriaId: 1,
  },
  {
    id: 2,
    codigo: 'PR002',
    nombre: 'Mermelada de Frutilla',
    descripcion: 'Mermelada casera',
    precio: 3000,
    stock: 5,
    oferta: 0,
    precioOferta: null,
    precioFinal: 3000,
    imagen: 'mermelada.jpg',
    categoria: 'Mermeladas',
    categoriaId: 2,
  },
]

const CATEGORIAS_MOCK = [
  { id: 1, nombre: 'Conservas' },
  { id: 2, nombre: 'Mermeladas' },
]

function CantidadEnCarrito() {
  const { cantidadTotal } = useCarrito()
  return <span data-testid="cantidad">{cantidadTotal}</span>
}

function montar() {
  return render(
    <MemoryRouter>
      <SesionProvider>
        <CarritoProvider>
          <CantidadEnCarrito />
          <Productos />
        </CarritoProvider>
      </SesionProvider>
    </MemoryRouter>
  )
}

describe('Componente Productos', () => {
  beforeEach(() => {
    localStorage.removeItem('dds_carrito')
    localStorage.removeItem('dds_sesion')
    localStorage.removeItem('dds_token')
    spyOn(productosServicio, 'listar').and.resolveTo(CATALOGO_MOCK)
    spyOn(categoriasServicio, 'listar').and.resolveTo(CATEGORIAS_MOCK)
  })

  afterEach(() => {
    cleanup()
    localStorage.removeItem('dds_carrito')
    localStorage.removeItem('dds_sesion')
    localStorage.removeItem('dds_token')
  })

  it('renderiza una tarjeta por cada producto del catálogo', async () => {
    montar()
    const botones = await screen.findAllByText('Ver Detalle')
    expect(botones.length).toBe(CATALOGO_MOCK.length)
  })

  it('filtra los productos al escribir en el buscador', async () => {
    montar()
    await screen.findAllByText('Ver Detalle')

    fireEvent.change(screen.getByPlaceholderText(/Buscar por nombre/), {
      target: { value: 'Salsa' },
    })

    expect(screen.getAllByText('Ver Detalle').length).toBe(1)
    expect(screen.getByText(/Salsa de Tomate/)).not.toBeNull()
  })

  it('muestra un mensaje cuando la búsqueda no tiene resultados', async () => {
    montar()
    await screen.findAllByText('Ver Detalle')

    fireEvent.change(screen.getByPlaceholderText(/Buscar por nombre/), {
      target: { value: 'zzzz' },
    })

    expect(screen.queryByText('Ver Detalle')).toBeNull()
    expect(screen.getByText(/No se encontraron productos/)).not.toBeNull()
  })

  it('suma al carrito al hacer clic en Añadir al Carrito', async () => {
    montar()
    await screen.findAllByText('Ver Detalle')

    expect(screen.getByTestId('cantidad').textContent).toBe('0')
    fireEvent.click(screen.getAllByText('Añadir al Carrito')[0])
    expect(screen.getByTestId('cantidad').textContent).toBe('1')
  })
})