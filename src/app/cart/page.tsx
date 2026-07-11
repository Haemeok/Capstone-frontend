import type { Metadata } from "next";

import CartView from "@/widgets/CartView";

export const metadata: Metadata = {
  title: "장바구니",
  robots: { index: false, follow: false },
};

const CartPage = () => <CartView />;

export default CartPage;
