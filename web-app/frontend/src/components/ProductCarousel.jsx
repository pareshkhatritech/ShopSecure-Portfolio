import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import api from "../api/api";
import ProductCard from "./ProductCard";

export default function ProductCarousel() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await api.get("/api/products");
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to load products:", err);
            }
        }

        loadProducts();
    }, []);

    return (
        <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={20}
            navigation={true}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
                320: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1200: {
                    slidesPerView: 4,
                },
            }}
        >
            {products.map((product) => (
                <SwiperSlide key={product.id}>
                    <ProductCard product={product} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
