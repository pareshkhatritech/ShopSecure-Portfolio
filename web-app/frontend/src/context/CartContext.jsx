import { useEffect, useState } from "react";
import { CartContext } from "./CartContextValue";

export default function CartProvider({ children }) {

    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {

        const existing = cart.find(item => item.id === product.id);

        if (existing) {

            setCart(
                cart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );

        } else {

            setCart([
                ...cart,
                {
                    ...product,
                    quantity: 1
                }
            ]);

        }

    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const increaseQty = (id) => {

        setCart(
            cart.map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );

    };

    const decreaseQty = (id) => {

        setCart(
            cart.map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ).filter(item => item.quantity > 0)
        );

    };

    // NEW
    const clearCart = () => {
        setCart([]);
    };

    return (

        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                increaseQty,
                decreaseQty,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>

    );

}
