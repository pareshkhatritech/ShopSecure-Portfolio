import { useEffect, useState } from "react";

export default function GoToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    if (!visible) {
        return null;
    }

    return (
        <button
            type="button"
            className="go-to-top"
            onClick={scrollToTop}
            aria-label="Go to top"
            title="Go to top"
        >
            <i className="bi bi-arrow-up"></i>
            <span>Go to Top</span>
        </button>
    );
}
