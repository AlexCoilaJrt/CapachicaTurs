import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
    standalone: true,
      imports: [NavbarComponent, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  // Arreglo de items en el carrito
  cartItems: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadCart(); // Cargar carrito al inicializar el componente
  }

  // Cargar carrito desde localStorage
  loadCart(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
    }
  }

  // Agregar al carrito
  addToCart(item: any): void {
    this.cartItems.push(item);
    this.saveCart();
  }

  // Guardar carrito en localStorage
  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  // Eliminar item del carrito
  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.saveCart();
  }
getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
        // Asegura que el precio sea un número, de lo contrario, usa 0
        const precio = isNaN(Number(item.precio)) ? 0 : Number(item.precio);
        return total + precio;
    }, 0);
}


  // Realizar reserva (vaciar carrito y mostrar mensaje)
  reserve(): void {
    if (this.cartItems.length > 0) {
      Swal.fire({
        icon: 'success',
        title: 'Reserva Exitosa',
        text: 'Tu reserva ha sido realizada.',
        confirmButtonText: 'Aceptar'
      });
      this.cartItems = []; // Limpiar el carrito
      this.saveCart(); // Guardar el carrito vacío
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Tu carrito está vacío.',
        confirmButtonText: 'Aceptar'
      });
    }
  }
}